import {FC, useCallback, useEffect, useMemo} from 'react';
import './styles.scss';
import { TableUI } from 'components/Table';
import { TableColumnsType } from 'components/Table/types';
import AvatarIcon from '../../assets/images/avatar.png';
import {Button} from "../../components/Button";
import {useNavigate} from "react-router-dom";
export type LeaderboardProps = {};
const inProgressColumns: TableColumnsType[] = [
  {
    field: 'position',
    headerName: 'Position',
    width: 86,
    position: 'center',
  },
  {
    field: 'id',
    headerName: 'Player ID',
    width: 304,
    position: 'center',
  },
  {
    field: 'level',
    headerName: 'Level',
    width: 192,
    position: 'center',
  },
    {
        field: 'NB',
        headerName: 'Number of battles',
        width: 183,
        position: 'center',
},
];

const getRows = () => {
  return [
    {
      id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>Blaze Vanguard</p>
            <p className='row_id'>@user2319</p>
          </div>
        </div>
      ),
      NB: '413',
      level: <span className='row_lvl'>12</span>,
      position: <div className={'row_position'}>#1</div>
    },
    {
      id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>Mystic Marauder</p>
            <p className='row_id'>@user341</p>
          </div>
        </div>
      ),
      NB: '413',
      level: <span className='row_lvl'>412</span>,
      position: <div className={'row_position'}>#2</div>
    },
    {
      id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>Mystic Marauder</p>
            <p className='row_id'>@user341</p>
          </div>
        </div>
      ),
      NB: '12',
      level: <span className='row_lvl'>312</span>,
      position: <div className={'row_position'}>#3</div>
    },
    {
      id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>Mystic Marauder</p>
            <p className='row_id'>@user341</p>
          </div>
        </div>
      ),
      NB: '413',
      level: <span className='row_lvl'>4</span>,
      position: <div className={'row_position'}>#4</div>
    },
    {
      id: (
          <div className='row_player'>
            <img src={AvatarIcon} />
            <div>
              <p className='row_name'>Mystic Marauder</p>
              <p className='row_id'>@user341</p>
            </div>
          </div>
      ),
      NB: '45',
      level: <span className='row_lvl'>5</span>,
      position: <div className={'row_position'}>#5</div>
    },
    {
      id: (
          <div className='row_player'>
            <img src={AvatarIcon} />
            <div>
              <p className='row_name'>Mystic Marauder</p>
              <p className='row_id'>@user341</p>
            </div>
          </div>
      ),
      NB: '45',
      level: <span className='row_lvl'>26</span>,
      position: <div className={'row_position'}>#6</div>
    },
    {
      id: (
          <div className='row_player'>
            <img src={AvatarIcon} />
            <div>
              <p className='row_name'>Mystic Marauder</p>
              <p className='row_id'>@user341</p>
            </div>
          </div>
      ),
      NB: '45',
      level: <span className='row_lvl'>99</span>,
      position: <div className={'row_position'}>#7</div>
    },
    {
      id: (
          <div className='row_player'>
            <img src={AvatarIcon} />
            <div>
              <p className='row_name'>Shadow Sentinel</p>
              <p className='row_id'>@user623</p>
            </div>
          </div>
      ),
      NB: '12',
      level: <span className='row_lvl'>13</span>,
      position: <div className={'row_position'}>#8</div>
    },
    {
      id: (
          <div className='row_player'>
            <img src={AvatarIcon} />
            <div>
              <p className='row_name'>Shadow Sentinel</p>
              <p className='row_id'>@user623</p>
            </div>
          </div>
      ),
      NB: '12',
      level: <span className='row_lvl'>21</span>,
      position: <div className={'row_position'}>#9</div>
    },
      {
          id: (
              <div className='row_player'>
                  <img src={AvatarIcon} />
                  <div>
                      <p className='row_name'>Shadow Sentinel</p>
                      <p className='row_id'>@user623</p>
                  </div>
              </div>
          ),
          NB: '12',
          level: <span className='row_lvl'>21</span>,
          position: <div className={'row_position'}>#10</div>
      },
      {
          id: (
              <div className='row_player'>
                  <img src={AvatarIcon} />
                  <div>
                      <p className='row_name'>Shadow Sentinel</p>
                      <p className='row_id'>@user623</p>
                  </div>
              </div>
          ),
          NB: '12',
          level: <span className='row_lvl'>21</span>,
          position: <div className={'row_position'}>#11</div>
      },
  ];
};

export const Leaderboard: FC<LeaderboardProps> = ({}) => {
  const inProgressRows = useMemo(() => getRows(), []);
  const navigate = useNavigate();
  const goBack = useCallback(() => {
       navigate('/arena');
   }, [navigate]);

    return (
    <div className='leaderboard'>
        <Button className={'back_button'} onClick={goBack}>← Back</Button>
      <div className='modal_leaderboard'>
        <div className='header'>Leaderboard</div>
          <div className={'scroll_container'}>
            <div className='modal_table'>
              <TableUI rows={inProgressRows} columns={inProgressColumns} />
            </div>
          </div>
      </div>
    </div>
  );
};
