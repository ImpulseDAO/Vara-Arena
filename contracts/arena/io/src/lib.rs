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
    CastSpell,
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
pub enum Spell {
    FireWall,
    EarthSkin,
    WaterRestoration,
    Fireball,
    EarthCatapult,
    WaterBurst,
    FireHaste,
    EarthSmites,
    ChillingTouch,
}

#[derive(Encode, Decode, Debug)]
pub enum BattleAction {
    Attack { kind: AttackKind },
    MoveRight,
    MoveLeft,
    Rest,
    Parry,
    Guardbreak,
    CastSpell { spell: Spell },
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

    // battle specific fields
    // store them here to avoid using extra structs
    #[codec(skip)]
    pub parry: bool,
    #[codec(skip)]
    pub energy_reg_counter: u8,
    #[codec(skip)]
    pub disable_agiim: bool,
    // spell effects
    #[codec(skip)]
    pub earth_skin: (u8, u8),
    #[codec(skip)]
    pub chilling_touch: u8,
    #[codec(skip)]
    pub water_burst: u8,
    #[codec(skip)]
    pub fire_haste: u8,
    #[codec(skip)]
    pub earth_smites: u8,
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
