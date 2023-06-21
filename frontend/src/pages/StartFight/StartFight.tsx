import './styles.scss';
import ArenaPng from '../../assets/images/arena.png';
import Select from 'react-select';
import { useAccount, useSendMessage } from '@gear-js/react-hooks';
import { getProgramMetadata } from '@gear-js/api';
import { memo, useEffect, useMemo, useState } from 'react';

import userIcon from '../../assets/svg/user.svg';
import { CustomOption } from 'components/CustomOption';
import { SelectControl } from 'components/SelectControl';
import { ARENA_ID, METADATA } from './constants';
import { Button } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { userStore } from 'model/user';
export const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
];

export const StartFight = memo(() => {
  const meta = useMemo(() => getProgramMetadata(METADATA), []);
  const send = useSendMessage(ARENA_ID, meta);
  const [user, setUser] = useState(undefined);
  const userName = useStore(userStore.$user);
  const { account } = useAccount();

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate('/arena/queue');
    send(
      {
        Register: {
          owner_id: account.decodedAddress,
        },
      },
      {
        onSuccess: () => {
          console.log('success');
        },
        onError: () => {
          console.log('error');
        },
      }
    );
  };

  return (
    <div className='arena'>
      <div className='arena_modal'>
        <img className='arena_img' src={ArenaPng} />
        <p className='arena_title'>Enter the Arena</p>
        <div className='arena_select_wrapper'>
          <p>Select your character</p>
          <Select
            className='arena_select'
            onClick={(user) => setUser(user)}
            //@ts-ignore
            icon={<img className='arena_user_icon' src={userIcon} />}
            //@ts-ignore
            components={{ Control: SelectControl, Option: CustomOption }}
            isSearchable
            name='user'
            options={[
              {
                value: userName || localStorage.getItem('name'),
                label: userName || localStorage.getItem('name'),
              },
            ]}
            selectedUser={user}
          />
        </div>
        <Button onClick={handleSubmit} disabled={!user}>
          Start fight
        </Button>
      </div>
    </div>
  );
});
