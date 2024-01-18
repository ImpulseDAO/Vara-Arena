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
  const send = useSendMessage(ARENA_PROGRAM_ID, meta, { isMaxGasLimit: true });

  const { subscribe, unsubscribe } = useWatchArenaMessages();

  return useCallback(
    async ({ lobbyId }: { lobbyId: string }) => {
      return new Promise(async (resolve, reject) => {
        subscribe((reply, error) => {
          if (error) {
            reject(error.message);
            alert.error(error.message);
            return;
          }

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
