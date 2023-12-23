use arena_io::{Character, Spell, TurnEvent};
use core::cmp::max;

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
) -> TurnEvent {
    match spell {
        Spell::FireWall => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.fire_wall = (3, player.attributes.intelligence * 3);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::EarthSkin => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_skin = (3, player.attributes.intelligence * 3);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::WaterRestoration => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let heal = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(heal);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::Fireball => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::EarthCatapult => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
                if player.position > enemy.position {
                    enemy.position = enemy.position.saturating_sub(2);
                } else {
                    enemy.position = max(enemy.position + 2, 15);
                }
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = 5 + player.attributes.intelligence * 2;
                enemy.water_burst = 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::FireHaste => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.fire_haste = 4;
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::EarthSmites => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_smites = (4, player.attributes.intelligence * 3);
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
        Spell::ChillingTouch => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                enemy.chilling_touch = 4;
            } else {
                return TurnEvent::NotEnoughEnergy;
            }
        }
    }

    TurnEvent::CastSpell
}
