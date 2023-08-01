#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId, CodeId, Debug, TypeInfo};

const MAX_LEVEL: usize = 9;
const MAX_STRENGTH: usize = 9;
const MAX_AGILITY: usize = 9;
const MAX_VITALITY: usize = 9;
const MAX_STAMINA: usize = 9;

const XP_GAIN: [u32; MAX_LEVEL + 1] = [
    300, 600, 600, 1350, 3240, 8100, 18225, 48600, 131220, 328050,
];
const LEVEL_XP: [u32; MAX_LEVEL + 1] = [
    300, 600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200, 3936600,
];

#[derive(Encode, Decode, TypeInfo, Clone, Debug)]
pub struct InitialAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
}

#[derive(Encode, Decode, TypeInfo, Clone, Default, Debug)]
pub struct CharacterAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
    pub level: u8,
    pub experience: u32,
}

#[derive(Encode, Debug, Decode, TypeInfo, Clone)]
pub enum AttributeChoice {
    Strength,
    Agility,
    Vitality,
    Stamina,
}

impl CharacterAttributes {
    pub fn increase_xp(&mut self) {
        self.experience = self.experience.saturating_add(XP_GAIN[self.level as usize]);
        use gstd::debug;
        debug!("Adding Experience!!!{:#?}", self.experience);
    }

    pub fn level_up(&mut self, attr: AttributeChoice) {
        let xp_consume = LEVEL_XP[self.level as usize];

        assert!(self.experience >= xp_consume, "not enough experience");

        assert!(self.level != MAX_LEVEL as u8, "max level");
        self.level = self.level + 1;

        match attr {
            AttributeChoice::Strength => {
                assert!(self.strength != MAX_STRENGTH as u8, "max level");
                self.strength = self.strength + 1;
                use gstd::debug;
                debug!("Adding STR!!!");
            }
            AttributeChoice::Agility => {
                assert!(self.agility != MAX_AGILITY as u8, "max level");
                self.agility = self.agility + 1;
            }
            AttributeChoice::Vitality => {
                assert!(self.vitality != MAX_VITALITY as u8, "max level");
                self.vitality = self.vitality + 1;
            }
            AttributeChoice::Stamina => {
                assert!(self.stamina != MAX_STAMINA as u8, "max level");
                self.stamina = self.stamina + 1;
            }
        }

        self.experience = self.experience - xp_consume;
    }
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct CharacterInfo {
    pub id: ActorId,
    pub name: String,
    pub attributes: CharacterAttributes,
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub enum MintAction {
    CreateCharacter {
        code_id: CodeId,
        name: String,
        attributes: InitialAttributes,
    },
    CharacterInfo {
        owner_id: ActorId,
    },
    BattleResult {
        owner_id: ActorId,
    },
    SetArena {
        arena_id: ActorId,
    },
    LevelUp {
        attr: AttributeChoice,
    },
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct MintState {
    pub characters: BTreeMap<ActorId, CharacterInfo>,
}

pub struct MintMetadata;

impl Metadata for MintMetadata {
    type Init = InOut<(), ()>;
    type Handle = InOut<MintAction, ()>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = MintState;
}
