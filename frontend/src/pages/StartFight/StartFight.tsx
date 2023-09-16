import { memo, useState, useMemo } from "react";
import { useStore } from "effector-react";
import { userStore } from "model/user";
import { ProgramMetadata } from "@gear-js/api";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { StartFightView } from "./components/StartFightView";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { MINT_ID, METADATA } from "pages/MintCharacter/constants";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { useWasmMetadata } from "../MintCharacter/hooks/useWasmMetadata";
import { MetaWasmDataType } from "app/types/metaWasmDataType";

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
];

export const StartFight = memo(() => {
  const [user, setUser] = useState(undefined);
  const { account } = useAccount();
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);

  // const charInfo = JSON.parse(localStorage.getItem("charInfo"));
  const handleSubmit = useOnSubmit();

  const metaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: MINT_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "character_info",
      argument: account?.decodedAddress,
    }),
    [account?.decodedAddress, meta, buffer]
  );

  console.log("metaWasmData :>> ", metaWasmData);

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
    name: string;
  }>(metaWasmData);

  return (
    <StartFightView
      name={charInfo?.state?.name ?? ""}
      setUser={setUser}
      user={user}
      handleSubmit={handleSubmit}
    />
  );
});
