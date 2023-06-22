import { FC, memo, useEffect, useReducer, useState } from "react";
import "./styles.scss";
import { Button } from "components/Button";
import { AccountsModal } from "components/AccountsModal";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { useAccount, useAlert, useReadWasmState } from "@gear-js/react-hooks";
import { useUnit } from "effector-react";
import { userStore } from "model/user";
import { MINT_ID } from "pages/MintCharacter/constants";
import { useNavigate } from "react-router-dom";

export const useWasmMetadata = (source: RequestInfo | URL) => {
  const alert = useAlert();
  const [data, setData] = useState<Buffer>();

  useEffect(() => {
    if (source) {
      fetch(source)
        .then((response) => response.arrayBuffer())
        .then((array) => Buffer.from(array))
        .then((buffer) => setData(buffer))
        .catch(({ message }: Error) => alert.error(`Fetch error: ${message}`));
    }
  }, [source]);

  return { buffer: data };
};

export type StartScreenProps = {};

export const StartScreen: FC<StartScreenProps> = memo(() => {
  const [visible, toggle] = useReducer((state) => !state, false);
  const [userChoosed, userChoose] = useReducer((state) => !state, false);
  const { buffer } = useWasmMetadata(stateMetaWasm);
  const setUserName = useUnit(userStore.setName);
  const { account } = useAccount();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (account && userChoosed) {
      if (!charInfo.state) {
        navigate("/mint-character");
      } else {
        navigate("/arena");
        setUserName(charInfo.state);
      }
    }
  }, [
    account,
    charInfo.isStateRead,
    charInfo.state,
    setUserName,
    navigate,
    userChoosed,
  ]);

  return (
    <div className="scr_start">
      <p>Arena</p>
      <Button onClick={toggle}>Connect wallet to enter the Arena</Button>
      {visible && <AccountsModal close={toggle} userChoose={userChoose} />}
    </div>
  );
});
