import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { HexString } from "@polkadot/util/types";
import { GAME_ADDRESS, GAME_ADDRESS_2, PORT } from "./consts";
import { createVoucher } from "./createVoucher";
import { type VoucherIssuedData } from "@gear-js/api";

const app: Express = express();
app.use(cors());
app.use(express.json());

/**
 * API
 */

const PREFIX = "/voucher";

app.post(`${PREFIX}/`, async (req: Request, res: Response) => {
  const accountUser = req.body.account as HexString;
  try {
    console.log(`${accountUser} is creating voucher`);

    const programs = [GAME_ADDRESS, GAME_ADDRESS_2].filter(Boolean);

    let voucherIssuedData: VoucherIssuedData = await createVoucher(
      accountUser,
      programs
    );
    console.log("data", voucherIssuedData.toHuman());

    console.log(`${accountUser} created voucher`);
    res.send(voucherIssuedData);
  } catch (error) {
    console.error(`${accountUser} failed to create voucher. Error below:`);
    console.error(error);

    res.status(500).send(error);
  }
});

// app.use(PREFIX, express.static("public/voucher"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(PREFIX ? `address prefix :>> ${PREFIX}` : "no address prefix");
});
