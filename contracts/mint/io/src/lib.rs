#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata, Out};
use gstd::collections::BTreeMap;
use gstd::{debug, prelude::*, ActorId, CodeId, Debug, TypeInfo};

const MAX_LEVEL: usize = 10;
const MAX_STRENGTH: usize = 9;
const MAX_AGILITY: usize = 9;
const MAX_VITALITY: usize = 9;
const MAX_STAMINA: usize = 9;
const MAX_INTELLIGENCE: usize = 9;

const XP_GAIN: [u32; MAX_LEVEL + 1] = [
    0, 300, 600, 600, 1350, 3240, 8100, 18225, 48600, 131220, 328050,
];
const LEVEL_XP: [u32; MAX_LEVEL + 1] = [
    0, 300, 600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200, 3936600,
];

#[derive(Encode, Decode, TypeInfo, Clone, Debug)]
pub struct InitialAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
    pub intelligence: u8,
}

#[derive(Encode, Decode, TypeInfo, Clone, Default, Debug)]
pub struct CharacterAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
    pub intelligence: u8,
    pub lives_count: u8,
    pub tier_rating: u128,
    pub balance: u128,
}

#[derive(Encode, Decode, TypeInfo, Clone, Default, Debug)]
pub struct Config {
    pub lives_count: u8,
    pub gas_for_daily_distribution: u64,
    pub minimum_gas_amount: u64,
    pub update_interval_in_blocks: u32,
    pub reservation_amount: u64,
    pub reservation_duration: u32,
    pub mint_cost: Option<u128>,
    pub gold_pool_amount: u128,
}

#[derive(Encode, Decode, TypeInfo, Default, Debug, PartialEq, Eq)]
pub enum DailyGoldDistrStatus {
    Active,
    OutOfGas,
    #[default]
    Stopped,
}

#[derive(Encode, Debug, Decode, TypeInfo, Clone)]
pub enum AttributeChoice {
    Strength,
    Agility,
    Vitality,
    Stamina,
    Intelligence,
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct CharacterInfo {
    pub id: ActorId,
    pub name: String,
    pub attributes: CharacterAttributes,
    pub level: u8,
    pub experience: u32,
}

impl CharacterInfo {
    pub fn increase_xp(&mut self) {
        self.experience = self.experience.saturating_add(XP_GAIN[self.level as usize]);
        debug!("Adding Experience!!!{:#?}", self.experience);
    }

    pub fn level_up(&mut self, attr: &AttributeChoice) {
        let xp_consume = LEVEL_XP[self.level as usize];

        assert!(self.experience >= xp_consume, "not enough experience");

        assert!(self.level != MAX_LEVEL as u8, "max level");
        self.level = self.level + 1;

        match attr {
            AttributeChoice::Strength => {
                assert!(self.attributes.strength != MAX_STRENGTH as u8, "max level");
                self.attributes.strength = self.attributes.strength + 1;
                debug!("Adding STR!!!");
            }
            AttributeChoice::Agility => {
                assert!(self.attributes.agility != MAX_AGILITY as u8, "max level");
                self.attributes.agility = self.attributes.agility + 1;
            }
            AttributeChoice::Vitality => {
                assert!(self.attributes.vitality != MAX_VITALITY as u8, "max level");
                self.attributes.vitality = self.attributes.vitality + 1;
            }
            AttributeChoice::Stamina => {
                assert!(self.attributes.stamina != MAX_STAMINA as u8, "max level");
                self.attributes.stamina = self.attributes.stamina + 1;
            }
            AttributeChoice::Intelligence => {
                assert!(
                    self.attributes.intelligence != MAX_INTELLIGENCE as u8,
                    "max level"
                );
                self.attributes.intelligence = self.attributes.intelligence + 1;
            }
        }

        self.experience = self.experience - xp_consume;
    }
}

impl CharacterAttributes {
    pub fn increase_rating(&mut self, earned_rating: u128) {
        self.tier_rating = self.tier_rating.saturating_add(earned_rating);
    }
}

#[derive(Encode, Decode, TypeInfo)]
pub enum MintAction {
    AddAdmin {
        admin: ActorId,
    },
    RemoveAdmin {
        admin: ActorId,
    },
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
        losers: Vec<ActorId>,
    },
    SetArena {
        arena_id: ActorId,
    },
    LevelUp {
        attr: AttributeChoice,
    },
    MakeReservation,
    StartDailyGoldDistribution,
    DistributeDailyPool,
    StopDailyGoldDistribution,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum MintEvent {
    CharacterCreated {
        character_info: CharacterInfo,
    },
    CharacterDied {
        character_id: ActorId,
    },
    XpIncreased {
        character_id: ActorId,
        xp: u32,
    },
    LevelUpdated {
        character_id: ActorId,
        attr: AttributeChoice,
    },
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct MintState {
    pub characters: BTreeMap<ActorId, CharacterInfo>,
}

pub struct MintMetadata;

impl Metadata for MintMetadata {
    type Init = InOut<Config, ()>;
    type Handle = InOut<MintAction, MintEvent>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = Out<MintState>;
}
