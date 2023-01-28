#![no_std]

use codec::{Decode, Encode};
use gstd::ActorId;

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
