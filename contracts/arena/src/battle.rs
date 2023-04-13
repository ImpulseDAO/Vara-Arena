use common::{AttackKind, BattleAction, CharacterAttributes, YourTurn};
use gstd::{debug, exec, msg, ActorId};
use rand::{rngs::SmallRng, Rng, SeedableRng};

const MIN_POS: f32 = 0.0;
const MAX_POS: f32 = 0.0;
const FIRST_POS: f32 = 4.0;
const SECOND_POS: f32 = 15.0;

const QUICK_DAMAGE: [u8; 10] = [0, 10, 10, 15, 20, 25, 30, 35, 40, 45];
const NORMAL_DAMAGE: [u8; 10] = [0, 15, 15, 20, 26, 33, 39, 46, 52, 59];
const HARD_DAMAGE: [u8; 10] = [0, 20, 20, 24, 32, 40, 48, 56, 64, 72];

const MOVE: [f32; 10] = [0.0, 1.0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5];

type CharacterId = ActorId;

#[derive(Clone)]
pub struct Character {
    pub id: CharacterId,
    pub hp: u8,
    pub energy: u8,
    pub position: f32,
    pub attributes: CharacterAttributes,
}

pub struct Battle {
    c1: Character,
    c2: Character,
}

impl Battle {
    pub fn new(mut c1: Character, mut c2: Character) -> Battle {
        c1.position = FIRST_POS;
        c2.position = SECOND_POS;
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
                            if let Some(_energy) = self.c1.energy.checked_sub(20) {
                                // self.c1.energy = energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    (self.c1.position + move_).min(self.c2.position - 1.0);
                                if self.c1.position + 1.0 == self.c2.position {
                                    let success = rng.gen_ratio(75, 100);
                                    if success {
                                        let damage =
                                            QUICK_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for quick attack. skipping the turn...", self.c1.id);
                            }
                        }
                        AttackKind::Normal => {
                            if let Some(_energy) = self.c1.energy.checked_sub(26) {
                                // self.c1.energy = energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    (self.c1.position + move_).min(self.c2.position - 1.0);
                                if self.c1.position + 1.0 == self.c2.position {
                                    let success = rng.gen_ratio(33, 100);
                                    if success {
                                        let damage =
                                            NORMAL_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for normal attack. skipping the turn...", self.c1.id);
                            }
                        }
                        AttackKind::Hard => {
                            if let Some(_energy) = self.c1.energy.checked_sub(32) {
                                // self.c1.energy = energy;
                                let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                                self.c1.position =
                                    (self.c1.position + move_).min(self.c2.position - 1.0);
                                if self.c1.position + 1.0 == self.c2.position {
                                    let success = rng.gen_ratio(17, 100);
                                    if success {
                                        let damage =
                                            HARD_DAMAGE[usize::from(self.c1.attributes.strength)];
                                        self.c2.hp = self.c2.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for hard attack. skipping the turn...", self.c1.id);
                            }
                        }
                    }
                    if self.c2.hp == 0 {
                        debug!("{:?} is a winner", self.c1.id);
                        return self.c1;
                    }
                }
                BattleAction::MoveLeft => {
                    if let Some(_energy) = self.c1.energy.checked_sub(3) {
                        // self.c1.energy = energy;
                        let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                        self.c1.position = (self.c1.position - move_).max(MIN_POS);
                    }
                }
                BattleAction::MoveRight => {
                    if let Some(_energy) = self.c1.energy.checked_sub(3) {
                        // self.c1.energy = energy;
                        let move_ = MOVE[usize::from(self.c1.attributes.agility)];
                        self.c1.position = (self.c1.position + move_).min(self.c2.position - 1.0);
                    }
                }
            }

            let action = msg::send_for_reply_as(self.c2.id, YourTurn, 0)
                .expect("unable to send message")
                .await
                .expect("unable to receive `BattleAction`");
            match action {
                BattleAction::Attack { kind } => {
                    match kind {
                        AttackKind::Quick => {
                            if let Some(_energy) = self.c2.energy.checked_sub(20) {
                                // self.c2.energy = energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    (self.c2.position - move_).max(self.c1.position + 1.0);
                                if self.c2.position - 1.0 == self.c1.position {
                                    let success = rng.gen_ratio(75, 100);
                                    if success {
                                        let damage =
                                            QUICK_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for quick attack. skipping the turn...", self.c2.id);
                            }
                        }
                        AttackKind::Normal => {
                            if let Some(_energy) = self.c2.energy.checked_sub(26) {
                                // self.c2.energy = energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    (self.c2.position - move_).max(self.c1.position + 1.0);
                                if self.c2.position - 1.0 == self.c1.position {
                                    let success = rng.gen_ratio(33, 100);
                                    if success {
                                        let damage =
                                            NORMAL_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for normal attack. skipping the turn...", self.c2.id);
                            }
                        }
                        AttackKind::Hard => {
                            if let Some(_energy) = self.c2.energy.checked_sub(32) {
                                // self.c2.energy = energy;
                                let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                                self.c2.position =
                                    (self.c2.position - move_).max(self.c1.position + 1.0);
                                if self.c2.position - 1.0 == self.c1.position {
                                    let success = rng.gen_ratio(17, 100);
                                    if success {
                                        let damage =
                                            HARD_DAMAGE[usize::from(self.c2.attributes.strength)];
                                        self.c1.hp = self.c1.hp.saturating_sub(damage);
                                    }
                                }
                            } else {
                                debug!("player {:?} has not enough energy for hard attack. skipping the turn...", self.c2.id);
                            }
                        }
                    }
                    if self.c1.hp == 0 {
                        debug!("{:?} is a winner", self.c2.id);
                        return self.c1;
                    }
                }
                BattleAction::MoveLeft => {
                    if let Some(_energy) = self.c2.energy.checked_sub(3) {
                        // self.c2.energy = energy;
                        let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                        self.c2.position = (self.c2.position - move_).max(self.c1.position + 1.0);
                    }
                }
                BattleAction::MoveRight => {
                    if let Some(_energy) = self.c2.energy.checked_sub(3) {
                        // self.c2.energy = energy;
                        let move_ = MOVE[usize::from(self.c2.attributes.agility)];
                        self.c2.position = (self.c2.position + move_).min(MAX_POS);
                    }
                }
            }
        }
    }
}
