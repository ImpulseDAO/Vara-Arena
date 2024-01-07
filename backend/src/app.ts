import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import {
  GearApi,
  GearKeyring,
  decodeAddress,
  VoucherIssuedData,
} from "@gear-js/api";
import { HexString } from "@polkadot/util/types";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

const NODE_ADDRESS = process.env.NODE_ADDRESS;
const GAME_ADDRESS = process.env.GAME_ADDRESS;
const KEYRING_PATH = process.env.PATH_TO_KEYS || "";
const KEYRING_PASSPHRASE = process.env.KEYRING_PASSPHRASE;

const jsonKeyring = readFileSync(KEYRING_PATH).toString();
const KEYRING = GearKeyring.fromJson(jsonKeyring, KEYRING_PASSPHRASE);

const createVoucher = async (accountUser: HexString) => {
  const api = await GearApi.create({
    providerAddress: NODE_ADDRESS,
  });

  const programId = GAME_ADDRESS as HexString;
  const account = decodeAddress(accountUser);

  // Specify the number of issues
  const tx = api.voucher.issue(
    account,
    programId,
    15 * 10 ** api.registry.chainDecimals[0]
  );

  const extrinsic = tx.extrinsic;

  return new Promise((resolve, reject) => {
    extrinsic
      .signAndSend(KEYRING, async ({ events, status, isError }) => {
        if (status.isInBlock) {
          const viEvent = events.find(({ event }) => {
            if (event.method === "ExtrinsicFailed") {
              const error = api.getExtrinsicFailedError(event);

              console.log("error", error);
              reject(error);
            }
            return event.method === "VoucherIssued";
          });

          const data = viEvent?.event.data as VoucherIssuedData;

          if (data) {
            resolve(true);
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

app.post("/", async (req: Request, res: Response) => {
  try {
    const accountUser = req.body.account as HexString;

    const voucher = await createVoucher(accountUser);

    if (voucher) {
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/", async (req: Request, res: Response) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
