import { useSendToArena, useSendToMintContract } from "app/api/sendMessages";
import { useGetMyVouchers } from "hooks/useMyVouchers";
import { useCallback } from "react";

export const useFindMyVoucher = () => {
  const { calculateGas: calculateGasForArena } = useSendToArena();
  const { calculateGas: calculateGasForMint } = useSendToMintContract();
  const { getMyVouchers } = useGetMyVouchers();

  /**
   * Find a voucher that has enough balance to pay for the gas.
   *
   * You can use 'gasLimit' returned from this function to calculate the gas needed for the transaction.
   */
  const findVoucher = useCallback(
    async (payload, to: "ARENA" | "MINT") => {
      const gasLimit =
        to === "ARENA"
          ? await calculateGasForArena(payload)
          : await calculateGasForMint(payload);

      const myVouchers = await getMyVouchers();
      const voucherToPayWith = myVouchers.find(
        (voucherInfo) => voucherInfo.balance > gasLimit
      );
      const voucherId = voucherToPayWith?.id;
      return { voucherId, gasLimit };
    },
    [calculateGasForArena, calculateGasForMint, getMyVouchers]
  );

  return {
    findVoucher,
  };
};
