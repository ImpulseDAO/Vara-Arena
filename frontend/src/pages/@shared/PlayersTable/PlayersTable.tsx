import isEmpty from "lodash/isEmpty";
import { useMemo } from "react";
//
import AvatarIcon from "assets/images/avatar.png";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";
import { useAllBattleLogs } from 'app/api/battleLogs';
import { ActionIcon, Anchor, Flex, Menu, Button, Text } from "@mantine/core";
//
import "./PlayersTable.scss";
import { routes } from "app/routes";
import { useNavigate } from "react-router-dom";
import { ThreeDotsIcon } from "components/Icons";
import { useMediaQuery } from "@mantine/hooks";

const inProgressColumns: TableColumnsType[] = [
  {
    field: "id",
    headerName: "Player ID",
    width: 220,
  },
  {
    field: "NB",
    headerName: "Number of battles",
    width: 144,
    $position: "center",
  },
  {
    field: "level",
    headerName: "Level",
    width: 172,
    $position: "center",
  },
  {
    field: "menu",
    headerName: "",
    width: 50,
    $position: "center",
  }
];

export const PlayersTable = ({
  characters,
}: {
  characters: Array<{
    name: string,
    id: string,
    level: number,
    isMyCharacter: boolean,
  }>,
}) => {
  return (
    <PlayersTableDataFetcher>
      {(allBattleLogs) => (
        <PlayersTableView characters={characters} battleLogs={allBattleLogs} />
      )}

    </PlayersTableDataFetcher>
  );
};

type BattleLogsReturned = ReturnType<typeof useAllBattleLogs>['data'];

export const PlayersTableDataFetcher = ({
  children }: {
    children: (data: BattleLogsReturned) => JSX.Element;
  }) => {
  const { data: allBattleLogs } = useAllBattleLogs();

  return children(allBattleLogs);
};

export const PlayersTableView = ({
  characters,
  battleLogs,
}: {
  characters: Array<{
    name: string,
    id: string,
    level: number,
    isMyCharacter: boolean,
  }>,
  battleLogs: BattleLogsReturned,
}) => {
  const navigate = useNavigate();
  const inProgressRows = useMemo(() => {
    if (!characters || isEmpty(Object.values(characters))) {
      return [
        {
          name: '',
          id: '',
          NB: (
            <Flex
              align={'center'}
              justify={'center'}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
            >
              Lobby is empty
            </Flex>
          ),
          level: '',
          isMyCharacter: false,
        }
      ];
    }

    return characters.map(({ name, id, level, isMyCharacter }) => ({
      name,
      id: <Row name={name} id={id} isSelected={isMyCharacter} />,
      NB: battleLogs?.filter(({ character1, character2 }) => character1.character === id || character2.character === id).length ?? 0,
      level: <span className="row_lvl">{level} LVL</span>,
      menu: (
        <Menu position="bottom-end" offset={3} >
          <Menu.Target>
            <ActionIcon
              className="menuIcon"
              size="md"
            >
              <ThreeDotsIcon fill="white" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown bg="black">
            <Button
              size="sm"
              py="xs"
              h={30}
              variant="subtle"
              onClick={() => navigate(routes.profile(id))}
            >
              <Text size="sm" c="white">
                See profile
              </Text>
            </Button>
            {/* Other items to be added in the future if needed... */}
          </Menu.Dropdown>
        </Menu>
      ),
      isMyCharacter,
    }));
  }, [battleLogs, characters, navigate]);

  return (
    <div className="playersTable">
      <TableUI rows={inProgressRows} columns={inProgressColumns} />
    </div>
  );
};

export const Row = ({
  name,
  id,
  isSelected
}: {
  name: string,
  id: string,
  isSelected: boolean;
}) => {
  const navigate = useNavigate();
  const isSmall = useMediaQuery('(max-width: 600px)');

  return (
    <div className="row_player">
      {isSmall ? null : <Anchor
        onClick={() => {
          navigate(routes.profile(id));
        }}

      >
        <img src={AvatarIcon} alt="AvatarIcon" className={`${isSelected ? 'selected_image' : ''}`} />
      </Anchor>}
      <div>
        <p className="row_name">{name}</p>
        <p>{`#${id}`}</p>
      </div>
    </div>
  );
};
