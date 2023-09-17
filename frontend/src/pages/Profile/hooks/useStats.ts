import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import { METADATA, MINT_ID } from "pages/MintCharacter/constants";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
const LEVEL_XP = [
  300,
  600,
  1800,
  5400,
  16200,
  48600,
  145800,
  437400,
  1312200,
  3936600,
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
    maxExp: "0",
  });
  const [attr, setAttr] = useState("");

  const [alertVisible, toggleVisible] = useReducer((state) => !state, false);

  const selectAttr = useCallback((attrName: string) => {
    setAttr(attrName);
    toggleVisible();
  }, []);

  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);
  const send = useSendMessage(MINT_ID, meta, { isMaxGasLimit: true });
  const accept = useCallback(() => {
    if (attr) {
      toggleVisible();
      send(
        {
          LevelUp: {
            attr,
          },
        },
        {
          onSuccess: () => {
            console.log("success");
          },
          onError: () => {
            console.log("error");
          },
        }
      );
    }
  }, [attr, send]);

  useEffect(() => {
    if (charInfo?.attributes) {
      const exp = charInfo.attributes.experience.replaceAll(",", "");
      const expectedLevel = LEVEL_XP.findIndex((lvlExp) => lvlExp > +exp);
      const isAvailableLvlUp = expectedLevel - +charInfo.attributes.level > 0;

      setStats((prev) => ({
        ...prev,
        ...charInfo.attributes,
        maxExp: LEVEL_XP[charInfo.attributes.level],
        points: isAvailableLvlUp ? "1" : "0",
        experience: exp,
      }));
    }
  }, [charInfo]);

  return {
    selectAttr,
    stats,
    alertVisible,
    accept,
    cancel: toggleVisible,
  };
};
