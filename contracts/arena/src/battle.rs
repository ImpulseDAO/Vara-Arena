use core::cmp::{max, min};

use arena_io::{
    AttackKind, BattleAction, BattleLog, Character, CharacterState, TurnAction, TurnResult,
    YourTurn,
};
use gstd::{debug, exec, msg, prelude::*};
use rand::{rngs::SmallRng, Rng, SeedableRng};

const MIN_POS: u8 = 0;
const MAX_POS: u8 = 20;
const FIRST_POS: u8 = 4;
const SECOND_POS: u8 = 15;

const QUICK_DAMAGE: [u8; 10] = [0, 10, 10, 15, 20, 25, 30, 35, 40, 45];
const PRESIZE_DAMAGE: [u8; 10] = [0, 15, 15, 20, 26, 33, 39, 46, 52, 59];
const HEAVY_DAMAGE: [u8; 10] = [0, 20, 20, 24, 32, 40, 48, 56, 64, 72];

const MOVE: [u8; 10] = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5];

pub const ENERGY: [u8; 10] = [0, 110, 120, 130, 140, 150, 160, 170, 180, 190];

pub struct Battle {
    pub c1: Character,
    pub c2: Character,
}

impl Battle {
    pub fn new(mut c1: Character, mut c2: Character) -> Battle {
        c1.position = FIRST_POS;
        c2.position = SECOND_POS;
        Battle { c1, c2 }
    }

    fn energy_regeneration(stamina: u8) -> u8 {
        match stamina {
            1..=3 => 15, // Low stamina regenerates slowly
            4..=7 => 40, // Moderate stamina regenerates at a moderate rate
            _ => 100,    // High stamina regenerates faster
        }
    }

