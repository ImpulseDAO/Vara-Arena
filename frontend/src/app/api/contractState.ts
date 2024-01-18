import { GearApi, ProgramMetadata } from "@gear-js/api";

import { createQuery } from "react-query-kit";
import { withApi } from "./queryMiddleware/withApi";

type OwnerId = HexString;

export const useArenaState = createQuery<
  {
    characters: Record<OwnerId, CharacterInContractState>;
  },
  {
    programId: HexString;
    metadata: string;
  }
>({
  use: [withApi],
  queryKey: ["arenaProgramState"],
  fetcher: async ({ programId, metadata }, context) => {
    const arenaMetadata = ProgramMetadata.from(metadata);
    const api = context.meta?.api as GearApi | undefined;

    const arenaState = await api?.programState.read(
      { programId, payload: undefined },
      arenaMetadata
    );
    return arenaState?.toJSON() as {
      characters: Record<OwnerId, CharacterInContractState>;
    };
  },
});
