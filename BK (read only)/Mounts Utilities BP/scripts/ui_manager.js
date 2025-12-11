import { world, system } from '@minecraft/server';
import { ActionFormData, ModalFormData, MessageFormData } from '@minecraft/server-ui';
import * as Utils from './utils';
import { returnOwnedMobs } from './utils';

export const activeFormPlayers = new Set();

export function openMainSettings(player) {
    if (activeFormPlayers.has(player.id)) return;
    activeFormPlayers.add(player.id);
    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "settings_title"))
        .body(Utils.translateForPlayer(player, "settings_body"))
        .button(Utils.translateForPlayer(player, "setting_manage_mobs"), "textures/items/saddle")
        .button(Utils.translateForPlayer(player, "setting_storage"), "textures/blocks/chest_front")
        .button(Utils.translateForPlayer(player, "setting_parameters"), "textures/items/comparator")
        .button(Utils.translateForPlayer(player, "setting_manage_trust"), "textures/items/paper");

    form.show(player).then(res => {
        activeFormPlayers.delete(player.id);
        if (res.canceled || res.selection === null) return;

        if (res.selection === 0) showManageMobsForm(player, 'mount_inventory');
        else if (res.selection === 1) showManageMobsForm(player, 'mount_storage');
        else if (res.selection === 2) showParametersForm(player);
        else if (res.selection === 3) showManageTrustForm(player);
    }).catch(() => activeFormPlayers.delete(player.id));
}

export function showManageMobsForm(player, type) {
    const mobs = Utils.getMobs(player, type);
    const title = type === 'mount_inventory' ? Utils.translateForPlayer(player, "manage_title") : Utils.translateForPlayer(player, "storage_title");
    const body = type === 'mount_inventory' ? Utils.translateForPlayer(player, "manage_body") : Utils.translateForUi(player, "storage_body", mobs.length.toString(), Utils.MAX_STORAGE.toString());

    const form = new ActionFormData().title(title).body(body);
    mobs.forEach((mob, index) => {
        const name = Utils.getNameFromCaptured(mob);
        const textureName = mob.entityType.replace("minecraft:", "");
        const iconTexture = `textures/ui/${textureName}`;
        form.button(`[ ${name} ]\nHP: ${Math.floor(mob.health)}`, iconTexture);
    });
    form.button(Utils.translateForPlayer(player, "btn_back"), "textures/items/ender_pearl");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;
        if (res.selection === mobs.length) {
            openMainSettings(player);
            return;
        }
        showMobDetailsForm(player, mobs[res.selection], res.selection, type);
    });
}

