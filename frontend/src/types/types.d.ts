/**
 * Vouchers
 */

type IVoucherDetails = import("@gear-js/api").IVoucherDetails;

type VouchersInfo = {
  id: HexString;
  balance?: Balance;
} & IVoucherDetails;

/**
 *
 */
