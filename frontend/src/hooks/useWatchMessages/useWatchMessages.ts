import { useAccount, useApi } from "@gear-js/react-hooks";
import { MutableRefObject, useCallback, useRef } from "react";
import { UnsubscribePromise } from "@polkadot/api/types";
import { Bytes } from "@polkadot/types";
import { ProgramMetadata, UserMessageSent } from "@gear-js/api";
import { useStableAlert } from "./useStableAlert";

export function useWatchMessages<TReply>({
  meta,
  programId,
}: {
  meta: ProgramMetadata;
  programId: HexString;
}) {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useStableAlert();

  const messageSub: MutableRefObject<UnsubscribePromise | null> = useRef(null);

  const getDecodedPayload = useCallback(
    <T>(payload: Bytes) => {
      if (!meta?.types.handle.output) return;
      return meta.createType(meta.types.handle.output, payload).toHuman() as T;
    },
    [meta]
  );

  type OnChangeStateReturnType =
    | {
        data: TReply;
        error: undefined;
      }
    | {
        data: undefined;
        error: Error;
      };

  const onChangeState = useCallback(
    (event: UserMessageSent) => {
      let {
        data: { message },
      } = event;

      /**
       * Be careful as this mutates the message object.
       * If you remove this line, the message will be in raw format.
       */
      const messageToHuman = message.toHuman();
      console.log("message", messageToHuman);

      const { destination, source, payload } = message;
      const payloadStr = JSON.stringify(payload.toHuman());

      {
        /**
         * If the message is an error, return the error message
         */
        const details = message.details.toHuman() ?? {};
        // @ts-ignore this is sggs
        const error = JSON.stringify(details?.code?.Error);

        if (error) {
          console.error(error);

          return {
            data: undefined,
            error: new Error(payloadStr, {
              cause: {
                message: message,
              },
            }),
          } as OnChangeStateReturnType;
        }
      }

      /**
       * Check that the message is for the owner of the account
       */
      const isOwner = destination.toHex() === account?.decodedAddress;
      const isGame = source.toHex() === programId;

      if (isOwner && isGame) {
        try {
          const reply = getDecodedPayload<TReply>(payload);
          console.log("inside update: ", { reply });

          return {
            data: reply,
            error: undefined,
          } as OnChangeStateReturnType;
        } catch (e) {
          console.log(e);
          alert.error((e as { message: string }).message);
        }
      }

      return {
        data: undefined,
        error: undefined,
      } as OnChangeStateReturnType;
    },
    [account?.decodedAddress, alert, getDecodedPayload, programId]
  );

  const subscribe = useCallback(
    (replyHandler?: (e?: TReply, error?: Error) => void) => {
      if (!api || messageSub.current) return;
      console.log("subscribed!");

      messageSub.current = api.gearEvents.subscribeToGearEvent(
        "UserMessageSent",
        (event: UserMessageSent) => {
          console.log("UserMessageSent: ", event);

          const { data, error } = onChangeState(event);
          replyHandler?.(data, error);
        }
      );
    },
    [api, onChangeState]
  );

  const unsubscribe = useCallback(() => {
    console.log("unsubscribed  :)");
    messageSub.current?.then((unsubCb) => {
      messageSub.current = null;
      unsubCb();
    });
  }, []);

  return {
    subscribe,
    unsubscribe,
    isSubscribed: messageSub.current != null,
  };
}
