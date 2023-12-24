import { Header } from "layouts/Header";
import { FC, ReactNode, memo, useEffect, useMemo } from "react";
import "./styles.scss";
import { useAccount, useReadWasmState } from "@gear-js/react-hooks";
import { useNavigate } from "react-router-dom";
import stateMetaWasm from "../../assets/mint_state.meta.wasm";
import { ProgramMetadata } from "@gear-js/api";
import { MINT_ID, METADATA } from "pages/MintCharacter/constants";
import { useWasmMetadata } from "../../pages/MintCharacter/hooks/useWasmMetadata";

export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    const { account, isAccountReady } = useAccount();
    const navigate = useNavigate();
    const { buffer } = useWasmMetadata(stateMetaWasm);
    const meta = ProgramMetadata.from(METADATA);

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
      };
      name: string;
    }>(metaWasmData);

    useEffect(() => {
      if (charInfo.state) {
        localStorage.setItem("charInfo", JSON.stringify(charInfo.state));
      }
    }, [charInfo.state]);

    useEffect(() => {
      if (!isAccountReady) {
        return; // do not do anything until account is ready
      }
      if (!account) {
        navigate("/");
      }
    }, [account, isAccountReady, navigate]);

    return (
      <div className="app">
        <Header />
        <div className="content">{children}</div>
      </div>
    );
  }
);
