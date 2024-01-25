import { queryClient } from "app/providers/ReactQuery";
import {
  getGraphQLPrimaryKey,
  useGraphQL,
} from "app/providers/ReactQuery/useGraphQL";
import { graphql } from "gql/gql";
import { BattleLog } from "gql/graphql";

export const allbattleLogsQueryDocument = graphql(`
  query BattleLogs {
    battleLogs {
      id
      battleIndex
      character1 {
        winner
        attributes
        character
        experience
        rating
        level
      }
      character2 {
        winner
        attributes
        experience
        character
        level
        rating
      }
      lobby {
        id
        tier
        capacity
        reservationsCount
        characters {
          id
          character {
            owner
            name
            level
            experience
            attributes
            id
          }
        }
      }
      turns {
        character1 {
          energy
          hp
          position
        }
        logs {
          action
          character
        }
        character2 {
          energy
          position
          hp
        }
      }
    }
  }
`);

export const invalidateAllBattleLogs = () =>
  queryClient.invalidateQueries({
    queryKey: [getGraphQLPrimaryKey(allbattleLogsQueryDocument)],
  });

export const useAllBattleLogs = () => {
  // variables are not used, but we should pass undefined so that we can omit the second argument and pass the third argument
  const queryResult = useGraphQL(allbattleLogsQueryDocument, undefined, {
    select: (data) => data.battleLogs,
  });

  return queryResult;
};

/**
 *
 */

const battleLogByIdQueryDocument = graphql(/* GraphQL */ `
  query BattleLogById($battleId: String!) {
    battleLogById(id: $battleId) {
      id
      battleIndex
      character1 {
        winner
        attributes
        character
        experience
        rating
        level
      }
      character2 {
        winner
        attributes
        experience
        character
        level
        rating
      }
      lobby {
        id
        tier
        reservationsCount
        capacity
        characters {
          id
          character {
            owner
            name
            level
            experience
            attributes
            id
          }
        }
      }
      turns {
        character1 {
          energy
          hp
          position

          chillingTouch
          earthSkin
          earthSmites
          fireHaste
          fireWall
          waterBurst
        }
        logs {
          action
          character
        }
        character2 {
          energy
          position
          hp

          chillingTouch
          earthSkin
          earthSmites
          fireHaste
          fireWall
          waterBurst
        }
      }
    }
  }
`);

export const useBattleLogById = ({ battleId }: { battleId?: string }) => {
  const query = useGraphQL(
    battleLogByIdQueryDocument,
    {
      battleId: `${battleId}`,
    },
    {
      enabled: battleId != null,
      select: (data) => data.battleLogById,
      placeholderData: (previousData) => previousData,
    }
  );
  return query;
};

/**
 * Battle logs by lobby id
 */

const battleLogsByLobbyIdQueryDocument = graphql(/* GraphQL */ `
  query BattleLogsByLobbyId($lobbyId: String!) {
    battleLogs(where: { lobby: { id_eq: $lobbyId } }) {
      id
    }
  }
`);

export const useBattleLogsByLobbyId = ({ lobbyId }: { lobbyId?: string }) => {
  const query = useGraphQL(
    battleLogsByLobbyIdQueryDocument,
    {
      lobbyId: `${lobbyId}`,
    },
    {
      enabled: lobbyId != null,
      select: (data) => data.battleLogs,
    }
  );
  return query;
};

/**
 * Utils
 */

export const getCharacterFromBattleLogById = (
  battleLog: BattleLog,
  characterId: string
) => {
  return battleLog.lobby.characters.find(
    ({ character: { id } }) => id === characterId
  )?.character;
};
