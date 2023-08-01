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

        let mut player1_energy_reg_counter = 0;
        let mut player2_energy_reg_counter = 0;
        let player1_stamina = self.c1.attributes.stamina;
        let player2_stamina = self.c2.attributes.stamina;

        loop {
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

            let p1_cant_rest = {
                if player1_energy_reg_counter == 3 {
                    true
                } else {
                    false
                }
            };

            let p2_cant_rest = {
                if player2_energy_reg_counter == 3 {
                    true
                } else {
                    false
                }
            };

            if p1_cant_rest && p2_cant_rest || turns.len() > 25 {
                debug!("New GAMEPLAY!");
                debug!("p1 = {} hp x p2 = {} hp!", self.c1.hp, self.c2.hp);
                let winner = {
                    if self.c1.hp > self.c2.hp {
                        self.c1.id
                    } else {
                        self.c2.id
                    }
                };
                return BattleLog {
                    c1: self.c1.id,
                    c2: self.c2.id,
                    winner: winner,
                    turns,
                };
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
                }
                BattleAction::Rest => {
                    if player1_energy_reg_counter < 3 {
                        let full_energy = ENERGY[usize::from(self.c1.attributes.stamina)];
                        let reg_tick = Battle::energy_regeneration(player1_stamina) - 5;

                        self.c1.energy = min(self.c1.energy + reg_tick, full_energy);
                        player1_energy_reg_counter += 1;
                        turns.push(TurnResult::Rest { energy: (reg_tick) });
                        debug!("p1 reg counter = {:?}", player1_energy_reg_counter);
                    }
                    // TODO: we could reset on here;
                    else {
                        debug!("p1 energy now = {:?}", self.c1.energy);
                        turns.push(TurnResult::NotEnoughEnergy);
                    }
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
                }
                BattleAction::Rest => {
                    if player2_energy_reg_counter < 3 {
                        let full_energy = ENERGY[usize::from(self.c2.attributes.stamina)];
                        let reg_tick = Battle::energy_regeneration(player2_stamina) - 5;

                        self.c2.energy = min(self.c2.energy + reg_tick, full_energy);
                        player2_energy_reg_counter += 1;
                        turns.push(TurnResult::Rest { energy: (reg_tick) });
                        debug!("p2 reg counter = {:?}", player2_energy_reg_counter);
                    } else {
                        debug!("p2 energy now = {:?}", self.c2.energy);
                        turns.push(TurnResult::NotEnoughEnergy);
                    };
                }
            }
        }
    }
}
