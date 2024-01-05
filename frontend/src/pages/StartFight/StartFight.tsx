import { memo, useState, useMemo, useEffect } from "react";
import { ProgramMetadata } from "@gear-js/api";
import { useOnRegisterForBattle } from "./hooks/useOnSubmit";
import { StartFightView } from "./components/StartFightView";
import { useAccount, useAlert, useReadWasmState } from "@gear-js/react-hooks";
import stateMetaWasm from "../../assets/mint.opt.wasm";
import { useWasmMetadata } from "../MintCharacter/hooks/useWasmMetadata";
import { ARENA_PROGRAM_ID, ARENA_METADATA, MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import arenaMetaWasm from "../../assets/arena.opt.wasm";
import { useParams } from "react-router-dom";
import { useMyCharacter } from "app/api/characters";

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
];

export const StartFight = memo(() => {
  const alert = useAlert();
  const { lobbyId } = useParams<{ lobbyId: string | undefined; }>();

  /**
   * Get user
   */
  const [user, setUser] = useState<typeof character>();
  const { data: character } = useMyCharacter();
  useEffect(() => {
    if (character) {
      setUser(character);
    }

  }, [character]);

  const { account } = useAccount();
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const { buffer: arenaMetaBuffer } = useWasmMetadata(arenaMetaWasm);

  const meta = useMemo(() => ProgramMetadata.from(MINT_METADATA), []);
  const arenaMeta = useMemo(() => ProgramMetadata.from(ARENA_METADATA), []);

  const metaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: MINT_PROGRAM_ID,
      programMetadata: meta,
      wasm: buffer,
      functionName: "character_info",
      argument: account?.decodedAddress,
    }),
    [account?.decodedAddress, meta, buffer]
  );

  const arenaMetaWasmData: MetaWasmDataType = useMemo(
    () => ({
      programId: ARENA_PROGRAM_ID,
      programMetadata: arenaMeta,
      wasm: arenaMetaBuffer,
      functionName: "registered",
      argument: account?.decodedAddress,
    }),
    [account?.decodedAddress, arenaMeta, arenaMetaBuffer]
  );

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

  const registerForBattle = useOnRegisterForBattle();
  const handleSubmit = () => {

    if (!lobbyId) {
      const message = "lobbyId is not defined";
      console.error(message);
      alert.error(message);
      return;
    }
    console.log('registerForBattle called with lobbyId: ', lobbyId);
    registerForBattle({ lobbyId });
  };

  return (
    <StartFightView
      name={charInfo?.state?.name ?? ""}
      setUser={setUser}
      user={user}
      handleSubmit={handleSubmit}
    />
  );
});
