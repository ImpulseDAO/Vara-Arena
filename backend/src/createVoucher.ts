import { GearApi, decodeAddress, VoucherIssuedData } from "@gear-js/api";
import { type HexString } from "@polkadot/util/types";
import {
  AMOUNT_IN_VARA,
  GAME_ADDRESS,
  KEYRING,
  NODE_ADDRESS,
  VOUCHER_DURATION,
} from "./consts";

export const createVoucher = async (
  accountUser: HexString,
  programIds: HexString[] = [GAME_ADDRESS]
) => {
  const api = await GearApi.create({
    providerAddress: NODE_ADDRESS,
  });

  const account = decodeAddress(accountUser);

  /**
   * Argument mapping
   */
  const value = AMOUNT_IN_VARA * 10 ** api.registry.chainDecimals[0];

  const tx = await api.voucher.issue(
    account,
    value,
    VOUCHER_DURATION,
    programIds,
    true
  );

  const { extrinsic, voucherId } = tx;

  return new Promise<VoucherIssuedData>((resolve, reject) => {
    extrinsic
      .signAndSend(KEYRING, async ({ events, status, isError }) => {
        if (status.isInBlock) {
          const viEvent = events.find(({ event }) => {
            if (event.method === "ExtrinsicFailed") {
              const error = api.getExtrinsicFailedError(event);
              reject(error);
            }
            return event.method === "VoucherIssued";
          });

          const data = viEvent?.event.data as VoucherIssuedData;

          if (data) {
            resolve(data);
          }
        } else if (isError) {
          const error = new Error(`Failed to create voucher`);
          reject(error);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