export function showMobDetailsForm(player, mob, index, type) {
    const lang = Utils.getPlayerLanguage(player);
    const ownerName = mob.ownerId ? (mob.ownerId === player.id ? Utils.translateForUi(player, "owner_self") : Utils.translateForUi(player, "owner_entrusted")) : Utils.translateForUi(player, "owner_none");

    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "mob_details_title"))
        .body(Utils.translateForUi(player, "mob_details_body", Utils.getNameFromCaptured(mob), Math.floor(mob.health).toString(), ownerName));

    const actions = [];

    // Release Button (Only in Inventory)
    if (type === 'mount_inventory') {
        form.button(Utils.translateForPlayer(player, "btn_release"), "textures/items/iron_horse_armor");
        actions.push("release");
    }

    // Tame / Gift / Give Back
    if (!mob.ownerId) {
        form.button(Utils.translateForPlayer(player, "btn_tame_self"), "textures/items/apple_golden");
        actions.push("tame");
    } else {
        if (mob.ownerId !== player.id) {
            form.button(Utils.translateForPlayer(player, "btn_give_back"), "textures/items/iron_horse_armor");
            actions.push("give_back");
        } else {
            form.button(Utils.translateForPlayer(player, "btn_gift"), "textures/items/diamond_horse_armor");
            actions.push("gift");
        }
    }

    // Move to Top Button
    form.button(Utils.translateForPlayer(player, "btn_move_top"), "textures/ui/up_arrow");
    actions.push("move_top");

    // Store / Retrieve
    if (type === 'mount_inventory') {
        form.button(Utils.translateForPlayer(player, "btn_send_storage"), "textures/blocks/chest_front");
        actions.push("store");
    } else {
        form.button(Utils.translateForPlayer(player, "btn_retrieve"), "textures/items/saddle");
        actions.push("retrieve");
    }

    form.button(Utils.translateForPlayer(player, "btn_back"), "textures/items/ender_pearl");
    actions.push("back");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;

        const action = actions[res.selection];

        if (action === "back") {
            showManageMobsForm(player, type);
            return;
        }

        if (action === "release") {
            const mobs = Utils.getMobs(player, type);
            mobs.splice(index, 1);
            Utils.saveMobs(player, type, mobs);

            // Spawn at player location
            Utils.spawnMob(player, mob, player.location);
            return;
        }

        if (action === "move_top") {
            const mobs = Utils.getMobs(player, type);
            if (index > 0 && mobs.length > 1) {
                const temp = mobs[0];
                mobs[0] = mobs[index];
                mobs[index] = temp;
                Utils.saveMobs(player, type, mobs);
                player.playSound("random.orb");
            }
            showManageMobsForm(player, type);
            return;
        }

        if (action === "tame") {
            if (Utils.consumeMelonSlices(player, 20)) {
                mob.ownerId = player.id;
                const mobs = Utils.getMobs(player, type);
                mobs[index] = mob;
                Utils.saveMobs(player, type, mobs);
                player.playSound("random.orb");
                player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "tame_success"));
                showMobDetailsForm(player, mob, index, type);
            } else {
                player.playSound("note.bass");
                player.sendMessage(Utils.translateForPlayer(player, "tame_fail_cost"));
                showMobDetailsForm(player, mob, index, type);
            }
        } else if (action === "gift") {
            showGiftPlayerSelectForm(player, mob, index, type);
        } else if (action === "give_back") {
            const owner = world.getAllPlayers().find(p => p.id === mob.ownerId);
            if (owner) {
                sendGift(player, owner, mob, index, type, true);
            } else {
                const mobs = Utils.getMobs(player, type);
                mobs.splice(index, 1);
                Utils.saveMobs(player, type, mobs);
                Utils.addPendingGift(mob.ownerId, { type: 'gift', senderId: player.id, senderName: player.name, mob: mob, cost: 0 });
                player.playSound("random.orb");
                player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "gift_sent", "Offline Owner"));
                showManageMobsForm(player, type);
            }
        } else if (action === "store") {
            const storage = Utils.getMobs(player, 'mount_storage');
            if (storage.length >= Utils.MAX_STORAGE) {
                player.sendMessage(Utils.translateForPlayer(player, "storage_full"));
                showMobDetailsForm(player, mob, index, type);
                return;
            }
            const inventory = Utils.getMobs(player, 'mount_inventory');
            inventory.splice(index, 1);
            storage.push(mob);
            Utils.saveMobs(player, 'mount_inventory', inventory);
            Utils.saveMobs(player, 'mount_storage', storage);
            player.playSound("armor.equip_chain");
            player.sendMessage(Utils.translateForPlayer(player, "move_success"));
            showManageMobsForm(player, 'mount_inventory');
        } else if (action === "retrieve") {
            const inventory = Utils.getMobs(player, 'mount_inventory');
            if (inventory.length >= Utils.MAX_INVENTORY) {
                player.sendMessage(Utils.translateForPlayer(player, "inventory_full"));
                showMobDetailsForm(player, mob, index, type);
                return;
            }
            const storage = Utils.getMobs(player, 'mount_storage');
            storage.splice(index, 1);
            inventory.push(mob);
            Utils.saveMobs(player, 'mount_storage', storage);
            Utils.saveMobs(player, 'mount_inventory', inventory);
            player.playSound("armor.equip_chain");
            player.sendMessage(Utils.translateForPlayer(player, "move_success"));
            showManageMobsForm(player, 'mount_storage');
        }
    });
}

function showGiftPlayerSelectForm(player, mob, index, type) {
    const players = world.getPlayers().filter(p => p.id !== player.id);
    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "gift_title"))
        .body(Utils.translateForPlayer(player, "gift_body"));

    players.forEach(p => form.button(p.name));
    form.button(Utils.translateForPlayer(player, "btn_back"));

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;
        if (res.selection === players.length) {
            showMobDetailsForm(player, mob, index, type);
            return;
        }
        sendGift(player, players[res.selection], mob, index, type);
    });
}

