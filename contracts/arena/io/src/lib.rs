#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata};
use gstd::{prelude::*, ActorId, ReservationId, TypeInfo};
use mint_io::{CharacterAttributes, CharacterInfo};

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

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct Character {
    pub owner: ActorId,
    pub id: ActorId,
    pub name: String,
    pub hp: u8,
    pub energy: u8,
    pub position: u8,
    pub attributes: CharacterAttributes,
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct BattleState {
    pub c1: Character,
    pub c2: Character,
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct ArenaState {
    pub characters: Vec<Character>,
    pub mint: ActorId,
    pub battles: Vec<BattleState>,
    pub winners: Vec<ActorId>,
    pub reservations: Vec<ReservationId>,
    pub leaderboard: BTreeMap<ActorId, u32>,
}

pub struct ArenaMetadata;

impl Metadata for ArenaMetadata {
    type Init = InOut<ActorId, ()>;
    type Handle = InOut<GameAction, GameEvent>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = ArenaState;
}
