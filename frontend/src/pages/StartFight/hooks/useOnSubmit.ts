import { useWasmMetadata } from "./../../MintCharacter/hooks/useWasmMetadata";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ARENA_ID, METADATA } from "../constants";
import {
  useAccount,
  useAlert,
  useReadWasmState,
  useSendMessage,
} from "@gear-js/react-hooks";
import { ProgramMetadata } from "@gear-js/api";
import arenaMetaWasm from "../../../assets/arena_state.meta.wasm";

export const useOnSubmit = (): VoidFunction => {
  const navigate = useNavigate();
  const { account } = useAccount();
  const alert = useAlert();

  const { buffer } = useWasmMetadata(arenaMetaWasm);

  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);
  const send = useSendMessage(ARENA_ID, meta, { isMaxGasLimit: true });

  const arenaMetaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: ARENA_ID,
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
  return useCallback(() => {
    if (registered !== undefined) {
      navigate("/tournament");
      if (registered.length < 2) {
        send({
          payload: {
            Register: {
              owner_id: account.decodedAddress,
            },
          },
          gasLimit: Infinity,
          onSuccess: () => {
            console.log("success");
          },
          onError: () => {
            console.log("error");
          },
        });
      } else {
        alert.error("Max tournament players = 2, work in progress 🏗");
      }
    }
  }, [account?.decodedAddress, navigate, send]);
};
