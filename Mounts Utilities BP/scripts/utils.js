import { world, system, ItemStack } from '@minecraft/server';

export const CATCHER_ID = "arzz_ut:purple_orb";
export const BLUE_ORB_ID = "arzz_ut:blue_orb";
export const MAX_INVENTORY = 4;
export const MAX_STORAGE = 6;
export const MAX_HEALTH = 250;

export const ALLOWED_ENTITIES = [
    'minecraft:horse',
    'minecraft:donkey',
    'minecraft:zombie_horse',
    'minecraft:skeleton_horse',
    'minecraft:mule',
    'minecraft:camel',
    'minecraft:camel_husk',
    'minecraft:nautilus',
    'minecraft:happy_ghast',
    'minecraft:strider',
    'minecraft:pig'
];


// --- TRADUCCIONES ---
export const TRANSLATIONS = {
    en: {
        capture_fail_blocked: "§cYou cannot capture that mob.",
        capture_fail_no_health: "§cThis mob cannot be captured.",
        capture_fail_too_much_health: "§cThat mob has too much health!",
        capture_fail_no_durability: "§cThe catcher does not have enough durability!",
        capture_fail_full: "§cYour Catcher inventory is full (4/4)!",
        capture_success: "%s has been captured! (%s/%s)",
        release_fail_empty: "The catcher is empty!",
        release_success: "%s has been released!",
        lore_line1: "- %s/%s mobs (Inventory)",
        lore_line2: "Click on a mob to capture",
        lore_line3: "Click on a block to release",
        form_title: "[ Captured Mobs ]",
        form_body: "Inventory: %s/%s",
        lang_select_title: "Select Language",
        lang_select_body: "Choose your language",
        lang_option_en: "English",
        lang_option_es: "Español",
        lang_set_en: "Language set to English.",
        lang_set_es: "Idioma configurado a Español.",
        capture_fail_crowded: "§cThere's a lot of mobs so close, you can't use the catcher here",
        capture_fail_no_saddle: "§cYou need a saddle to capture this mob.",
        capture_fail_no_harness: "§cYou need a harness to capture this mob.",
        release_fail_riding: "§cTo release a mount, you must get off saddle.",
        settings_title: "§dOrb Menu",
        settings_body: "§kWhat do you want to do?",
        setting_auto_ride_on: "Auto-Ride: §aON",
        setting_auto_ride_off: "Auto-Ride: §cOFF",
        setting_parameters: "Parameters",
        parameters_title: "Parameters",
        parameters_body: "Configure addon parameters.",
        setting_language: "Language",
        setting_manage_mobs: "Mounts",
        setting_storage: "Storage",
        capture_fail_not_owner: "§cThis mount belongs to another player!",
        manage_title: "Mounts (Inventory)",
        manage_body: "Select a mount to see details.",
        storage_title: "Storage (Passive)",
        storage_body: "Stored Mobs: %s/%s",
        mob_details_title: "Mount Details",
        mob_details_body: "Name: %s\nHP: %s\nOwner: %s",
        btn_tame_self: "Tame (Cost: 20 Slices)",
        btn_gift: "Gift (Cost: 20 Slices)",
        btn_send_storage: "Send to Storage",
        btn_retrieve: "Retrieve from Storage",
        btn_back: "Back",
        tame_success: "§aMount tamed successfully!",
        tame_fail_cost: "§cYou need 20 Glistering Melon Slices!",
        gift_title: "Gift Mount",
        gift_body: "Select a player to gift this mount to.",
        gift_sent: "§aGift request sent to %s!",
        gift_received_title: "Gift Received",
        gift_received_body: "%s wants to gift you a %s.\nDo you accept?",
        gift_accepted_sender: "§a%s accepted your gift!",
        gift_accepted_recipient: "§aYou accepted the gift!",
        gift_denied_sender: "§c%s denied your gift. 20 slices refunded.",
        gift_denied_recipient: "§cYou denied the gift.",
        gift_fail_storage_full: "§cCannot send gift. Recipient's storage is full!",
        storage_full: "§cStorage is full!",
        inventory_full: "§cInventory is full!",
        move_success: "§aMoved successfully!",
        owner_none: "None",
        owner_self: "You",
        trust_success: "§aPlayer added to trust list!",
        trust_removed: "§aPlayer removed from trust list!",
        trust_fail_cost: "§cYou need 128 Glistering Melon Slices!",
        trust_fail_exists: "§cPlayer is already trusted!",
        ride_fail_not_trusted: "§cYou are not trusted to ride this mount!",
        capture_fail_no_carpet: "§cYou need a carpet to capture this mob.",
        trust_invite_sent: "§aTrust invitation sent to %s",
        trust_invite_title: "Trust Invitation",
        trust_invite_body: "§l§c%s §r§awants to add you to their trust list.\nThis will also add them to YOUR list.\nDo you accept?",
        trust_accepted_sender: "§a%s accepted your trust invitation!",
        trust_accepted_recipient: "§aYou now trust %s!",
        trust_denied_sender: "§c%s denied your invitation. 128 Glistering Melon Slices refunded.",
        trust_denied_recipient: "§cYou denied the invitation.",
        setting_manage_trust: "Social",
        trust_title: "Social Menu",
        trust_body: "Options available:",
        trust_add: "Add Trusted Player",
        gift_invite_title: "Gift Received",
        gift_invite_body: "§a%s wants to gift you a %s.\nDo you accept?",
        owner_entrusted: "Entrusted",
        trust_remove_btn: "Remove Trusted Player",
        trust_remove_confirm_title: "Remove Trust Permissions?",
        trust_remove_confirm_body: "§cAre you sure you want to remove %s from your trust list?",
        trust_remove_fail_mobs: "§cCannot remove trust! Both players must return each other's mobs first.",
        btn_give_back: "Give Back",
        invitations_btn: "§c§l[%s]§r§c Social Notifications",
        btn_release: "Release",
        btn_move_top: "Move to Top",
        // New Additions
        tame_fail_melon_count: "§cYou need 20 Glistering Melon Slices to tame this mob!",
        tame_success_generic: "§aYou have tamed this mount!",
        harness_fail_equipped: "§cAlready has a harness!",
        harness_equip_success: "Harness Equipped",
        blue_orb_fail_riding: "§cBlue Orb can only catch mounts you are riding!"
    },
    es: {
        capture_fail_blocked: "§cNo puedes capturar esta criatura.",
        capture_fail_no_health: "§cNo se puede capturar esta criatura.",
        capture_fail_too_much_health: "§cNo puedes capturar esta criatura.",
        capture_fail_no_durability: "§c¡La red no tiene suficiente durabilidad!",
        capture_fail_full: "§c¡Tu inventario de Catcher está lleno (4/4)!",
        capture_success: "§a¡%s ha sido capturado! (%s/%s)",
        release_fail_empty: "¡El catcher está vacío!",
        release_success: "¡%s ha sido liberado!",
        lore_line1: "- %s/%s mobs (Inventario)",
        lore_line2: "Haz clic en una montura para capturar",
        lore_line3: "Haz clic en un bloque para liberar",
        form_title: "[ Monturas Capturadas ]",
        form_body: "Inventario: %s/%s",
        lang_select_title: "Seleccionar idioma",
        lang_select_body: "Elige tu idioma",
        lang_option_en: "English",
        lang_option_es: "Español",
        lang_set_en: "Language set to English.",
        lang_set_es: "Idioma configurado a Español.",
        capture_fail_crowded: "§cHay muchas criaturas cerca, no puedes usar el catcher aquí",
        capture_fail_no_saddle: "§cNecesitas una montura para capturar esta criatura.",
        capture_fail_no_harness: "§cNecesitas un arnés para capturar esta criatura.",
        release_fail_riding: "§cPara liberar una montura, debes bajarte de la silla.",
        settings_title: "§dMenú del Orbe",
        settings_body: "§k¿Qué quieres hacer?",
        setting_auto_ride_on: "Auto-Montura: §aON",
        setting_auto_ride_off: "Auto-Montura: §cOFF",
        setting_parameters: "Parámetros",
        parameters_title: "Parámetros",
        parameters_body: "Configura los parámetros del addon.",
        setting_language: "Idioma",
        setting_manage_mobs: "Administrar Monturas",
        setting_storage: "Almacenamiento",
        capture_fail_not_owner: "§c¡Esta montura pertenece a otro jugador!",
        manage_title: "Administrar Monturas (Inventario)",
        manage_body: "Selecciona una montura para administrar.",
        storage_title: "Almacenamiento (Pasivo)",
        storage_body: "Monturas Almacenadas: %s/%s",
        mob_details_title: "Detalles de la Montura",
        mob_details_body: "Nombre: %s\nHP: %s\nDueño: %s",
        btn_tame_self: "Domesticar (Costo: 20 Rodajas)",
        btn_gift: "Regalar (Costo: 20 Rodajas)",
        btn_send_storage: "Enviar al Almacén",
        btn_retrieve: "Recuperar del Almacén",
        btn_back: "Volver",
        tame_success: "§a¡Montura domesticada con éxito!",
        tame_fail_cost: "§c¡Necesitas 20 Rodajas de Sandía Reluciente!",
        gift_title: "Regalar Montura",
        gift_body: "Selecciona un jugador para regalar esta montura.",
        gift_sent: "§a¡Solicitud de regalo enviada a %s!",
        gift_received_title: "Regalo Recibido",
        gift_received_body: "§a%s quiere regalarte: %s.\n¿Aceptas?",
        gift_accepted_sender: "§a¡%s aceptó tu regalo!",
        gift_accepted_recipient: "§a¡Aceptaste el regalo!",
        gift_denied_sender: "§c%s rechazó tu regalo. 20 rodajas devueltas.",
        gift_denied_recipient: "§cRechazaste el regalo.",
        gift_fail_storage_full: "§cNo se puede enviar. ¡El almacén del destinatario está lleno!",
        storage_full: "§c¡El almacén está lleno!",
        inventory_full: "§c¡El inventario está lleno!",
        move_success: "§a¡Mob movido con éxito!",
        owner_none: "Ninguno",
        owner_self: "Tú",
        trust_success: "§a¡Jugador añadido a la lista de confianza!",
        trust_removed: "§a¡Jugador eliminado de la lista de confianza!",
        trust_fail_cost: "§c¡Necesitas 128 Rodajas de Sandía Reluciente!",
        trust_fail_exists: "§c¡El jugador ya está en la lista de confianza!",
        ride_fail_not_trusted: "§c¡No tienes permiso para montar esta criatura!",
        capture_fail_no_carpet: "§cNecesitas una alfombra para capturar esta criatura.",
        trust_invite_sent: "§aInvitación de confianza enviada a %s",
        trust_invite_title: "Invitación de Confianza",
        trust_invite_body: "§l§c%s §r§aquiere añadirte a su lista de confianza.\nEsto también los añadirá a TU lista.\n¿Aceptas?",
        trust_accepted_sender: "§a¡%s aceptó tu invitación de confianza!",
        trust_accepted_recipient: "§a¡Ahora confías en %s!",
        trust_denied_sender: "§c%s rechazó tu invitación. 128 rodajas devueltas.",
        trust_denied_recipient: "§cRechazaste la invitación.",
        setting_manage_trust: "Social",
        trust_title: "Menú Social",
        trust_body: "Opciones disponibles:",
        trust_add: "Añadir Jugador de Confianza",
        gift_invite_title: "Regalo Recibido",
        gift_invite_body: "§a%s quiere regalarte un %s.\n¿Aceptas?",
        owner_entrusted: "Confiado",
        trust_remove_btn: "Eliminar Jugador de Confianza",
        trust_remove_confirm_title: "¿Eliminar Permisos de Confianza?",
        trust_remove_confirm_body: "§c¿Estás seguro de querer eliminar a %s de tu lista de confianza?",
        trust_remove_fail_mobs: "§c¡No se puede eliminar la confianza! Ambos jugadores deben devolver los mobs del otro primero.",
        btn_give_back: "Devolver",
        invitations_btn: "§c§l[%s]§r§c Notificaciones Sociales",
        btn_release: "Liberar Montura",
        btn_move_top: "Mover al Inicio",
        // New Additions
        tame_fail_melon_count: "§cNecesitas 20 Rodajas de Sandía Reluciente para domesticar esta criatura.",
        tame_success_generic: "§a¡Has domesticado esta criatura!",
        harness_fail_equipped: "§c¡Ya tiene un arnés!",
        harness_equip_success: "Arnés Equipado",
        blue_orb_fail_riding: "§c¡El Orbe Azul solo puede capturar monturas que estés montando!"
    }
};

