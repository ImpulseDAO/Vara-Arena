#![no_std]

use gstd::collections::{btree_map::Entry, BTreeMap, BTreeSet};
use gstd::prog::ProgramGenerator;
use gstd::{exec, msg, prelude::*, ActorId, CodeId, ReservationId};
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
    character_id: u128,
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

        self.check_attributes(&attributes);

        let (_, algorithm_id) =
            ProgramGenerator::create_program_with_gas(code_id, b"payload", 10_000_000_000, 0)
                .unwrap();

        let id = self.character_id;
        let info = CharacterInfo {
            id,
            algorithm_id,
            name,
            attributes: CharacterAttributes {
                strength: attributes.strength,
                agility: attributes.agility,
                vitality: attributes.vitality,
                stamina: attributes.stamina,
                intelligence: attributes.intelligence,
                lives_count: self.config.lives_count,
                tier_rating: 0,
                balance: 0,
            },
            level: 1,
            experience: 0,
        };

        self.characters.insert(msg::source(), info.clone());

        self.character_id += 1;
        msg::reply(
            MintEvent::CharacterCreated {
                character_info: info,
            },
            0,
        )
        .expect("unable to reply");
    }

    fn update_strategy(&mut self, code_id: Option<CodeId>, address: Option<ActorId>) {
        let player = msg::source();

        if code_id.is_some() && address.is_some() {
            panic!("Either code ID or strategy address")
        }
        let character = self
            .characters
            .get_mut(&player)
            .expect("You have no  characters");

        let algorithm_id = if let Some(code_id) = code_id {
            let (_, algorithm_id) =
                ProgramGenerator::create_program_with_gas(code_id, b"payload", 10_000_000_000, 0)
                    .unwrap();
            algorithm_id
        } else if let Some(address) = address {
            address
        } else {
            panic!("Both values cant be None")
        };

        character.algorithm_id = algorithm_id;

        msg::reply(MintEvent::CharacterUpdated, 0).expect("unable to reply");
    }

    fn character_info(&self, owner_id: CharacterId) {
        let character = self
            .characters
            .get(&owner_id)
            .expect("user has no character");
        msg::reply(character, 0).expect("unable to reply");
    }

    fn increase_xp(&mut self, owner_id: CharacterId, character_id: u128, losers: Vec<ActorId>) {
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

        assert!(character.id == character_id);

        let earned_rating = match character.level {
            0 => unreachable!(),
            1 => 25,
            2 => 20,
            3 => 15,
            4 => 10,
            _ => 5,
        };
        character.increase_xp();

        character.attributes.increase_rating(earned_rating);
        msg::reply(
            MintEvent::RatingUpdated {
                character_id: character.id,
                rating: character.attributes.tier_rating,
            },
            0,
        )
        .expect("unable to reply");

        let xp = character.experience;
        self.characters.insert(owner_id, character.clone());

        for character_id in losers {
            if let Entry::Occupied(mut character_info) = self.characters.entry(character_id) {
                character_info.get_mut().attributes.lives_count -= 1;
                msg::reply(
                    MintEvent::LivesCountUpdated {
                        character_id: character_info.get().id,
                        count: character_info.get().attributes.lives_count,
                    },
                    0,
                )
                .expect("unable to reply");

                if character_info.get().attributes.lives_count == 0 {
                    character_info.remove_entry();
                }
            }
        }

        self.total_rating = self.total_rating.saturating_add(earned_rating.into());

        msg::reply(
            MintEvent::XpUpdated {
                character_id: character.id,
                xp,
            },
            0,
        )
        .expect("unable to reply");
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

        character.level_up(&attr);

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

        let amount_for_distribution = self.config.gold_pool_amount;

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

    fn check_attributes(&self, attributes: &InitialAttributes) {
        assert!(attributes.agility >= 1);
        assert!(attributes.stamina >= 1);
        assert!(attributes.strength >= 1);
        assert!(attributes.intelligence >= 1);
        assert!(attributes.vitality >= 1);
        let mut sum: u8 = 0;
        sum = sum.checked_add(attributes.agility).unwrap();
        sum = sum.checked_add(attributes.stamina).unwrap();
        sum = sum.checked_add(attributes.strength).unwrap();
        sum = sum.checked_add(attributes.intelligence).unwrap();
        sum = sum.checked_add(attributes.vitality).unwrap();
        assert!(sum == 10, "invalid amount of attributes")
    }

    fn update_config(
        &mut self,
        gas_for_daily_distribution: Option<u64>,
        minimum_gas_amount: Option<u64>,
        update_interval_in_blocks: Option<u32>,
        reservation_amount: Option<u64>,
        reservation_duration: Option<u32>,
        mint_cost: Option<u128>,
        gold_pool_amount: Option<u128>,
    ) {
        self.check_if_admin(&msg::source());

        if let Some(gas_for_daily_distribution) = gas_for_daily_distribution {
            self.config.gas_for_daily_distribution = gas_for_daily_distribution;
        }

        if let Some(minimum_gas_amount) = minimum_gas_amount {
            self.config.minimum_gas_amount = minimum_gas_amount;
        }

        if let Some(update_interval_in_blocks) = update_interval_in_blocks {
            self.config.update_interval_in_blocks = update_interval_in_blocks;
        }

        if let Some(reservation_amount) = reservation_amount {
            self.config.reservation_amount = reservation_amount;
        }

        if let Some(reservation_duration) = reservation_duration {
            self.config.reservation_duration = reservation_duration;
        }

        if let Some(mint_cost) = mint_cost {
            self.config.mint_cost = Some(mint_cost);
        }

        if let Some(gold_pool_amount) = gold_pool_amount {
            self.config.gold_pool_amount = gold_pool_amount;
        }
    }
}

#[no_mangle]
unsafe extern "C" fn init() {
    let config: Config = msg::load().expect("Unable to decode Config");
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
        MintAction::BattleResult {
            owner_id,
            character_id,
            losers,
        } => mint.increase_xp(owner_id, character_id, losers),
        MintAction::SetArena { arena_id } => mint.set_arena(arena_id),
        MintAction::LevelUp { attr } => mint.level_up(caller, attr),
        MintAction::MakeReservation => mint.make_reservation(),
        MintAction::DistributeDailyPool => mint.distribute_daily_pool(),
        MintAction::AddAdmin { admin } => mint.add_admin(&admin),
        MintAction::RemoveAdmin { admin } => mint.remove_admin(&admin),
        MintAction::StartDailyGoldDistribution => mint.start_daily_gold_distribution(),
        MintAction::StopDailyGoldDistribution => mint.stop_daily_gold_distribution(),
        MintAction::UpdateCharacter { code_id, address } => mint.update_strategy(code_id, address),
        MintAction::UpdateConfig {
            gas_for_daily_distribution,
            minimum_gas_amount,
            update_interval_in_blocks,
            reservation_amount,
            reservation_duration,
            mint_cost,
            gold_pool_amount,
        } => mint.update_config(
            gas_for_daily_distribution,
            minimum_gas_amount,
            update_interval_in_blocks,
            reservation_amount,
            reservation_duration,
            mint_cost,
            gold_pool_amount,
        ),
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
