import { useBalanceFormat, useVoucher } from "@gear-js/react-hooks";
import { MINT_PROGRAM_ID } from "consts";

export const useShouldUseVoucher = () => {
  /**
   * Voucher
   */

  const { getFormattedBalanceValue } = useBalanceFormat();
  const { isVoucherExists, voucherBalance, isVoucherReady } =
    useVoucher(MINT_PROGRAM_ID);
  const formattedBalance =
    voucherBalance &&
    getFormattedBalanceValue(voucherBalance.toString()).toFixed();

  const shouldUseVoucher =
    isVoucherReady && isVoucherExists && formattedBalance > 10;

  return shouldUseVoucher;
};
