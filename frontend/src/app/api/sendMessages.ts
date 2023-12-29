import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import { ARENA_ID, ARENA_METADATA } from "pages/StartFight/constants";
import { useMemo } from "react";

export const useSendToArena = () => {
  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const send = useSendMessage(ARENA_ID, meta, { isMaxGasLimit: true });

  return send;
};
