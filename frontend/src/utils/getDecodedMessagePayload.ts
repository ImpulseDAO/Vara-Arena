import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

interface IBase {
  genesis: string;
  timestamp: string;
  blockHash: string | null;
}

enum Type {
  MessageQueued = 'MessageQueued',
  UserMessageSent = 'UserMessageSent',

  // TODO: db entity has only MessageQueued and UserMessageSent values,
  // do we need the rest?

  // CodeChanged = 'CodeChanged',
  // DatabaseWiped = 'DatabaseWiped',
  // ProgramChanged = 'ProgramChanged',
  // UserMessageRead = 'UserMessageRead',
  // MessagesDispatched = 'MessagesDispatched',
}

enum ReadReason {
  OutOfRent = 'OutOfRent',
  Claimed = 'Claimed',
  Replied = 'Replied',
}

enum EntryPoint {
  Init = 'init',
  Handle = 'handle',
  Reply = 'reply',
}

enum ProgramStatus {
  Unknown = 'unknown',
  Active = 'active',
  Terminated = 'terminated',
  InitFailed = 'init_failed',
  Paused = 'paused',
  Exited = 'exited',

  // TODO: old ones
  // Success = 'success',
  // Failed = 'failed',
  // InProgress = 'in progress',
}

enum CodeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

interface IMeta {
  hex: HexString;
  types: ProgramMetadata['types'];
}

interface ICode extends IBase {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  expiration: string | null;
  uploadedBy: string;
  meta: IMeta | null;
  programs?: IProgram[];
}

interface IProgram extends IBase {
  _id: string;
  id: HexString;
  owner: string;
  name: string;
  status: ProgramStatus;
  messages: IMessage[];
  title: string | null;
  expiration?: number;
  code?: ICode;
  meta?: IMeta;
}

interface IMessage extends IBase {
  id: string;
  destination: string;
  source: string;
  value: string;
  payload: string | null;
  exitCode: number | null;
  replyToMessageId: string | null;
  processedWithPanic: boolean | null;
  entry: EntryPoint | null;
  expiration: number | null;
  type: Type | null;
  readReason: ReadReason | null;
  program: IProgram | null;
}

export const getDecodedMessagePayload = (
  meta: ProgramMetadata,
  message: IMessage
) => {
  const { entry, payload } = message;
  const isMessageQueued = message.type === 'MessageQueued';

  let type: number | undefined;

  switch (entry) {
    case EntryPoint.Init: {
      type = isMessageQueued ? meta.types.init.input : meta.types.init.output;
      break;
    }

    case EntryPoint.Reply: {
      type = isMessageQueued ? meta.types.reply.input : meta.types.reply.output;
      break;
    }

    case EntryPoint.Handle: {
      type = isMessageQueued
        ? meta.types.handle.input
        : meta.types.handle.output;
      break;
    }

    default:
      type = isMessageQueued
        ? meta.types.others.input
        : meta.types.others.output;
      break;
  }

  return type !== undefined && type !== null
    ? meta.createType(type, payload)
    : payload;
};
