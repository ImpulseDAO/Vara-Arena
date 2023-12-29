import { useAccount } from "@gear-js/react-hooks";
import { graphql } from "../../gql/gql";
import { useGraphQL } from "app/providers/ReactQuery/useGraphQL";

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

export const useMyCharacters = ({ owner_eq }: { owner_eq: string }) => {
  return useGraphQL(charactersByOwnerQueryDocument, {
    owner_eq,
  });
};

export const useMyCharacter = () => {
  const { account } = useAccount();
  const { data: myCharacters } = useMyCharacters({
    owner_eq: account?.decodedAddress ?? "",
  });

  return myCharacters?.characters[myCharacters?.characters.length - 1];
};
