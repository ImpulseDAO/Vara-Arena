import './styles.scss';
import { getCharacterFromBattleLogById, useAllBattleLogs } from 'app/api/battleLogs';
import { Box, Table } from '@mantine/core';
import { newRoutes } from 'app/routes';
import { useNavigate } from 'react-router-dom';
import { BattleLog } from 'gql/graphql';

export const Logs = () => {
  // const inProgressRows = useMemo(() => getRows(), []);
  const navigate = useNavigate();
  const { data: battleLogs } = useAllBattleLogs();

  const inProgressRows = battleLogs?.map((battleLog: BattleLog) => {
    const { id } = battleLog;
    const char1Id = battleLog.character1.character;
    const char2Id = battleLog.character2.character;

    const playersNames = [char1Id, char2Id].map((charId) => getCharacterFromBattleLogById(battleLog, charId)?.name ?? 'Player not found');

    return ({
      playersNames,
      battleId: id,
      lobbyId: battleLog.lobby.id,
      winner: battleLog.character1.winner
        ? getCharacterFromBattleLogById(battleLog as BattleLog, char1Id)?.name
        : battleLog.character2.winner
          ? getCharacterFromBattleLogById(battleLog as BattleLog, char2Id)?.name :
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
