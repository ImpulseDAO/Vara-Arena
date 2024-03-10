import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MAX_GAS_LIMIT } from "consts";
import { resetUseMyCharacrersQuery } from "app/api/characters";
import { useSendToMintContract } from "app/api/sendMessages";
import { useFindMyVoucher } from "hooks/useFindMyVoucher";

export const useOnSubmit = ({
  codeId,
  name,
  stats,
  onSuccess,
}: {
  codeId: string | null;
  name: string;
  stats: {
    strength: number;
    agility: number;
    stamina: number;
    intelligence: number;
    points: number;
  };
  onSuccess?: () => void;
}): VoidFunction => {
  /**
   *  using ref to reduce the number of re-renders caused by the useCallback below
   */
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  /**
   *
   */
  const { send } = useSendToMintContract();
  const { findVoucher } = useFindMyVoucher();
  const navigate = useNavigate();

  /**
   *
   */

  return useCallback(async () => {
    const payload = {
      CreateCharacter: {
        code_id: codeId,
        attributes: {
          agility: stats.agility,
          stamina: stats.stamina,
          strength: stats.strength,
          intelligence: stats.intelligence,
        },
        name,
      },
    };

    const { voucherId } = await findVoucher(payload, "MINT");

    send({
      payload,
      gasLimit: MAX_GAS_LIMIT,
      voucherId,
      onSuccess: (result) => {
        console.log("success", result);
        onSuccessRef.current?.();
        resetUseMyCharacrersQuery();
        navigate("/arena");
      },
      onError: () => {
        console.log("error");
      },
    });
  }, [
    codeId,
    findVoucher,
    name,
    navigate,
    send,
    stats.agility,
    stats.intelligence,
    stats.stamina,
    stats.strength,
  ]);
};
