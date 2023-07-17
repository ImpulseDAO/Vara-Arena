import { useSendMessage } from "@gear-js/react-hooks";
import { useCallback, useMemo } from "react";
import { METADATA, MINT_ID } from "../constants";
import { getProgramMetadata } from "@gear-js/api";

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
  const meta = useMemo(() => getProgramMetadata(METADATA), []);
  const send = useSendMessage(MINT_ID, meta);
  return useCallback(() => {
    send(
      {
        CreateCharacter: {
          code_id: codeId,
          name: name,
          attributes: stats,
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
  }, []);
};
