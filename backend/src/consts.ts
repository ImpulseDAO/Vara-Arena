import { GearKeyring, type HexString } from "@gear-js/api";
import { readFileSync } from "fs";

const envsRequired = [
  "NODE_ADDRESS",
  "GAME_ADDRESS",
  "GAME_ADDRESS_2",
  "KEYRING_PASSPHRASE",
  "AMOUNT_IN_VARA",
  "VOUCHER_DURATION",
  "PORT",
];

switch (true) {
  case envsRequired.some((envVar) => process.env[envVar] == null):
    throw new Error(
      `Some of the required environment variables are not set: ${envsRequired.join(
        ", "
      )}`
    );
  case process.env.KEYRING_JSON_CONTENT_STRING == null ||
    process.env.PATH_TO_KEYS == null:
    throw new Error(
      "Either KEYRING_JSON_CONTENT_STRING or PATH_TO_KEYS env variable should be set."
    );

    break;
}

export const PORT = process.env.PORT;

export const NODE_ADDRESS = process.env.NODE_ADDRESS;
export const GAME_ADDRESS = process.env.GAME_ADDRESS as HexString;
export const GAME_ADDRESS_2 = process.env.GAME_ADDRESS_2 as HexString | null;
export const KEYRING_PATH = process.env.PATH_TO_KEYS || "";
export const KEYRING_JSON_CONTENT_STRING =
  process.env.KEYRING_JSON_CONTENT_STRING;
export const KEYRING_PASSPHRASE = process.env.KEYRING_PASSPHRASE;

export const AMOUNT_IN_VARA = process.env.AMOUNT_IN_VARA as any as number;
export const VOUCHER_DURATION = process.env.VOUCHER_DURATION as any as number;

const jsonKeyring = KEYRING_PATH
  ? readFileSync(KEYRING_PATH).toString()
  : (KEYRING_JSON_CONTENT_STRING as string);
export const KEYRING = GearKeyring.fromJson(jsonKeyring, KEYRING_PASSPHRASE);
