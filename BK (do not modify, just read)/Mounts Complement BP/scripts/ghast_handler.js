import { world, system } from "@minecraft/server";

const HARNESS_COLORS = [
    "white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray",
    "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"
];

world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const { player, target, itemStack } = ev;

    if (target.typeId !== "minecraft:happy_ghast") return;
    if (!itemStack) return;

    // 1. Equip Harness
    let color = null;
    for (const c of HARNESS_COLORS) {
        if (itemStack.typeId.includes(`${c}_harness`)) {
            color = c;
            break;
        }
    }

    if (color) {
        // Check if already equipped
        if (target.hasTag("harness")) {
            player.onScreenDisplay.setActionBar("§cAlready has a harness!");
            return;
        }

        ev.cancel = true;

        system.run(() => {
            // Add tags
            target.addTag("harness");
            target.addTag(`harness_color:${color}`);

            // Trigger event for visual/component updates
            target.triggerEvent("equip_harness");

            // Consume item (if not creative)
            // Simplified check: just consume. 
            const inv = player.getComponent("minecraft:inventory").container;
            if (inv) {
                const selectedItem = inv.getItem(player.selectedSlotIndex);
                if (selectedItem) {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount--;
                        inv.setItem(player.selectedSlotIndex, selectedItem);
                    } else {
                        inv.setItem(player.selectedSlotIndex, undefined);
                    }
                }
            }

            // Feedback
            player.onScreenDisplay.setActionBar("Harness Equipped");
            player.playSound("armor.equip_leather");
        });
        return;
    }

    // 2. Unequip Harness (Shears)
    if (itemStack.typeId === "minecraft:shears") {
        if (target.hasTag("harness")) {
            ev.cancel = true;
            system.run(() => {
                // Remove tags
                target.removeTag("harness");

                // Remove color tag
                const tags = target.getTags();
                for (const tag of tags) {
                    if (tag.startsWith("harness_color:")) {
                        target.removeTag(tag);
                        break;
                    }
                }

                // Trigger event
                target.triggerEvent("unequip_harness");

                // Feedback
                player.playSound("mob.sheep.shear");

                // Damage shears
                const inv = player.getComponent("minecraft:inventory").container;
                const selectedItem = inv.getItem(player.selectedSlotIndex);
                if (selectedItem) {
                    const durability = selectedItem.getComponent("minecraft:durability");
                    if (durability) {
                        durability.damage++;
                        if (durability.damage >= durability.maxDurability) {
                            inv.setItem(player.selectedSlotIndex, undefined);
                            player.playSound("random.break");
                        } else {
                            inv.setItem(player.selectedSlotIndex, selectedItem);
                        }
                    }
                }
            });
        }
    }
});
