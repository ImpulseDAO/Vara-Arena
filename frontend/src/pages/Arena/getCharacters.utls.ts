type GetCharacter = (params: {
  character: {
    id: string;
    name: string;
    owner: string;
    level: number;
    experience: number;
    attributes: any;
  };
  isMyCharacter: boolean;
}) => {
  isMyCharacter: boolean;
  playerId: string;
  id: string;
  name: string;
  level: number;
};

export const getCharacter: GetCharacter = ({ character, isMyCharacter }) => {
  return {
    isMyCharacter,
    playerId: character.owner,
    id: character.id,
    name: character.name,
    level: character.level ?? 0,
  };
};
