use common::{AttackKind, BattleAction, CharacterAttributes, YourTurn};
use gstd::{debug, exec, msg, ActorId};
use rand::{rngs::SmallRng, Rng, SeedableRng};

const QUICK_DAMAGE: [u8; 10] = [0, 10, 10, 15, 20, 25, 30, 35, 40, 45];
const NORMAL_DAMAGE: [u8; 10] = [0, 15, 15, 20, 26, 33, 39, 46, 52, 59];
const HARD_DAMAGE: [u8; 10] = [0, 20, 20, 24, 32, 40, 48, 56, 64, 72];

type CharacterId = ActorId;

#[derive(Clone)]
pub struct Character {
    pub id: CharacterId,
    pub hp: u8,
    pub position: u8,
    pub attributes: CharacterAttributes,
}

pub struct Battle {
    c1: Character,
    c2: Character,
}

impl Battle {
    pub fn new(c1: Character, c2: Character) -> Battle {
        Battle { c1, c2 }
    }

    pub async fn fight(mut self) -> Character {
        let block_timestamp = exec::block_timestamp();
        let mut rng = SmallRng::seed_from_u64(block_timestamp);

        loop {
            let action: BattleAction = msg::send_for_reply_as(self.c1.id, YourTurn, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            let success = rng.gen_ratio(75, 100);
                            if success {
                                let damage = QUICK_DAMAGE[self.c1.attributes.strength as usize];
                                self.c2.hp = self.c2.hp.saturating_sub(damage);
                            }
                        }
                        AttackKind::Normal => {
                            let success = rng.gen_ratio(33, 100);
                            if success {
                                let damage = NORMAL_DAMAGE[self.c1.attributes.strength as usize];
                                self.c2.hp = self.c2.hp.saturating_sub(damage);
                            }
                        }
                        AttackKind::Hard => {
                            let success = rng.gen_ratio(17, 100);
                            if success {
                                let damage = HARD_DAMAGE[self.c1.attributes.strength as usize];
                                self.c2.hp = self.c2.hp.saturating_sub(damage);
                            }
                        }
                    }
                    if self.c2.hp == 0 {
                        debug!("{:?} is a winner", self.c1.id);
                        return self.c1;
                    }
                }
                BattleAction::MoveLeft => todo!(),
                BattleAction::MoveRight => todo!(),
            }

            let action = msg::send_for_reply_as(self.c2.id, YourTurn, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            let success = rng.gen_ratio(75, 100);
                            if success {
                                let damage = QUICK_DAMAGE[self.c2.attributes.strength as usize];
                                self.c1.hp = self.c1.hp.saturating_sub(damage);
                            }
                        }
                        AttackKind::Normal => {
                            let success = rng.gen_ratio(33, 100);
                            if success {
                                let damage = NORMAL_DAMAGE[self.c2.attributes.strength as usize];
                                self.c1.hp = self.c1.hp.saturating_sub(damage);
                            }
                        }
                        AttackKind::Hard => {
                            let success = rng.gen_ratio(17, 100);
                            if success {
                                let damage = HARD_DAMAGE[self.c2.attributes.strength as usize];
                                self.c1.hp = self.c1.hp.saturating_sub(damage);
                            }
                        }
                    }
                    if self.c1.hp == 0 {
                        debug!("{:?} is a winner", self.c2.id);
                        return self.c1;
                    }
                }
                BattleAction::MoveLeft => todo!(),
                BattleAction::MoveRight => todo!(),
            }
        }
    }
}
