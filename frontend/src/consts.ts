const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: "account",
};

/**
 *
 */

export const MAX_GAS_LIMIT = 750000000000;
export const LIFES_INITIAL_QUANTITY = 5;

/**
 * Calculations
 */

const BASE_HP = 90;
const HP_MULTIPLIER = 10;
const ENERGY_MULTIPLIER = 3;
const BASE_ENERGY = 20;

export const getFullHp = (vitality: number) => {
  return BASE_HP + vitality * HP_MULTIPLIER;
};

export const getFullEnergy = (stamina: number) => {
  return BASE_ENERGY + stamina * ENERGY_MULTIPLIER;
};

/**
 *
 */

export { ADDRESS, LOCAL_STORAGE };
