import { useWasmMetadata } from "./../../MintCharacter/hooks/useWasmMetadata";
import { useCallback, useMemo } from "react";
import { ARENA_PROGRAM_ID, ARENA_METADATA } from "consts";
import {
  useAccount,
  useReadWasmState,
  useSendMessage,
} from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import arenaMetaWasm from "../../../assets/arena.opt.wasm";
import { MAX_GAS_LIMIT } from "consts";

export const useOnRegisterForBattle = () => {
  const { account } = useAccount();

  const { buffer } = useWasmMetadata(arenaMetaWasm);

  const meta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);
  const send = useSendMessage(ARENA_PROGRAM_ID, meta, { isMaxGasLimit: true });

  const arenaMetaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: ARENA_PROGRAM_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "registered",
      argument: account?.decodedAddress,
    }),
    [account?.decodedAddress, meta, buffer]
  );

  const registered = useReadWasmState<
    Array<{
      attributes: {
        strength: string;
        agility: string;
        vitality: string;
        stamina: string;
      };
      energy: string;
      hp: string;
      id: string;
      name: string;
      owner: string;
      position: string;
    }>
  >(arenaMetaWasmData).state;
  console.log(`registered`, registered);
  return useCallback(
    async ({ lobbyId }: { lobbyId: string }) => {
      return new Promise(async (resolve, reject) => {
        send({
          payload: {
            Register: {
              owner_id: account?.decodedAddress,
              lobby_id: lobbyId,
            },
          },
          gasLimit: MAX_GAS_LIMIT,
          onSuccess: () => {
            console.log('"Register" message successfully sent');
            resolve(undefined);
          },
          onError: () => {
            console.log("error");
            reject();
          },
        });
      });
    },
    [account?.decodedAddress, send]
  );
};
