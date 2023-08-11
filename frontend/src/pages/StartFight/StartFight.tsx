import { memo, useState } from "react";
import { useStore } from "effector-react";
import { userStore } from "model/user";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { StartFightView } from "./components/StartFightView";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { MINT_ID } from "pages/MintCharacter/constants";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { useWasmMetadata } from "../MintCharacter/hooks/useWasmMetadata";

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
];

export const StartFight = memo(() => {
  const [user, setUser] = useState(undefined);
  const { account } = useAccount();
  const { buffer } = useWasmMetadata(stateMetaWasm);
  // const charInfo = JSON.parse(localStorage.getItem("charInfo"));
  const handleSubmit = useOnSubmit();

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
    name: string;
  }>(MINT_ID, buffer, "character_info", account?.decodedAddress);
  console.log("charInfo", charInfo, account?.decodedAddress);

  return (
    <StartFightView
      name={charInfo?.state?.name ?? ""}
      setUser={setUser}
      user={user}
      handleSubmit={handleSubmit}
    />
  );
});
