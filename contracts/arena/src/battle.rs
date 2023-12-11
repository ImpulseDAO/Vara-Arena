use crate::execute::execute_action;
use arena_io::{AttackKind, BattleAction, BattleLog, Character, CharacterState, Spell, YourTurn};
use gstd::{debug, exec, msg, prelude::*, ActorId};
use rand::{rngs::SmallRng, SeedableRng};

const FIRST_POS: u8 = 6;
const SECOND_POS: u8 = 10;

const INITIATIVE_MODIFIER: u16 = 125;

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
            if turns.len() > 25 {
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

            let p1_initiative = player_initiative(&self.c1, &self.c2, &p1_action);
            let p2_initiative = player_initiative(&self.c2, &self.c1, &p2_action);

            self.c1.disable_agiim = false;
            self.c2.disable_agiim = false;

            if p1_initiative > p2_initiative {
                self.c1.parry = matches!(&p1_action, BattleAction::Parry);
                self.c2.parry = false;

                let result = execute_action(&p1_action, &mut self.c1, &mut self.c2, &mut rng);
                turns.push(result);
                if let Some(winner) = self.check_winner() {
                    debug!("{:?} is a winner", winner);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner,
                        turns,
                    };
                }

                let result = execute_action(&p2_action, &mut self.c2, &mut self.c1, &mut rng);
                turns.push(result);
                if let Some(winner) = self.check_winner() {
                    debug!("{:?} is a winner", winner);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner,
                        turns,
                    };
                }
            } else {
                self.c1.parry = false;
                self.c2.parry = matches!(&p2_action, BattleAction::Parry);

                let result = execute_action(&p2_action, &mut self.c2, &mut self.c1, &mut rng);
                turns.push(result);
                if let Some(winner) = self.check_winner() {
                    debug!("{:?} is a winner", winner);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner,
                        turns,
                    };
                }

                let result = execute_action(&p1_action, &mut self.c1, &mut self.c2, &mut rng);
                turns.push(result);
                if let Some(winner) = self.check_winner() {
                    debug!("{:?} is a winner", winner);
                    return BattleLog {
                        c1: self.c1.id,
                        c2: self.c2.id,
                        winner,
                        turns,
                    };
                }
            }

            update_effects(&mut self.c1);
            update_effects(&mut self.c2);
        }
    }

    fn check_winner(&self) -> Option<ActorId> {
        if self.c1.hp == 0 {
            Some(self.c2.id)
        } else if self.c2.hp == 0 {
            Some(self.c1.id)
        } else {
            None
        }
    }
}

fn spell_initiative(spell: &Spell) -> u16 {
    match spell {
        Spell::FireWall | Spell::EarthSkin | Spell::WaterRestoration => 10,
        Spell::Fireball | Spell::EarthCatapult | Spell::WaterBurst => 16,
        Spell::FireHaste | Spell::EarthSmites | Spell::ChillingTouch => 20,
    }
}

fn action_initiative(action: &BattleAction) -> u16 {
    match action {
        BattleAction::Attack { kind } => match kind {
            AttackKind::Quick => 10,
            AttackKind::Precise => 15,
            AttackKind::Heavy => 20,
        },
        BattleAction::MoveLeft | BattleAction::MoveRight | BattleAction::Rest => 8,
        BattleAction::Parry => 12,
        BattleAction::Guardbreak => 18,
        BattleAction::CastSpell { spell } => spell_initiative(spell),
    }
}

fn player_initiative(player: &Character, enemy: &Character, action: &BattleAction) -> u16 {
    let base_initiative = action_initiative(action) * 100;
    let mut modifier = INITIATIVE_MODIFIER;

    if player.fire_haste > 0 {
        modifier += INITIATIVE_MODIFIER / 9 * u16::from(player.attributes.intelligence);
    }

    if player.chilling_touch > 0 {
        modifier -= INITIATIVE_MODIFIER / 9 * u16::from(enemy.attributes.intelligence);
    }

    if player.disable_agiim {
        base_initiative
    } else {
        base_initiative - (u16::from(player.attributes.agility) * modifier)
    }
}

fn update_effects(player: &mut Character) {
    if player.fire_wall != 0 {
        player.fire_wall -= 1;
    }

    if player.earth_skin.0 != 0 {
        player.earth_skin.0 -= 1;
    }

    if player.chilling_touch != 0 {
        player.chilling_touch -= 1;
    }

    if player.water_burst != 0 {
        player.water_burst -= 1;
    }

    if player.fire_haste != 0 {
        player.fire_haste -= 1;
    }

    if player.earth_smites != 0 {
        player.earth_smites -= 1;
    }
}