function sendGift(player, target, mob, index, type, isReturn = false) {
    const cost = isReturn ? 0 : 20;
    if (!isReturn && !Utils.consumeMelonSlices(player, cost)) {
        player.sendMessage(Utils.translateForPlayer(player, "tame_fail_cost"));
        return;
    }

    const mobs = Utils.getMobs(player, type);
    mobs.splice(index, 1);
    Utils.saveMobs(player, type, mobs);

    Utils.addPendingGift(target.id, {
        type: 'gift',
        senderId: player.id,
        senderName: player.name,
        mob: mob,
        cost: cost
    });

    player.playSound("random.orb");
    player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "gift_sent", target.name));
    target.sendMessage(Utils.translateForUi(target, "gift_invite_body", player.name, Utils.getNameFromCaptured(mob)));
    showManageMobsForm(player, type);
}

function showParametersForm(player) {
    const autoRide = Utils.getPlayerAutoRide(player);
    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "parameters_title"))
        .body(Utils.translateForPlayer(player, "parameters_body"))
        .button(autoRide ? Utils.translateForPlayer(player, "setting_auto_ride_on") : Utils.translateForPlayer(player, "setting_auto_ride_off"), "textures/items/saddle")
        .button(Utils.translateForPlayer(player, "setting_language"), "textures/items/book_enchanted")
        .button(Utils.translateForPlayer(player, "btn_back"), "textures/items/ender_pearl");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;

        if (res.selection === 0) {
            Utils.playerAutoRide.set(player.id, !autoRide);
            player.setDynamicProperty("mount_settings_autoride", !autoRide);
            showParametersForm(player);
        } else if (res.selection === 1) {
            showLanguageForm(player);
        } else {
            openMainSettings(player);
        }
    });
}

export function showLanguageForm(player) {
    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "lang_select_title"))
        .body(Utils.translateForPlayer(player, "lang_select_body"))
        .button(Utils.translateForPlayer(player, "lang_option_en"))
        .button(Utils.translateForPlayer(player, "lang_option_es"));

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;

        if (res.selection === 0) {
            Utils.setPlayerLanguage(player, "en");
            player.sendMessage(Utils.translateForPlayer(player, "lang_set_en"));
        } else if (res.selection === 1) {
            Utils.setPlayerLanguage(player, "es");
            player.sendMessage(Utils.translateForPlayer(player, "lang_set_es"));
        }
    });
}


export function showManageTrustForm(player) {
    const trustedIds = Utils.getTrusted(player.id);
    const data = Utils.getPlayerPendingData(player.id);
    const invites = data.gifts || [];

    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "trust_title"))
        .body(Utils.translateForPlayer(player, "trust_body"))
        .button(Utils.translateForPlayer(player, "trust_add"), "textures/items/emerald")
        .button(Utils.translateForPlayer(player, "invitations_btn", invites.length), "textures/items/paper");

    const allPlayers = world.getAllPlayers();
    trustedIds.forEach(id => {
        const p = allPlayers.find(pl => pl.id === id);
        const name = p ? p.name : `Offline: ${id.substring(0, 8)}...`;
        form.button(`Remove: ${name}`, "textures/ui/cancel");
    });
    form.button(Utils.translateForPlayer(player, "btn_back"), "textures/items/ender_pearl");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;

        if (res.selection === 0) showAddTrustedForm(player);
        else if (res.selection === 1) showTrustInvitationsForm(player);
        else if (res.selection === trustedIds.length + 2) openMainSettings(player);
        else {
            const index = res.selection - 2;
            if (index >= 0 && index < trustedIds.length) showRemoveTrustConfirmForm(player, trustedIds[index]);
        }
    });
}

