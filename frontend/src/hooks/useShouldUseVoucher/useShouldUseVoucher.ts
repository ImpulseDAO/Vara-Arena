import {
  useBalanceFormat,
  useVoucherDeprecated as useVoucher,
} from "@gear-js/react-hooks";
import { useMyAccountId } from "hooks/hooks";

export const useShouldUseVoucher = (contractId: HexString) => {
  /**
   * Voucher
   */

  const accountId = useMyAccountId();
  const { getFormattedBalanceValue } = useBalanceFormat();
  const { isVoucherExists, voucherBalance, isVoucherReady } = useVoucher(
    contractId,
    accountId
  );

  const formattedBalance = voucherBalance
    ? Number(getFormattedBalanceValue(voucherBalance.toString()).toFixed())
    : 0;

  const shouldUseVoucher =
    isVoucherReady && isVoucherExists && formattedBalance > 10;

  return shouldUseVoucher;
};