export const LANGUAGE = "en";
export const playerLanguages = new Map();

export function getPlayerLanguage(player) {
    if (playerLanguages.has(player.id)) return playerLanguages.get(player.id);
    const saved = player.getDynamicProperty("mount_settings_lang");
    if (saved) {
        playerLanguages.set(player.id, saved);
        return saved;
    }
    return LANGUAGE;
}

export function setPlayerLanguage(player, lang) {
    playerLanguages.set(player.id, lang);
    player.setDynamicProperty("mount_settings_lang", lang);
}

export function translateForPlayer(player, key, ...params) {
    const lang = getPlayerLanguage(player);
    let text = TRANSLATIONS[lang][key] || key;
    params.forEach(param => {
        text = text.replace(/%s/, param);
    });
    return text;
}

// Deprecated UI Helper - redirecting to standard
export function translateForUi(player, key, ...params) {
    return translateForPlayer(player, key, ...params);
}

// --- DATA MANAGEMENT ---
export const TRUST_REGISTRY_KEY = 'mount_trust_registry';
export const PENDING_DATA_KEY = 'mount_pending_data';

export const playerAutoRide = new Map();

export function getPendingData() {
    const data = world.getDynamicProperty(PENDING_DATA_KEY);
    return data ? JSON.parse(data) : {};
}

