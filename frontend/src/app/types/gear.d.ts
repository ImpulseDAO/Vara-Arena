type HexString = import("@polkadot/util/types").HexString;
type AnyJson = import("@polkadot/types/types").AnyJson;
type ProgramMetadata = import("@gear-js/api").ProgramMetadata;

type MetaWasmDataType = {
  programId: HexString | undefined;
  wasm: Buffer | Uint8Array | undefined;
  programMetadata: ProgramMetadata | undefined;
  functionName: string | undefined;
  payload?: AnyJson;
  argument?: AnyJson;
};
