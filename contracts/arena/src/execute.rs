use crate::spell::execute_cast_spell;
use crate::utils;
use arena_io::{AttackKind, BattleAction, Character, TurnEvent, TurnLog};
use core::cmp::{max, min};
use gstd::debug;

const MIN_POS: u8 = 1;
const MAX_POS: u8 = 15;

const MOVE: [u8; 10] = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];

fn is_attack_successful(hit_chance: u8) -> bool {
    utils::get_random_value(100) < hit_chance
}

fn execute_attack_kind(
    player: &mut Character,
    enemy: &mut Character,
    energy: u8,
    base_hit_chance: u8,
    base_damage: u8,
) -> TurnEvent {
    if let Some(energy) = player.energy.checked_sub(energy) {
        player.energy = energy;
        if player.position.abs_diff(enemy.position) == 1 {
            if enemy.parry {
                TurnEvent::Attack {
                    position: player.position,
                    damage: 0,
                }
            } else {
                let hit_chance = if player.water_burst == 0 {
                    base_hit_chance + player.attributes.agility * 2
                } else {
                    base_hit_chance
                };
                let success = is_attack_successful(hit_chance);
                if success {
                    let mut damage = base_damage + player.attributes.strength * 2;
                    if player.earth_smites.0 > 0 {
                        damage += player.earth_smites.1;
                    }
                    if enemy.earth_skin.0 > 0 {
                        if enemy.earth_skin.1 > damage {
                            damage = 0;
                            enemy.earth_skin.1 = enemy.earth_skin.1 - damage;
                        } else {
                            damage = damage - enemy.earth_skin.1;
                            enemy.earth_skin = (0, 0);
                        }
                    }
                    enemy.hp = enemy.hp.saturating_sub(damage);
                    if enemy.fire_wall.0 != 0 && enemy.hp != 0 {
                        let damage = enemy.fire_wall.1;
                        player.hp = player.hp.saturating_sub(damage);
                    }
                    TurnEvent::Attack {
                        position: player.position,
                        damage,
                    }
                } else {
                    TurnEvent::Miss {
                        position: player.position,
                    }
                }
            }
        } else {
            TurnEvent::Miss {
                position: player.position,
            }
        }
    } else {
        debug!(
            "player {:?} has not enough energy for quick attack. skipping the turn...",
            player.id
        );
        TurnEvent::NotEnoughEnergy
    }
}

fn execute_attack(player: &mut Character, enemy: &mut Character, kind: &AttackKind) -> TurnEvent {
    match kind {
        AttackKind::Quick => execute_attack_kind(player, enemy, 2, 80, 5),
        AttackKind::Precise => execute_attack_kind(player, enemy, 4, 60, 10),
        AttackKind::Heavy => execute_attack_kind(player, enemy, 6, 35, 20),
    }
}

pub fn execute_action(
    action: &BattleAction,
    player: &mut Character,
    enemy: &mut Character,
) -> TurnLog {
    let action = match action {
        BattleAction::Attack { kind } => execute_attack(player, enemy, kind),
        BattleAction::MoveLeft => {
            if let Some(energy) = player.energy.checked_sub(1) {
                player.energy = energy;
                let move_ = MOVE[usize::from(player.attributes.agility)];
                if player.position < enemy.position {
                    player.position = max(player.position - move_, MIN_POS);
                } else {
                    player.position = max(player.position - move_, enemy.position + 1);
                }
                TurnEvent::Move {
                    position: player.position,
                }
            } else {
                TurnEvent::NotEnoughEnergy
            }
        }
        BattleAction::MoveRight => {
            if let Some(energy) = player.energy.checked_sub(1) {
                player.energy = energy;
                let move_ = MOVE[usize::from(player.attributes.agility)];
                if player.position < enemy.position {
                    player.position = min(player.position + move_, enemy.position - 1);
                } else {
                    player.position = min(player.position + move_, MAX_POS);
                }
                TurnEvent::Move {
                    position: player.position,
                }
            } else {
                TurnEvent::NotEnoughEnergy
            }
        }
        BattleAction::Rest => {
            let full_energy = utils::full_energy(player.attributes.stamina);
            let reg_tick = 5u8.saturating_sub(player.rest_count);
            player.energy = min(player.energy + reg_tick, full_energy);
            player.rest_count += 1;
            debug!(
                "player {:?} reg counter = {:?}",
                player.id, player.rest_count
            );
            TurnEvent::Rest { energy: reg_tick }
        }
        BattleAction::Parry => {
            if let Some(energy) = player.energy.checked_sub(2) {
                player.energy = energy;
                TurnEvent::Parry
            } else {
                TurnEvent::NotEnoughEnergy
            }
        }
        BattleAction::Guardbreak => {
            if let Some(energy) = player.energy.checked_sub(2) {
                player.energy = energy;
                if enemy.parry {
                    enemy.disable_agiim = true;
                }
                TurnEvent::Guardbreak
            } else {
                TurnEvent::NotEnoughEnergy
            }
        }
        BattleAction::CastSpell { spell } => execute_cast_spell(player, enemy, spell),
    };

    TurnLog {
        character: player.id,
        action,
    }
}
