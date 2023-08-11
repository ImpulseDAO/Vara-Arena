const quick = [10, 10, 15, 20, 25, 30, 35, 40, 45];
const normal = [15, 15, 20, 26, 33, 39, 46, 52, 59];
const hard = [20, 20, 24, 32, 40, 48, 56, 64, 72];
const ATTACK_COST = 15;

export const getTypeAttack = (str: string, attack: number) => {
  if (Number(attack) === quick[Number(str)]) {
    return {
      type: "quick",
      costEnergy: 5 + ATTACK_COST,
    };
  }
  if (Number(attack) === normal[Number(str)]) {
    return {
      type: "normal",
      costEnergy: 11 + ATTACK_COST,
    };
  }
  if (Number(attack) === hard[Number(str)]) {
    return {
      type: "hard",
      costEnergy: 17 + ATTACK_COST,
    };
  }
};
