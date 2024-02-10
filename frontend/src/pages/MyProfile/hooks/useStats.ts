import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import { MAX_GAS_LIMIT, XP_NEEDED_FOR_LEVEL_UP_MAP } from "consts";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import { useShouldUseVoucher } from "hooks/useShouldUseVoucher";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

export const useStats = (character?: Character) => {
  const [stats, setStats] = useState({
    ...character?.attributes,
    points: 0,
    level: character?.level ?? 0,
    experience: 0,
    maxExp: 0,
  });
  const shouldUseVoucher = useShouldUseVoucher();
  const [attr, setAttr] = useState("");

  const [alertVisible, toggleVisible] = useReducer((state) => !state, false);
  const [isStatsMutating, setIsStatsMutating] = useState(false);

  const selectAttr = useCallback((capitalizedAttrName: string) => {
    setAttr(capitalizedAttrName);
    toggleVisible();
  }, []);

  const meta = useMemo(() => ProgramMetadata.from(MINT_METADATA), []);
  const send = useSendMessage(MINT_PROGRAM_ID, meta, { isMaxGasLimit: true });
  const accept = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    } = {}) => {
      if (attr) {
        setIsStatsMutating(true);
        toggleVisible();
        try {
          await send({
            payload: {
              LevelUp: {
                attr,
              },
            },
            withVoucher: shouldUseVoucher,
            gasLimit: MAX_GAS_LIMIT,
            onSuccess: () => {
              console.log("LevelUp message successfully sent");
              onSuccess?.();
              setIsStatsMutating(false);
            },
            onError: () => {
              console.log("Error while sending LevelUp message");
              onError?.();
              setIsStatsMutating(false);
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    [attr, send, shouldUseVoucher]
  );

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
    selectedAttr: attr,
    isStatsMutating,
  };
};
