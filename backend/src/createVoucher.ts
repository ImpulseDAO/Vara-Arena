import { GearApi, decodeAddress, VoucherIssuedData } from "@gear-js/api";
import { type HexString } from "@polkadot/util/types";
import {
  AMOUNT_IN_VARA,
  GAME_ADDRESS,
  GAME_ADDRESS_2,
  KEYRING,
  NODE_ADDRESS,
} from "./consts";

export const createVoucher = async (
  accountUser: HexString,
  programId: HexString = GAME_ADDRESS,
  programId2: HexString | null = GAME_ADDRESS_2
) => {
  const api = await GearApi.create({
    providerAddress: NODE_ADDRESS,
  });

  const account = decodeAddress(accountUser);

  const tx = api.voucher.issue(
    account,
    programId,
    AMOUNT_IN_VARA * 10 ** api.registry.chainDecimals[0]
  );

  let tx2 = programId2
    ? api.voucher.issue(
        account,
        programId2,
        AMOUNT_IN_VARA * 10 ** api.registry.chainDecimals[0]
      )
    : null;

  const extrinsics = [tx, tx2].filter(Boolean).map((tx) => tx?.extrinsic);

  return extrinsics.map((extrinsic) => {
    return new Promise<VoucherIssuedData>((resolve, reject) => {
      if (!KEYRING) {
        reject(new Error("Keyring is not defined"));
        return;
      }

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
  });
};
