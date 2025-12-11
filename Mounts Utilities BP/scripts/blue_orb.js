import { world, system } from '@minecraft/server';
import * as Utils from './utils';
import * as UI from './ui_manager';

world.beforeEvents.itemUse.subscribe(ev => {
    const { itemStack, source: player } = ev;
    if (itemStack.typeId !== Utils.BLUE_ORB_ID) return;

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
        ev.cancel = true;
        system.run(() => {
            const dimension = player.dimension;
            const nearbyEntities = dimension.getEntities({
                location: player.location,
                maxDistance: 4.0,
                excludeFamilies: ["player"]
            });

            let myMount = null;
            for (const entity of nearbyEntities) {
                const rideable = entity.getComponent("minecraft:rideable");
                if (rideable) {
                    const riders = rideable.getRiders();
                    if (riders.some(r => r.id === player.id)) {
                        myMount = entity;
                        break;
                    }
                }
            }

            if (myMount) {
                // Attempt capture with strict blue orb rules (checking isBlueOrb=true is handled in logic if needed, 
                // but here we just need to pass the itemStack).
                // We pass true for isBlueOrb to apply strict rules if implemented in canCapture, 
                // though currently canCapture mainly skips crowd check for blue orb.
                Utils.captureMob(player, myMount, itemStack, true);
            } else {
                player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "release_fail_riding"));
            }
        });
        return;
    }

    system.run(() => {
        const inventory = Utils.getMobs(player, 'mount_inventory');
        if (inventory.length === 0) {
            player.playSound("beacon.deactivate", { pitch: 0.8, volume: 1.0 });
            player.onScreenDisplay.setActionBar(Utils.translateForPlayer(player, "release_fail_empty"));
            return;
        }

        const mob = inventory[0];
        // Remove first (Top of list logic)
        inventory.shift();
        Utils.saveMobs(player, 'mount_inventory', inventory);

        // Spawn
        const autoRide = Utils.getPlayerAutoRide(player);
        Utils.spawnMob(player, mob, player.location, autoRide);

        player.startItemCooldown("catcher_cooldown", 20);
    });
});