function showAddTrustedForm(player) {
    const players = world.getPlayers().filter(p => p.id !== player.id && !Utils.isTrusted(player.id, p.id));
    const form = new ActionFormData()
        .title("Add Trusted Player")
        .body("Select a player to send a trust invitation (Cost: 128 Slices).");

    players.forEach(p => form.button(p.name));
    form.button("Back");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;
        if (res.selection === players.length) {
            showManageTrustForm(player);
            return;
        }

        const target = players[res.selection];
        if (!Utils.consumeMelonSlices(player, 128)) {
            player.sendMessage(Utils.translateForPlayer(player, "trust_fail_cost"));
            return;
        }

        Utils.addPendingGift(target.id, { type: 'trust', senderId: player.id, senderName: player.name, cost: 128 });
        player.sendMessage(Utils.translateForPlayer(player, "trust_invite_sent", target.name));
        target.sendMessage("§eYou have received a Trust Invitation! Check your Mounts Orb.");
        showManageTrustForm(player);
    });
}

function showRemoveTrustConfirmForm(player, targetId) {
    const target = world.getAllPlayers().find(p => p.id === targetId);
    const name = target ? target.name : "Offline Player";

    const form = new MessageFormData()
        .title(Utils.translateForPlayer(player, "trust_remove_confirm_title"))
        .body(Utils.translateForUi(player, "trust_remove_confirm_body", name))
        .button1("Cancel")
        .button2("Remove");

    form.show(player).then(res => {
        if (res.selection === 1) {
            Utils.removeTrusted(player.id, targetId);
            Utils.removeTrusted(targetId, player.id);
            returnOwnedMobs(player, targetId);

            if (target) {
                returnOwnedMobs(target, player.id);
                target.sendMessage(`§eTrust removed by ${player.name}. Your mobs have been returned.`);
            } else {
                Utils.addPendingBreak(targetId, player.id);
            }
            player.sendMessage(Utils.translateForPlayer(player, "trust_removed"));
            showManageTrustForm(player);
        } else {
            showManageTrustForm(player);
        }
    });
}

export function showTrustInvitationsForm(player) {
    const data = Utils.getPlayerPendingData(player.id);
    const invites = data.gifts || [];

    const form = new ActionFormData()
        .title("Social Invitations")
        .body(invites.length === 0 ? "No pending invitations." : "Select an invitation to accept or deny.");

    invites.forEach(invite => {
        if (invite.type === 'gift') {
            form.button(`Gift: ${Utils.getNameFromCaptured(invite.mob)} from ${invite.senderName}`);
        } else {
            form.button(`Social Invite from ${invite.senderName}`);
        }
    });
    form.button(Utils.translateForPlayer(player, "btn_back"), "textures/items/ender_pearl");

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;
        if (res.selection === invites.length) {
            showManageTrustForm(player);
            return;
        }

        const inviteIndex = res.selection;
        const invite = invites[inviteIndex];

        if (invite.type === 'trust') {
            const trusted = Utils.getTrusted(player.id);
            if (trusted.length > 0) {
                player.sendMessage("§cYou cannot accept social invitations while you have trusted players.");
                showTrustInviteActionForm(player, invite, inviteIndex, false);
            } else {
                showTrustInviteActionForm(player, invite, inviteIndex, true);
            }
        } else {
            showTrustInviteActionForm(player, invite, inviteIndex, true);
        }
    });
}

