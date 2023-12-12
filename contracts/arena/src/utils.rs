use gstd::exec;

const HP_MULTIPLIER: u8 = 10;
const BASE_HP: u8 = 90;
const ENERGY_MULTIPLIER: u8 = 3;
const BASE_ENERGY: u8 = 20;

static mut SEED: u8 = 0;

pub fn get_random_value(range: u8) -> u8 {
    let seed = unsafe { SEED };
    unsafe { SEED = SEED.wrapping_add(1) };
    let mut random_input: [u8; 32] = exec::program_id().into();
    random_input[0] = random_input[0].wrapping_add(seed);
    let (random, _) = exec::random(random_input).expect("Error in getting random number");
    random[0] % range
}

pub fn full_hp(vitality: u8) -> u8 {
    BASE_HP + vitality * HP_MULTIPLIER
}

pub fn full_energy(stamina: u8) -> u8 {
    BASE_ENERGY + stamina * ENERGY_MULTIPLIER
}
