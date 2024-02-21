import { TIERS_MAP } from "./tiersMap";

export const getTier = (level: number): number | undefined => {
  if (level === 0) {
    throw new Error("level can not be 0");
  }
  for (let tier in TIERS_MAP) {
    const levels = TIERS_MAP[tier];
    if (levels.includes(level)) return Number(tier.slice(-1));
  }

  return 1;
};
