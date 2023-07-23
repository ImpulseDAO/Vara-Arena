import { Header } from "layouts/Header";
import { FC, ReactNode, memo, useEffect } from "react";
import "./styles.scss";
import { useAccount } from "@gear-js/react-hooks";
import { useNavigate } from "react-router-dom";

export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    const { account } = useAccount();
    const navigate = useNavigate();

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
