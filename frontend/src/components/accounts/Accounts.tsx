import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccount } from '@gear-js/react-hooks';
import { isLoggedIn } from 'utils';
import { LOCAL_STORAGE } from 'consts';
import { AccountButton } from '../accountButton';
import styles from './Accounts.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  list: InjectedAccountWithMeta[];
};

function Accounts({ list }: Props) {
  const [isClicked, setIsClicked] = useState(false);
  const { login, account } = useAccount();
  const isAnyAccount = list.length > 0;
  const navigate = useNavigate();

  const handleAccountButtonClick = (account: InjectedAccountWithMeta) => {
    setIsClicked(true);
    login(account);
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, account.address);
  };

  useEffect(() => {
    if (isClicked && account) {
      navigate('/mint-character');
    }
  }, [isClicked, account]);

  const getAccounts = () =>
    list.map((account) => (
      <AccountButton
        key={account.address}
        address={account.address}
        name={account.meta.name}
        isActive={isLoggedIn(account)}
        onClick={() => handleAccountButtonClick(account)}
        block
      />
    ));

  return isAnyAccount ? (
    <div className={styles.list}>{getAccounts()}</div>
  ) : (
    <p>
      No accounts found. Please open Polkadot extension, create a new account or
      import existing one and reload the page.
    </p>
  );
}

export { Accounts };
