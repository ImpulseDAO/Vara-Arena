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

#[derive(Encode, Decode, Clone, Debug)]
pub struct InitCharacter {
    pub code_id: CodeId,
    pub attributes: InitialAttributes,
}
