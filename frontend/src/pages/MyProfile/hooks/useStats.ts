import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import { METADATA, MINT_ID } from "pages/MintCharacter/constants";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

const XP_NEEDED_FOR_LEVEL_UP_MAP = {
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

export const useStats = (character?: Character) => {
  const [stats, setStats] = useState({
    ...character?.attributes,
    points: 0,
    level: character?.level ?? 0,
    experience: 0,
    maxExp: 0,
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
      send({
        payload: {
          LevelUp: {
            attr,
          },
        },
        gasLimit: Infinity,
        onSuccess: () => {
          console.log("success");
        },
        onError: () => {
          console.log("error");
        },
      });
    }
  }, [attr, send]);

  useEffect(() => {
    if (character?.attributes) {
      const exp = character.experience;
      const currentLevel = character.level;
      const nextLevel = currentLevel + 1;

      /**
       * Calculating if it's possible to level up
       */
      const expNeededForLevelUp = XP_NEEDED_FOR_LEVEL_UP_MAP[nextLevel];
      const isAvailableLvlUp = exp >= expNeededForLevelUp;

      setStats((prev) => ({
        ...prev,
        ...character.attributes,
        maxExp: XP_NEEDED_FOR_LEVEL_UP_MAP[nextLevel],
        points: isAvailableLvlUp ? 1 : 0,
        experience: exp,
      }));
    }
  }, [character]);

  console.log("stats", stats);

  return {
    selectAttr,
    stats,
    alertVisible,
    accept,
    cancel: toggleVisible,
  };
};
