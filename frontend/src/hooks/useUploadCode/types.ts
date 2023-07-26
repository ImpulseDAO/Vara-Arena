/**
 *  TODO: clean this file up and remove things that can be removed
 * some of the types certainly can be imported from gear lib
 */

import { HexString } from "@polkadot/util/types";

import { Signer } from "@polkadot/api/types";

type OperationCallbacks = {
  reject?: () => void;
  resolve?: (codeId: string) => void;
};

type CommonParamsToSignAndSend = OperationCallbacks & {
  signer: Signer;
};

type ParamsToUploadCode = {
  optBuffer: Buffer;
  name: string;
  metaHex: HexString | undefined;
  resolve: (codeId: string) => void;
};

type ParamsToSignAndSend = Omit<CommonParamsToSignAndSend, "reject"> & {
  name: string;
  codeId: HexString;
  metaHex: HexString | undefined;
};

export type { ParamsToUploadCode, ParamsToSignAndSend };

export enum Method {
  Transfer = "Transfer",
  CodeChanged = "CodeChanged",
  ProgramChanged = "ProgramChanged",
  UserMessageSent = "UserMessageSent",
  UserMessageRead = "UserMessageRead",
  MessageQueued = "MessageQueued",
  MessagesDispatched = "MessagesDispatched",
  MessageWaited = "MessageWaited",
  MessageWaken = "MessageWaken",
  ExtrinsicFailed = "ExtrinsicFailed",
  ExtrinsicSuccess = "ExtrinsicSuccess",
}

export enum TransactionName {
  SendReply = "gear.sendReply",
  SendMessage = "gear.sendMessage",
  ClaimMessage = "gear.claimValueFromMailbox",
  SubmitCode = "gear.submitCode",
  CreateProgram = "gear.createProgram",
  UploadProgram = "gear.uploadProgram",
}

export enum TransactionStatus {
  Ready = "Ready",
  InBlock = "InBlock",
  IsInvalid = "IsInvalid",
  Finalized = "Finalized",
}

export const PROGRAM_ERRORS = {
  BALANCE_LOW: "Invalid transaction. Account balance too low",
  UNAUTHORIZED: "Unauthorized",
  PAYLOAD_ERROR: "payload.toHex is not a function",
  INVALID_PARAMS: "Invalid method parameters",
  GEAR_NODE_ERROR: "Gear node error",
  INVALID_TRANSACTION: "Transaction error. Status: isInvalid",
  PROGRAM_INIT_FAILED: "Program initialization failed",
};
