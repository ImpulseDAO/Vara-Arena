use crate::spell::execute_cast_spell;
use arena_io::{AttackKind, BattleAction, Character, TurnAction, TurnResult};
use core::cmp::{max, min};
use gstd::debug;
use rand::{rngs::SmallRng, Rng};

const MIN_POS: u8 = 1;
const MAX_POS: u8 = 15;

const QUICK_DAMAGE: [u8; 10] = [0, 10, 10, 15, 20, 25, 30, 35, 40, 45];
const PRECISE_DAMAGE: [u8; 10] = [0, 15, 15, 20, 26, 33, 39, 46, 52, 59];
const HEAVY_DAMAGE: [u8; 10] = [0, 20, 20, 24, 32, 40, 48, 56, 64, 72];

const MOVE: [u8; 10] = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];

pub const ENERGY: [u8; 10] = [0, 110, 120, 130, 140, 150, 160, 170, 180, 190];

fn energy_regeneration(stamina: u8) -> u8 {
    match stamina {
        1..=3 => 15, // Low stamina regenerates slowly
        4..=7 => 40, // Moderate stamina regenerates at a moderate rate
        _ => 100,    // High stamina regenerates faster
    }
}

fn execute_attack(
    player: &mut Character,
    enemy: &mut Character,
    kind: &AttackKind,
    rng: &mut SmallRng,
) -> TurnAction {
    match kind {
        AttackKind::Quick => {
            if let Some(energy) = player.energy.checked_sub(10) {
                player.energy = energy;
                if player.position.abs_diff(enemy.position) == 1 {
                    if enemy.parry {
                        TurnAction::Attack {
                            position: player.position,
                            damage: 0,
                        }
                    } else {
                        let success = rng.gen_ratio(80, 100);
                        if success {
                            let damage = QUICK_DAMAGE[usize::from(player.attributes.strength)];
                            enemy.hp = enemy.hp.saturating_sub(damage);
                            TurnAction::Attack {
                                position: player.position,
                                damage,
                            }
                        } else {
                            TurnAction::Miss {
                                position: player.position,
                            }
                        }
                    }
                } else {
                    TurnAction::Miss {
                        position: player.position,
                    }
                }
            } else {
                debug!(
                    "player {:?} has not enough energy for quick attack. skipping the turn...",
                    player.id
                );
                TurnAction::NotEnoughEnergy
            }
        }
        AttackKind::Precise => {
            if let Some(energy) = player.energy.checked_sub(20) {
                player.energy = energy;
                if player.position.abs_diff(enemy.position) == 1 {
                    if enemy.parry {
                        TurnAction::Attack {
                            position: player.position,
                            damage: 0,
                        }
                    } else {
                        let success = rng.gen_ratio(60, 100);
                        if success {
                            let damage = PRECISE_DAMAGE[usize::from(player.attributes.strength)];
                            enemy.hp = enemy.hp.saturating_sub(damage);
                            TurnAction::Attack {
                                position: player.position,
                                damage,
                            }
                        } else {
                            TurnAction::Miss {
                                position: player.position,
                            }
                        }
                    }
                } else {
                    TurnAction::Miss {
                        position: player.position,
                    }
                }
            } else {
                debug!(
                    "player {:?} has not enough energy for precise attack. skipping the turn...",
                    player.id
                );
                TurnAction::NotEnoughEnergy
            }
        }
        AttackKind::Heavy => {
            if let Some(energy) = player.energy.checked_sub(30) {
                player.energy = energy;
                if player.position.abs_diff(enemy.position) == 1 {
                    if enemy.parry {
                        TurnAction::Attack {
                            position: player.position,
                            damage: 0,
                        }
                    } else {
                        let success = rng.gen_ratio(35, 100);
                        if success {
                            let damage = HEAVY_DAMAGE[usize::from(player.attributes.strength)];
                            enemy.hp = enemy.hp.saturating_sub(damage);
                            TurnAction::Attack {
                                position: player.position,
                                damage,
                            }
                        } else {
                            TurnAction::Miss {
                                position: player.position,
                            }
                        }
                    }
                } else {
                    TurnAction::Miss {
                        position: player.position,
                    }
                }
            } else {
                debug!(
                    "player {:?} has not enough energy for heavy attack. skipping the turn...",
                    player.id
                );
                TurnAction::NotEnoughEnergy
            }
        }
    }
}

pub fn execute_action(
    action: &BattleAction,
    player: &mut Character,
    enemy: &mut Character,
    rng: &mut SmallRng,
) -> TurnResult {
    let action = match action {
        BattleAction::Attack { kind } => execute_attack(player, enemy, kind, rng),
        BattleAction::MoveLeft => {
            if let Some(energy) = player.energy.checked_sub(3) {
                player.energy = energy;
                let move_ = MOVE[usize::from(player.attributes.agility)];
                if player.position < enemy.position {
                    player.position = max(player.position - move_, MIN_POS);
                } else {
                    player.position = max(player.position - move_, enemy.position + 1);
                }
                TurnAction::Move {
                    position: player.position,
                }
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        BattleAction::MoveRight => {
            if let Some(energy) = player.energy.checked_sub(3) {
                player.energy = energy;
                let move_ = MOVE[usize::from(player.attributes.agility)];
                if player.position < enemy.position {
                    player.position = min(player.position + move_, enemy.position - 1);
                } else {
                    player.position = min(player.position + move_, MAX_POS);
                }
                TurnAction::Move {
                    position: player.position,
                }
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        BattleAction::Rest => {
            if player.energy_reg_counter < 3 {
                let full_energy = ENERGY[usize::from(player.attributes.stamina)];
                let reg_tick = energy_regeneration(player.attributes.stamina) - 5;
                player.energy = min(player.energy + reg_tick, full_energy);
                player.energy_reg_counter += 1;
                debug!(
                    "player {:?} reg counter = {:?}",
                    player.id, player.energy_reg_counter
                );
                TurnAction::Rest { energy: reg_tick }
            } else {
                debug!("player {:?} energy now = {:?}", player.id, player.energy);
                TurnAction::NotEnoughEnergy
            }
        }
        BattleAction::Parry => {
            if let Some(energy) = player.energy.checked_sub(10) {
                player.energy = energy;
                enemy.initiative_incr += 1;
                TurnAction::Parry
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        BattleAction::Guardbreak => {
            if let Some(energy) = player.energy.checked_sub(15) {
                player.energy = energy;
                TurnAction::Guardbreak
            } else {
                TurnAction::NotEnoughEnergy
            }
        }
        BattleAction::CastSpell { spell } => execute_cast_spell(player, enemy, spell),
    };

    TurnResult {
        character: player.id,
        action,
    }
}
