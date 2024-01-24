import './styles.scss';
import { getCharacterFromBattleLogById, useAllBattleLogs } from 'app/api/battleLogs';
import { Flex, Table } from '@mantine/core';
import { routes } from 'app/routes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BattleLog } from 'gql/graphql';
import React, { useEffect } from 'react';
import { useMyCharacters } from 'app/api/characters';
import { useMyAccountId } from 'hooks/hooks';
import { TheButton } from 'components/TheButton';

export const History = () => {
  const navigate = useNavigate();
  const myAccountId = useMyAccountId();

  /**
   *
   */

  const { data: myCharacters } = useMyCharacters({ owner_eq: myAccountId ?? '' });
  const { data: battleLogsUnfiltered } = useAllBattleLogs();

  /**
   * If true, only show battle logs where the player's characters are involved.
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const isFiltered = searchParams.get('filtered') === 'true';


  useEffect(() => {
    // set initial if not set
    if (!searchParams.get('filtered')) {
      setSearchParams('filtered=true');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const battleLogs = React.useMemo(() => {
    if (!isFiltered) { return battleLogsUnfiltered; }

    const myCharactersIds = myCharacters?.characters.map((character) => character.id) ?? [];

    return battleLogsUnfiltered?.filter((battleLog: BattleLog) => {
      return (myCharactersIds.includes(battleLog.character1.character)
        || myCharactersIds.includes(battleLog.character2.character));
    });
  }, [battleLogsUnfiltered, isFiltered, myCharacters?.characters]);

  /**
   *
   */

  const inProgressRows = battleLogs?.toReversed().map((battleLog: BattleLog) => {
    const { id } = battleLog;
    const char1Id = battleLog.character1.character;
    const char2Id = battleLog.character2.character;

    const playersNames = [char1Id, char2Id].map((charId) => getCharacterFromBattleLogById(battleLog, charId)?.name ?? 'Player not found');
    const playersOwners = [char1Id, char2Id].map((charId) => getCharacterFromBattleLogById(battleLog, charId)?.owner ?? 'Player not found');

    const winner: Pick<Character, 'name' | 'owner'> | undefined = battleLog.character1.winner
      ? getCharacterFromBattleLogById(battleLog as BattleLog, char1Id)
      : battleLog.character2.winner
        ? getCharacterFromBattleLogById(battleLog as BattleLog, char2Id)
        : { name: 'No winner', owner: '' };

    const winnerName = winner?.name;
    const winnerOwner = winner?.owner;

    const includesMyCharacter = playersOwners.includes(myAccountId ?? '') || (winnerOwner && winnerOwner === myAccountId);

    return ({
      playersNames,
      battleId: id,
      lobbyId: battleLog.lobby.id,
      winner: winnerName,
      includesMyCharacter
    });
  }) ?? [];


  return (
    <div className='logs'>
      <div className='modal_leaderboard'>
        <Flex
          style={{ alignSelf: 'stretch' }}
          mb="xs"
        >
          <TheButton
            size="sm"
            bg="black"
            onClick={() => setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('filtered', isFiltered ? 'false' : 'true');
              return newParams;
            },)}
          >{isFiltered ? "Show all logs" : "Show my logs only"}</TheButton>
        </Flex>

        <div className='header'>History</div>
        <div className='modal_table'>
          <Table horizontalSpacing="md" verticalSpacing="md" >
            <Table.Thead>
              <Table.Tr>
                {[
                  'Lobby ID',
                  'Battle ID',
                  'Players',
                  'Winner',
                ].map((header, idx) => {
                  return (
                    <Table.Th
                      key={header}
                      w={CELL_WIDTH[idx]}
                      ta={TEXT_ALIGN[idx]}
                    >
                      {header}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{inProgressRows.map((row) => {
              return (
                <Table.Tr
                  onClick={() => {
                    const [lobbyId, battleId] = row.battleId.split('-') as [string, string | undefined];
                    navigate(routes.tournamentResult({ lobbyId, battleId }));
                  }}
                  className={['table_row', row.includesMyCharacter && !isFiltered ? 'table_row_highlighted' : ''].join(' ')}
                  key={`${row.battleId}-${row.lobbyId}`}
                >
                  {[
                    /* Lobby ID */
                    <div className={'badge'} > {row.lobbyId}</div>,
                    /* Battle ID */
                    <div className={'badge'}>{row.battleId}</div>,
                    /* Players */
                    row.playersNames.map(playerName => {
                      return (
                        <div key={playerName}>
                          {playerName}
                        </div>
                      );
                    }),
                    /* Winner */
                    row.winner,
                  ].map((cellContent, idx) => {
                    return (
                      <Table.Td
                        key={idx}
                        w={CELL_WIDTH[idx]}
                        ta={TEXT_ALIGN[idx]}
                      >
                        {cellContent}
                      </Table.Td>
                    );
                  })}

                </Table.Tr>);
            })}</Table.Tbody>
          </Table>

        </div>
      </div>
    </div >
  );
};

const CELL_WIDTH = {
  0: '100px',
  1: '100px',
};

const TEXT_ALIGN = {
  0: 'center',
  1: 'center',
};
