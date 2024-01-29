import { memo, useState, useMemo, useEffect } from "react";
import { ProgramMetadata } from "@gear-js/api";
import { useOnRegisterForBattle } from "./hooks/useOnSubmit";
import { StartFightView } from "./components/StartFightView";
import { useAccount, useAlert, useReadWasmState } from "@gear-js/react-hooks";
import stateMetaWasm from "../../assets/mint.opt.wasm";
import { useWasmMetadata } from "../MintCharacter/hooks/useWasmMetadata";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
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

  const meta = useMemo(() => ProgramMetadata.from(MINT_METADATA), []);

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

  const charInfo = useReadWasmState<{
    id: string;
    attributes: {
      strength: string;
      agility: string;
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
