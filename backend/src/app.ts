import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { HexString } from "@polkadot/util/types";
import { GAME_ADDRESS, GAME_ADDRESS_2, PORT } from "./consts";
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

    const promises = await Promise.allSettled([
      createVoucher(accountUser, GAME_ADDRESS),
      GAME_ADDRESS_2 ? createVoucher(accountUser, GAME_ADDRESS_2) : null,
    ]);

    const bothRejected = promises.every(
      (promise) => promise.status === "rejected"
    );

    const bothFulfilled = promises.every(
      (promise) => promise.status === "fulfilled"
    );

    if (bothRejected) {
      res.status(500).send({
        message: "Failed to create voucher",
        reasons: promises.map(
          (promise) => (promise as PromiseRejectedResult)?.reason
        ),
      });
      return;
    } else if (bothFulfilled) {
      res.status(500).send({
        message: "Vouchers created successfully",
        results: promises.map(
          (promise) => (promise as PromiseFulfilledResult<any>)?.value
        ),
      });
      return;
    } else {
      res.send({
        message: "Only one voucher was created",
        settledPromisesData: promises,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.use(PREFIX, express.static("public/voucher"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  console.log(PREFIX ? `address prefix :>> ${PREFIX}` : "no address prefix");
});
