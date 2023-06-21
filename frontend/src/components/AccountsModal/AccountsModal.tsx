import { Modal } from '@gear-js/ui';
import { Accounts } from '../accounts';
import { useAccount } from '@gear-js/react-hooks';

type Props = {
  close: () => void;
};

export const AccountsModal = ({ close }: Props) => {
  const { accounts } = useAccount();
  return (
    <Modal heading='Connect' close={close}>
      {accounts ? (
        <Accounts list={accounts} />
      ) : (
        <p>
          Wallet extension was not found or disconnected. Please check how to
          install a supported wallet and create an account{' '}
          <a
            href='https://wiki.gear-tech.io/docs/idea/account/create-account'
            target='_blank'
            rel='noreferrer'
            className='link-text'
          >
            here
          </a>
        </p>
      )}
    </Modal>
  );
};
