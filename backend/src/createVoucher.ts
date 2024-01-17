import { GearApi, decodeAddress, VoucherIssuedData } from "@gear-js/api";
import { type HexString } from "@polkadot/util/types";
import { AMOUNT_IN_VARA, GAME_ADDRESS, KEYRING, NODE_ADDRESS } from "./consts";

export const createVoucher = async (
  accountUser: HexString,
  programId: HexString = GAME_ADDRESS
) => {
  const api = await GearApi.create({
    providerAddress: NODE_ADDRESS,
  });

  const account = decodeAddress(accountUser);

  // Specify the number of issues
  const tx = api.voucher.issue(
    account,
    programId,
    AMOUNT_IN_VARA * 10 ** api.registry.chainDecimals[0]
  );

  const extrinsic = tx.extrinsic;

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
