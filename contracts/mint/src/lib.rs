#![no_std]

use gstd::collections::{btree_map::Entry, BTreeMap, BTreeSet};
use gstd::prog::ProgramGenerator;
use gstd::{debug, exec, msg, prelude::*, ActorId, CodeId, ReservationId};
use mint_io::{
    AttributeChoice, CharacterAttributes, CharacterInfo, Config, DailyGoldDistrStatus,
    InitialAttributes, MintAction, MintEvent, MintState,
};

type CharacterId = ActorId;

#[derive(Default)]
struct Mint {
    characters: BTreeMap<CharacterId, CharacterInfo>,
    arena_contract: Option<ActorId>,
    admins: BTreeSet<ActorId>,
    config: Config,
    reservations: Vec<ReservationId>,
    pool_amount: u128,
    total_rating: u128,
    daily_gold_distr_status: DailyGoldDistrStatus,
}

static mut MINT: Option<Mint> = None;

impl Mint {
    fn add_admin(&mut self, admin: &ActorId) {
        self.check_if_admin(&msg::source());
        self.admins.insert(*admin);
    }

    fn remove_admin(&mut self, admin: &ActorId) {
        self.check_if_admin(&msg::source());
        self.admins.remove(admin);
    }

    fn create_character(&mut self, code_id: CodeId, name: String, attributes: InitialAttributes) {
        if let Some(mint_cost) = self.config.mint_cost {
            assert_eq!(
                mint_cost,
                msg::value(),
                "Please attach the exact amount of Vara"
            );
            self.pool_amount = self.pool_amount.saturating_add(mint_cost);
        }

        let (_, character_id) =
            ProgramGenerator::create_program_with_gas(code_id, b"payload", 10_000_000_000, 0)
                .unwrap();

        let info = CharacterInfo {
            id: character_id,
            name,
            attributes: CharacterAttributes {
                strength: attributes.strength,
                agility: attributes.agility,
                vitality: attributes.vitality,
                stamina: attributes.stamina,
                intelligence: attributes.intelligence,
                level: 0,
                experience: 0,
                lives_count: self.config.lives_count,
                tier_rating: 0,
                balance: 0,
            },
            level: 1,
            experience: 0,
        };

        self.characters.insert(msg::source(), info.clone());
        debug!("character {:?} minted", character_id);
        msg::reply(
            MintEvent::CharacterCreated {
                character_info: info,
            },
            0,
        )
        .expect("unable to reply");
    }

    fn character_info(&self, owner_id: CharacterId) {
        let character = self
            .characters
            .get(&owner_id)
            .expect("user has no character");
        msg::reply(character, 0).expect("unable to reply");
    }

    fn increase_xp(&mut self, owner_id: CharacterId, losers: Vec<ActorId>) {
        let caller = msg::source();

        if let Some(arena_id) = self.arena_contract {
            assert_eq!(caller, arena_id, "only the arena contract can call this fn");
        } else {
            panic!("Arena contract is not set");
        }

        let mut character = self
            .characters
            .get(&owner_id)
            .cloned()
            .expect("invalid owner_id");

        let earned_rating = match character.level {
            0 => unreachable!(),
            1 => 25,
            2 => 20,
            3 => 15,
            4 => 10,
            _ => 5,
        };
        character.attributes.increase_xp();

        character.attributes.increase_rating(earned_rating);
        let character_id = character.id;
        let xp = character.experience;
        self.characters.insert(owner_id, character.clone());

        for character_id in losers {
            // self.characters.entry(character_id).and_modify(|_| {});
            if let Entry::Occupied(mut character_info) = self.characters.entry(character_id) {
                character_info.get_mut().attributes.lives_count -= 1;
                if character_info.get().attributes.lives_count == 0 {
                    character_info.remove_entry();
                }
            }
        }

        self.total_rating = self.total_rating.saturating_add(earned_rating.into());

        msg::reply(MintEvent::XpIncreased { character_id, xp }, 0).expect("unable to reply");
    }

    fn set_arena(&mut self, arena_id: ActorId) {
        self.check_if_admin(&msg::source());
        self.arena_contract = Some(arena_id);
    }

    fn level_up(&mut self, owner_id: ActorId, attr: AttributeChoice) {
        let character: &mut CharacterInfo = self
            .characters
            .get_mut(&owner_id)
            .expect("caller doesn't have a character");

        character.attributes.level_up(&attr);

        msg::reply(
            MintEvent::LevelUpdated {
                character_id: character.id,
                attr,
            },
            0,
        )
        .expect("unable to reply");
    }

