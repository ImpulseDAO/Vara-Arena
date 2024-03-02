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

    // spell effects
    pub fire_wall: (u8, u8),
    pub earth_skin: (u8, u8),
    pub chilling_touch: u8,
    pub water_burst: u8,
    pub fire_haste: u8,
    pub earth_smites: (u8, u8),
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
            fire_wall: (0, 0),
            earth_skin: (0, 0),
            chilling_touch: 0,
            earth_smites: (0, 0),
            fire_haste: 0,
            water_burst: 0,
        }
    }
}
