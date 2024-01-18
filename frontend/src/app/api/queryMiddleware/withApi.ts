import { useApi } from "@gear-js/react-hooks";
import { Middleware } from "react-query-kit";

export const withApi: Middleware = (useQueryNext) => {
  return (options) => {
    const { api } = useApi();

    return useQueryNext({
      ...options,
      meta: {
        ...options.meta,
        api,
      },
    });
  };
};
