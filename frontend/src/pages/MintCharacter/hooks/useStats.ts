import { useState } from "react";

export const useStats = () => {
  const [stats, setStats] = useState({
    strength: 6,
    agility: 1,
    vitality: 1,
    stamina: 1,
    points: 0,
  });
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
