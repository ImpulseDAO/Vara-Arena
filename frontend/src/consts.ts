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

export const XP_NEEDED_FOR_LEVEL_UP_MAP = {
  2: 300,
  3: 600,
  4: 1800,
  5: 5400,
  6: 16200,
  7: 48600,
  8: 145800,
  9: 437400,
  10: 1312200,
};

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
