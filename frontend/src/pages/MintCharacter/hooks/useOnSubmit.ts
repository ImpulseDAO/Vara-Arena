import { useSendMessage } from "@gear-js/react-hooks";
import { useCallback, useMemo, useRef } from "react";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import { ProgramMetadata } from "@gear-js/api";
import { useNavigate } from "react-router-dom";
import { MAX_GAS_LIMIT, PAYMENT_FOR_MINTING } from "consts";
import { resetUseMyCharacrersQuery } from "app/api/characters";
import { useShouldUseVoucher } from "hooks/useShouldUseVoucher";

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
    vitality: number;
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

  const shouldUseVoucher = useShouldUseVoucher();

  /**
   *
   */
  const meta = useMemo(() => ProgramMetadata.from(MINT_METADATA), []);

  const send = useSendMessage(MINT_PROGRAM_ID, meta, { isMaxGasLimit: true });
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
          vitality: stats.vitality,
          intelligence: stats.intelligence,
        },
        name,
      },
    };

    send({
      payload,
      gasLimit: MAX_GAS_LIMIT,
      withVoucher: shouldUseVoucher,
      onSuccess: (result) => {
        console.log("success", result);
        onSuccessRef.current?.();
        resetUseMyCharacrersQuery();
        navigate("/arena");
      },
      onError: () => {
        console.log("error");
      },
      value: PAYMENT_FOR_MINTING,
    });
  }, [codeId, name, navigate, send, shouldUseVoucher, stats]);
};
