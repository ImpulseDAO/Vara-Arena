import './styles.scss';
import { debounce } from 'lodash';
import { getCharacterFromBattleLogById, useAllBattleLogs } from 'app/api/battleLogs';
import { Flex, Table, Text, TextInput, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
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
  const [searchStr, setSearchStr] = React.useState('');

  /**
   *
   */

  const { data: myCharacters } = useMyCharacters({ owner_eq: myAccountId ?? '' });
  const { data: battleLogsUnfilteredUnsorted } = useAllBattleLogs();

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

  const battleLogsUnfilteredSorted = React.useMemo(() => {
    return battleLogsUnfilteredUnsorted?.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }, [battleLogsUnfilteredUnsorted]);

  /**
   * Filter battle logs
   */

  const battleLogs = React.useMemo(() => {
    if (!isFiltered) { return battleLogsUnfilteredSorted; }

    const myCharactersIds = myCharacters?.characters.map((character) => character.id) ?? [];

    return battleLogsUnfilteredSorted?.filter((battleLog: BattleLog) => {
      return (myCharactersIds.includes(battleLog.character1.character)
        || myCharactersIds.includes(battleLog.character2.character));
    });
  }, [battleLogsUnfilteredSorted, isFiltered, myCharacters?.characters]);

  /**
   * Apply search string
   */

  const battleLogsAfterSearch = React.useMemo(() => {
    if (!searchStr) { return battleLogs; }

    return battleLogs?.filter((battleLog: BattleLog) => {
      if (battleLog.lobby.id.toLowerCase().includes(searchStr.toLowerCase())) { return true; }
      if (battleLog.id.toLowerCase().includes(searchStr.toLowerCase())) { return true; }

      const playersInBattle = getPlayersInBattle(battleLog);

      return playersInBattle.some(character => {
        return character?.name.toLowerCase().includes(searchStr.toLowerCase());
      });
    });
  }, [battleLogs, searchStr]);

  /**
   * transform rows data
   */

  const inProgressRows = React.useMemo(() => {
    return battleLogsAfterSearch?.toReversed().map((battleLog: BattleLog) => {
      const { id } = battleLog;
      const playersInBattle = getPlayersInBattle(battleLog);

      const playersNames = playersInBattle.map((character) => character?.name ?? 'Player not found');
      const playersOwners = playersInBattle.map((character) => character?.owner ?? 'Player not found');
      const winner = battleLog.character1.winner ? playersInBattle[0] : battleLog.character2.winner ? playersInBattle[1] : { name: 'No winner', owner: '' };

      const winnerName = winner?.name;
      const winnerOwner = winner?.owner;

      const includesMyCharacter = playersOwners.includes(myAccountId ?? '') || (winnerOwner && winnerOwner === myAccountId);

      return ({
        playersNames,
        battleId: id,
        lobbyId: battleLog.lobby.id,
        tier: battleLog.lobby.tier,
        winner: winnerName,
        includesMyCharacter
      });
    }) ?? [];
  }, [battleLogsAfterSearch, myAccountId]);


  const BUTTON_WIDTH = '200px';

  return (
    <div className='logs'>
      <div className='modal_leaderboard'>
        <Flex
          style={{ alignSelf: 'stretch' }}
          mb="xs"
          justify={'space-between'}
          w="100%"
        >
          <TheButton
            w={BUTTON_WIDTH}
            size="sm"
            bg="black"
            onClick={() => setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.set('filtered', isFiltered ? 'false' : 'true');
              return newParams;
            },)}
          >{isFiltered ? "Show all logs" : "Show my logs only"}</TheButton>

          <TextInput
            w={BUTTON_WIDTH}
            size="sm"
            placeholder="Search by ID or name"
            rightSectionWidth={42}
            styles={{
              input: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '2px solid white',
                color: 'white'
              }
            }}
            c="white"
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} color="white" stroke={2.5} />}
            onChange={(event) => {
              debounce(() => {
                setSearchStr(event.target.value);
              }, 300, { maxWait: 1000 })();
            }}
          />
        </Flex>

        <div className='header'>History</div>
        <div className='modal_table'>
          <Table horizontalSpacing="md" verticalSpacing="md" >
            <Table.Thead>
              <Table.Tr>
                {[
                  'Lobby ID',
                  'Battle ID',
                  'Tier',
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
                    /* Tier */
                    <Text ta="center" size='sm' fw="500">{row.tier}</Text>,
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
  2: '40px'
};

const TEXT_ALIGN = {
  0: 'center',
  1: 'center',
  2: 'center'
};

/**
 * Utils
 */

function getPlayersInBattle(battleLog: BattleLog) {
  const char1Id = battleLog.character1.character;
  const char2Id = battleLog.character2.character;
  return [char1Id, char2Id].map((charId) => getCharacterFromBattleLogById(battleLog, charId));
}
