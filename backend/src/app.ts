import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { HexString } from "@polkadot/util/types";
import { PORT } from "./consts";
import { createVoucher } from "./createVoucher";

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
    const voucherIssuedData = await createVoucher(accountUser);

    if (voucherIssuedData) {
      res.send(voucherIssuedData);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use(PREFIX, express.static("public/voucher"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(PREFIX ? `address prefix :>> ${PREFIX}` : "no address prefix");
});
