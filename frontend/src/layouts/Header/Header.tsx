import { Wallet } from "components/wallet";
import { FC, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.scss";
import { useAccount, useBalance } from "@gear-js/react-hooks";
import { AccountsModal } from "components/AccountsModal";

export type HeaderProps = {};

export const Header: FC<HeaderProps> = () => {
  const { account, isAccountReady } = useAccount();
  const decodedAddress = account?.decodedAddress;
  const balance = useBalance(decodedAddress).balance?.toString() ?? '';
  const [visible, toggle] = useReducer((state) => !state, false);
  const [userChoosed, userChoose] = useReducer((state) => !state, false);
  const navigate = useNavigate();

  if (!isAccountReady) return null;

  return (
    <div className="header">
      <p className={"header_title"} onClick={() => navigate("/arena")}>
        Arena
      </p>

      <div className={"header_nav"}>
        <NavLink
          to="/mint-character"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Create New
        </NavLink>
        <NavLink
          to="/tournament"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Tournament
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Leaderboard
        </NavLink>
        <NavLink
          to={`/profile/${account?.decodedAddress}`}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          My profile
        </NavLink>
      </div>
      {account && (
        <div className="wallet_wrapper">
          <Wallet
            balance={balance}
            address={account.address}
            name={account.meta.name}
            onClick={toggle}
          />
        </div>
      )}
      {visible && (
        <AccountsModal
          close={toggle}
          userChoose={userChoose}
          account={account}
        />
      )}
    </div>
  );
};
