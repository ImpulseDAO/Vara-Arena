/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query BattleLogs {\n    battleLogs {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        capacity\n        reservationsCount\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n        }\n      }\n    }\n  }\n": types.BattleLogsDocument,
    "\n  query BattleLogById($battleId: String!) {\n    battleLogById(id: $battleId) {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        reservationsCount\n        capacity\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n      }\n    }\n  }\n": types.BattleLogByIdDocument,
    "\n  query BattleLogsByLobbyId($lobbyId: String!) {\n    battleLogs(where: { lobby: { id_eq: $lobbyId } }) {\n      id\n    }\n  }\n": types.BattleLogsByLobbyIdDocument,
    "\n  query AllCharacters {\n    characters {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n": types.AllCharactersDocument,
    "\n  query CharactersByOwner($owner_eq: String!) {\n    characters(where: { owner_eq: $owner_eq }) {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n": types.CharactersByOwnerDocument,
    "\n  query CharacterById($character_id: String!) {\n    characterById(id: $character_id) {\n      attributes\n      experience\n      balance\n      id\n      level\n      owner\n      livesCount\n      name\n      rating\n    }\n  }\n": types.CharacterByIdDocument,
    "\n  query Lobbies {\n    lobbies {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n": types.LobbiesDocument,
    "\n  query LobbyById2($id: String!) {\n    lobbyById(id: $id) {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n": types.LobbyById2Document,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BattleLogs {\n    battleLogs {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        capacity\n        reservationsCount\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query BattleLogs {\n    battleLogs {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        capacity\n        reservationsCount\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BattleLogById($battleId: String!) {\n    battleLogById(id: $battleId) {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        reservationsCount\n        capacity\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query BattleLogById($battleId: String!) {\n    battleLogById(id: $battleId) {\n      id\n      battleIndex\n      character1 {\n        winner\n        attributes\n        character\n        experience\n        rating\n        level\n      }\n      character2 {\n        winner\n        attributes\n        experience\n        character\n        level\n        rating\n      }\n      lobby {\n        id\n        tier\n        reservationsCount\n        capacity\n        characters {\n          id\n          character {\n            owner\n            name\n            level\n            experience\n            attributes\n            id\n          }\n        }\n      }\n      turns {\n        character1 {\n          energy\n          hp\n          position\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n        logs {\n          action\n          character\n        }\n        character2 {\n          energy\n          position\n          hp\n\n          chillingTouch\n          earthSkin\n          earthSmites\n          fireHaste\n          fireWall\n          waterBurst\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BattleLogsByLobbyId($lobbyId: String!) {\n    battleLogs(where: { lobby: { id_eq: $lobbyId } }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  query BattleLogsByLobbyId($lobbyId: String!) {\n    battleLogs(where: { lobby: { id_eq: $lobbyId } }) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllCharacters {\n    characters {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n"): (typeof documents)["\n  query AllCharacters {\n    characters {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CharactersByOwner($owner_eq: String!) {\n    characters(where: { owner_eq: $owner_eq }) {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n"): (typeof documents)["\n  query CharactersByOwner($owner_eq: String!) {\n    characters(where: { owner_eq: $owner_eq }) {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CharacterById($character_id: String!) {\n    characterById(id: $character_id) {\n      attributes\n      experience\n      balance\n      id\n      level\n      owner\n      livesCount\n      name\n      rating\n    }\n  }\n"): (typeof documents)["\n  query CharacterById($character_id: String!) {\n    characterById(id: $character_id) {\n      attributes\n      experience\n      balance\n      id\n      level\n      owner\n      livesCount\n      name\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Lobbies {\n    lobbies {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query Lobbies {\n    lobbies {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LobbyById2($id: String!) {\n    lobbyById(id: $id) {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query LobbyById2($id: String!) {\n    lobbyById(id: $id) {\n      id\n      capacity\n      tier\n      reservationsCount\n      characters {\n        id\n        character {\n          id\n          name\n          owner\n          level\n          experience\n          attributes\n        }\n      }\n      battleLogs {\n        id\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;