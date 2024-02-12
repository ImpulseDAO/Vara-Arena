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
  try {
    const accountUser = req.body.account as HexString;

    const programs = [GAME_ADDRESS, GAME_ADDRESS_2].filter(Boolean);

    const data: (PromiseSettledResult<VoucherIssuedData> & {
      programId: HexString;
    })[] = [];

    for (const program of programs) {
      try {
        const result = await createVoucher(accountUser, program);
        data.push({ status: "fulfilled", value: result, programId: program });
      } catch (error) {
        data.push({ status: "rejected", reason: error, programId: program });
      }
    }

    const bothRejected = data.every((item) => item.status === "rejected");

    if (bothRejected) {
      throw new Error("Error creating voucher. Both vouchers rejected.");
    }

    res.send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use(PREFIX, express.static("public/voucher"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(PREFIX ? `address prefix :>> ${PREFIX}` : "no address prefix");
});
