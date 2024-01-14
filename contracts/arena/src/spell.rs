use arena_io::{BattleAction, CastSpellResult, Character, Spell, TurnEvent};
use core::cmp::min;

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
    action: &BattleAction,
) -> TurnEvent {
    let result = match spell {
        Spell::FireWall => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.fire_wall = (3, player.attributes.intelligence * 2);
                CastSpellResult::FireWall
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::EarthSkin => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_skin = (3, player.attributes.intelligence * 3);
                CastSpellResult::EarthSkin {
                    defence: player.earth_skin.1,
                }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::WaterRestoration => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let heal = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(heal);
                CastSpellResult::WaterRestoration { heal }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::Fireball => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
                CastSpellResult::Fireball { damage }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::EarthCatapult => {
            if let Some(energy) = player.energy.checked_sub(7) {
                player.energy = energy;
                let damage = player.attributes.intelligence * 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
                if player.position > enemy.position {
                    enemy.position = enemy.position.saturating_sub(2);
                } else {
                    enemy.position = min(enemy.position + 2, 15);
                }
                CastSpellResult::EarthCatapult {
                    damage,
                    enemy_position: enemy.position,
                }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = 5 + player.attributes.intelligence * 2;
                enemy.water_burst = 3;
                enemy.hp = enemy.hp.saturating_sub(damage);
                CastSpellResult::WaterBurst { damage }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::FireHaste => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.fire_haste = 4;
                CastSpellResult::FireHaste
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::EarthSmites => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                player.earth_smites = (4, player.attributes.intelligence * 3);
                CastSpellResult::EarthSmites {
                    damage: player.earth_smites.1,
                }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::ChillingTouch => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                enemy.chilling_touch = 4;
                CastSpellResult::ChillingTouch
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
    };

    TurnEvent::CastSpell { result }
}
