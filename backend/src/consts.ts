import { GearKeyring, type HexString } from "@gear-js/api";
import { readFileSync } from "fs";

export const PORT = process.env.PORT;

export const NODE_ADDRESS = process.env.NODE_ADDRESS;
export const GAME_ADDRESS = process.env.GAME_ADDRESS as HexString;
export const KEYRING_PATH = process.env.PATH_TO_KEYS || "";
export const KEYRING_JSON_CONTENT_STRING =
  process.env.KEYRING_JSON_CONTENT_STRING;
export const KEYRING_PASSPHRASE = process.env.KEYRING_PASSPHRASE;

export const AMOUNT_IN_VARA = process.env.AMOUNT_IN_VARA as any as number;

const jsonKeyring = KEYRING_PATH
  ? readFileSync(KEYRING_PATH).toString()
  : (KEYRING_JSON_CONTENT_STRING as string);
export const KEYRING = GearKeyring.fromJson(jsonKeyring, KEYRING_PASSPHRASE);
