use crate::character::Character;
use crate::effects::EffectKind;
use crate::spell::execute_cast_spell;
use crate::utils;
use arena_io::{AttackKind, AttackResult, BattleAction, TurnEvent, TurnLog};
use core::cmp::{max, min};
use gstd::{debug, prelude::*};

const MIN_POS: u8 = 1;
const MAX_POS: u8 = 15;

const MOVE: [u8; 10] = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];

fn is_attack_successful(hit_chance: u8) -> bool {
    utils::get_random_value(100) < hit_chance
}

fn attack_power(character: &Character, base_damage: u8, crit_modifier: u8) -> u8 {
    let agility = character.attributes.agility;
    let strength = character.attributes.strength;
    let empower = character.get_effect(EffectKind::Empower);
    let is_crit = utils::get_random_value(100 + agility * 2);
    debug!("{:?}", is_crit);

    let damage = base_damage + empower + strength * 2;
    if is_crit > 100 {
        // Scale damage using player's strength and agility
        damage + (agility + crit_modifier) * 2
    } else {
        damage
    }
}

fn execute_attack_kind(
    player: &mut Character,
    enemy: &mut Character,
    energy: u8,
    base_hit_chance: u8,
    base_damage: u8,
    crit_modifier: u8,
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
                let blind = player.get_effect(EffectKind::Blind);
                let hit_chance = base_hit_chance + player.attributes.agility * 2 - blind;
                let success = is_attack_successful(hit_chance);
                if success {
                    let damage = attack_power(player, base_damage, crit_modifier);
                    debug!("damage is {:?}", damage);
                    enemy.hp = enemy.hp.saturating_sub(damage);

                    let spikes = enemy.get_effect(EffectKind::Spikes);
                    if spikes > 0 {
                        player.hp = player.hp.saturating_sub(spikes);
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
        AttackKind::Quick => execute_attack_kind(player, enemy, 2, 80, 5, 2, kind, logs),
        AttackKind::Precise => execute_attack_kind(player, enemy, 4, 60, 10, 3, kind, logs),
        AttackKind::Heavy => execute_attack_kind(player, enemy, 6, 35, 20, 4, kind, logs),
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
            debug!("player {:?} CASTING SPELL {:?} ", player.name, spell);

            let event = execute_cast_spell(player, enemy, spell, action);
            logs.push(TurnLog {
                character: player.id,
                action: event,
            });
        }
    };
}
