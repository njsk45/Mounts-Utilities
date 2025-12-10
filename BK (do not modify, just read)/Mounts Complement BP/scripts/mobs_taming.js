import { world, system, ItemStack } from '@minecraft/server';

const ALLOWED_ENTITIES = [
    'minecraft:horse',
    'minecraft:donkey',
    'minecraft:zombie_horse',
    'minecraft:skeleton_horse',
    'minecraft:mule',
    'minecraft:nautilus',
    'minecraft:camel',
    'minecraft:camel_husk',
    'minecraft:happy_ghast',
    'minecraft:strider',
    'minecraft:pig',
    'minecraft:llama',
    'minecraft:trader_llama'
];

world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const { player, itemStack, target: entity } = ev;

    if (!itemStack || itemStack.typeId !== 'minecraft:glistering_melon_slice') return;
    player.sendMessage(`Debug: Taming Check - Entity: ${entity.typeId}`);
    if (!ALLOWED_ENTITIES.includes(entity.typeId)) return;

    // Check if already tamed by this script
    const currentOwner = entity.getDynamicProperty('mount_owner');
    if (currentOwner) {
        // Already tamed by script
        return;
    }

    // Check if already tamed by vanilla
    const tameable = entity.getComponent('minecraft:tameable');
    if (tameable && tameable.tamedToPlayerId) {
        // Already tamed by vanilla
        return;
    }

    // Check for amount
    const inv = player.getComponent('minecraft:inventory').container;
    let totalSlices = 0;
    if (player.getGameMode() !== 'creative') {
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item && item.typeId === 'minecraft:glistering_melon_slice') {
                totalSlices += item.amount;
            }
        }
        player.sendMessage(`Debug: Total Slices: ${totalSlices}`);

        if (totalSlices < 20) {
            player.onScreenDisplay.setActionBar("§cYou need 20 Glistering Melon Slices to tame this mob!");
            ev.cancel = true;
            return;
        }
    }

    ev.cancel = true;

    system.run(() => {
        // Set owner
        entity.setDynamicProperty('mount_owner', player.id);

        // Trigger vanilla tame if possible
        if (tameable) {
            try {
                tameable.tame(player);
            } catch (e) {
                // Ignore error
            }
        }

        // Effects
        player.runCommand(`particle minecraft:heart_particle ${entity.location.x} ${entity.location.y + 1} ${entity.location.z}`);
        player.playSound('random.orb', { pitch: 1.0, volume: 1.0 });
        player.onScreenDisplay.setActionBar("§aYou have tamed this mount!");

        // Consume items (if not creative)
        const gameMode = player.getGameMode();
        if (gameMode !== 'creative') {
            let remaining = 20;
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
        }
    });
});
