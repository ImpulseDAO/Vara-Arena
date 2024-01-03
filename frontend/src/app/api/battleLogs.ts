import { queryClient } from "app/providers/ReactQuery";
import {
  getGraphQLPrimaryKey,
  useGraphQL,
} from "app/providers/ReactQuery/useGraphQL";
import { graphql } from "gql/gql";

export const allbattleLogsQueryDocument = graphql(`
  query BattleLogs {
    battleLogs {
      id
      battleIndex
      character1 {
        attributes
        character
        experience
        rating
        level
      }
      character2 {
        attributes
        experience
        character
        level
        rating
      }
      lobby {
        id
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
        capacity
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

  queryResult.data?.forEach((battleLog) => {
    console.log(`battleLog`, battleLog);
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
        attributes
        character
        experience
        rating
        level
      }
      character2 {
        attributes
        experience
        character
        level
        rating
      }
      lobby {
        id
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
        capacity
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

export const useBattleLogById = ({ battleId }: { battleId?: string }) => {
  const query = useGraphQL(
    battleLogByIdQueryDocument,
    {
      battleId: `${battleId}`,
    },
    {
      enabled: battleId != null,
      select: (data) => data.battleLogById,
    }
  );
  return query;
};
