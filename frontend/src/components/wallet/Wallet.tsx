import { Account } from '@gear-js/react-hooks';
import { AccountButton } from '../accountButton';
import styles from './Wallet.module.scss';

type Props = {
  balance: Account['balance'];
  address: string;
  name: string | undefined;
  onClick?: () => void;
};

function Wallet({ balance, address, name, onClick }: Props) {
  return (
    <div className={styles.wallet}>
      <div className={styles.balanceWrapper}>
        <p className={styles.balanceTitle}>Balance:</p>
        <p className={styles.balance}>
          <span className={styles.value}>{balance.value}</span>
          <span className={styles.currency}>{balance.unit}</span>
        </p>
      </div>
      <AccountButton address={address} name={name} onClick={onClick} />
    </div>
  );
}

export { Wallet };
