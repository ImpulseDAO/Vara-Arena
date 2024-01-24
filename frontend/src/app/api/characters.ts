import { useAccount } from "@gear-js/react-hooks";
import { graphql } from "gql/gql";
import {
  getGraphQLPrimaryKey,
  useGraphQL,
} from "app/providers/ReactQuery/useGraphQL";
import { UseQueryResult } from "@tanstack/react-query";
import { queryClient } from "app/providers/ReactQuery";

const allCharactersQueryDocument = graphql(/* GraphQL */ `
  query AllCharacters {
    characters {
      id
      level
      name
      owner
      experience
      attributes
    }
  }
`);

export const useAllCharacters = () => useGraphQL(allCharactersQueryDocument);

const charactersByOwnerQueryDocument = graphql(/* GraphQL */ `
  query CharactersByOwner($owner_eq: String!) {
    characters(where: { owner_eq: $owner_eq }) {
      id
      level
      name
      owner
      experience
      attributes
    }
  }
`);

export const resetUseMyCharacrersQuery = () => {
  const primaryKey = getGraphQLPrimaryKey(charactersByOwnerQueryDocument);

  queryClient.invalidateQueries({ queryKey: [primaryKey] });
};

export const useMyCharacters = ({ owner_eq }: { owner_eq: string }) => {
  return useGraphQL(charactersByOwnerQueryDocument, {
    owner_eq,
  });
};

export const useMyCharacter = () => {
  const { account } = useAccount();
  const queryResult = useMyCharacters({
    owner_eq: account?.decodedAddress ?? "",
  });

  const myCharacters = queryResult.data;

  return {
    ...queryResult,
    data: myCharacters?.characters[
      myCharacters?.characters.length - 1
    ] as Character,
  };
};

const characterByIdQueryDocument = graphql(/* GraphQL */ `
  query CharacterById($character_id: String!) {
    characterById(id: $character_id) {
      attributes
      experience
      balance
      id
      level
      owner
      livesCount
      name
      rating
    }
  }
`);

export const useCharacterById = ({ id }: { id: string }) => {
  return useGraphQL(characterByIdQueryDocument, {
    character_id: id,
  });
};
