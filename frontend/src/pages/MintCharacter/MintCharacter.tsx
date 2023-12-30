import { FC, memo, useEffect, useState, useMemo } from "react";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { useUnit } from "effector-react";
import { ProgramMetadata } from "@gear-js/api";
import { userStore } from "model/user";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { MintCharacterView } from "./components/MintCharacterView";
import { useWasmMetadata } from "./hooks/useWasmMetadata";
import { MINT_ID, METADATA } from "./constants";
import { useOnSubmit } from "./hooks/useOnSubmit";
import { useStats } from "./hooks/useStats";
import { useOnChange } from "./hooks/useOnChange";
import React from "react";
import {
  addCodeIdToLocalStorage,
  getCodeIdsFromLocalStorage,
} from "hooks/useUploadCode";

export type MintCharacterProps = {};

export const STRATEGY_CODE_ID_HARDCODED =
  "0x25c002d7c488d8117a6c003c3ed04f11da6eb95f912dda39e31c4a634cd1f79f";

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const setUserName = useUnit(userStore.setName);
  const { account } = useAccount();
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);

  const metaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: MINT_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "character_info",
      argument: account?.decodedAddress,
    }),
    [meta, buffer, account?.decodedAddress]
  );

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
      intelligence: string;
    };
    name: string;
  }>(metaWasmData);

  const [data, setData] = useState({
    codeId: getCodeIdsFromLocalStorage()[0] ?? "",
    name: "",
  });

  React.useEffect(() => {
    const codeIdsArr = getCodeIdsFromLocalStorage();
    if (codeIdsArr.length === 0) {
      addCodeIdToLocalStorage(STRATEGY_CODE_ID_HARDCODED);
      setData((prev) => ({ ...prev, codeId: STRATEGY_CODE_ID_HARDCODED }));
    }
  }, []);

  const { decrease, increase, stats } = useStats();
  const onSubmit = useOnSubmit({ ...data, stats });
  const onChangeInput = useOnChange(setData);

  useEffect(() => {
    if (charInfo.state) {
      setUserName(charInfo.state);
    }
  }, [charInfo.state, setUserName]);

  return (
    <MintCharacterView
      codeId={data.codeId}
      setCodeId={(codeId) => setData({ ...data, codeId })}
      name={data.name}
      disabled={!!stats.points || !data.name}
      decrease={decrease}
      increase={increase}
      onChange={onChangeInput}
      onSubmit={onSubmit}
      onUploadCodeChange={(codeId) => setData({ ...data, codeId })}
      stats={stats}
    />
  );
});
