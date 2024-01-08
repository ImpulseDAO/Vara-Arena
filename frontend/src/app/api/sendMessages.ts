import { ProgramMetadata } from "@gear-js/api";
import { useSendMessage } from "@gear-js/react-hooks";
import {
  ARENA_METADATA,
  ARENA_PROGRAM_ID,
  MINT_METADATA,
  MINT_PROGRAM_ID,
} from "consts";
import { useMemo } from "react";

export const useSendToArena = () => {
  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const sendToArenaContract = useSendMessage(ARENA_PROGRAM_ID, meta, {
    isMaxGasLimit: true,
  });

  return sendToArenaContract;
};

export const useSendToMintContract = () => {
  const meta = useMemo(() => ProgramMetadata.from(MINT_METADATA), []);
  const sendToMintContract = useSendMessage(MINT_PROGRAM_ID, meta, {
    isMaxGasLimit: true,
  });

  return sendToMintContract;
};
