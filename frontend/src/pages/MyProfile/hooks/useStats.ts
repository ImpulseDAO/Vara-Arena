import { useSendToMintContract } from "app/api/sendMessages";
import { MAX_GAS_LIMIT, XP_NEEDED_FOR_LEVEL_UP_MAP } from "consts";
import { useFindMyVoucher } from "hooks/useFindMyVoucher";
import { useCallback, useEffect, useReducer, useState } from "react";

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
  const [isStatsMutating, setIsStatsMutating] = useState(false);

  const selectAttr = useCallback((capitalizedAttrName: string) => {
    setAttr(capitalizedAttrName);
    toggleVisible();
  }, []);

  const { send } = useSendToMintContract();
  const { findVoucher } = useFindMyVoucher();
  const accept = useCallback(
    async ({
      onSuccess,
      onError,
    }: {
      onSuccess?: () => void;
      onError?: () => void;
    } = {}) => {
      const payload = {
        LevelUp: {
          attr,
        },
      };

      if (attr) {
        setIsStatsMutating(true);
        toggleVisible();

        const { voucherId } = await findVoucher(payload, "MINT");

        try {
          await send({
            payload,
            gasLimit: MAX_GAS_LIMIT,
            voucherId,
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
    [attr, findVoucher, send]
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
