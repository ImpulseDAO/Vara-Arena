import './styles.scss';
import AvatarIcon from '../../assets/images/avatar.png';
import { useAllBattleLogs } from 'app/api/battleLogs';
import { getShortIdString } from 'utils';
import { Box, Table } from '@mantine/core';
import { newRoutes } from 'app/routes';
import { useNavigate } from 'react-router-dom';

export const Logs = () => {
  // const inProgressRows = useMemo(() => getRows(), []);
  const navigate = useNavigate();
  const { data: battleLogs } = useAllBattleLogs();

  const inProgressRows = battleLogs?.map((battleLog) => {
    const { id } = battleLog;

    console.log(battleLog);

    return ({
      player1_id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>{battleLog.lobby.characters[0].character.name}</p>
            <p className='row_id'>{getShortIdString(battleLog.lobby.characters[0].character.owner)}</p>
          </div>
        </div>
      ),
      player2_id: (
        <div className='row_player'>
          <img src={AvatarIcon} />
          <div>
            <p className='row_name'>{battleLog.lobby.characters[1].character.name}</p>
            <p className='row_id'>{getShortIdString(battleLog.lobby.characters[1].character.owner)}</p>
          </div>
        </div>
      ),
      status: 'WON',
      players: battleLog.lobby.characters,
      level: <span className='row_lvl'>12</span>,
      battleId: id
    });
  }) ?? [];


  return (
    <div className='logs'>
      <div className='modal_leaderboard'>
        <div className='header'>My logs</div>
        <div className='modal_table'>
          <Table horizontalSpacing="md" verticalSpacing="md">
            <thead>
              <tr>
                <th>Battle ID</th>
                <th>Players</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>{inProgressRows.map((row) => {
              return (
                <Box
                  onClick={() => {
                    navigate(newRoutes.battleResult(row.battleId));
                  }}
                  component='tr'
                  sx={{
                    "&:hover": {
                      background: 'rgba(255, 255, 255, 0.2)'
                    },
                    cursor: 'pointer'
                  }}
                >
                  <td><div className={'row_position'}>{row.battleId}</div></td>
                  <td>{row.players.map(character => {
                    return (
                      <div>
                        {character.character.name}
                      </div>
                    );
                  })}</td>
                  <td>{'winner'}</td>
                </Box>);
            })}</tbody>
          </Table>



        </div>
      </div>
    </div>
  );
};
