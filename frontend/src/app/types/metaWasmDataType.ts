import { AnyJson } from "@polkadot/types/types";
import { ProgramMetadata } from "@gear-js/api";
import { HexString } from "@polkadot/util/types";

export type MetaWasmDataType = {
  programId: HexString | undefined;
  wasm: Buffer | Uint8Array | undefined;
  programMetadata: ProgramMetadata | undefined;
  functionName: string | undefined;
  payload?: AnyJson;
  argument?: AnyJson;
};
