import { world, system, Player, Container, ItemStack } from '@minecraft/server';
import './ghast_handler';
import './mobs_taming';
import './blue_orb';
import * as Utils from './utils';
import * as UI from './ui_manager';

// INITIALIZATION
system.runTimeout(() => {
    for (const player of world.getPlayers()) {
        player.playSound("block.anvil.land", { pitch: 1.0, volume: 2.0 });
        world.spawnParticle("minecraft:totem_particle", player.location);
    }
}, 20);

// LORE UPDATER
function getCatcherSlots(inv) {
    const catchers = [];
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (item && (item.typeId === Utils.CATCHER_ID || item.typeId === Utils.BLUE_ORB_ID)) {
            catchers.push({ item, slot: i });
        }
    }
    return catchers;
}

function updateCatcherLore(item, player) {
    const inventory = Utils.getMobs(player, 'mount_inventory');
    item.setLore([
        `§aInventory: ${inventory.length}/${Utils.MAX_INVENTORY}`,
        `§7Click on a mob to capture`,
        `§7Click on a block to release`
    ]);
}

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const inv = player.getComponent("minecraft:inventory").container;
        for (const { item, slot } of getCatcherSlots(inv)) {
            updateCatcherLore(item, player);
            inv.setItem(slot, item);
        }
    }
}, 20);

// PLAYER EVENTS
world.afterEvents.playerSpawn.subscribe(ev => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        checkPendingActions(player);
    }
});

function checkPendingActions(player) {
    const data = Utils.getPlayerPendingData(player.id);

    // Handle Breaks (Force Return)
    if (data.breaks && data.breaks.length > 0) {
        data.breaks.forEach(breakerId => {
            Utils.returnOwnedMobs(player, breakerId);
        });
        // Clear breaks after processing
        data.breaks = [];
        Utils.savePlayerPendingData(player.id, data);
    }

    // Handle Gifts/Invites Notification
    if (data.gifts && data.gifts.length > 0) {
        player.sendMessage(Utils.translateForPlayer(player, "invitations_btn", data.gifts.length));
        player.playSound("random.orb", 1, 1);
    }
}

// --- CAPTURE MOB ---
world.beforeEvents.playerInteractWithEntity.subscribe(ev => {
    const { player, itemStack, target: entity } = ev;

    if (!itemStack) return;
    const isCatcher = itemStack.typeId === Utils.CATCHER_ID;
    const isBlueOrb = itemStack.typeId === Utils.BLUE_ORB_ID;

    if (!isCatcher && !isBlueOrb) return;

    if (player.getItemCooldown("catcher_cooldown") > 0) {
        ev.cancel = true;
        return;
    }

    if (player['last_interact_tick'] === system.currentTick) {
        ev.cancel = true;
        return;
    }
    player['last_interact_tick'] = system.currentTick;

    if (player.capture_lock) {
        ev.cancel = true;
        return;
    }
    player.capture_lock = true;

    ev.cancel = true;
    system.run(() => {
        try {
            const inv = player.getComponent("minecraft:inventory").container;
            const item = inv.getItem(player.selectedSlotIndex);
            if (!item || (item.typeId !== Utils.CATCHER_ID && item.typeId !== Utils.BLUE_ORB_ID)) return;

            if (!entity.isValid()) return;

            // Blue Orb Restriction: Must be riding
            if (isBlueOrb) {
                const rideable = entity.getComponent("minecraft:rideable");
                const riders = rideable ? rideable.getRiders() : [];
                const isRiding = riders.some(r => r.id === player.id);
                if (!isRiding) {
                    player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "blue_orb_fail_riding"));
                    player.playSound("beacon.deactivate", { pitch: 0.8, volume: 1.0 });
                    return;
                }
            }

            // Allow capture if correct item
            Utils.captureMob(player, entity, item, isBlueOrb);

        } catch (e) {
            player.sendMessage("§cCapture Error: " + e);
            console.warn("Capture Error: " + e);
        } finally {
            player.capture_lock = false;
        }
    });
});

// --- RELEASE MOB & SETTINGS (Item Use on Block) ---
world.beforeEvents.playerInteractWithBlock.subscribe(ev => {
    const { block, player, itemStack } = ev;
    if (!itemStack || itemStack.typeId !== Utils.CATCHER_ID) return;

    if (player.isSneaking) {
        ev.cancel = true;
        system.run(() => {
            UI.openMainSettings(player);
        });
        return;
    }

    if (player.getItemCooldown("catcher_cooldown") > 0) {
        ev.cancel = true;
        return;
    }

    if (Utils.isPlayerRiding(player)) {
        player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "release_fail_riding"));
        ev.cancel = true;
        return;
    }

    if (player['last_interact_tick'] === system.currentTick) {
        ev.cancel = true;
        return;
    }
    player['last_interact_tick'] = system.currentTick;

    ev.cancel = true;

    system.run(() => {
        const inventory = Utils.getMobs(player, 'mount_inventory');

        if (inventory.length === 0) {
            player.playSound("beacon.deactivate", { pitch: 0.8, volume: 1.0 });
            return;
        }

        player.startItemCooldown("catcher_cooldown", 20);

        if (inventory.length === 1) {
            const mob = inventory.shift();
            Utils.saveMobs(player, 'mount_inventory', inventory);

            const autoRide = Utils.getPlayerAutoRide(player);
            const spawnLoc = autoRide ? player.location : block.location;
            Utils.spawnMob(player, mob, spawnLoc, autoRide);
        } else {
            UI.openMobsMenu(player, block.location);
        }
    });
});

// --- PERMISSION CHECK ---
world.beforeEvents.playerInteractWithEntity.subscribe(ev => {
    const { player, target: entity } = ev;
    const rideable = entity.getComponent("minecraft:rideable");
    if (!rideable) return;
    const ownerId = entity.getDynamicProperty("mount_owner");
    if (ownerId && ownerId !== player.id && !Utils.isTrusted(ownerId, player.id)) {
        ev.cancel = true;
        player.sendMessage("§cYou are not the owner of this mount!");
    }
    player.playSound("beacon.activate", { pitch: 1, volume: 1.0 });
});
