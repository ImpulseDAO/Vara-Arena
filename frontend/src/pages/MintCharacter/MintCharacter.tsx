import { ChangeEvent, FC, memo, useCallback, useMemo, useState } from 'react';
import './styles.scss';
import { Input } from '../../components';
import Table from '@mui/material/Table';
import LockSvg from '../../assets/svg/lock.svg';
import CharSvg from '../../assets/svg/char.svg';

import './styles.scss';
import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';
import { StatBar } from '../../components/StatBar';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSendMessage } from '@gear-js/react-hooks';
import { getProgramMetadata } from '@gear-js/api';
import { METADATA, MINT_ID } from './constants';
import { useUnit } from 'effector-react';
import { userStore } from 'model/user';

export type MintCharacterProps = {};

export const MintCharacter: FC<MintCharacterProps> = memo(() => {
  const [name, setName] = useState('');
  const [codeId, setCodeId] = useState(
    '0x313919bb00afbd3f03cc0dec4046bb87ab1d6569d7eeab601abdaee913a0043e'
  );

  const setUserName = useUnit(userStore.setName);

  const [stats, setStats] = useState({
    strength: 6,
    agility: 1,
    vitality: 1,
    stamina: 1,
    points: 0,
  });

  const increase = (name) => {
    if (stats.points > 0) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: prevStats[name] + 1,
        points: prevStats['points'] - 1,
      }));
    }
  };
  const decrease = (name) => {
    if (stats[name] > 1) {
      setStats((prevStats) => ({
        ...prevStats,
        [name]: prevStats[name] - 1,
        points: prevStats['points'] + 1,
      }));
    }
  };

  const onChangeInput = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setName(target.value);
    },
    []
  );

  const handleCodeId = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setCodeId(target.value);
    },
    []
  );

  const meta = useMemo(() => getProgramMetadata(METADATA), []);
  const send = useSendMessage(MINT_ID, meta);
  const { account } = useAccount();
  const navigate = useNavigate();

  const handleSubmit = () => {
    setUserName(name);
    localStorage.setItem('name', name);
    send(
      {
        CreateCharacter: {
          code_id: codeId,
          name: name,
          attributes: stats,
        },
      },
      {
        onSuccess: () => {
          navigate('/arena');
        },
        onError: () => {
          console.log('error');
        },
      }
    );
  };

  // CharacterInfo: {
  //   owner_id:
  //     '0x3881129057a7e85c4f0e039147f7c1f70acc8a52bebf86b108a67f7bdf5a565f',
  // },
  const onClickMint = () => {};
  const onClickCancel = () => {};

  return (
    <div className='mint_char'>
      <Table className={'table_container'}>
        <div className={'table_header'}>Mint character to proceed</div>
        <div className={'modal'}>
          <div className={'top_wrapper'}>
            <div className={'char_info'}>
              Character info{' '}
              <a href='https://impulse-dao.gitbook.io/impulse-dao/games-for-developers/arena'>
                [?]
              </a>
            </div>
            <Input
              className={'input_container'}
              onChange={onChangeInput}
              value={name}
              placeholder='Enter character name'
            />
            <Input
              className={'input_container'}
              onChange={handleCodeId}
              value={codeId}
              placeholder='Enter code id'
            />
          </div>
          <ButtonGroup
            leftText={'Strength'}
            firstButton={'-'}
            secondButton={stats.strength}
            thirdButton={'+'}
            onClickSecondButton={() => {}}
            onClickFirstButton={() => decrease('strength')}
            onClickThirdButton={() => increase('strength')}
          />
          <ButtonGroup
            leftText={'Agility'}
            firstButton={'-'}
            secondButton={stats.agility}
            thirdButton={'+'}
            onClickSecondButton={() => {}}
            onClickFirstButton={() => decrease('agility')}
            onClickThirdButton={() => increase('agility')}
          />
          <ButtonGroup
            leftText={'Vitality'}
            firstButton={'-'}
            secondButton={stats.vitality}
            thirdButton={'+'}
            onClickSecondButton={() => {}}
            onClickFirstButton={() => decrease('vitality')}
            onClickThirdButton={() => increase('vitality')}
          />
          <ButtonGroup
            leftText={'Stamina'}
            firstButton={'-'}
            secondButton={stats.stamina}
            thirdButton={'+'}
            onClickSecondButton={() => {}}
            onClickFirstButton={() => decrease('stamina')}
            onClickThirdButton={() => increase('stamina')}
          />
          <div className={'points'}>
            Points left:<span>{stats.points}</span>{' '}
          </div>
        </div>
        <div className={'modal_right'}>
          <StatBar
            health={stats.vitality * 30 + 10}
            stamina={
              [0, 110, 120, 130, 140, 150, 160, 170, 180, 190][stats.stamina]
            }
          />
          <div className={'imgWrapper'}>
            <img className={'lock_img1'} src={LockSvg} />
            <img className={'lock_img2'} src={LockSvg} />
            <img className={'lock_img3'} src={LockSvg} />
            <img className={'lock_img4'} src={LockSvg} />
            <img className={'lock_img5'} src={LockSvg} />
            <img className={'char_svg'} src={CharSvg} />
            <img className={'lock_img6'} src={LockSvg} />
            <img className={'lock_img7'} src={LockSvg} />
            <img className={'lock_img8'} src={LockSvg} />
            <img className={'lock_img9'} src={LockSvg} />
          </div>
        </div>
        <div className={'buttonWrapper'}>
          <Button className={'cancelButton'} onClick={onClickCancel}>
            Cancel
          </Button>
          <Button
            className={'mintButton'}
            onClick={handleSubmit}
            disabled={!!stats.points || !name}
          >
            Mint character
          </Button>
        </div>
      </Table>
    </div>
  );
});