    pub async fn fight(mut self) -> BattleLog {
        let mut turns = vec![];

        let block_timestamp = exec::block_timestamp();
        let mut rng = SmallRng::seed_from_u64(block_timestamp);

        let mut p1_energy_reg_counter = 0;
        let mut p2_energy_reg_counter = 0;
        let p1_stamina = self.c1.attributes.stamina;
        let p2_stamina = self.c2.attributes.stamina;
        let mut p1_initiative_incr = 0;
        let mut p2_initiative_incr = 0;

        loop {
            let p1_cant_rest = p1_energy_reg_counter == 3;
            let p2_cant_rest = p2_energy_reg_counter == 3;

            if p1_cant_rest && p2_cant_rest || turns.len() > 25 {
                debug!("New GAMEPLAY!");
                debug!("p1 = {} hp x p2 = {} hp!", self.c1.hp, self.c2.hp);
                let winner = if self.c1.hp > self.c2.hp {
                    self.c1.id
                } else {
                    self.c2.id
                };
                return BattleLog {
                    c1: self.c1.id,
                    c2: self.c2.id,
                    winner: winner,
                    turns,
                };
            };

            let p1_turn = YourTurn {
                you: CharacterState {
                    hp: self.c1.hp,
                    position: self.c1.position,
                    energy: self.c1.energy,
                },
                enemy: CharacterState {
                    hp: self.c2.hp,
                    position: self.c2.position,
                    energy: self.c2.energy,
                },
            };
            let p1_action: BattleAction = msg::send_for_reply_as(self.c1.id, p1_turn, 0, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");

            let p2_turn = YourTurn {
                you: CharacterState {
                    hp: self.c2.hp,
                    position: self.c2.position,
                    energy: self.c2.energy,
                },
                enemy: CharacterState {
                    hp: self.c1.hp,
                    position: self.c1.position,
                    energy: self.c1.energy,
                },
            };
            let p2_action: BattleAction = msg::send_for_reply_as(self.c2.id, p2_turn, 0, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");

            let p1_initiative = p1_action.initiative() + p1_initiative_incr;
            let p2_initiative = p2_action.initiative() + p2_initiative_incr;

            p1_initiative_incr = 0;
            p2_initiative_incr = 0;

            if p1_initiative > p2_initiative {
                let result = Battle::execute_action(
                    &p1_action,
                    &mut self.c1,
                    &mut self.c2,
                    &mut p1_energy_reg_counter,
                    &mut p2_initiative_incr,
                    false,
                );
                turns.push(result);
                if self.c2.hp == 0 {
                    debug!("{:?} is a winner", self.c1.id);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner: self.c1.id,
                        turns,
                    };
                }

                let result = Battle::execute_action(
                    &p2_action,
                    &mut self.c2,
                    &mut self.c1,
                    &mut p2_energy_reg_counter,
                    &mut p1_initiative_incr,
                    matches!(&p1_action, BattleAction::Parry),
                );
                turns.push(result);
                if self.c1.hp == 0 {
                    debug!("{:?} is a winner", self.c2.id);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner: self.c2.id,
                        turns,
                    };
                }
            } else {
                let result = Battle::execute_action(
                    &p2_action,
                    &mut self.c2,
                    &mut self.c1,
                    &mut p2_energy_reg_counter,
                    &mut p1_initiative_incr,
                    false,
                );
                turns.push(result);
                if self.c1.hp == 0 {
                    debug!("{:?} is a winner", self.c2.id);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner: self.c2.id,
                        turns,
                    };
                }

                let result = Battle::execute_action(
                    &p1_action,
                    &mut self.c1,
                    &mut self.c2,
                    &mut p1_energy_reg_counter,
                    &mut p2_initiative_incr,
                    matches!(&p2_action, BattleAction::Parry),
                );
                turns.push(result);
                if self.c2.hp == 0 {
                    debug!("{:?} is a winner", self.c1.id);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner: self.c1.id,
                        turns,
                    };
                }
            }
        }
    }

    fn execute_action(
        action: &BattleAction,
        player: &mut Character,
        enemy: &mut Character,
        reg_counter: &mut i32,
        enemy_initiative_incr: &mut u8,
        enemy_parry: bool,
    ) -> TurnResult {
        let action = match action {
            BattleAction::Attack { kind } => match kind {
                AttackKind::Quick => {
                    if let Some(energy) = player.energy.checked_sub(10) {
                        player.energy = energy;
                        if player.position.abs_diff(enemy.position) == 1 {
                            if enemy_parry {
                                TurnAction::Attack {
                                    position: player.position,
                                    damage: 0,
                                }
                            } else {
                                let damage = QUICK_DAMAGE[usize::from(player.attributes.strength)];
                                enemy.hp = enemy.hp.saturating_sub(damage);
                                TurnAction::Attack {
                                    position: player.position,
                                    damage,
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
                            if enemy_parry {
                                TurnAction::Attack {
                                    position: player.position,
                                    damage: 0,
                                }
                            } else {
                                let damage =
                                    PRESIZE_DAMAGE[usize::from(player.attributes.strength)];
                                enemy.hp = enemy.hp.saturating_sub(damage);
                                TurnAction::Attack {
                                    position: player.position,
                                    damage,
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
                            if enemy_parry {
                                TurnAction::Attack {
                                    position: player.position,
                                    damage: 0,
                                }
                            } else {
                                let damage = HEAVY_DAMAGE[usize::from(player.attributes.strength)];
                                enemy.hp = enemy.hp.saturating_sub(damage);
                                TurnAction::Attack {
                                    position: player.position,
                                    damage,
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
            },
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
                if *reg_counter < 3 {
                    let full_energy = ENERGY[usize::from(player.attributes.stamina)];
                    let reg_tick = Battle::energy_regeneration(player.attributes.stamina) - 5;
                    player.energy = min(player.energy + reg_tick, full_energy);
                    *reg_counter += 1;
                    debug!("player {:?} reg counter = {:?}", player.id, reg_counter);
                    TurnAction::Rest { energy: reg_tick }
                } else {
                    debug!("player {:?} energy now = {:?}", player.id, player.energy);
                    TurnAction::NotEnoughEnergy
                }
            }
            BattleAction::Parry => {
                if let Some(energy) = player.energy.checked_sub(10) {
                    player.energy = energy;
                    *enemy_initiative_incr += 1;
                    TurnAction::Parry
                } else {
                    TurnAction::NotEnoughEnergy
                }
            }
        };

        TurnResult {
            character: player.id,
            action,
        }
    }
}
