import { Modal } from "@gear-js/ui";
import { Accounts } from "../accounts";
import { useAccount } from "@gear-js/react-hooks";
import { Account } from "@gear-js/react-hooks/dist/esm/types";
import styles from "./AccountsModal.module.scss";
import { memo } from "react";

type Props = {
  close: () => void;
  account?: Account;
};

export const AccountsModal = memo(({ close, account }: Props) => {
  const { accounts, logout } = useAccount();
  return (
    <Modal heading="Connect" close={close}>
      {accounts ? (
        <Accounts close={close} list={accounts} />
      ) : (
        <p>
          Wallet extension was not found or disconnected. Please check how to
          install a supported wallet and create an account{" "}
          <a
            href="https://wiki.gear-tech.io/docs/idea/account/create-account"
            target="_blank"
            rel="noreferrer"
            className="link-text"
          >
            here
          </a>
        </p>
      )}
      {account ? (
        <div className={styles.footer}>
          <div className={styles.logout} onClick={logout}>
            logout
          </div>
        </div>
      ) : null}
    </Modal>
  );
});
