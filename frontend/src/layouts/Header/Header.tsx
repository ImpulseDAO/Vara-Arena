import { Wallet } from "components/wallet";
import { FC, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.scss";
import { useAccount, useApi, useBalance, useBalanceFormat } from "@gear-js/react-hooks";
import { AccountsModal } from "components/AccountsModal";
import { newRoutes } from "app/routes";

export type HeaderProps = {};

const navLinks = [
  {
    name: "Arena",
    path: newRoutes.arena,
  },
  {
    name: "History",
    path: newRoutes.history,
  },
  /**
   * HIDE LEADERBOARD UNTIL IT IS READY
   */
  // {
  //   name: "Leaderboard",
  //   path: newRoutes.leaderboard,
  // },
  {
    name: "My Profile",
    path: newRoutes.myProfile,
  },
];

export const Header: FC<HeaderProps> = () => {
  const { isApiReady } = useApi();
  const { account, isAccountReady } = useAccount();
  const decodedAddress = account?.decodedAddress;
  const balance = useBalance(decodedAddress).balance?.toString() ?? '';
  const balanceFormat = useBalanceFormat();
  const [visible, toggle] = useReducer((state) => !state, false);
  const navigate = useNavigate();

  if (!isAccountReady || !isApiReady) return null;
  // we should wait until api is ready, thats why this line is below "if" block
  const { value: balanceValue, unit: balanceUnit } = balanceFormat.getFormattedBalance(balance);

  return (
    <div className="header">
      <p className={"header_title"} onClick={() => navigate(newRoutes.arena)}>
        Arena
      </p>

      <div className={"header_nav"}>
        {navLinks.map(({ name, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {name}
          </NavLink>
        ))}
      </div>
      <div className="wallet_wrapper" >
        {account && <Wallet
          balance={balanceValue}
          unit={balanceUnit}
          address={account.address}
          name={account.meta.name}
          onClick={toggle}
        />}
      </div>
      {visible && (
        <AccountsModal
          close={toggle}
          account={account}
        />
      )}
    </div>
  );
};
