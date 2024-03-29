import { GearApi, ProgramMetadata } from "@gear-js/api";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import { useMyAccountId } from "hooks/hooks";

import { createQuery } from "react-query-kit";
import { withApi } from "./queryMiddleware/withApi";
import { useMyCharacters } from "./characters";

type OwnerId = HexString;

export const useMintState = createQuery<
  {
    characters: Record<OwnerId, CharacterInContractState>;
  },
  {
    programId: HexString;
    metadata: string;
  }
>({
  use: [withApi],
  queryKey: ["mintProgramState"],
  fetcher: async ({ programId, metadata }, context) => {
    const mintMetadata = ProgramMetadata.from(metadata);
    const api = context.meta?.api as GearApi | undefined;

    const mintState = await api?.programState.read(
      { programId, payload: undefined },
      mintMetadata
    );
    return mintState?.toJSON() as {
      characters: Record<OwnerId, CharacterInContractState>;
    };
  },
});

/**
 * This is a workaround until we have working indexer
 */
export const useMyCharacterFromContractState = () => {
  const accountId = useMyAccountId();
  const queryResult = useMintState({
    variables: {
      metadata: MINT_METADATA,
      programId: MINT_PROGRAM_ID,
    },
    select: (state) => {
      return state.characters?.[(accountId ?? "") as OwnerId] ?? null;
    },
  });

  return queryResult;
};

export const useMyHeroIsDead = () => {
  const owner_eq = useMyAccountId() ?? "";
  const { data: myCharacters } = useMyCharacters({ owner_eq });
  const { data: myCharacter } = useMyCharacterFromContractState();

  return {
    isDead: myCharacters?.characters.length !== 0 && !myCharacter,
    // isFresh means that we don't have any characters yet
    isFresh: myCharacters?.characters.length === 0,
  };
};
