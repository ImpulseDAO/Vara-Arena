import { isEmpty } from "lodash";
import { useMemo } from "react";
//
import AvatarIcon from "assets/images/avatar.png";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";
import { getShortIdString } from "utils";
import { useAllCharacters } from "app/api/characters";
import { useAllBattleLogs } from '../../../app/api/battleLogs';

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
    position: "center",
  },
  {
    field: "level",
    headerName: "Level",
    width: 172,
    position: "center",
  },
];

export const PlayersTable = ({
  characters,
}: {
  characters: Array<{
    name: string,
    id: string,
    level: string,
    isMyCharacter: boolean,
  }>,
}) => {
  // const characters = [];

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
    level: string,
    isMyCharacter: boolean,
  }>,
  battleLogs: BattleLogsReturned,
}) => {
  const inProgressRows = useMemo(() => {
    if (!characters || isEmpty(Object.values(characters))) {
      return [];
    }

    return characters.map(({ name, id, level, isMyCharacter }) => ({
      name,
      id: <Row name={name} id={getShortIdString(id)} isSelected={isMyCharacter} />,
      NB: battleLogs?.filter(({ character1, character2 }) => character1.character === id || character2.character === id).length ?? 0,
      level: <span className="row_lvl">{level} LVL</span>,
      isMyCharacter,
    }));
  }, [battleLogs, characters]);

  return (
    <TableUI rows={inProgressRows} columns={inProgressColumns} />
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
  return (
    <div className="row_player">
      <img src={AvatarIcon} alt="AvatarIcon" className={`${isSelected ? 'selected_image' : ''}`} />
      <div>
        <p className="row_name">{name}</p>
        <p>{id}</p>
      </div>
    </div>
  );
}; 
