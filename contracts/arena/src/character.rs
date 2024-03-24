use crate::effect::{Effect, EffectKind, Effects, Stack};
use crate::item::{Item, ItemTrigger};
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
    items: Vec<Item>,
}

impl Character {
    pub fn new(character_info: CharacterInfo, owner_id: ActorId, items: Vec<Item>) -> Character {
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
            items,
        }
    }

    pub fn get_effect(&self, kind: EffectKind) -> Stack {
        self.effects.get_effect(kind)
    }

    pub fn add_effect(&mut self, kind: EffectKind, stack: Stack, duration: Option<u8>) {
        let effect = Effect {
            kind,
            stack,
            duration,
        };
        self.effects.add_effect(effect);
    }

    pub fn round_tick(&mut self) {
        self.effects.update_effects();
    }

    pub fn trigger_items(&mut self, trigger: ItemTrigger) {
        for item in &self.items {
            if item.trigger == trigger {
                for effect in &item.effects {
                    self.effects.add_effect(effect.clone());
                }
            }
        }
    }
}
