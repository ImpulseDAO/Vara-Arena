use crate::effects::{EffectKind, Effects, Stack};
use crate::utils;
use gstd::{prelude::*, ActorId};
use mint_io::{CharacterAttributes, CharacterInfo};

#[derive(Clone, Debug)]
pub struct Character {
    pub owner: ActorId,
    pub id: u128,
    pub algorithm_id: ActorId,
    pub name: String,
    pub hp: u8,
    pub energy: u8,
    pub position: u8,
    pub attributes: CharacterAttributes,
    pub level: u8,

    // battle specific fields
    pub parry: bool,
    pub rest_count: u8,
    pub disable_agiim: bool,

    effects: Effects,
}

impl Character {
    pub fn new(character_info: CharacterInfo, owner_id: ActorId) -> Character {
        Character {
            owner: owner_id,
            id: character_info.id,
            algorithm_id: character_info.algorithm_id,
            name: character_info.name,
            hp: utils::full_hp(character_info.level),
            energy: utils::full_energy(character_info.attributes.stamina),
            position: 0,
            attributes: character_info.attributes,
            level: character_info.level,
            parry: false,
            rest_count: 0,
            disable_agiim: false,
            effects: Effects::new(),
        }
    }

    pub fn get_effect(&self, kind: EffectKind) -> Stack {
        self.effects.get_effect(kind)
    }

    pub fn add_effect(&mut self, kind: EffectKind, stack: Stack, duration: Option<u8>) {
        self.effects.add_effect(kind, stack, duration);
    }

    pub fn round_tick(&mut self) {
        self.effects.update_effects();
    }
}