    fn start_daily_gold_distribution(&mut self) {
        self.check_if_admin(&msg::source());

        msg::send_with_gas_delayed(
            exec::program_id(),
            MintAction::DistributeDailyPool,
            self.config.gas_for_daily_distribution,
            0,
            self.config.update_interval_in_blocks,
        )
        .expect("Error during sending a delayed message");
        self.daily_gold_distr_status = DailyGoldDistrStatus::Active;
    }

    fn distribute_daily_pool(&mut self) {
        assert_eq!(
            self.daily_gold_distr_status,
            DailyGoldDistrStatus::Active,
            "Gold distribution was stopped"
        );
        let program_id = exec::program_id();
        assert!(
            program_id == msg::source(),
            "The caller must be the contract itself"
        );
        // 75 percent
        let amount_for_distribution = (self.config.gold_pool_amount * 750) / 1000;

        // Payment per rating unit
        let unit_rating_payment = amount_for_distribution / self.total_rating;

        for character_info in self.characters.values_mut() {
            if character_info.attributes.lives_count > 0 {
                let earned_daily_balance =
                    character_info.attributes.tier_rating * unit_rating_payment;
                character_info.attributes.balance = character_info
                    .attributes
                    .balance
                    .saturating_add(earned_daily_balance.into());
            }
        }

        // Check gas in message
        // If the remaining gas in the message is less than the minimum gas amount on config
        // then new gas is taken from the reservation.
        // If there is no reservation, then the daily distribution of gold is suspended.
        if exec::gas_available() < self.config.minimum_gas_amount {
            if let Some(reservation_id) = self.reservations.pop() {
                msg::send_delayed_from_reservation(
                    reservation_id,
                    program_id,
                    MintAction::DistributeDailyPool,
                    0,
                    self.config.update_interval_in_blocks,
                )
                .expect("Error during sending a delayed message");
            } else {
                self.daily_gold_distr_status = DailyGoldDistrStatus::OutOfGas;
            }
        } else {
            msg::send_with_gas_delayed(
                program_id,
                MintAction::DistributeDailyPool,
                self.config.gas_for_daily_distribution,
                0,
                self.config.update_interval_in_blocks,
            )
            .expect("Error during sending a delayed message");
        }
    }

    fn stop_daily_gold_distribution(&mut self) {
        self.check_if_admin(&msg::source());
        self.daily_gold_distr_status = DailyGoldDistrStatus::Stopped;
    }

    fn make_reservation(&mut self) {
        let reservation_id = ReservationId::reserve(
            self.config.reservation_amount,
            self.config.reservation_duration,
        )
        .expect("Error during reservation");
        self.reservations.push(reservation_id);
    }

    fn check_if_admin(&self, account: &ActorId) {
        assert!(self.admins.contains(account), "Not admin");
    }
}

#[no_mangle]
unsafe extern "C" fn init() {
    let config: Config = msg::load().expect("Unable to decode Condig");
    let contract_owner = msg::source();
    MINT = Some(Mint {
        admins: BTreeSet::from([contract_owner]),
        config,
        ..Default::default()
    });
}

#[no_mangle]
extern "C" fn handle() {
    let mint = unsafe { MINT.as_mut().unwrap() };
    let action: MintAction = msg::load().expect("unable to decode `MintAction`");
    let caller = msg::source();

    match action {
        MintAction::CreateCharacter {
            code_id,
            name,
            attributes,
        } => {
            mint.create_character(code_id, name, attributes);
        }
        MintAction::CharacterInfo { owner_id } => mint.character_info(owner_id),
        MintAction::BattleResult { owner_id, losers } => mint.increase_xp(owner_id, losers),
        MintAction::SetArena { arena_id } => mint.set_arena(arena_id),
        MintAction::LevelUp { attr } => mint.level_up(caller, attr),
        MintAction::MakeReservation => mint.make_reservation(),
        MintAction::DistributeDailyPool => mint.distribute_daily_pool(),
        MintAction::AddAdmin { admin } => mint.add_admin(&admin),
        MintAction::RemoveAdmin { admin } => mint.remove_admin(&admin),
        MintAction::StartDailyGoldDistribution => mint.start_daily_gold_distribution(),
        MintAction::StopDailyGoldDistribution => mint.stop_daily_gold_distribution(),
    }
}

#[no_mangle]
extern "C" fn state() {
    let mint = unsafe { MINT.as_ref().unwrap() };
    msg::reply(
        MintState {
            characters: mint.characters.clone(),
        },
        0,
    )
    .expect("failed to share state");
}