export function savePendingData(data) {
    world.setDynamicProperty(PENDING_DATA_KEY, JSON.stringify(data));
}

export function getPlayerPendingData(playerId) {
    const data = getPendingData();
    if (!data[playerId]) {
        data[playerId] = { gifts: [], breaks: [] };
    }
    return data[playerId];
}

export function savePlayerPendingData(playerId, playerData) {
    const data = getPendingData();
    data[playerId] = playerData;
    savePendingData(data);
}

export function addPendingGift(targetId, gift) {
    const data = getPendingData();
    if (!data[targetId]) data[targetId] = { gifts: [], breaks: [] };
    data[targetId].gifts.push(gift);
    savePendingData(data);
}

export function addPendingBreak(targetId, breakerId) {
    const data = getPendingData();
    if (!data[targetId]) data[targetId] = { gifts: [], breaks: [] };
    if (!data[targetId].breaks.includes(breakerId)) {
        data[targetId].breaks.push(breakerId);
        savePendingData(data);
    }
}

export function getTrustRegistry() {
    const data = world.getDynamicProperty(TRUST_REGISTRY_KEY);
    return data ? JSON.parse(data) : {};
}

export function saveTrustRegistry(registry) {
    world.setDynamicProperty(TRUST_REGISTRY_KEY, JSON.stringify(registry));
}

