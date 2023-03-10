#![no_std]

use codec::{Decode, Encode};
use gstd::{ActorId, CodeId};

pub type CharacterId = ActorId;

#[derive(Encode, Decode)]
pub enum GameAction {
    Register { character: CharacterId },
    Play,
    MoveLeft,
    MoveRight,
    Attack,
}

#[derive(Encode, Decode)]
pub struct YourTurn;

#[derive(Encode, Decode, Clone, Debug)]
pub struct InitialAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
}

#[derive(Encode, Decode, Default)]
pub struct CharacterAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
}

#[derive(Encode, Decode)]
pub struct CharacterInfo {
    pub owner: ActorId,
    pub attributes: CharacterAttributes,
}

#[derive(Encode, Decode, Clone)]
pub enum MintAction {
    CreateCharacter {
        code_id: CodeId,
        attributes: InitialAttributes,
    },
    CharacterInfo {
        character_id: ActorId,
    },
}
