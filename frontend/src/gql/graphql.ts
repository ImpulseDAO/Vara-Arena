/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A scalar that can represent any JSON value */
  JSON: { input: any; output: any; }
};

export type BattleLog = {
  __typename?: 'BattleLog';
  battleIndex: Scalars['Int']['output'];
  character1: CharacterState;
  character2: CharacterState;
  id: Scalars['String']['output'];
  lobby: Lobby;
  turns: Array<BattleTurn>;
};

export type BattleLogEdge = {
  __typename?: 'BattleLogEdge';
  cursor: Scalars['String']['output'];
  node: BattleLog;
};

export enum BattleLogOrderByInput {
  BattleIndexAsc = 'battleIndex_ASC',
  BattleIndexAscNullsFirst = 'battleIndex_ASC_NULLS_FIRST',
  BattleIndexDesc = 'battleIndex_DESC',
  BattleIndexDescNullsLast = 'battleIndex_DESC_NULLS_LAST',
  Character1CharacterAsc = 'character1_character_ASC',
  Character1CharacterAscNullsFirst = 'character1_character_ASC_NULLS_FIRST',
  Character1CharacterDesc = 'character1_character_DESC',
  Character1CharacterDescNullsLast = 'character1_character_DESC_NULLS_LAST',
  Character1ExperienceAsc = 'character1_experience_ASC',
  Character1ExperienceAscNullsFirst = 'character1_experience_ASC_NULLS_FIRST',
  Character1ExperienceDesc = 'character1_experience_DESC',
  Character1ExperienceDescNullsLast = 'character1_experience_DESC_NULLS_LAST',
  Character1LevelAsc = 'character1_level_ASC',
  Character1LevelAscNullsFirst = 'character1_level_ASC_NULLS_FIRST',
  Character1LevelDesc = 'character1_level_DESC',
  Character1LevelDescNullsLast = 'character1_level_DESC_NULLS_LAST',
  Character1RatingAsc = 'character1_rating_ASC',
  Character1RatingAscNullsFirst = 'character1_rating_ASC_NULLS_FIRST',
  Character1RatingDesc = 'character1_rating_DESC',
  Character1RatingDescNullsLast = 'character1_rating_DESC_NULLS_LAST',
  Character1WinnerAsc = 'character1_winner_ASC',
  Character1WinnerAscNullsFirst = 'character1_winner_ASC_NULLS_FIRST',
  Character1WinnerDesc = 'character1_winner_DESC',
  Character1WinnerDescNullsLast = 'character1_winner_DESC_NULLS_LAST',
  Character2CharacterAsc = 'character2_character_ASC',
  Character2CharacterAscNullsFirst = 'character2_character_ASC_NULLS_FIRST',
  Character2CharacterDesc = 'character2_character_DESC',
  Character2CharacterDescNullsLast = 'character2_character_DESC_NULLS_LAST',
  Character2ExperienceAsc = 'character2_experience_ASC',
  Character2ExperienceAscNullsFirst = 'character2_experience_ASC_NULLS_FIRST',
  Character2ExperienceDesc = 'character2_experience_DESC',
  Character2ExperienceDescNullsLast = 'character2_experience_DESC_NULLS_LAST',
  Character2LevelAsc = 'character2_level_ASC',
  Character2LevelAscNullsFirst = 'character2_level_ASC_NULLS_FIRST',
  Character2LevelDesc = 'character2_level_DESC',
  Character2LevelDescNullsLast = 'character2_level_DESC_NULLS_LAST',
  Character2RatingAsc = 'character2_rating_ASC',
  Character2RatingAscNullsFirst = 'character2_rating_ASC_NULLS_FIRST',
  Character2RatingDesc = 'character2_rating_DESC',
  Character2RatingDescNullsLast = 'character2_rating_DESC_NULLS_LAST',
  Character2WinnerAsc = 'character2_winner_ASC',
  Character2WinnerAscNullsFirst = 'character2_winner_ASC_NULLS_FIRST',
  Character2WinnerDesc = 'character2_winner_DESC',
  Character2WinnerDescNullsLast = 'character2_winner_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LobbyCapacityAsc = 'lobby_capacity_ASC',
  LobbyCapacityAscNullsFirst = 'lobby_capacity_ASC_NULLS_FIRST',
  LobbyCapacityDesc = 'lobby_capacity_DESC',
  LobbyCapacityDescNullsLast = 'lobby_capacity_DESC_NULLS_LAST',
  LobbyIdAsc = 'lobby_id_ASC',
  LobbyIdAscNullsFirst = 'lobby_id_ASC_NULLS_FIRST',
  LobbyIdDesc = 'lobby_id_DESC',
  LobbyIdDescNullsLast = 'lobby_id_DESC_NULLS_LAST',
  LobbyReservationsCountAsc = 'lobby_reservationsCount_ASC',
  LobbyReservationsCountAscNullsFirst = 'lobby_reservationsCount_ASC_NULLS_FIRST',
  LobbyReservationsCountDesc = 'lobby_reservationsCount_DESC',
  LobbyReservationsCountDescNullsLast = 'lobby_reservationsCount_DESC_NULLS_LAST',
  LobbyTierAsc = 'lobby_tier_ASC',
  LobbyTierAscNullsFirst = 'lobby_tier_ASC_NULLS_FIRST',
  LobbyTierDesc = 'lobby_tier_DESC',
  LobbyTierDescNullsLast = 'lobby_tier_DESC_NULLS_LAST'
}

