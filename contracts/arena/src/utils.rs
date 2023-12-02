const HP_MULTIPLIER: u8 = 10;
const BASE_HP: u8 = 90;
const ENERGY_MULTIPLIER: u8 = 3;
const BASE_ENERGY: u8 = 20;

pub fn full_hp(vitality: u8) -> u8 {
    BASE_HP + vitality * HP_MULTIPLIER
}

pub fn full_energy(stamina: u8) -> u8 {
    BASE_ENERGY + stamina * ENERGY_MULTIPLIER
}
