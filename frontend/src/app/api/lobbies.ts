import { graphql } from "gql/gql";
import { useGraphQL } from "app/providers/ReactQuery/useGraphQL";
import { useSendToArena } from "./sendMessages";
import { MAX_GAS_LIMIT } from "consts";
import { useAccount, useAlert } from "@gear-js/react-hooks";
import { useWatchArenaMessages } from "hooks/useWatchArenaMessages/useWatchArenaMessages";
import { useFindMyVoucher } from "hooks/useFindMyVoucher";

/**
 * All Lobbies
 */

const lobbiesQueryDocument = graphql(/* GraphQL */ `
  query Lobbies {
    lobbies {
      id
      capacity
      tier
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
      tier
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

type ReplyObject = {
  LobbyCreated: {
    lobbyId: string;
    capacity: string;
  };
};

/**
 * Create Lobby
 */

export const useCreateLobby = () => {
  const alert = useAlert();
  const { send } = useSendToArena();
  const { findVoucher } = useFindMyVoucher();
  const { isAccountReady } = useAccount();
  const { subscribe, unsubscribe } = useWatchArenaMessages<ReplyObject>();

  if (!isAccountReady) {
    // no-op
    return ({ capacity }: { capacity: LobbyCapacity }) =>
      Promise.resolve(undefined as ReplyObject | undefined);
  }

  return ({ capacity }: { capacity: LobbyCapacity }) => {
    if (capacity <= 0) {
      alert.error("Capacity must be greater than 0");
      return Promise.reject("Capacity must be greater than 0");
    }

    return new Promise<ReplyObject | undefined>(async (resolve, reject) => {
      const payload = { CreateLobby: { capacity: `${capacity}` } };

      const { voucherId } = await findVoucher(payload, "ARENA");

      /**
       * (Optional) If no voucher found, show dialogue that can redirect to discord
       * or propmts user if they want to pay from main balance
       */

      // TO BE IMPLEMENTED if needed

      /**
       * Subscribe to result before sending message
       */

      subscribe((reply, error) => {
        if (error) {
          reject(error.message);
          alert.error(error.message);
          return;
        }

        reply != null &&
          setTimeout(() => {
            const { lobbyId, capacity } = reply.LobbyCreated;
            const message = `Lobby ${lobbyId} created with capacity ${capacity}. ${
              voucherId ? "Voucher used" : "Main balance used"
            }`;
            console.info(message);
            alert.success(message);
          });

        resolve(reply);
      });

      /**
       * Pay using either voucher or main balance
       */

      send({
        payload,
        gasLimit: MAX_GAS_LIMIT,
        voucherId,
        onSuccess: () => {
          console.log("CreateLobby message successfully sent");
          voucherId
            ? console.log("Voucher used", voucherId)
            : console.log("Main balance used");
        },
        onError: () => {
          console.log("Error while sending CreateLobby message");
          reject("Error while sending CreateLobby message");
        },
      });
    }).finally(() => {
      console.log("Unsubscribing from arena messages");
      unsubscribe();
    });
  };
};
