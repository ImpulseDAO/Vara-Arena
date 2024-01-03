import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import { XP_NEEDED_FOR_LEVEL_UP_MAP } from "consts";
import { METADATA, MINT_ID } from "pages/MintCharacter/constants";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

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