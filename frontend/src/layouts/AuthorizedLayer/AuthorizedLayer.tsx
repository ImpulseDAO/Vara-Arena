import { Header } from "layouts/Header";
import { FC, ReactNode, memo } from "react";
import "./styles.scss";
import { StartFight } from "pages/StartFight";

export type AuthorizedLayerProps = {
  children: ReactNode;
};

export const AuthorizedLayer: FC<AuthorizedLayerProps> = memo(
  ({ children }) => {
    return (
      <div className="app">
        <Header />
        <div className="content">{children}</div>
      </div>
    );
  }
);
