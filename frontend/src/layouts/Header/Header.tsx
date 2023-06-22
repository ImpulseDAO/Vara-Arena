import { Wallet } from "components/wallet";
import { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.scss";
import { useAccount } from "@gear-js/react-hooks";

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const { account, logout } = useAccount();
  const navigate = useNavigate();

  return (
    <div className="header">
      <p
        className={"header_title"}
        onClick={() => {
          navigate("/");
          logout();
        }}
      >
        Arena
      </p>

      <div className={"header_nav"}>
        <NavLink
          to="/arena"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Arena
        </NavLink>
        <NavLink
          to="/logs"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          My logs
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Leaderboard
        </NavLink>
        <NavLink
          to="/my_profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          My profile
        </NavLink>
      </div>
      {account && (
        <Wallet
          balance={account.balance}
          address={account.address}
          name={account.meta.name}
        />
      )}
    </div>
  );
};
