import { FC, memo, useReducer } from 'react';
import './styles.scss';
import { Button } from 'components/Button';
import { AccountsModal } from 'components/AccountsModal';

export type StartScreenProps = {};

export const StartScreen: FC<StartScreenProps> = memo(() => {
  const [visible, toggle] = useReducer((state) => !state, false);

  return (
    <div className='scr_start'>
      <p>Arena</p>
      <Button onClick={toggle}>Connect wallet to enter the Arena</Button>
      {visible && <AccountsModal close={toggle} />}
    </div>
  );
});
