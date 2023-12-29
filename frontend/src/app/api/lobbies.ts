import { graphql } from "../../gql/gql";
import { useGraphQL } from "app/providers/ReactQuery/useGraphQL";
import { useSendToArena } from "./sendMessages";
import { MAX_GAS_LIMIT } from "consts";
import { useAccount, useAlert } from "@gear-js/react-hooks";

/**
 * All Lobbies
 */

const lobbiesQueryDocument = graphql(/* GraphQL */ `
  query Lobbies {
    lobbies {
      id
      characters {
        id
        character {
          name
          owner
          level
          id
          experience
          attributes
        }
      }
    }
  }
`);

export const useLobbies = () => useGraphQL(lobbiesQueryDocument);

/**
 * Lobby By Id
 */

const lobbyByIdQueryDocument = graphql(/* GraphQL */ `
  query LobbyById($id: String!) {
    lobbyById(id: $id) {
      id
      characters {
        character {
          attributes
          experience
          id
          level
          name
          owner
        }
        id
      }
    }
  }
`);

export const useLobby = ({ id }: { id: string }) => {
  const query = useGraphQL(lobbyByIdQueryDocument, { id: `${id}` });
  return query;
};

/**
 * Create Lobby
 */

export const useCreateLobby = () => {
  const alert = useAlert();
  const send = useSendToArena();
  const { isAccountReady } = useAccount();

  if (!isAccountReady) {
    // no-op
    return ({ capacity }: { capacity: number }) => Promise.resolve();
  }

  return ({ capacity }: { capacity: number }) => {
    if (capacity <= 0) {
      alert.error("Capacity must be greater than 0");
      return;
    }

    return send({
      payload: {
        CreateLobby: {
          capacity: `${capacity}`,
        },
      },
      gasLimit: MAX_GAS_LIMIT,
      onSuccess: () => {
        console.log("success");
      },
      onError: () => {
        console.log("error");
      },
    });
  };
};
