import { useMemo } from "react";
import "./styles.scss";
import { useMintState } from "app/api/mintState";
import { MINT_METADATA, MINT_PROGRAM_ID } from "consts";
import { Box, Table, Text } from "@mantine/core";
import { getShortIdString } from "utils";
import { useMyAccountId } from "hooks/hooks";
import { useNavigate } from "react-router-dom";
import { routes } from "app/routes";
import { Header } from "components/PanelWithHeader/components/Header";

export const Leaderboard = () => {
  const navigate = useNavigate();
  const myAccountId = useMyAccountId();

  const { data: mintState } = useMintState({
    variables: {
      metadata: MINT_METADATA,
      programId: MINT_PROGRAM_ID
    }
  });

  const { characters } = mintState ?? { characters: {} };

  const entries = useMemo(() => {
    return Object.entries(characters).sort(([, c1], [, c2]) => {
      return (c1.attributes.tierRating - c2.attributes.tierRating) * -1;
    });
  }, [characters]);

  const ROWS_MIN = 5;
  const inProgressRows = entries.map(([ownerId, c]) => {
    const isMyCharacter = ownerId === myAccountId;

    return {
      name: c.name,
      level: c.level,
      exp: c.experience,
      ownerId,
      rating: c.attributes.tierRating,
      isMyCharacter,
      id: c.id,
    };
  });

  return (
    <div className="leaderboard">
      <div className="content-wrapper">
        <Header>Leaderboard</Header>

        <div className='modal_table'>
          <Table horizontalSpacing="md" verticalSpacing="md" >
            <Table.Thead>
              <Table.Tr>
                {[
                  'Rating',
                  'Name',
                  'Level',
                  'Owner ID',
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
            <Table.Tbody>
              {inProgressRows.map((row) => {
                return (
                  <Table.Tr
                    // onClick={() => {
                    //   const [lobbyId, battleId] = row.battleId.split('-') as [string, string | undefined];
                    //   navigate(newRoutes.tournamentResult({ lobbyId, battleId }));
                    // }}
                    className={['table_row', row.isMyCharacter ? 'table_row_highlighted' : ''].join(' ')}
                    key={row.ownerId}
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate(routes.profile(String(row.id)));
                    }}
                  >
                    {[
                      /* Rating */
                      <Box className={'badge'} >{row.rating}</Box>,
                      /* Name */
                      <Text size="md"> {row.name}</Text>,
                      /* Level */
                      <div className={'badge'}>{row.level}</div>,
                      /* Owner ID */
                      <div title={row.ownerId}>{getShortIdString(row.ownerId)}</div>,
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
              })}
              {ROWS_MIN - inProgressRows.length &&
                /**
                 * This is needed to keep the table rows height consistent
                 */
                (
                  <Table.Tr>
                    <Table.Td colSpan={4} >

                    </Table.Td>
                  </Table.Tr>
                )
              }
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const CELL_WIDTH = {
  0: '10%',
  1: '30%',
  // 2: '100px',
  3: '40%'
};

const TEXT_ALIGN = {
  0: 'center',
  1: 'left',
  2: 'center',
};
