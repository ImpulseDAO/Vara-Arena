use crate::spell::execute_cast_spell;
use crate::utils;
use arena_io::{AttackKind, AttackResult, BattleAction, Character, TurnEvent, TurnLog};
use core::cmp::{max, min};
use gstd::{debug, prelude::*};

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
    kind: &AttackKind,
    logs: &mut Vec<TurnLog>,
) {
    let kind = kind.clone();
    if let Some(energy) = player.energy.checked_sub(energy) {
        player.energy = energy;
        if player.position.abs_diff(enemy.position) == 1 {
            if enemy.parry {
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::Attack {
                        kind,
                        result: AttackResult::Parry,
                    },
                });
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
                        logs.push(TurnLog {
                            character: player.id,
                            action: TurnEvent::FireWall { damage },
                        });
                    }
                    logs.push(TurnLog {
                        character: player.id,
                        action: TurnEvent::Attack {
                            kind,
                            result: AttackResult::Damage(damage),
                        },
                    });
                } else {
                    logs.push(TurnLog {
                        character: player.id,
                        action: TurnEvent::Attack {
                            kind,
                            result: AttackResult::Miss,
                        },
                    });
                }
            }
        } else {
            logs.push(TurnLog {
                character: player.id,
                action: TurnEvent::Attack {
                    kind,
                    result: AttackResult::Miss,
                },
            });
        }
    } else {
        debug!("player {:?} has not enough energy for attack", player.id);
        logs.push(TurnLog {
            character: player.id,
            action: TurnEvent::NotEnoughEnergy {
                action: BattleAction::Attack { kind },
            },
        })
    }
}

fn execute_attack(
    player: &mut Character,
    enemy: &mut Character,
    kind: &AttackKind,
    logs: &mut Vec<TurnLog>,
) {
    match kind {
        AttackKind::Quick => execute_attack_kind(player, enemy, 2, 80, 5, kind, logs),
        AttackKind::Precise => execute_attack_kind(player, enemy, 4, 60, 10, kind, logs),
        AttackKind::Heavy => execute_attack_kind(player, enemy, 6, 35, 20, kind, logs),
    }
}

pub fn execute_action(
    action: &BattleAction,
    player: &mut Character,
    enemy: &mut Character,
    logs: &mut Vec<TurnLog>,
) {
    match action {
        BattleAction::Attack { kind } => execute_attack(player, enemy, kind, logs),
        BattleAction::MoveLeft => {
            if let Some(energy) = player.energy.checked_sub(1) {
                player.energy = energy;
                let move_ = MOVE[usize::from(player.attributes.agility)];
                if player.position < enemy.position {
                    player.position = max(player.position - move_, MIN_POS);
                } else {
                    player.position = max(player.position - move_, enemy.position + 1);
                }
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::Move {
                        position: player.position,
                    },
                });
            } else {
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::NotEnoughEnergy {
                        action: action.clone(),
                    },
                });
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
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::Move {
                        position: player.position,
                    },
                });
            } else {
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::NotEnoughEnergy {
                        action: action.clone(),
                    },
                });
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
            logs.push(TurnLog {
                character: player.id,
                action: TurnEvent::Rest { energy: reg_tick },
            });
        }
        BattleAction::Parry => {
            if let Some(energy) = player.energy.checked_sub(2) {
                player.energy = energy;
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::Parry,
                });
            } else {
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::NotEnoughEnergy {
                        action: action.clone(),
                    },
                });
            }
        }
        BattleAction::Guardbreak => {
            if let Some(energy) = player.energy.checked_sub(2) {
                player.energy = energy;
                if enemy.parry {
                    enemy.disable_agiim = true;
                }
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::Guardbreak {
                        success: enemy.parry,
                    },
                });
            } else {
                logs.push(TurnLog {
                    character: player.id,
                    action: TurnEvent::NotEnoughEnergy {
                        action: action.clone(),
                    },
                })
            }
        }
        BattleAction::CastSpell { spell } => {
            debug!("player {:?} CASTING SPELL", player.id);
            let event = execute_cast_spell(player, enemy, spell, action);
            logs.push(TurnLog {
                character: player.id,
                action: event,
            });
        }
    };
}
