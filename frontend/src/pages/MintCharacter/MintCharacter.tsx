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
} from "hooks/useUploadCode/useUploadCode";

export type MintCharacterProps = {};

export const STRATEGY_CODE_ID_HARDCODED =
  "0xfb63a322fb1836b112fc102d9ae966e0614afdf80e9f19e231e4a28328d0a989";

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const setUserName = useUnit(userStore.setName);
  const { account } = useAccount();
  const meta = useMemo(() => ProgramMetadata.from(METADATA), []);

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
      vitality: string;
      stamina: string;
    };
    name: string;
  }>(
    {
      programId: MINT_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "character_info",
      argument: account?.decodedAddress
    });
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
