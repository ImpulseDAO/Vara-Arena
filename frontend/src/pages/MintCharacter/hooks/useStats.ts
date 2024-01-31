import { POINTS_WHEN_MINTING_TOTAL } from "consts";
import { useState } from "react";

export type CharacterStats = Attributes & {
  level?: number;
  points?: number;
};

const defaultAttributes: Required<Attributes> = {
  strength: 1,
  agility: 1,
  stamina: 1,
  intelligence: 1,
};
const getPointsLeft = (stats: CharacterStats) =>
  POINTS_WHEN_MINTING_TOTAL - Object.values(stats).reduce((a, b) => a + b, 0);

const defaultStats: Required<CharacterStats> = {
  level: 1,
  ...defaultAttributes,
  points: getPointsLeft(defaultAttributes),
};

export const useStats = (initialStats: CharacterStats = defaultStats) => {
  const pointsLeft = getPointsLeft(initialStats);
  const initialWithDefault = {
    ...defaultStats,
    ...initialStats,
    points: pointsLeft,
  };
  const [stats, setStats] = useState(initialWithDefault);
  const increase = (name) => {
    if (stats.points > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: prevStats[name] + 1,
        points: prevStats["points"] - 1,
      }));
    }
  };
  const decrease = (name) => {
    if (stats[name] > 1) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: prevStats[name] - 1,
        points: prevStats["points"] + 1,
      }));
    }
  };

  return {
    decrease,
    increase,
    stats,
  };
};
