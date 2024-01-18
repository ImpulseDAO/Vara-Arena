import { ProgramMetadata } from "@gear-js/api";
import { ARENA_METADATA, ARENA_PROGRAM_ID } from "consts";
import { useWatchMessages } from "hooks/useWatchMessages/useWatchMessages";

export const useWatchArenaMessages = <TReply>() => {
  const arenaMetadata = ProgramMetadata.from(ARENA_METADATA);
  const programId = ARENA_PROGRAM_ID;
  return useWatchMessages<TReply>({
    meta: arenaMetadata,
    programId,
  });
};