function showTrustInviteActionForm(player, invite, index, canAccept) {
    const isGift = invite.type === 'gift';
    const titleKey = isGift ? "gift_invite_title" : "trust_invite_title";
    const bodyKey = isGift ? "gift_invite_body" : "trust_invite_body";
    let bodyText = isGift ? Utils.translateForUi(player, bodyKey, invite.senderName, Utils.getNameFromCaptured(invite.mob)) : Utils.translateForUi(player, bodyKey, invite.senderName);

    const form = new MessageFormData()
        .title(Utils.translateForPlayer(player, titleKey))
        .body(bodyText)
        .button1("Deny")
        .button2(canAccept ? "Accept" : "§cAccept (Locked)");

    form.show(player).then(res => {
        const sender = world.getAllPlayers().find(p => p.id === invite.senderId);
        const data = Utils.getPlayerPendingData(player.id);
        const invites = data.gifts || [];

        if (res.selection === 1 && canAccept) {
            if (isGift) {
                const storage = Utils.getMobs(player, 'mount_storage');
                if (storage.length >= Utils.MAX_STORAGE) {
                    if (sender) {
                        Utils.refundMelonSlices(sender, invite.cost);
                        sender.sendMessage(Utils.translateForPlayer(sender, "gift_denied_sender", player.name) + " (Storage Full)");
                        const senderStorage = Utils.getMobs(sender, 'mount_storage');
                        senderStorage.push(invite.mob);
                        Utils.saveMobs(sender, 'mount_storage', senderStorage);
                    } else {
                        Utils.addPendingGift(invite.senderId, { type: 'gift', senderId: player.id, senderName: player.name, mob: invite.mob, cost: 0 });
                    }
                    invites.splice(index, 1);
                    data.gifts = invites;
                    Utils.savePlayerPendingData(player.id, data);
                    showTrustInvitationsForm(player);
                    return;
                }
                invite.mob.ownerId = player.id;
                storage.push(invite.mob);
                Utils.saveMobs(player, 'mount_storage', storage);
                player.sendMessage(Utils.translateForPlayer(player, "gift_accepted_recipient"));
                if (sender) sender.sendMessage(Utils.translateForPlayer(sender, "gift_accepted_sender", player.name));
            } else {
                Utils.addTrusted(player.id, invite.senderId);
                Utils.addTrusted(invite.senderId, player.id);
                player.sendMessage(Utils.translateForPlayer(player, "trust_accepted_recipient", invite.senderName));
                if (sender) sender.sendMessage(Utils.translateForPlayer(sender, "trust_accepted_sender", player.name));
            }
            invites.splice(index, 1);
            data.gifts = invites;
            Utils.savePlayerPendingData(player.id, data);
            showTrustInvitationsForm(player);

        } else if (res.selection === 0) {
            if (sender) {
                Utils.refundMelonSlices(sender, invite.cost);
                if (isGift) {
                    sender.sendMessage(Utils.translateForPlayer(sender, "gift_denied_sender", player.name));
                    const senderStorage = Utils.getMobs(sender, 'mount_storage');
                    if (senderStorage.length < Utils.MAX_STORAGE) {
                        senderStorage.push(invite.mob);
                        Utils.saveMobs(sender, 'mount_storage', senderStorage);
                    } else {
                        sender.sendMessage("§eWarning: Storage overfilled due to returned gift.");
                        senderStorage.push(invite.mob);
                        Utils.saveMobs(sender, 'mount_storage', senderStorage);
                    }
                } else {
                    sender.sendMessage(Utils.translateForPlayer(sender, "trust_denied_sender", player.name));
                }
            } else {
                if (isGift) Utils.addPendingGift(invite.senderId, { type: 'gift', senderId: player.id, senderName: player.name, mob: invite.mob, cost: 0 });
            }
            player.sendMessage(Utils.translateForPlayer(player, isGift ? "gift_denied_recipient" : "trust_denied_recipient"));
            invites.splice(index, 1);
            data.gifts = invites;
            Utils.savePlayerPendingData(player.id, data);
            showTrustInvitationsForm(player);
        } else {
            showTrustInvitationsForm(player);
        }
    });
}

export function openMobsMenu(player, blockLocation = null) {
    const inventory = Utils.getMobs(player, 'mount_inventory');
    const form = new ActionFormData()
        .title(Utils.translateForPlayer(player, "form_title"))
        .body(Utils.translateForPlayer(player, "form_body", inventory.length.toString(), Utils.MAX_INVENTORY.toString()));

    const reversedInventory = [...inventory].reverse();

    reversedInventory.forEach((mob, i) => {
        const name = Utils.getNameFromCaptured(mob);
        const textureName = mob.entityType.replace("minecraft:", "");
        const iconTexture = `textures/ui/${textureName}`;
        form.button(`[ ${name} ]\n§4HP: ${Math.floor(mob.health)}`, iconTexture);
    });

    form.show(player).then(res => {
        if (res.canceled || res.selection === null) return;

        const originalIndex = inventory.length - 1 - res.selection;
        const mob = inventory[originalIndex];
        inventory.splice(originalIndex, 1);
        Utils.saveMobs(player, 'mount_inventory', inventory);

        const autoRide = Utils.getPlayerAutoRide(player);
        const spawnLoc = (autoRide || !blockLocation) ? player.location : blockLocation;
        Utils.spawnMob(player, mob, spawnLoc, autoRide || !blockLocation);
    });
}
