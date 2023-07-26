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

        let mut move1: u8 = 0; // number of moves: player 1
        let mut move2: u8 = 0; // number of moves: player 2

        loop {
            let c1_movable = {
                if move1 < self.c1.attributes.stamina {
                    true
                } else {
                    false
                }
            };
            let c2_movable = {
                if move2 < self.c2.attributes.stamina {
                    true
                } else {
                    false
                }
            };
            if !c1_movable || !c2_movable {
                let winner = {
                    if c1_movable {
                        self.c1.id
                    } else if c2_movable {
                        self.c2.id
                    } else {
                        if self.c1.hp > self.c2.hp {
                            self.c1.id
                        } else {
                            self.c2.id
                        }
                    }
                };
                debug!("{:?} is the winner", winner);
                return BattleLog {
                    c1: self.c1.id,
                    c2: self.c2.id,
                    winner,
                    turns,
                };
            }
            let turn = YourTurn {
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
            let action: BattleAction = msg::send_for_reply_as(self.c1.id, turn, 0, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            if let Some(_energy) = self.c1.energy.checked_sub(20) {
                                self.c1.energy = _energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    min(self.c1.position + move_, self.c2.position - 1);
                                if self.c1.position + 1 == self.c2.position {
                                    let success = rng.gen_ratio(75, 100);
                                    if success {
                                        let damage =
                                            QUICK_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for quick attack. skipping the turn...", self.c1.id);
                            }
                        }
                        AttackKind::Normal => {
                            if let Some(_energy) = self.c1.energy.checked_sub(26) {
                                self.c1.energy = _energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    min(self.c1.position + move_, self.c2.position - 1);
                                if self.c1.position + 1 == self.c2.position {
                                    let success = rng.gen_ratio(33, 100);
                                    if success {
                                        let damage =
                                            NORMAL_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for normal attack. skipping the turn...", self.c1.id);
                            }
                        }
                        AttackKind::Hard => {
                            if let Some(_energy) = self.c1.energy.checked_sub(32) {
                                self.c1.energy = _energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    min(self.c1.position + move_, self.c2.position - 1);
                                if self.c1.position + 1 == self.c2.position {
                                    let success = rng.gen_ratio(17, 100);
                                    if success {
                                        let damage =
                                            HARD_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c1.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c1.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c1.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for hard attack. skipping the turn...", self.c1.id);
                            }
                        }
                    }
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
                BattleAction::MoveLeft => {
                    if let Some(_energy) = self.c1.energy.checked_sub(3) {
                        self.c1.energy = _energy;
                        let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                        self.c1.position = max(self.c1.position - move_, MIN_POS);
                        turns.push(TurnResult::Move {
                            position: self.c1.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                    move1 = move1 + 1;
                }
                BattleAction::MoveRight => {
                    if let Some(_energy) = self.c1.energy.checked_sub(3) {
                        self.c1.energy = _energy;
                        let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                        self.c1.position = min(self.c1.position + move_, self.c2.position - 1);
                        turns.push(TurnResult::Move {
                            position: self.c1.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                    move1 = move1 + 1;
                }
                BattleAction::Rest => {
                    let full_energy = ENERGY[usize::from(self.c1.attributes.stamina)];
                    self.c1.energy = min(self.c1.energy + 10, full_energy);
                    turns.push(TurnResult::Rest {
                        energy: self.c1.energy,
                    });
                }
            }

            let turn = YourTurn {
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
            let action = msg::send_for_reply_as(self.c2.id, turn, 0, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            if let Some(_energy) = self.c2.energy.checked_sub(20) {
                                self.c2.energy = _energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    max(self.c2.position - move_, self.c1.position + 1);
                                if self.c2.position - 1 == self.c1.position {
                                    let success = rng.gen_ratio(75, 100);
                                    if success {
                                        let damage =
                                            QUICK_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c2.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c2.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c2.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for quick attack. skipping the turn...", self.c2.id);
                            }
                        }
                        AttackKind::Normal => {
                            if let Some(_energy) = self.c2.energy.checked_sub(26) {
                                self.c2.energy = _energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    max(self.c2.position - move_, self.c1.position + 1);
                                if self.c2.position - 1 == self.c1.position {
                                    let success = rng.gen_ratio(33, 100);
                                    if success {
                                        let damage =
                                            NORMAL_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c2.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c2.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c2.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for normal attack. skipping the turn...", self.c2.id);
                            }
                        }
                        AttackKind::Hard => {
                            if let Some(_energy) = self.c2.energy.checked_sub(32) {
                                self.c2.energy = _energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    max(self.c2.position - move_, self.c1.position + 1);
                                if self.c2.position - 1 == self.c1.position {
                                    let success = rng.gen_ratio(17, 100);
                                    if success {
                                        let damage =
                                            HARD_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                        turns.push(TurnResult::Attack {
                                            position: self.c2.position,
                                            damage,
                                        });
                                    } else {
                                        turns.push(TurnResult::Miss {
                                            position: self.c2.position,
                                        });
                                    }
                                } else {
                                    turns.push(TurnResult::Miss {
                                        position: self.c2.position,
                                    });
                                }
                            } else {
                                turns.push(TurnResult::NotEnoughEnergy);
                                debug!("player {:?} has not enough energy for hard attack. skipping the turn...", self.c2.id);
                            }
                        }
                    }
                    if self.c1.hp == 0 {
                        debug!("{:?} is a winner", self.c2.id);
                        return BattleLog {
                            c1: self.c1.id,
                            c2: self.c2.id,
                            winner: self.c2.id,
                            turns,
                        };
                    }
                }
                BattleAction::MoveLeft => {
                    if let Some(_energy) = self.c2.energy.checked_sub(3) {
                        self.c2.energy = _energy;
                        let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                        self.c2.position = max(self.c2.position - move_, self.c1.position + 1);
                        turns.push(TurnResult::Move {
                            position: self.c2.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                    move2 = move2 + 1;
                }
                BattleAction::MoveRight => {
                    if let Some(_energy) = self.c2.energy.checked_sub(3) {
                        self.c2.energy = _energy;
                        let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                        self.c2.position = min(self.c2.position + move_, MAX_POS);
                        turns.push(TurnResult::Move {
                            position: self.c2.position,
                        });
                    } else {
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
                    move2 = move2 + 1;
                }
                BattleAction::Rest => {
                    let full_energy = ENERGY[usize::from(self.c2.attributes.stamina)];
                    self.c2.energy = min(self.c2.energy + 10, full_energy);

                    turns.push(TurnResult::Rest {
                        energy: self.c2.energy,
                    });
                }
            }
        }
    }
}
