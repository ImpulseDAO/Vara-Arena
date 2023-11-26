use crate::execute::execute_action;
use arena_io::{BattleAction, BattleLog, Character, CharacterState, YourTurn};
use gstd::{debug, exec, msg, prelude::*};
use rand::{rngs::SmallRng, Rng, SeedableRng};

const FIRST_POS: u8 = 4;
const SECOND_POS: u8 = 15;

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

        loop {
            let p1_cant_rest = self.c1.energy_reg_counter == 3;
            let p2_cant_rest = self.c2.energy_reg_counter == 3;

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

            let p1_initiative = p1_action.initiative() + self.c1.initiative_incr;
            let p2_initiative = p2_action.initiative() + self.c2.initiative_incr;

            self.c1.initiative_incr = 0;
            self.c2.initiative_incr = 0;

            if p1_initiative > p2_initiative {
                self.c1.parry = matches!(&p1_action, BattleAction::Parry);
                self.c2.parry = false;

                let result = execute_action(&p1_action, &mut self.c1, &mut self.c2, &mut rng);
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

                let result = execute_action(&p2_action, &mut self.c2, &mut self.c1, &mut rng);
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
                self.c1.parry = false;
                self.c2.parry = matches!(&p2_action, BattleAction::Parry);

                let result = execute_action(&p2_action, &mut self.c2, &mut self.c1, &mut rng);
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

                let result = execute_action(&p1_action, &mut self.c1, &mut self.c2, &mut rng);
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
}
