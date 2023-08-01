import { useEffect, useState } from "react";
const LEVEL_XP = [
  300, 600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200, 3936600,
];

export const useStats = (
  charInfo:
    | {
        id: string;
        attributes: {
          strength: string;
          agility: string;
          vitality: string;
          stamina: string;
          experience: string;
          level: string;
        };
        name: string;
      }
    | undefined
) => {
  const [stats, setStats] = useState({
    strength: "1",
    agility: "1",
    vitality: "1",
    stamina: "1",
    points: "0",
    level: "0",
    experience: "0",
  });

  const [exp, setExp] = useState({
    curExp: 0,
    maxExp: 0,
  });

  useEffect(() => {
    if (charInfo?.attributes) {
      const curLevel = LEVEL_XP.findIndex(
        (lvlExp) => lvlExp > +charInfo.attributes.experience
      );
      const points = (curLevel - +charInfo.attributes.level).toString();

      setExp({
        curExp: +charInfo.attributes.experience,
        maxExp: LEVEL_XP[curLevel],
      });
      setStats((prev) => ({ ...prev, ...charInfo.attributes, points }));
    }
  }, [charInfo]);

  const increase = (name: string) => {
    if (+stats.points > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: (+prevStats[name] + 1).toString(),
        points: (+prevStats["points"] - 1).toString(),
      }));
    }
  };
  const decrease = (name: string) => {
    if (+stats[name] > 1) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: (+prevStats[name] - 1).toString(),
        points: (+prevStats["points"] + 1).toString(),
      }));
    }
  };

  return {
    decrease,
    increase,
    stats,
    exp,
  };
};
