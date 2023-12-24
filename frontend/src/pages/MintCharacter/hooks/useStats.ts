import { useState } from "react";

export type CharacterStats = {
  strength: number;
  agility: number;
  vitality: number;
  stamina: number;
  points: number;
  intelligence: number;
};

export const useStats = (
  initialStats: CharacterStats = {
    strength: 1,
    agility: 1,
    vitality: 1,
    stamina: 1,
    intelligence: 1,
    points: 5,
  }
) => {
  const [stats, setStats] = useState(initialStats);
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