export function getTrusted(ownerId) {
    const registry = getTrustRegistry();
    return registry[ownerId] || [];
}

export function addTrusted(ownerId, trustedId) {
    const registry = getTrustRegistry();
    if (!registry[ownerId]) registry[ownerId] = [];
    if (!registry[ownerId].includes(trustedId)) {
        registry[ownerId].push(trustedId);
        saveTrustRegistry(registry);
        return true;
    }
    return false;
}

export function removeTrusted(ownerId, trustedId) {
    const registry = getTrustRegistry();
    if (registry[ownerId]) {
        const index = registry[ownerId].indexOf(trustedId);
        if (index > -1) {
            registry[ownerId].splice(index, 1);
            saveTrustRegistry(registry);
            return true;
        }
    }
    return false;
}

export function isTrusted(ownerId, playerId) {
    if (ownerId === playerId) return true;
    const trusted = getTrusted(ownerId);
    return trusted.includes(playerId);
}

export function getMobs(player, type) {
    const data = player.getDynamicProperty(type);
    return data ? JSON.parse(data) : [];
}

export function saveMobs(player, type, data) {
    player.setDynamicProperty(type, JSON.stringify(data));
}



export function getPlayerAutoRide(player) {
    if (playerAutoRide.has(player.id)) return playerAutoRide.get(player.id);

    const saved = player.getDynamicProperty("mount_settings_autoride");
    if (saved !== undefined) {
        playerAutoRide.set(player.id, saved);
        return saved;
    }
    return false;
}


export function toFriendlyName(str) {
    return str.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}



export function getFriendlyName(entity) {
    const customName = entity.nameTag?.trim();
    if (customName && customName.length > 0) {
        return customName;
    }
    let id = entity.typeId || "unknown:entity";
    if (id.includes(':')) {
        id = id.split(':')[1];
    }
    return toFriendlyName(id);
}

export function getNameFromCaptured(mob) {
    if (mob.customName && mob.customName.length > 0) {
        return mob.customName;
    }
    return toFriendlyName(mob.entityName || "unknown");
}

