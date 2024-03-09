import { useCallback, useMemo } from "react";
import { ARENA_PROGRAM_ID, ARENA_METADATA } from "consts";
import { useAccount, useSendMessage } from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import { MAX_GAS_LIMIT } from "consts";
import { useWatchArenaMessages } from "hooks/useWatchArenaMessages/useWatchArenaMessages";
import { useStableAlert } from "hooks/useWatchMessages/useStableAlert";

export const useOnRegisterForBattle = () => {
  const { account } = useAccount();
  const alert = useStableAlert();

  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const send = useSendMessage(ARENA_PROGRAM_ID, meta);

  const { subscribe, unsubscribe } = useWatchArenaMessages<{
    PlayerRegistered: {
      lobbyId: "32";
      playerId: "9";
      tier: "5";
    };
  }>();

  return useCallback(
    async ({ lobbyId }: { lobbyId: string }) => {
      return new Promise(async (resolve, reject) => {
        subscribe((reply, error) => {
          if (error) {
            reject(error.message);
            alert.error(error.message);
            return;
          }

          reply != null &&
            setTimeout(() => {
              const { lobbyId, playerId, tier } = reply.PlayerRegistered ?? {};
              const message = `Player ${playerId} registered for lobby ${lobbyId} with tier ${tier}`;
              console.info(message);
              alert.success(message);
            });

          resolve(reply);
        });
        const rejectAfterTimeout = () =>
          setTimeout(
            () => reject(new Error("Timeout: no reply from the arena")),
            4000
          );
        send({
          payload: {
            Register: {
              owner_id: account?.decodedAddress,
              lobby_id: lobbyId,
            },
          },
          gasLimit: MAX_GAS_LIMIT,
          onSuccess: () => {
            console.log('"Register" message sent');
            rejectAfterTimeout();
          },
          onError: () => {
            console.log("Error while sending Register message");
            rejectAfterTimeout();
          },
        });
      }).finally(() => {
        unsubscribe();
      });
    },
    [account?.decodedAddress, alert, send, subscribe, unsubscribe]
  );
};
