import { useApi } from "@gear-js/react-hooks";
import { MINT_PROGRAM_ID } from "consts";
import { useMyAccountId } from "hooks/hooks";
import { useCallback } from "react";

export const useGetMyVouchers = () => {
  const { api } = useApi();
  const myAccountId = useMyAccountId();

  const getMyVouchers = useCallback(async () => {
    if (!myAccountId) throw new Error("No accountId");
    if (!api) throw new Error("No api");

    const vouchersMap = await api.voucher.getAllForAccount(
      myAccountId,
      MINT_PROGRAM_ID
    );

    const voucherInfos: VouchersInfo[] = await Promise.all(
      Object.keys(vouchersMap)
        .map(async (voucherId) => {
          return {
            id: voucherId as HexString,
            balance: (await api?.balance.findOut(voucherId))?.toNumber(),
            ...vouchersMap[voucherId],
          };
        })
        .filter(Boolean)
    );

    return voucherInfos;
  }, [api, myAccountId]);

  return {
    getMyVouchers,
  };
};
