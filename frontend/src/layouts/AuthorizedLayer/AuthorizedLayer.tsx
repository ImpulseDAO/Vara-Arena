import { Header } from "layouts/Header";
import { FC, ReactNode, memo, useEffect } from "react";
import "./styles.scss";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { useNavigate } from "react-router-dom";
import { useWasmMetadata } from "pages/Queue";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { MINT_ID } from "pages/MintCharacter/constants";

export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    const { account } = useAccount();
    const navigate = useNavigate();
    const { buffer } = useWasmMetadata(stateMetaWasm);

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

    console.log("charInfo", charInfo);

    useEffect(() => {
      if (charInfo.state) {
        localStorage.setItem("charInfo", JSON.stringify(charInfo.state));
      }
    }, [charInfo.state]);

    useEffect(() => {
      if (!account) {
        navigate("/");
      }
    }, [account, navigate]);

    return (
      <div className="app">
        <Header />
        <div className="content">{children}</div>
      </div>
    );
  }
);
