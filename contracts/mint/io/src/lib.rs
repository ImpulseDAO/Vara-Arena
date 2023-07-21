#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId, CodeId, TypeInfo};

#[derive(Encode, Decode, TypeInfo, Clone, Debug)]
pub struct InitialAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
}

#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct CharacterAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
    pub level: u8,
    pub experience: u8,
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
    SetArena {
        arena_id: ActorId,
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
