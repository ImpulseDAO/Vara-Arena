import request from "graphql-request";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  type DefaultError,
  useQuery,
  UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { GRAPHQL_API_URL } from "app/api/consts";

export const getGraphQLPrimaryKey = (document: TypedDocumentNode<any, any>) => {
  return (document.definitions[0] as any).name?.value as string;
};

export function useGraphQL<
  TVariables,
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData
>(
  document: TypedDocumentNode<TQueryFnData, TVariables>, // never changes
  variables?: TVariables extends Record<string, never> ? never : TVariables,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TData, TError> {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [getGraphQLPrimaryKey(document), variables],
    queryFn: async ({ queryKey }) => {
      const variables = queryKey[1] as TVariables;
      return request(
        GRAPHQL_API_URL,
        document,
        variables ? variables : undefined
      );
    },
    ...options,
  });
}
