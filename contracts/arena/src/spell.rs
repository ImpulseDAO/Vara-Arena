use crate::character::Character;
use crate::effects::EffectKind;
use arena_io::{BattleAction, CastSpellResult, Spell, TurnEvent};

pub fn execute_cast_spell(
    player: &mut Character,
    enemy: &mut Character,
    spell: &Spell,
    action: &BattleAction,
) -> TurnEvent {
    let result = match spell {
        Spell::FireWall => {
            if let Some(energy) = player.energy.checked_sub(5) {
                let firewall_damage = player.attributes.intelligence * 2;
                player.energy = energy;
                player.add_effect(EffectKind::Spikes, firewall_damage, Some(3));
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
                player.add_effect(
                    EffectKind::Regeneration,
                    player.attributes.intelligence,
                    Some(3),
                );
                CastSpellResult::EarthSkin {
                    defence: player.attributes.intelligence,
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
                let heal = player.attributes.intelligence * 2;
                player.hp = player.hp + heal;
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
        Spell::WaterBurst => {
            if let Some(energy) = player.energy.checked_sub(5) {
                player.energy = energy;
                let damage = 5 + player.attributes.intelligence * 2;
                enemy.add_effect(EffectKind::Blind, 1, Some(3));
                enemy.hp = enemy.hp.saturating_sub(damage);
                CastSpellResult::WaterBurst { damage }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
        Spell::EarthSmites => {
            if let Some(energy) = player.energy.checked_sub(5) {
                let damage = player.attributes.intelligence * 3;
                player.energy = energy;
                player.add_effect(EffectKind::Empower, damage, Some(3));
                CastSpellResult::EarthSmites { damage }
            } else {
                return TurnEvent::NotEnoughEnergy {
                    action: action.clone(),
                };
            }
        }
    };

    TurnEvent::CastSpell { result }
}
