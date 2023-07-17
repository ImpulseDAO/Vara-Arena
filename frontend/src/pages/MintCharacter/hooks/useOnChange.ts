import { ChangeEvent, useCallback } from "react";

export const useOnChange = (
  setData: (
    value: React.SetStateAction<{
      codeId: string;
      name: string;
    }>
  ) => void
) => {
  return useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    },
    [setData]
  );
};
