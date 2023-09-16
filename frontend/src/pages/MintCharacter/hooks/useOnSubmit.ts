import { useSendMessage } from "@gear-js/react-hooks";
import { useCallback, useMemo } from "react";
import { METADATA, MINT_ID } from "../constants";
import { ProgramMetadata } from "@gear-js/api";
import { useNavigate } from "react-router-dom";
import { ARENA_ID } from "pages/StartFight/constants";

export const useOnSubmit = ({
  codeId,
  name,
  stats,
}: {
  codeId: string;
  name: string;
  stats: {
    strength: number;
    agility: number;
    vitality: number;
    stamina: number;
    points: number;
  };
}): VoidFunction => {
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);
  const send = useSendMessage(MINT_ID, meta);
  const navigate = useNavigate();
  const data = useMemo(
    () => ({
      destination: MINT_ID,
      gasLimit: 18,
      value: 0,
      payload: {
        CreateCharacter: {
          code_id: codeId,
          attributes: {
            agility: stats.agility,
            stamina: stats.stamina,
            strength: stats.strength,
            vitality: stats.vitality,
          },
          name,
        },
      },
    }),
    []
  );

  return useCallback(() => {
    send(data, {
      onSuccess: () => {
        console.log("success");
        navigate("/arena");
      },
      onError: () => {
        console.log("error");
      },
    });
  }, [codeId, name, navigate, send, stats]);
};
