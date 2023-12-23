#![no_std]

use codec::{Decode, Encode};
use gmeta::{InOut, Metadata, Out};
use gstd::collections::BTreeMap;
use gstd::{prelude::*, ActorId, TypeInfo};
use mint_io::CharacterAttributes;

#[derive(Encode, Decode, TypeInfo)]
pub enum ArenaAction {
    CreateLobby { capacity: u8 },
    Register { lobby_id: u128, owner_id: ActorId },
    Play { lobby_id: u128 },
    ReserveGas { lobby_id: u128 },
    CleanState { lobby_id: u128 },
}

#[derive(Encode, Decode, TypeInfo)]
pub struct TurnLog {
    pub character: ActorId,
    pub action: TurnEvent,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum TurnEvent {
    NotEnoughEnergy,
    Miss { position: u8 },
    Attack { position: u8, damage: u8 },
    Move { position: u8 },
    Rest { energy: u8 },
    Parry,
    Guardbreak { success: bool },
    CastSpell,
}

#[derive(Encode, Decode, TypeInfo)]
pub struct BattleLog {
    pub winner_id: ActorId,
    pub loser_id: ActorId,
    pub turns: Vec<Vec<TurnLog>>,
}

#[derive(Encode, Decode, TypeInfo)]
pub enum ArenaEvent {
    LobbyCreated {
        lobby_id: u128,
        capacity: u8,
    },
    PlayerRegistered {
        lobby_id: u128,
        player_id: ActorId,
    },
    GasReserved {
        lobby_id: u128,
    },
    LobbyBattleLog {
        lobby_id: u128,
        winner_id: ActorId,
        logs: Vec<BattleLog>,
    },
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

#[derive(Encode, Decode, Clone)]
pub struct CharacterState {
    pub hp: u8,
    pub position: u8,
    pub energy: u8,
    pub rest_count: u8,
    pub disable_agiim: bool,
    // spell effects
    pub fire_wall: (u8, u8),
    pub earth_skin: (u8, u8),
    pub chilling_touch: u8,
    pub water_burst: u8,
    pub fire_haste: u8,
    pub earth_smites: (u8, u8),
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
    pub level: u8,

    // battle specific fields
    // store them here to avoid using extra structs
    #[codec(skip)]
    pub parry: bool,
    #[codec(skip)]
    pub rest_count: u8,
    #[codec(skip)]
    pub disable_agiim: bool,
    // spell effects
    #[codec(skip)]
    pub fire_wall: (u8, u8),
    #[codec(skip)]
    pub earth_skin: (u8, u8),
    #[codec(skip)]
    pub chilling_touch: u8,
    #[codec(skip)]
    pub water_burst: u8,
    #[codec(skip)]
    pub fire_haste: u8,
    #[codec(skip)]
    pub earth_smites: (u8, u8),
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct BattleState {
    pub c1: Character,
    pub c2: Character,
}

#[derive(Encode, Decode, TypeInfo, Clone)]
pub struct ArenaState {
    pub mint: ActorId,
    pub leaderboard: BTreeMap<ActorId, u32>,
    pub lobby_count: u128,
}

pub struct ArenaMetadata;

impl Metadata for ArenaMetadata {
    type Init = InOut<ActorId, ()>;
    type Handle = InOut<ArenaAction, ArenaEvent>;
    type Others = InOut<(), ()>;
    type Reply = InOut<(), ()>;
    type Signal = ();
    type State = Out<ArenaState>;
}
