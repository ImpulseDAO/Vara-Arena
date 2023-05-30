#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{ActorId, CodeId, TypeInfo};

pub type CharacterId = ActorId;

#[derive(Encode, Decode, TypeInfo)]
pub enum GameAction {
    Register { character: CharacterId },
    Play,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum TurnResult {
    NotEnoughEnergy,
    Miss { position: u8 },
    Attack { position: u8, damage: u8 },
    Move { position: u8 },
    Rest { energy: u8 },
}

#[derive(Encode, Decode, TypeInfo)]
pub enum GameEvent {
    PlayerRegistered(ActorId),
    PlayerWon(ActorId),
    BattleStarted(ActorId, ActorId),
    BattleEvent(ActorId, TurnResult),
    BattleFinished(ActorId),
}

#[derive(Encode, Decode, Debug)]
pub enum AttackKind {
    Quick,
    Normal,
    Hard,
}

#[derive(Encode, Decode, Debug)]
pub enum BattleAction {
    Attack { kind: AttackKind },
    MoveRight,
    MoveLeft,
    Rest,
}

#[derive(Encode, Decode)]
pub struct CharacterState {
    pub hp: u8,
    pub position: u8,
    pub energy: u8,
}

#[derive(Encode, Decode)]
pub struct YourTurn {
    pub you: CharacterState,
    pub enemy: CharacterState,
}

#[derive(Encode, Decode, TypeInfo, Clone, Debug)]
pub struct InitialAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
}

#[derive(Encode, Decode, Clone, Default)]
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

#[derive(Encode, Decode, TypeInfo, Clone)]
pub enum MintAction {
    CreateCharacter {
        code_id: CodeId,
        attributes: InitialAttributes,
    },
    CharacterInfo {
        character_id: ActorId,
    },
}

pub struct MintMetadata;

impl Metadata for MintMetadata {
    type Init = InOut<(), ()>;
    type Handle = InOut<MintAction, ()>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = ();
}

pub struct ArenaMetadata;

impl Metadata for ArenaMetadata {
    type Init = InOut<ActorId, ()>;
    type Handle = InOut<GameAction, GameEvent>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = ();
}
