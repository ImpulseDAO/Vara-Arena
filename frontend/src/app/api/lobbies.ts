import { graphql } from "gql/gql";
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
      capacity
      reservationsCount
      characters {
        id
        character {
          id
          name
          owner
          level
          experience
          attributes
        }
      }
      battleLogs {
        id
      }
    }
  }
`);

export const useLobbies = () =>
  useGraphQL(lobbiesQueryDocument, undefined, { refetchInterval: 1000 * 3 });

/**
 * Lobby By Id
 */

const lobbyByIdQueryDocument = graphql(/* GraphQL */ `
  query LobbyById2($id: String!) {
    lobbyById(id: $id) {
      id
      capacity
      reservationsCount
      characters {
        id
        character {
          id
          name
          owner
          level
          experience
          attributes
        }
      }
      battleLogs {
        id
      }
    }
  }
`);

export const useLobby = ({ id }: { id: string }) => {
  const query = useGraphQL(
    lobbyByIdQueryDocument,
    { id: `${id}` },
    {
      // refresh every 3 seconds
      refetchInterval: 1000 * 3,
    }
  );
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
    return ({ capacity }: { capacity: LobbyCapacity }) => Promise.resolve();
  }

  return ({ capacity }: { capacity: LobbyCapacity }) => {
    if (capacity <= 0) {
      alert.error("Capacity must be greater than 0");
      return;
    }

    return new Promise((resolve, reject) => {
      send({
        payload: {
          CreateLobby: {
            capacity: `${capacity}`,
          },
        },
        gasLimit: MAX_GAS_LIMIT,
        onSuccess: () => {
          console.log("success");
          resolve("success");
        },
        onError: () => {
          console.log("error");
          reject("error");
        },
      });
    });
  };
};
