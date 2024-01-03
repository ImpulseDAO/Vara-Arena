switch (true) {
  case process.env.REACT_APP_IS_TESTNET == null:
    throw new Error("REACT_APP_IS_TESTNET env variable is not set");
  case process.env.REACT_APP_NODE_ADDRESS == null:
    throw new Error("REACT_APP_NODE_ADDRESS env variable is not set");
  default:
    break;
}

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
};

const LOCAL_STORAGE = {
  ACCOUNT: "account",
};

export const IS_TESTNET = process.env.REACT_APP_IS_TESTNET;
console.log("IS_TESTNET", IS_TESTNET);

/**
 *
 */

export const MAX_GAS_LIMIT = 750_000_000_000;
export const LIFES_INITIAL_QUANTITY = 5;
export const PAYMENT_FOR_MINTING = IS_TESTNET
  ? 10_000_000_000_000
  : 100_000_000_000_000;

export const XP_NEEDED_FOR_LEVEL_UP_MAP = {
  2: 300,
  3: 600,
  4: 1800,
  5: 5400,
  6: 16200,
  7: 48600,
  8: 145800,
  9: 437400,
  10: 1_312_200,
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
