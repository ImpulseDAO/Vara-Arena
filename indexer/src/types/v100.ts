import {sts, Result, Option, Bytes, BitSequence} from './support'

export const StoredMessage: sts.Type<StoredMessage> = sts.struct(() => {
    return  {
        id: MessageId,
        source: ProgramId,
        destination: ProgramId,
        payload: LimitedVec,
        value: sts.bigint(),
        details: sts.option(() => MessageDetails),
    }
})

export const MessageDetails: sts.Type<MessageDetails> = sts.closedEnum(() => {
    return  {
        Reply: ReplyDetails,
        Signal: SignalDetails,
    }
})

export const SignalDetails: sts.Type<SignalDetails> = sts.struct(() => {
    return  {
        from: MessageId,
        statusCode: sts.number(),
    }
})

export interface SignalDetails {
    from: MessageId
    statusCode: number
}

export type MessageId = Bytes

export const ReplyDetails: sts.Type<ReplyDetails> = sts.struct(() => {
    return  {
        replyTo: MessageId,
        statusCode: sts.number(),
    }
})

export interface ReplyDetails {
    replyTo: MessageId
    statusCode: number
}

export type MessageDetails = MessageDetails_Reply | MessageDetails_Signal

export interface MessageDetails_Reply {
    __kind: 'Reply'
    value: ReplyDetails
}

export interface MessageDetails_Signal {
    __kind: 'Signal'
    value: SignalDetails
}

export const LimitedVec = sts.bytes()

export const ProgramId = sts.bytes()

export const MessageId = sts.bytes()

export interface StoredMessage {
    id: MessageId
    source: ProgramId
    destination: ProgramId
    payload: LimitedVec
    value: bigint
    details?: (MessageDetails | undefined)
}

export type LimitedVec = Bytes

export type ProgramId = Bytes
