import { AccountButton } from '../accountButton';
import styles from './Wallet.module.scss';

type Props = {
  balance: string,
  unit?: string,
  address: string;
  name: string | undefined;
  onClick?: () => void;
};

function Wallet({ balance, unit, address, name, onClick }: Props) {

  return (
    <div className={styles.wallet}>
      <div className={styles.balanceWrapper}>
        <p className={styles.balanceTitle}>Balance:</p>
        <p className={styles.balance}>
          <span className={styles.value}>{balance}</span>
          <span className={styles.currency}>{unit}</span>
        </p>
      </div>
      <AccountButton address={address} name={name} onClick={onClick} />
    </div>
  );
}

export { Wallet };
