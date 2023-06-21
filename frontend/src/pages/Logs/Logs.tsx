import {FC, useCallback, useMemo} from 'react';
import './styles.scss';
import { TableUI } from 'components/Table';
import { TableColumnsType } from 'components/Table/types';
import AvatarIcon from '../../assets/images/avatar.png';
import {Button} from "../../components/Button";
import {useNavigate} from "react-router-dom";
export type LogsProps = {};
const inProgressColumns: TableColumnsType[] = [
  {
    field: 'battleId',
    headerName: 'Battle ID',
    width: 142,
      position: 'center',
  },
  {
    field: 'id',
    headerName: 'Player ID',
    width: 248,
      position: 'center',
  },
  {
    field: 'level',
    headerName: 'Level',
    width: 183,
      position: 'center',
  },
    {
        field: 'status',
        headerName: 'Status',
        width: 192,
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
        status: 'WON',
      level: <span className='row_lvl'>12</span>,
      battleId: <div className={'row_position'}>93912939</div>
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
        status: 'LOSE',
      level: <span className='row_lvl'>412</span>,
      battleId: <div className={'row_position'}>32131231</div>
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
        status: 'WON',
      level: <span className='row_lvl'>312</span>,
      battleId: <div className={'row_position'}>213213231</div>
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
        status: 'WON',
      level: <span className='row_lvl'>4</span>,
      battleId: <div className={'row_position'}>93912939</div>
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
        status: 'LOSE',
      level: <span className='row_lvl'>5</span>,
      battleId: <div className={'row_position'}>32131231</div>
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
        status: 'WON',
      level: <span className='row_lvl'>26</span>,
      battleId: <div className={'row_position'}>213213231</div>
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
        status: 'WON',
      level: <span className='row_lvl'>99</span>,
      battleId: <div className={'row_position'}>93912939</div>
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
        status: 'LOSE',
      level: <span className='row_lvl'>13</span>,
      battleId: <div className={'row_position'}>32131231</div>
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
        status: 'WON',
      level: <span className='row_lvl'>21</span>,
      battleId: <div className={'row_position'}>213213231</div>
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
          status: 'WON',
          level: <span className='row_lvl'>21</span>,
          battleId: <div className={'row_position'}>93912939</div>
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
          status: 'LOSE',
          level: <span className='row_lvl'>21</span>,
          battleId: <div className={'row_position'}>32131231</div>
      },
  ];
};

export const Logs: FC<LogsProps> = ({}) => {
  const inProgressRows = useMemo(() => getRows(), []);
    const navigate = useNavigate();
    const goBack = useCallback(() => {
        navigate('/arena');
    }, [navigate]);

  return (
    <div className='logs'>
        <Button className={'back_button'} onClick={goBack}>← Back</Button>
      <div className='modal_leaderboard'>
        <div className='header'>My logs</div>
          <div className={'scroll_container'}>
            <div className='modal_table'>
              <TableUI rows={inProgressRows} columns={inProgressColumns} />
            </div>
          </div>
      </div>
    </div>
  );
};
