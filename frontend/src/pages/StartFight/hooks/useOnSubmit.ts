import { useCallback } from "react";
import { useAccount } from "@gear-js/react-hooks";
import { MAX_GAS_LIMIT } from "consts";
import { useWatchArenaMessages } from "hooks/useWatchArenaMessages/useWatchArenaMessages";
import { useStableAlert } from "hooks/useWatchMessages/useStableAlert";
import { useSendToArena } from "app/api/sendMessages";
import { useFindMyVoucher } from "hooks/useFindMyVoucher";

export const useOnRegisterForBattle = () => {
  const { account } = useAccount();
  const alert = useStableAlert();
  const { send } = useSendToArena();
  const { findVoucher } = useFindMyVoucher();

  const { subscribe, unsubscribe } = useWatchArenaMessages<{
    PlayerRegistered: {
      lobbyId: "32";
      playerId: "9";
      tier: "5";
    };
  }>();

  return useCallback(
    async ({ lobbyId }: { lobbyId: string }) => {
      const payload = {
        Register: {
          owner_id: account?.decodedAddress,
          lobby_id: lobbyId,
        },
      };

      return new Promise(async (resolve, reject) => {
        const { voucherId } = await findVoucher(payload, "ARENA");

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

        const rejectAfterTimeout = () => {
          setTimeout(
            () => reject(new Error("Timeout: no reply from the arena")),
            4000
          );
        };

        send({
          payload,
          gasLimit: MAX_GAS_LIMIT,
          voucherId,
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
    [account, alert, findVoucher, send, subscribe, unsubscribe]
  );
};
