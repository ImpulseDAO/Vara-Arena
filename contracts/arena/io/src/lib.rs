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
pub struct TurnResult {
    pub character: ActorId,
    pub action: TurnAction,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum TurnAction {
    NotEnoughEnergy,
    Miss { position: u8 },
    Attack { position: u8, damage: u8 },
    Move { position: u8 },
    Rest { energy: u8 },
    Parry,
    Guardbreak,
}

#[derive(Encode, Decode, TypeInfo)]
pub struct BattleLog {
    pub c1: ActorId,
    pub c2: ActorId,
    pub winner: ActorId,
    pub turns: Vec<TurnResult>,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum GameEvent {
    RegisteredPlayers(Vec<CharacterInfo>),
    ArenaLog {
        winner: ActorId,
        logs: Vec<BattleLog>,
    },
    GasReserved,
}

#[derive(Encode, Decode, Debug, Default, Eq, PartialEq, Clone, TypeInfo)]
pub enum SetTier {
    #[default]
    Tier0,
    Tier5,
    Tier4,
    Tier3,
    Tier2,
    Tier1,
}

#[derive(Encode, Decode, Debug)]
pub enum AttackKind {
    Quick,
    Precise,
    Heavy,
}

#[derive(Encode, Decode, Debug)]
pub enum BattleAction {
    Attack { kind: AttackKind },
    MoveRight,
    MoveLeft,
    Rest,
    Parry,
    Guardbreak,
}

impl BattleAction {
    pub fn initiative(&self) -> u8 {
        match self {
            BattleAction::Attack { kind } => match kind {
                AttackKind::Quick => 1,
                AttackKind::Precise => 2,
                AttackKind::Heavy => 3,
            },
            BattleAction::MoveLeft | BattleAction::MoveRight => 2,
            BattleAction::Parry => 1,
            BattleAction::Guardbreak => 2,
            _ => todo!(),
        }
    }
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
    pub current_tier: SetTier,
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
