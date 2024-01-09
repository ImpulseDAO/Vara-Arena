import { ProgramMetadata } from "@gear-js/api";
import { useApi } from "@gear-js/react-hooks";
import { useQuery } from "@tanstack/react-query";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import { useMyAccountId } from "hooks/hooks";

type OwnerId = HexString;

export const useMintState = () => {
  const { api } = useApi();
  return useQuery({
    queryKey: ["programState"],
    queryFn: async () => {
      const mintMetadata = ProgramMetadata.from(MINT_METADATA);
      const mintState = await api?.programState.read(
        { programId: MINT_PROGRAM_ID, payload: undefined },
        mintMetadata
      );
      return mintState?.toJSON() as {
        characters: Record<OwnerId, CharacterInContractState>[];
      };
    },
  });
};

/**
 * This is a workaround until we have working indexer
 */
export const useMyCharacterFromContractState = () => {
  const { data: mintState } = useMintState();

  const accountId = useMyAccountId();

  return mintState?.characters?.[accountId ?? ""] as
    | CharacterInContractState
    | undefined;
};
