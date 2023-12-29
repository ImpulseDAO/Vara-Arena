import { isEmpty } from "lodash";
import { useMemo } from "react";
//
import AvatarIcon from "assets/images/avatar.png";
import { TableUI } from "components/Table";
import { TableColumnsType } from "components/Table/types";

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
  const inProgressRows = useMemo(() => {
    if (!characters || isEmpty(Object.values(characters))) {
      return [];
    }

    return characters.map(({ name, id, level, isMyCharacter }) => ({
      name,
      id: <Row name={name} id={`@${id.substring(0, 7)}...${id.substring(id.length - 3)}`} isSelected={isMyCharacter} />,
      NB: 0,
      level: <span className="row_lvl">{level} LVL</span>,
      isMyCharacter,
    }));
  }, [characters]);

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
