import { FC, memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { useUnit } from "effector-react";
import { userStore } from "model/user";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { MintCharacterView } from "./components/MintCharacterView";
import { useWasmMetadata } from "./hooks/useWasmMetadata";
import { MINT_ID } from "./constants";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { useStats } from "./hooks/useStats";
import { useOnChange } from "./hooks/useOnChange";

export type MintCharacterProps = {};

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const setUserName = useUnit(userStore.setName);
  const { account } = useAccount();
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
  const [data, setData] = useState({
    codeId:
      "0x4b3f39e1e28263eebcde5423e75421dd18daf35dc3059e4a8f9b54d673a7f9a9",
    name: "",
  });

  const navigate = useNavigate();

  const { decrease, increase, stats } = useStats();
  const onSubmit = useOnSubmit({ ...data, stats });
  const onChangeInput = useOnChange(setData);

  useEffect(() => {
    if (charInfo.state) {
      setUserName(charInfo.state);
      navigate("/arena");
    }
  }, [charInfo, setUserName, navigate, data.name]);

  return (
    <MintCharacterView
      codeId={data.codeId}
      name={data.name}
      disabled={!!stats.points || !data.name}
      decrease={decrease}
      increase={increase}
      onChange={onChangeInput}
      onSubmit={onSubmit}
      stats={stats}
    />
  );
});
