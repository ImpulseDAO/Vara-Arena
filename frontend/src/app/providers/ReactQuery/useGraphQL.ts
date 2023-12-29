import request from "graphql-request";
import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { GRAPHQL_API_URL } from "app/api/consts";

export function useGraphQL<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>, // never changes
  variables?: TVariables extends Record<string, never> ? never : TVariables
): UseQueryResult<TResult> {
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [(document.definitions[0] as any).name?.value, variables],
    queryFn: async ({ queryKey }) => {
      const variables = queryKey[1] as TVariables;
      return request(
        GRAPHQL_API_URL,
        document,
        variables ? variables : undefined
      );
    },
  });
}