export type BattleLogWhereInput = {
  AND?: InputMaybe<Array<BattleLogWhereInput>>;
  OR?: InputMaybe<Array<BattleLogWhereInput>>;
  battleIndex_eq?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  battleIndex_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  battleIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_not_eq?: InputMaybe<Scalars['Int']['input']>;
  battleIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  character1?: InputMaybe<CharacterStateWhereInput>;
  character1_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  character2?: InputMaybe<CharacterStateWhereInput>;
  character2_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  lobby?: InputMaybe<LobbyWhereInput>;
  lobby_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  turns_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BattleLogsConnection = {
  __typename?: 'BattleLogsConnection';
  edges: Array<BattleLogEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type BattleTurn = {
  __typename?: 'BattleTurn';
  character1?: Maybe<CharacterTurnState>;
  character2?: Maybe<CharacterTurnState>;
  logs: Array<TurnLog>;
};

export type Character = {
  __typename?: 'Character';
  attributes: Scalars['JSON']['output'];
  balance: Scalars['Int']['output'];
  experience: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  livesCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
};

export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  cursor: Scalars['String']['output'];
  node: Character;
};

export enum CharacterOrderByInput {
  BalanceAsc = 'balance_ASC',
  BalanceAscNullsFirst = 'balance_ASC_NULLS_FIRST',
  BalanceDesc = 'balance_DESC',
  BalanceDescNullsLast = 'balance_DESC_NULLS_LAST',
  ExperienceAsc = 'experience_ASC',
  ExperienceAscNullsFirst = 'experience_ASC_NULLS_FIRST',
  ExperienceDesc = 'experience_DESC',
  ExperienceDescNullsLast = 'experience_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LevelAsc = 'level_ASC',
  LevelAscNullsFirst = 'level_ASC_NULLS_FIRST',
  LevelDesc = 'level_DESC',
  LevelDescNullsLast = 'level_DESC_NULLS_LAST',
  LivesCountAsc = 'livesCount_ASC',
  LivesCountAscNullsFirst = 'livesCount_ASC_NULLS_FIRST',
  LivesCountDesc = 'livesCount_DESC',
  LivesCountDescNullsLast = 'livesCount_DESC_NULLS_LAST',
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameDesc = 'name_DESC',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
  RatingAsc = 'rating_ASC',
  RatingAscNullsFirst = 'rating_ASC_NULLS_FIRST',
  RatingDesc = 'rating_DESC',
  RatingDescNullsLast = 'rating_DESC_NULLS_LAST'
}

export type CharacterState = {
  __typename?: 'CharacterState';
  attributes: Scalars['JSON']['output'];
  character: Scalars['String']['output'];
  experience: Scalars['Int']['output'];
  level: Scalars['Int']['output'];
  rating: Scalars['Int']['output'];
  winner: Scalars['Boolean']['output'];
};

export type CharacterStateWhereInput = {
  attributes_eq?: InputMaybe<Scalars['JSON']['input']>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  attributes_jsonContains?: InputMaybe<Scalars['JSON']['input']>;
  attributes_jsonHasKey?: InputMaybe<Scalars['JSON']['input']>;
  attributes_not_eq?: InputMaybe<Scalars['JSON']['input']>;
  character_contains?: InputMaybe<Scalars['String']['input']>;
  character_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  character_endsWith?: InputMaybe<Scalars['String']['input']>;
  character_eq?: InputMaybe<Scalars['String']['input']>;
  character_gt?: InputMaybe<Scalars['String']['input']>;
  character_gte?: InputMaybe<Scalars['String']['input']>;
  character_in?: InputMaybe<Array<Scalars['String']['input']>>;
  character_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  character_lt?: InputMaybe<Scalars['String']['input']>;
  character_lte?: InputMaybe<Scalars['String']['input']>;
  character_not_contains?: InputMaybe<Scalars['String']['input']>;
  character_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  character_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  character_not_eq?: InputMaybe<Scalars['String']['input']>;
  character_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  character_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  character_startsWith?: InputMaybe<Scalars['String']['input']>;
  experience_eq?: InputMaybe<Scalars['Int']['input']>;
  experience_gt?: InputMaybe<Scalars['Int']['input']>;
  experience_gte?: InputMaybe<Scalars['Int']['input']>;
  experience_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  experience_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  experience_lt?: InputMaybe<Scalars['Int']['input']>;
  experience_lte?: InputMaybe<Scalars['Int']['input']>;
  experience_not_eq?: InputMaybe<Scalars['Int']['input']>;
  experience_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  level_eq?: InputMaybe<Scalars['Int']['input']>;
  level_gt?: InputMaybe<Scalars['Int']['input']>;
  level_gte?: InputMaybe<Scalars['Int']['input']>;
  level_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  level_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  level_lt?: InputMaybe<Scalars['Int']['input']>;
  level_lte?: InputMaybe<Scalars['Int']['input']>;
  level_not_eq?: InputMaybe<Scalars['Int']['input']>;
  level_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rating_eq?: InputMaybe<Scalars['Int']['input']>;
  rating_gt?: InputMaybe<Scalars['Int']['input']>;
  rating_gte?: InputMaybe<Scalars['Int']['input']>;
  rating_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rating_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  rating_lt?: InputMaybe<Scalars['Int']['input']>;
  rating_lte?: InputMaybe<Scalars['Int']['input']>;
  rating_not_eq?: InputMaybe<Scalars['Int']['input']>;
  rating_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  winner_eq?: InputMaybe<Scalars['Boolean']['input']>;
  winner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  winner_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CharacterTurnState = {
  __typename?: 'CharacterTurnState';
  chillingTouch: Scalars['Int']['output'];
  earthSkin: Scalars['Int']['output'];
  earthSmites: Scalars['Int']['output'];
  energy: Scalars['Int']['output'];
  fireHaste: Scalars['Int']['output'];
  fireWall: Scalars['Int']['output'];
  hp: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  waterBurst: Scalars['Int']['output'];
};

export type CharacterWhereInput = {
  AND?: InputMaybe<Array<CharacterWhereInput>>;
  OR?: InputMaybe<Array<CharacterWhereInput>>;
  attributes_eq?: InputMaybe<Scalars['JSON']['input']>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  attributes_jsonContains?: InputMaybe<Scalars['JSON']['input']>;
  attributes_jsonHasKey?: InputMaybe<Scalars['JSON']['input']>;
  attributes_not_eq?: InputMaybe<Scalars['JSON']['input']>;
  balance_eq?: InputMaybe<Scalars['Int']['input']>;
  balance_gt?: InputMaybe<Scalars['Int']['input']>;
  balance_gte?: InputMaybe<Scalars['Int']['input']>;
  balance_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  balance_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  balance_lt?: InputMaybe<Scalars['Int']['input']>;
  balance_lte?: InputMaybe<Scalars['Int']['input']>;
  balance_not_eq?: InputMaybe<Scalars['Int']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  experience_eq?: InputMaybe<Scalars['Int']['input']>;
  experience_gt?: InputMaybe<Scalars['Int']['input']>;
  experience_gte?: InputMaybe<Scalars['Int']['input']>;
  experience_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  experience_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  experience_lt?: InputMaybe<Scalars['Int']['input']>;
  experience_lte?: InputMaybe<Scalars['Int']['input']>;
  experience_not_eq?: InputMaybe<Scalars['Int']['input']>;
  experience_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  level_eq?: InputMaybe<Scalars['Int']['input']>;
  level_gt?: InputMaybe<Scalars['Int']['input']>;
  level_gte?: InputMaybe<Scalars['Int']['input']>;
  level_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  level_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  level_lt?: InputMaybe<Scalars['Int']['input']>;
  level_lte?: InputMaybe<Scalars['Int']['input']>;
  level_not_eq?: InputMaybe<Scalars['Int']['input']>;
  level_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  livesCount_eq?: InputMaybe<Scalars['Int']['input']>;
  livesCount_gt?: InputMaybe<Scalars['Int']['input']>;
  livesCount_gte?: InputMaybe<Scalars['Int']['input']>;
  livesCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  livesCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  livesCount_lt?: InputMaybe<Scalars['Int']['input']>;
  livesCount_lte?: InputMaybe<Scalars['Int']['input']>;
  livesCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  livesCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_eq?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  name_not_eq?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  name_startsWith?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  owner_endsWith?: InputMaybe<Scalars['String']['input']>;
  owner_eq?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  owner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  owner_not_eq?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  owner_startsWith?: InputMaybe<Scalars['String']['input']>;
  rating_eq?: InputMaybe<Scalars['Int']['input']>;
  rating_gt?: InputMaybe<Scalars['Int']['input']>;
  rating_gte?: InputMaybe<Scalars['Int']['input']>;
  rating_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rating_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  rating_lt?: InputMaybe<Scalars['Int']['input']>;
  rating_lte?: InputMaybe<Scalars['Int']['input']>;
  rating_not_eq?: InputMaybe<Scalars['Int']['input']>;
  rating_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CharactersConnection = {
  __typename?: 'CharactersConnection';
  edges: Array<CharacterEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LobbiesConnection = {
  __typename?: 'LobbiesConnection';
  edges: Array<LobbyEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Lobby = {
  __typename?: 'Lobby';
  battleLogs: Array<BattleLog>;
  capacity: Scalars['Int']['output'];
  characters: Array<LobbyCharacter>;
  id: Scalars['String']['output'];
  reservationsCount: Scalars['Int']['output'];
  tier: Scalars['Int']['output'];
};


export type LobbyBattleLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BattleLogOrderByInput>>;
  where?: InputMaybe<BattleLogWhereInput>;
};


export type LobbyCharactersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LobbyCharacterOrderByInput>>;
  where?: InputMaybe<LobbyCharacterWhereInput>;
};

export type LobbyCharacter = {
  __typename?: 'LobbyCharacter';
  character: Character;
  id: Scalars['String']['output'];
  lobby: Lobby;
};

export type LobbyCharacterEdge = {
  __typename?: 'LobbyCharacterEdge';
  cursor: Scalars['String']['output'];
  node: LobbyCharacter;
};

export enum LobbyCharacterOrderByInput {
  CharacterBalanceAsc = 'character_balance_ASC',
  CharacterBalanceAscNullsFirst = 'character_balance_ASC_NULLS_FIRST',
  CharacterBalanceDesc = 'character_balance_DESC',
  CharacterBalanceDescNullsLast = 'character_balance_DESC_NULLS_LAST',
  CharacterExperienceAsc = 'character_experience_ASC',
  CharacterExperienceAscNullsFirst = 'character_experience_ASC_NULLS_FIRST',
  CharacterExperienceDesc = 'character_experience_DESC',
  CharacterExperienceDescNullsLast = 'character_experience_DESC_NULLS_LAST',
  CharacterIdAsc = 'character_id_ASC',
  CharacterIdAscNullsFirst = 'character_id_ASC_NULLS_FIRST',
  CharacterIdDesc = 'character_id_DESC',
  CharacterIdDescNullsLast = 'character_id_DESC_NULLS_LAST',
  CharacterLevelAsc = 'character_level_ASC',
  CharacterLevelAscNullsFirst = 'character_level_ASC_NULLS_FIRST',
  CharacterLevelDesc = 'character_level_DESC',
  CharacterLevelDescNullsLast = 'character_level_DESC_NULLS_LAST',
  CharacterLivesCountAsc = 'character_livesCount_ASC',
  CharacterLivesCountAscNullsFirst = 'character_livesCount_ASC_NULLS_FIRST',
  CharacterLivesCountDesc = 'character_livesCount_DESC',
  CharacterLivesCountDescNullsLast = 'character_livesCount_DESC_NULLS_LAST',
  CharacterNameAsc = 'character_name_ASC',
  CharacterNameAscNullsFirst = 'character_name_ASC_NULLS_FIRST',
  CharacterNameDesc = 'character_name_DESC',
  CharacterNameDescNullsLast = 'character_name_DESC_NULLS_LAST',
  CharacterOwnerAsc = 'character_owner_ASC',
  CharacterOwnerAscNullsFirst = 'character_owner_ASC_NULLS_FIRST',
  CharacterOwnerDesc = 'character_owner_DESC',
  CharacterOwnerDescNullsLast = 'character_owner_DESC_NULLS_LAST',
  CharacterRatingAsc = 'character_rating_ASC',
  CharacterRatingAscNullsFirst = 'character_rating_ASC_NULLS_FIRST',
  CharacterRatingDesc = 'character_rating_DESC',
  CharacterRatingDescNullsLast = 'character_rating_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LobbyCapacityAsc = 'lobby_capacity_ASC',
  LobbyCapacityAscNullsFirst = 'lobby_capacity_ASC_NULLS_FIRST',
  LobbyCapacityDesc = 'lobby_capacity_DESC',
  LobbyCapacityDescNullsLast = 'lobby_capacity_DESC_NULLS_LAST',
  LobbyIdAsc = 'lobby_id_ASC',
  LobbyIdAscNullsFirst = 'lobby_id_ASC_NULLS_FIRST',
  LobbyIdDesc = 'lobby_id_DESC',
  LobbyIdDescNullsLast = 'lobby_id_DESC_NULLS_LAST',
  LobbyReservationsCountAsc = 'lobby_reservationsCount_ASC',
  LobbyReservationsCountAscNullsFirst = 'lobby_reservationsCount_ASC_NULLS_FIRST',
  LobbyReservationsCountDesc = 'lobby_reservationsCount_DESC',
  LobbyReservationsCountDescNullsLast = 'lobby_reservationsCount_DESC_NULLS_LAST',
  LobbyTierAsc = 'lobby_tier_ASC',
  LobbyTierAscNullsFirst = 'lobby_tier_ASC_NULLS_FIRST',
  LobbyTierDesc = 'lobby_tier_DESC',
  LobbyTierDescNullsLast = 'lobby_tier_DESC_NULLS_LAST'
}

export type LobbyCharacterWhereInput = {
  AND?: InputMaybe<Array<LobbyCharacterWhereInput>>;
  OR?: InputMaybe<Array<LobbyCharacterWhereInput>>;
  character?: InputMaybe<CharacterWhereInput>;
  character_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  lobby?: InputMaybe<LobbyWhereInput>;
  lobby_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LobbyCharactersConnection = {
  __typename?: 'LobbyCharactersConnection';
  edges: Array<LobbyCharacterEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LobbyEdge = {
  __typename?: 'LobbyEdge';
  cursor: Scalars['String']['output'];
  node: Lobby;
};

export enum LobbyOrderByInput {
  CapacityAsc = 'capacity_ASC',
  CapacityAscNullsFirst = 'capacity_ASC_NULLS_FIRST',
  CapacityDesc = 'capacity_DESC',
  CapacityDescNullsLast = 'capacity_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  ReservationsCountAsc = 'reservationsCount_ASC',
  ReservationsCountAscNullsFirst = 'reservationsCount_ASC_NULLS_FIRST',
  ReservationsCountDesc = 'reservationsCount_DESC',
  ReservationsCountDescNullsLast = 'reservationsCount_DESC_NULLS_LAST',
  TierAsc = 'tier_ASC',
  TierAscNullsFirst = 'tier_ASC_NULLS_FIRST',
  TierDesc = 'tier_DESC',
  TierDescNullsLast = 'tier_DESC_NULLS_LAST'
}

export type LobbyWhereInput = {
  AND?: InputMaybe<Array<LobbyWhereInput>>;
  OR?: InputMaybe<Array<LobbyWhereInput>>;
  battleLogs_every?: InputMaybe<BattleLogWhereInput>;
  battleLogs_none?: InputMaybe<BattleLogWhereInput>;
  battleLogs_some?: InputMaybe<BattleLogWhereInput>;
  capacity_eq?: InputMaybe<Scalars['Int']['input']>;
  capacity_gt?: InputMaybe<Scalars['Int']['input']>;
  capacity_gte?: InputMaybe<Scalars['Int']['input']>;
  capacity_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  capacity_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  capacity_lt?: InputMaybe<Scalars['Int']['input']>;
  capacity_lte?: InputMaybe<Scalars['Int']['input']>;
  capacity_not_eq?: InputMaybe<Scalars['Int']['input']>;
  capacity_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  characters_every?: InputMaybe<LobbyCharacterWhereInput>;
  characters_none?: InputMaybe<LobbyCharacterWhereInput>;
  characters_some?: InputMaybe<LobbyCharacterWhereInput>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  reservationsCount_eq?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  reservationsCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  reservationsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  reservationsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tier_eq?: InputMaybe<Scalars['Int']['input']>;
  tier_gt?: InputMaybe<Scalars['Int']['input']>;
  tier_gte?: InputMaybe<Scalars['Int']['input']>;
  tier_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tier_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  tier_lt?: InputMaybe<Scalars['Int']['input']>;
  tier_lte?: InputMaybe<Scalars['Int']['input']>;
  tier_not_eq?: InputMaybe<Scalars['Int']['input']>;
  tier_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Mint = {
  __typename?: 'Mint';
  id: Scalars['String']['output'];
  poolAmount: Scalars['Int']['output'];
};

export type MintEdge = {
  __typename?: 'MintEdge';
  cursor: Scalars['String']['output'];
  node: Mint;
};

export enum MintOrderByInput {
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  PoolAmountAsc = 'poolAmount_ASC',
  PoolAmountAscNullsFirst = 'poolAmount_ASC_NULLS_FIRST',
  PoolAmountDesc = 'poolAmount_DESC',
  PoolAmountDescNullsLast = 'poolAmount_DESC_NULLS_LAST'
}

export type MintWhereInput = {
  AND?: InputMaybe<Array<MintWhereInput>>;
  OR?: InputMaybe<Array<MintWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_eq?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
  id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
  id_not_eq?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
  id_startsWith?: InputMaybe<Scalars['String']['input']>;
  poolAmount_eq?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_gt?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_gte?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  poolAmount_lt?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_lte?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_not_eq?: InputMaybe<Scalars['Int']['input']>;
  poolAmount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type MintsConnection = {
  __typename?: 'MintsConnection';
  edges: Array<MintEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  battleLogById?: Maybe<BattleLog>;
  /** @deprecated Use battleLogById */
  battleLogByUniqueInput?: Maybe<BattleLog>;
  battleLogs: Array<BattleLog>;
  battleLogsConnection: BattleLogsConnection;
  characterById?: Maybe<Character>;
  /** @deprecated Use characterById */
  characterByUniqueInput?: Maybe<Character>;
  characters: Array<Character>;
  charactersConnection: CharactersConnection;
  lobbies: Array<Lobby>;
  lobbiesConnection: LobbiesConnection;
  lobbyById?: Maybe<Lobby>;
  /** @deprecated Use lobbyById */
  lobbyByUniqueInput?: Maybe<Lobby>;
  lobbyCharacterById?: Maybe<LobbyCharacter>;
  /** @deprecated Use lobbyCharacterById */
  lobbyCharacterByUniqueInput?: Maybe<LobbyCharacter>;
  lobbyCharacters: Array<LobbyCharacter>;
  lobbyCharactersConnection: LobbyCharactersConnection;
  mintById?: Maybe<Mint>;
  /** @deprecated Use mintById */
  mintByUniqueInput?: Maybe<Mint>;
  mints: Array<Mint>;
  mintsConnection: MintsConnection;
  squidStatus?: Maybe<SquidStatus>;
};


export type QueryBattleLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryBattleLogByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryBattleLogsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BattleLogOrderByInput>>;
  where?: InputMaybe<BattleLogWhereInput>;
};


export type QueryBattleLogsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<BattleLogOrderByInput>;
  where?: InputMaybe<BattleLogWhereInput>;
};


export type QueryCharacterByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryCharacterByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryCharactersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CharacterOrderByInput>>;
  where?: InputMaybe<CharacterWhereInput>;
};


export type QueryCharactersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<CharacterOrderByInput>;
  where?: InputMaybe<CharacterWhereInput>;
};


export type QueryLobbiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LobbyOrderByInput>>;
  where?: InputMaybe<LobbyWhereInput>;
};


export type QueryLobbiesConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<LobbyOrderByInput>;
  where?: InputMaybe<LobbyWhereInput>;
};


export type QueryLobbyByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryLobbyByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryLobbyCharacterByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryLobbyCharacterByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryLobbyCharactersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LobbyCharacterOrderByInput>>;
  where?: InputMaybe<LobbyCharacterWhereInput>;
};


