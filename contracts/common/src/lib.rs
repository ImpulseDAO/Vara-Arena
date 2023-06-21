#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId, CodeId, TypeInfo};

#[derive(Encode, Decode, TypeInfo)]
pub enum GameAction {
    Register { owner_id: ActorId },
    Play,
    ReserveGas,
    CleanState,
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
    RegisteredPlayers(Vec<CharacterInfo>),
    PlayerWon(ActorId),
    BattleStarted(ActorId, ActorId),
    BattleEvent(ActorId, TurnResult),
    BattleFinished(ActorId),
    GasReserved,
    NextBattleFromReservation,
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

#[derive(Encode, Decode, TypeInfo, Clone, Default)]
pub struct CharacterAttributes {
    pub strength: u8,
    pub agility: u8,
    pub vitality: u8,
    pub stamina: u8,
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

pub struct ArenaMetadata;

impl Metadata for ArenaMetadata {
    type Init = InOut<ActorId, ()>;
    type Handle = InOut<GameAction, GameEvent>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = ();
}
