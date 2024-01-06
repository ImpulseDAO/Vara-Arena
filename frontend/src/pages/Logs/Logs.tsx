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

    return ({
      // player1_id: (
      //   <div className='row_player'>
      //     <img src={AvatarIcon} />
      //     <div>
      //       <p className='row_name'>{battleLog.lobby.characters[0].character.name}</p>
      //       <p className='row_id'>{getShortIdString(battleLog.lobby.characters[0].character.owner)}</p>
      //     </div>
      //   </div>
      // ),
      // player2_id: (
      //   <div className='row_player'>
      //     <img src={AvatarIcon} />
      //     <div>
      //       <p className='row_name'>{battleLog.lobby.characters[1].character.name}</p>
      //       <p className='row_id'>{getShortIdString(battleLog.lobby.characters[1].character.owner)}</p>
      //     </div>
      //   </div>
      // ),
      playersNames: [battleLog.character1, battleLog.character2].map(({ character: characterId }) => {
        const characterName = battleLog.lobby.characters.find(c => c.character.id === characterId)?.character.name;
        return characterName;
      }),
      battleId: id,
      lobbyId: battleLog.lobby.id,
      winner: battleLog.character1.winner
        ? battleLog.lobby.characters[0].character.name
        : battleLog.character2.winner
          ? battleLog.lobby.characters[1].character.name :
          'No winner'

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
                <th>Lobby ID</th>
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
                  {/* Lobby ID */}
                  <td><div className={'row_position'}>{row.lobbyId}</div></td>

                  {/* Battle ID */}
                  <td><div className={'row_position'}>{row.battleId}</div></td>

                  {/* Players */}
                  <td>{row.playersNames.map(playerName => {
                    return (
                      <div>
                        {playerName}
                      </div>
                    );
                  })}</td>

                  {/* Winner */}
                  <td>{row.winner}</td>
                </Box>);
            })}</tbody>
          </Table>



        </div>
      </div>
    </div>
  );
};