export type QueryLobbyCharactersConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<LobbyCharacterOrderByInput>;
  where?: InputMaybe<LobbyCharacterWhereInput>;
};


export type QueryMintByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMintByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMintsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MintOrderByInput>>;
  where?: InputMaybe<MintWhereInput>;
};


export type QueryMintsConnectionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy: Array<MintOrderByInput>;
  where?: InputMaybe<MintWhereInput>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export type TurnLog = {
  __typename?: 'TurnLog';
  action: Scalars['JSON']['output'];
  character: Scalars['String']['output'];
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

export type BattleLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type BattleLogsQuery = { __typename?: 'Query', battleLogs: Array<{ __typename?: 'BattleLog', id: string, battleIndex: number, character1: { __typename?: 'CharacterState', winner: boolean, attributes: any, character: string, experience: number, rating: number, level: number }, character2: { __typename?: 'CharacterState', winner: boolean, attributes: any, experience: number, character: string, level: number, rating: number }, lobby: { __typename?: 'Lobby', id: string, capacity: number, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', owner: string, name: string, level: number, experience: number, attributes: any, id: string } }> }, turns: Array<{ __typename?: 'BattleTurn', character1?: { __typename?: 'CharacterTurnState', energy: number, hp: number, position: number } | null, logs: Array<{ __typename?: 'TurnLog', action: any, character: string }>, character2?: { __typename?: 'CharacterTurnState', energy: number, position: number, hp: number } | null }> }> };

export type BattleLogByIdQueryVariables = Exact<{
  battleId: Scalars['String']['input'];
}>;


export type BattleLogByIdQuery = { __typename?: 'Query', battleLogById?: { __typename?: 'BattleLog', id: string, battleIndex: number, character1: { __typename?: 'CharacterState', winner: boolean, attributes: any, character: string, experience: number, rating: number, level: number }, character2: { __typename?: 'CharacterState', winner: boolean, attributes: any, experience: number, character: string, level: number, rating: number }, lobby: { __typename?: 'Lobby', id: string, capacity: number, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', owner: string, name: string, level: number, experience: number, attributes: any, id: string } }> }, turns: Array<{ __typename?: 'BattleTurn', character1?: { __typename?: 'CharacterTurnState', energy: number, hp: number, position: number } | null, logs: Array<{ __typename?: 'TurnLog', action: any, character: string }>, character2?: { __typename?: 'CharacterTurnState', energy: number, position: number, hp: number } | null }> } | null };

export type BattleLogsByLobbyIdQueryVariables = Exact<{
  lobbyId: Scalars['String']['input'];
}>;


export type BattleLogsByLobbyIdQuery = { __typename?: 'Query', battleLogs: Array<{ __typename?: 'BattleLog', id: string }> };

export type AllCharactersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCharactersQuery = { __typename?: 'Query', characters: Array<{ __typename?: 'Character', id: string, level: number, name: string, owner: string, experience: number, attributes: any }> };

export type CharactersByOwnerQueryVariables = Exact<{
  owner_eq: Scalars['String']['input'];
}>;


export type CharactersByOwnerQuery = { __typename?: 'Query', characters: Array<{ __typename?: 'Character', id: string, level: number, name: string, owner: string, experience: number, attributes: any }> };

export type CharacterByIdQueryVariables = Exact<{
  character_id: Scalars['String']['input'];
}>;


export type CharacterByIdQuery = { __typename?: 'Query', characterById?: { __typename?: 'Character', attributes: any, experience: number, id: string, level: number, name: string, owner: string } | null };

export type LobbiesQueryVariables = Exact<{ [key: string]: never; }>;


export type LobbiesQuery = { __typename?: 'Query', lobbies: Array<{ __typename?: 'Lobby', id: string, capacity: number, tier: number, reservationsCount: number, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', id: string, name: string, owner: string, level: number, experience: number, attributes: any } }>, battleLogs: Array<{ __typename?: 'BattleLog', id: string }> }> };

export type LobbyById2QueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type LobbyById2Query = { __typename?: 'Query', lobbyById?: { __typename?: 'Lobby', id: string, capacity: number, tier: number, reservationsCount: number, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', id: string, name: string, owner: string, level: number, experience: number, attributes: any } }>, battleLogs: Array<{ __typename?: 'BattleLog', id: string }> } | null };


export const BattleLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BattleLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"battleLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"battleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"character1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lobby"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"energy"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"character"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"energy"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BattleLogsQuery, BattleLogsQueryVariables>;
export const BattleLogByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BattleLogById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"battleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"battleLogById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"battleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"battleIndex"}},{"kind":"Field","name":{"kind":"Name","value":"character1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"level"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"winner"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"character"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lobby"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"turns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"energy"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"character"}}]}},{"kind":"Field","name":{"kind":"Name","value":"character2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"energy"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"hp"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BattleLogByIdQuery, BattleLogByIdQueryVariables>;
export const BattleLogsByLobbyIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BattleLogsByLobbyId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lobbyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"battleLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lobby"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lobbyId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BattleLogsByLobbyIdQuery, BattleLogsByLobbyIdQueryVariables>;
export const AllCharactersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCharacters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}}]} as unknown as DocumentNode<AllCharactersQuery, AllCharactersQueryVariables>;
export const CharactersByOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CharactersByOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner_eq"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner_eq"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}}]} as unknown as DocumentNode<CharactersByOwnerQuery, CharactersByOwnerQueryVariables>;
export const CharacterByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CharacterById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"character_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"character_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}}]}}]}}]} as unknown as DocumentNode<CharacterByIdQuery, CharacterByIdQueryVariables>;
export const LobbiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Lobbies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lobbies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"reservationsCount"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<LobbiesQuery, LobbiesQueryVariables>;
export const LobbyById2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LobbyById2"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lobbyById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"reservationsCount"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"battleLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<LobbyById2Query, LobbyById2QueryVariables>;