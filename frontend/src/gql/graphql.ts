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

export type Character = {
  __typename?: 'Character';
  attributes: Scalars['JSON']['output'];
  experience: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
};

export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  cursor: Scalars['String']['output'];
  node: Character;
};

export enum CharacterOrderByInput {
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
  NameAsc = 'name_ASC',
  NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
  NameDesc = 'name_DESC',
  NameDescNullsLast = 'name_DESC_NULLS_LAST',
  OwnerAsc = 'owner_ASC',
  OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
  OwnerDesc = 'owner_DESC',
  OwnerDescNullsLast = 'owner_DESC_NULLS_LAST'
}

export type CharacterWhereInput = {
  AND?: InputMaybe<Array<CharacterWhereInput>>;
  OR?: InputMaybe<Array<CharacterWhereInput>>;
  attributes_eq?: InputMaybe<Scalars['JSON']['input']>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']['input']>;
  attributes_jsonContains?: InputMaybe<Scalars['JSON']['input']>;
  attributes_jsonHasKey?: InputMaybe<Scalars['JSON']['input']>;
  attributes_not_eq?: InputMaybe<Scalars['JSON']['input']>;
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
  characters: Array<LobbyCharacter>;
  id: Scalars['String']['output'];
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
  CharacterNameAsc = 'character_name_ASC',
  CharacterNameAscNullsFirst = 'character_name_ASC_NULLS_FIRST',
  CharacterNameDesc = 'character_name_DESC',
  CharacterNameDescNullsLast = 'character_name_DESC_NULLS_LAST',
  CharacterOwnerAsc = 'character_owner_ASC',
  CharacterOwnerAscNullsFirst = 'character_owner_ASC_NULLS_FIRST',
  CharacterOwnerDesc = 'character_owner_DESC',
  CharacterOwnerDescNullsLast = 'character_owner_DESC_NULLS_LAST',
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST',
  LobbyIdAsc = 'lobby_id_ASC',
  LobbyIdAscNullsFirst = 'lobby_id_ASC_NULLS_FIRST',
  LobbyIdDesc = 'lobby_id_DESC',
  LobbyIdDescNullsLast = 'lobby_id_DESC_NULLS_LAST'
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
  IdAsc = 'id_ASC',
  IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
  IdDesc = 'id_DESC',
  IdDescNullsLast = 'id_DESC_NULLS_LAST'
}

export type LobbyWhereInput = {
  AND?: InputMaybe<Array<LobbyWhereInput>>;
  OR?: InputMaybe<Array<LobbyWhereInput>>;
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
  squidStatus?: Maybe<SquidStatus>;
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

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']['output']>;
};

export type WhereIdInput = {
  id: Scalars['String']['input'];
};

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


export type LobbiesQuery = { __typename?: 'Query', lobbies: Array<{ __typename?: 'Lobby', id: string, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', name: string, owner: string, level: number, id: string, experience: number, attributes: any } }> }> };

export type LobbyByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type LobbyByIdQuery = { __typename?: 'Query', lobbyById?: { __typename?: 'Lobby', id: string, characters: Array<{ __typename?: 'LobbyCharacter', id: string, character: { __typename?: 'Character', attributes: any, experience: number, id: string, level: number, name: string, owner: string } }> } | null };


export const AllCharactersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCharacters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}}]} as unknown as DocumentNode<AllCharactersQuery, AllCharactersQueryVariables>;
export const CharactersByOwnerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CharactersByOwner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"owner_eq"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characters"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"owner_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"owner_eq"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}}]} as unknown as DocumentNode<CharactersByOwnerQuery, CharactersByOwnerQueryVariables>;
export const CharacterByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CharacterById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"character_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"characterById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"character_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}}]}}]}}]} as unknown as DocumentNode<CharacterByIdQuery, CharacterByIdQueryVariables>;
export const LobbiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Lobbies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lobbies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"attributes"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LobbiesQuery, LobbiesQueryVariables>;
export const LobbyByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LobbyById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lobbyById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"characters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"character"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attributes"}},{"kind":"Field","name":{"kind":"Name","value":"experience"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<LobbyByIdQuery, LobbyByIdQueryVariables>;