use arena_io::{Character, Spell, TurnAction};
use core::cmp::max;

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
) -> TurnAction {
    match spell {
        Spell::FireWall => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                todo!();
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::EarthSkin => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_skin = (3, player.attributes.intelligence * 3);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::WaterRestoration => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let heal = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(heal);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::Fireball => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnAction::NotEnoughEnergy;
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
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = 5 + player.attributes.intelligence * 2;
                enemy.water_burst = 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::FireHaste => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.fire_haste = 3;
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::EarthSmites => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_smites = 3;
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
        Spell::ChillingTouch => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                enemy.chilling_touch = 3;
            } else {
                return TurnAction::NotEnoughEnergy;
            }
        }
    }

    TurnAction::CastSpell
}
