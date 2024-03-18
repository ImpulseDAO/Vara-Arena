import { useHandleCalculateGas, withoutCommas } from "@gear-js/react-hooks";
import { AnyNumber } from "@polkadot/types/types";
import { useCallback } from "react";

export const useMyHandleCalculateGas = (
  programId: `0x${string}`,
  meta: ProgramMetadata
) => {
  const calculateGasOriginal = useHandleCalculateGas(programId, meta);

  const calculateGas = useCallback(
    (initPayload: AnyJson, value?: AnyNumber | undefined) => {
      return calculateGasOriginal(initPayload, value)
        .then((res) => res.toHuman())
        .then((resultOfCalculateGas) => {
          const { min_limit } = resultOfCalculateGas;
          const minLimit = withoutCommas(min_limit as string);
          const gasLimit = Math.floor(
            Number(minLimit) + Number(minLimit) * 0.2
          );
          return gasLimit;
        });
    },
    [calculateGasOriginal]
  );

  return {
    calculateGas,
  };
};