export function consumeMelonSlices(player, amount) {
    if (player.getGameMode() === 'creative') return true;

    const inv = player.getComponent("minecraft:inventory").container;
    let total = 0;
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (item && item.typeId === 'minecraft:glistering_melon_slice') {
            total += item.amount;
        }
    }

    if (total < amount) return false;

    let remaining = amount;
    for (let i = 0; i < inv.size; i++) {
        if (remaining <= 0) break;
        const item = inv.getItem(i);
        if (item && item.typeId === 'minecraft:glistering_melon_slice') {
            if (item.amount > remaining) {
                item.amount -= remaining;
                inv.setItem(i, item);
                remaining = 0;
            } else {
                remaining -= item.amount;
                inv.setItem(i, undefined);
            }
        }
    }
    return true;
}

export function refundMelonSlices(player, amount) {
    const inv = player.getComponent("minecraft:inventory").container;
    const itemStack = new ItemStack("minecraft:glistering_melon_slice", amount);
    inv.addItem(itemStack);
}

export function spawnMob(player, mob, location, forceRide = false) {
    try {
        player.runCommand(`structure load "${mob.structureName}" ${location.x} ${location.y + 1} ${location.z}`);
        player.runCommand(`structure delete "${mob.structureName}"`);
    } catch (e) {
        player.sendMessage("§cError spawning mob: " + e);
    }

    system.runTimeout(() => {
        const spawnLocation = {
            x: location.x,
            y: location.y,
            z: location.z
        };

        player.runCommand(`particle minecraft:sonic_explosion ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
        player.runCommand(`particle minecraft:trial_spawner_detection_ominous ${spawnLocation.x} ${spawnLocation.y} ${spawnLocation.z}`);
        player.playSound("beacon.activate", { pitch: 2.0, volume: 1.0 });

        const dimension = player.dimension;
        const entities = dimension.getEntities({
            location: spawnLocation,
            maxDistance: 2.0,
            type: mob.entityType
        });

        if (entities.length > 0) {
            const spawnedMob = entities[0];
            if (mob.ownerId) {
                spawnedMob.setDynamicProperty('mount_owner', mob.ownerId);
                spawnedMob.addEffect("resistance", 9999999, { amplifier: 255, showParticles: true });
            }

            if (forceRide || getPlayerAutoRide(player)) {
                const tryRide = (attempts = 0) => {
                    if (attempts > 5) return;
                    system.runTimeout(() => {
                        if (!spawnedMob.isValid()) return;

                        const rideable = spawnedMob.getComponent("minecraft:rideable");
                        if (rideable) {
                            const success = rideable.addRider(player);
                            if (!success) tryRide(attempts + 1);
                        } else {
                            tryRide(attempts + 1);
                        }
                    }, 4 + (attempts * 2));
                };
                tryRide();
            }
        }
    }, 1);
}

export function returnOwnedMobs(player, targetOwnerId) {
    const inventory = getMobs(player, 'mount_inventory');
    const storage = getMobs(player, 'mount_storage');
    let returnedCount = 0;

    // Check Inventory
    for (let i = inventory.length - 1; i >= 0; i--) {
        if (inventory[i].ownerId === targetOwnerId) {
            const mob = inventory[i];
            inventory.splice(i, 1);
            addPendingGift(targetOwnerId, {
                type: 'gift',
                senderId: player.id,
                senderName: player.name,
                mob: mob,
                cost: 0 // Free return
            });
            returnedCount++;
        }
    }

    // Check Storage
    for (let i = storage.length - 1; i >= 0; i--) {
        if (storage[i].ownerId === targetOwnerId) {
            const mob = storage[i];
            storage.splice(i, 1);
            addPendingGift(targetOwnerId, {
                type: 'gift',
                senderId: player.id,
                senderName: player.name,
                mob: mob,
                cost: 0 // Free return
            });
            returnedCount++;
        }
    }

    if (returnedCount > 0) {
        saveMobs(player, 'mount_inventory', inventory);
        saveMobs(player, 'mount_storage', storage);
        player.sendMessage(`§eReturned ${returnedCount} mobs to their owner (Trust Removed).`);
    }
}

export function isPlayerRiding(player) {
    const dimension = player.dimension;
    const nearbyEntities = dimension.getEntities({
        location: player.location,
        maxDistance: 6.0,
    });

    for (const entity of nearbyEntities) {
        const rideable = entity.getComponent("minecraft:rideable");
        if (rideable) {
            const riders = rideable.getRiders();
            for (const rider of riders) {
                if (rider.id === player.id) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function canCapture(player, entity, isBlueOrb = false) {
    if (!entity.isValid()) return { canCapture: false };

    // Crowd Check (Applies to both Orbs to prevent duplication)
    const dimension = entity.dimension;
    const nearbyEntities = dimension.getEntities({
        location: entity.location,
        maxDistance: 6.0
    });
    const nearbyAllowed = nearbyEntities.filter(e => ALLOWED_ENTITIES.includes(e.typeId));
    if (nearbyAllowed.length > 1) {
        return { canCapture: false, error: "capture_fail_crowded" };
    }

    if (!ALLOWED_ENTITIES.includes(entity.typeId)) {
        return { canCapture: false, error: "capture_fail_blocked" };
    }

    const mountOwner = entity.getDynamicProperty('mount_owner');
    const tameable = entity.getComponent("minecraft:tameable");

    let ownerId = mountOwner;
    if (!ownerId && tameable) {
        ownerId = tameable.tamedToPlayerId;
    }

    if (ownerId && ownerId !== player.id) {
        if (!isTrusted(ownerId, player.id)) {
            return { canCapture: false, error: "capture_fail_not_owner" };
        }
    }

    if (entity.typeId === 'minecraft:happy_ghast') {
        if (!entity.hasTag("harness")) {
            return { canCapture: false, error: "capture_fail_no_harness" };
        }
    } else {
        const isSaddled = entity.getComponent('minecraft:is_saddled');
        const equippable = entity.getComponent('minecraft:equippable');
        const saddleItem = equippable ? equippable.getEquipment('Saddle') : null;
        let hasSaddle = false;
        if (isSaddled) hasSaddle = true;
        if (saddleItem) hasSaddle = true;
        if (entity.getComponent("minecraft:is_saddled")) hasSaddle = true;

        if (entity.typeId !== 'minecraft:nautilus' && !hasSaddle) {
            return { canCapture: false, error: "capture_fail_no_saddle" };
        }
    }

    const health = entity.getComponent("minecraft:health");
    if (!health) {
        return { canCapture: false, error: "capture_fail_no_health" };
    }
    if (health.currentValue > MAX_HEALTH) {
        return { canCapture: false, error: "capture_fail_too_much_health" };
    }

    const inventory = getMobs(player, 'mount_inventory');
    if (inventory.length >= MAX_INVENTORY) {
        return { canCapture: false, error: "capture_fail_full" };
    }

    return { canCapture: true, ownerId: ownerId, health: health.currentValue };
}

export function captureMob(player, entity, itemStack, isBlueOrb = false) {
    const check = canCapture(player, entity, isBlueOrb);

    if (!check.canCapture) {
        if (check.error) {
            // Only show detailed error if it is NOT the blue orb fail (which might be handled specifically)
            // But here we return generic errors.
            player.onScreenDisplay.setActionBar(translateForPlayer(player, check.error));
            player.playSound("beacon.deactivate", { pitch: 0.8, volume: 1.0 });
            player.runCommand("particle minecraft:trial_spawner_detection ~ ~1 ~");
        }
        return false;
    }

    try {
        const inv = player.getComponent("minecraft:inventory").container;

        const structureName = `capture_${player.name}_${Date.now()}`;
        player.runCommand(`particle minecraft:trial_spawner_detection ${entity.location.x} ${entity.location.y} ${entity.location.z}`);
        player.playSound("beacon.deactivate", { pitch: 2, volume: 1.0 });
        player.runCommand(`structure save "${structureName}" ${entity.location.x} ${entity.location.y} ${entity.location.z} ${entity.location.x} ${entity.location.y} ${entity.location.z} true disk false`);
        const customName = entity.nameTag?.trim() || null;

        const inventory = getMobs(player, 'mount_inventory');
        inventory.unshift({
            structureName,
            entityType: entity.typeId,
            entityName: entity.typeId.split(":")[1],
            health: check.health,
            customName,
            ownerId: check.ownerId
        });
        saveMobs(player, 'mount_inventory', inventory);

        player.startItemCooldown("catcher_cooldown", 20);

        // Safety Effects for Blue Orb (Save User Feature)
        if (isBlueOrb) {
            player.addEffect("levitation", 8, { amplifier: 15, showParticles: false });
            player.addEffect("resistance", 30, { amplifier: 255, showParticles: false });
        }

        entity.remove();
        return true;
    } catch (e) {
        player.sendMessage("§cCapture Error: " + e);
        return false;
    }
}
