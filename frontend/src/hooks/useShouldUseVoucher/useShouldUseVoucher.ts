import { useBalanceFormat, useVoucher } from "@gear-js/react-hooks";

export const useShouldUseVoucher = (contractId: HexString) => {
  /**
   * Voucher
   */

  const { getFormattedBalanceValue } = useBalanceFormat();
  const { isVoucherExists, voucherBalance, isVoucherReady } =
    useVoucher(contractId);
  const formattedBalance =
    voucherBalance &&
    getFormattedBalanceValue(voucherBalance.toString()).toFixed();

  const shouldUseVoucher =
    isVoucherReady && isVoucherExists && formattedBalance > 10;

  return shouldUseVoucher;
};
