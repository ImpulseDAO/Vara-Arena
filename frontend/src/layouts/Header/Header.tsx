import { Wallet } from "components/wallet";
import { FC, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.scss";
import { useAccount, useApi, useBalance, useBalanceFormat } from "@gear-js/react-hooks";
import { AccountsModal } from "components/AccountsModal";
import { newRoutes } from "app/routes";
import { DiscordLogo } from "components/Icons";
import { Anchor, Box, Flex } from "@mantine/core";
import { staticRoutes } from "app/routes/routes";

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
  {
    name: "Leaderboard",
    path: newRoutes.leaderboard,
  },
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
    <div className="header" >
      <a
        href={staticRoutes.discord}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex
          className="header_join_community"
          gap={'sm'}
          style={{ cursor: 'pointer' }}
          align={'center'}
        >
          <DiscordLogo className="transition" width={'30px'} height={'30px'} display={'inline'} />
          <span className="transition">Join Community</span>
        </Flex>
      </a>

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
