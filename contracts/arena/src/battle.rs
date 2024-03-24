use crate::character::Character;
use crate::effect::EffectKind;
use crate::execute::execute_action;
use crate::utils::full_hp;
use arena_io::{
    AttackKind, BattleAction, BattleLog, CharacterState, Spell, TurnEvent, TurnLog, YourTurn,
};
use core::cmp::min;
use gstd::{debug, msg, prelude::*};

const FIRST_POS: u8 = 6;
const SECOND_POS: u8 = 10;

const INITIATIVE_MODIFIER: u16 = 125;
const GAS_FOR_STEP: u64 = 40_000_000_000;

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

        loop {
            if turns.len() > 25 {
                debug!("New GAMEPLAY!");
                debug!("p1 = {} hp x p2 = {} hp!", self.c1.hp, self.c2.hp);
                return BattleLog {
                    character1: (self.c1.id, self.c1.hp > self.c2.hp),
                    character2: (self.c2.id, self.c2.hp > self.c1.hp),
                    turns,
                };
            };

            turns.push(vec![]);
            let index = turns.len() - 1;
            let turn_logs = &mut turns[index];

            self.regenerate_characters();

            let p1_state = CharacterState {
                hp: self.c1.hp,
                position: self.c1.position,
                energy: self.c1.energy,
                rest_count: self.c1.rest_count,
                disable_agiim: self.c1.disable_agiim,
                attributes: self.c1.attributes.clone(),
            };
            let p2_state = CharacterState {
                hp: self.c2.hp,
                position: self.c2.position,
                energy: self.c2.energy,
                rest_count: self.c2.rest_count,
                disable_agiim: self.c2.disable_agiim,
                attributes: self.c2.attributes.clone(),
            };

            let p1_turn = YourTurn {
                you: p1_state.clone(),
                enemy: p2_state.clone(),
            };
            debug!("sending msg 1");
            let p1_action: BattleAction = match msg::send_with_gas_for_reply_as(
                self.c1.algorithm_id,
                p1_turn,
                GAS_FOR_STEP,
                0,
                0,
            )
            .expect("unable to send message")
            .await
            {
                Ok(action) => {
                    debug!("{:?}", action);
                    action
                }
                Err(_) => {
                    turn_logs.push(TurnLog {
                        character: self.c1.id,
                        action: TurnEvent::ReplyError,
                    });
                    return BattleLog {
                        character1: (self.c1.id, false),
                        character2: (self.c2.id, true),
                        turns,
                    };
                }
            };
            debug!("sending msg 2");

            let p2_turn = YourTurn {
                you: p2_state,
                enemy: p1_state,
            };
            let p2_action: BattleAction = match msg::send_with_gas_for_reply_as(
                self.c2.algorithm_id,
                p2_turn,
                GAS_FOR_STEP,
                0,
                0,
            )
            .expect("unable to send message")
            .await
            {
                Ok(action) => action,
                Err(_) => {
                    turn_logs.push(TurnLog {
                        character: self.c2.id,
                        action: TurnEvent::ReplyError,
                    });
                    return BattleLog {
                        character1: (self.c1.id, true),
                        character2: (self.c2.id, false),
                        turns,
                    };
                }
            };

            let p1_initiative = player_initiative(&self.c1, &p1_action);
            let p2_initiative = player_initiative(&self.c2, &p2_action);

            self.c1.disable_agiim = false;
            self.c2.disable_agiim = false;

            if p1_initiative > p2_initiative {
                debug!(
                    "p1 initiative = {} x p2 initiative = {} !",
                    p1_initiative, p2_initiative
                );

                debug!("p1 name = {} x p2 name = {} !", self.c1.name, self.c2.name);

                self.c1.parry = matches!(&p1_action, BattleAction::Parry);
                self.c2.parry = false;

                execute_action(&p1_action, &mut self.c1, &mut self.c2, turn_logs);
                if let Some((character1, character2)) = self.check_winner() {
                    return BattleLog {
                        character1,
                        character2,
                        turns,
                    };
                }

                execute_action(&p2_action, &mut self.c2, &mut self.c1, turn_logs);
                if let Some((character1, character2)) = self.check_winner() {
                    return BattleLog {
                        character1,
                        character2,
                        turns,
                    };
                }
            } else {
                self.c1.parry = false;
                self.c2.parry = matches!(&p2_action, BattleAction::Parry);

                execute_action(&p2_action, &mut self.c2, &mut self.c1, turn_logs);
                if let Some((character1, character2)) = self.check_winner() {
                    return BattleLog {
                        character1,
                        character2,
                        turns,
                    };
                }

                execute_action(&p1_action, &mut self.c1, &mut self.c2, turn_logs);
                if let Some((character1, character2)) = self.check_winner() {
                    return BattleLog {
                        character1,
                        character2,
                        turns,
                    };
                }
            }

            self.c1.round_tick();
            self.c2.round_tick();
        }
    }

    fn check_winner(&self) -> Option<((u128, bool), (u128, bool))> {
        if self.c1.hp == 0 {
            Some(((self.c1.id, false), (self.c2.id, true)))
        } else if self.c2.hp == 0 {
            Some(((self.c1.id, true), (self.c2.id, false)))
        } else {
            None
        }
    }

    fn regenerate_characters(&mut self) {
        let hp = full_hp(self.c1.level);
        let stack = self.c1.get_effect(EffectKind::Regeneration);
        self.c1.hp = min(hp, self.c1.hp + stack);

        let hp = full_hp(self.c2.level);
        let stack = self.c2.get_effect(EffectKind::Regeneration);
        self.c2.hp = min(hp, self.c2.hp + stack);
    }
}

fn spell_initiative(spell: &Spell) -> u16 {
    match spell {
        Spell::FireWall | Spell::EarthSkin | Spell::WaterRestoration => 20,
        Spell::Fireball | Spell::WaterBurst => 15,
        Spell::EarthSmites => 10,
    }
}

fn action_initiative(action: &BattleAction) -> u16 {
    match action {
        BattleAction::Attack { kind } => match kind {
            AttackKind::Quick => 20,
            AttackKind::Precise => 15,
            AttackKind::Heavy => 10,
        },
        BattleAction::MoveLeft | BattleAction::MoveRight | BattleAction::Rest => 22,
        BattleAction::Parry => 18,
        BattleAction::Guardbreak => 12,
        BattleAction::CastSpell { spell } => spell_initiative(spell),
    }
}

fn player_initiative(player: &Character, action: &BattleAction) -> u16 {
    let base_initiative = action_initiative(action) * 100;
    let modifier = INITIATIVE_MODIFIER;

    if player.disable_agiim {
        base_initiative
    } else {
        base_initiative + (u16::from(player.attributes.agility) * modifier)
    }
}
