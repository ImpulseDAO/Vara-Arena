use core::cmp::{max, min};

use arena_io::{
    AttackKind, BattleAction, BattleLog, Character, CharacterState, TurnResult, YourTurn,
};
use gstd::{debug, exec, msg, prelude::*};
use rand::{rngs::SmallRng, Rng, SeedableRng};

const MIN_POS: u8 = 0;
const MAX_POS: u8 = 20;
const FIRST_POS: u8 = 4;
const SECOND_POS: u8 = 15;

const QUICK_DAMAGE: [u8; 10] = [0, 10, 10, 15, 20, 25, 30, 35, 40, 45];
const NORMAL_DAMAGE: [u8; 10] = [0, 15, 15, 20, 26, 33, 39, 46, 52, 59];
const HARD_DAMAGE: [u8; 10] = [0, 20, 20, 24, 32, 40, 48, 56, 64, 72];

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

    pub async fn fight(mut self) -> BattleLog {
        let mut turns = vec![];

        let block_timestamp = exec::block_timestamp();
        let mut rng = SmallRng::seed_from_u64(block_timestamp);
        let mut round: u32 = 0;

        loop {
            let player1 = {
                if round % 2 == 0 {
                    self.c1
                } else {
                    self.c2
                }
            };
            let player2 = {
                if round % 2 == 0 {
                    &self.c2
                } else {
                    &self.c1
                }
            };

            let turn = YourTurn {
                you: CharacterState {
                    hp: player1.hp,
                    position: player1.position,
                    energy: player1.energy,
                },
                enemy: CharacterState {
                    hp: player2.hp,
                    position: player2.position,
                    energy: player2.energy,
                },
            };
            let action: BattleAction = msg::send_for_reply_as(player1.id, turn, 0, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            if let Some(_energy) = player1.energy.checked_sub(20) {
                                player1.energy = _energy;
                                let move_ = MOVE[usize::from(player1.attributes.agility)];
                                player1.position =
                                    min(player1.position + move_, player2.position - 1);
                                if player1.position + 1 == player2.position {
                                    let success = rng.gen_ratio(75, 100);
                                    if success {
                                        let damage =
                                            QUICK_DAMAGE[usize::from(player1.attributes.strength)];
                                        player2.hp = player2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: player1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: player1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: player1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for quick attack. skipping the turn...", player1.id);
                            }
                        }
                        AttackKind::Normal => {
                            if let Some(_energy) = player1.energy.checked_sub(26) {
                                player1.energy = _energy;
                                let move_ = MOVE[usize::from(player1.attributes.agility)];
                                player1.position =
                                    min(player1.position + move_, player2.position - 1);
                                if player1.position + 1 == player2.position {
                                    let success = rng.gen_ratio(33, 100);
                                    if success {
                                        let damage =
                                            NORMAL_DAMAGE[usize::from(player1.attributes.strength)];
                                        player2.hp = player2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: player1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: player1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: player1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for normal attack. skipping the turn...", player1.id);
                            }
                        }
                        AttackKind::Hard => {
                            if let Some(_energy) = player1.energy.checked_sub(32) {
                                player1.energy = _energy;
                                let move_ = MOVE[usize::from(player1.attributes.agility)];
                                player1.position =
                                    min(player1.position + move_, player2.position - 1);
                                if player1.position + 1 == player2.position {
                                    let success = rng.gen_ratio(17, 100);
                                    if success {
                                        let damage =
                                            HARD_DAMAGE[usize::from(player1.attributes.strength)];
                                        player2.hp = player2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: player1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: player1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: player1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for hard attack. skipping the turn...", player1.id);
                            }
                        }
                    }
                    if player2.hp == 0 {
                        debug!("{:?} is a winner", player1.id);
                        return BattleLog {
                            c1: player1.id,
                            c2: player2.id,
                            winner: player1.id,
                            turns,
                        };
                    }
                }
                BattleAction::MoveLeft => {
                    if let Some(_energy) = player1.energy.checked_sub(3) {
                        player1.energy = _energy;
                        let move_ = MOVE[usize::from(player1.attributes.agility)];
                        player1.position = max(player1.position - move_, MIN_POS);
                        turns.push(TurnResult::Move {
                            position: player1.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                }
                BattleAction::MoveRight => {
                    if let Some(_energy) = player1.energy.checked_sub(3) {
                        player1.energy = _energy;
                        let move_ = MOVE[usize::from(player1.attributes.agility)];
                        player1.position = min(player1.position + move_, player2.position - 1);
                        turns.push(TurnResult::Move {
                            position: player1.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                }
                BattleAction::Rest => {
                    let full_energy = ENERGY[usize::from(player1.attributes.stamina)];
                    player1.energy = min(player1.energy + 10, full_energy);
                    turns.push(TurnResult::Rest {
                        energy: player1.energy,
                    });
                }
            }

            round = round + 1;
        }
    }
}
