import {sts, Result, Option, Bytes, BitSequence} from './support'

export const UserMessage: sts.Type<UserMessage> = sts.struct(() => {
    return  {
        id: MessageId,
        source: ProgramId,
        destination: ProgramId,
        payload: sts.bytes(),
        value: sts.bigint(),
        details: sts.option(() => ReplyDetails),
    }
})

export const ReplyDetails: sts.Type<ReplyDetails> = sts.struct(() => {
    return  {
        to: MessageId,
        code: ReplyCode,
    }
})

export const ReplyCode: sts.Type<ReplyCode> = sts.closedEnum(() => {
    return  {
        Error: ErrorReplyReason,
        Success: SuccessReplyReason,
        Unsupported: sts.unit(),
    }
})

export const SuccessReplyReason: sts.Type<SuccessReplyReason> = sts.closedEnum(() => {
    return  {
        Auto: sts.unit(),
        Manual: sts.unit(),
        Unsupported: sts.unit(),
    }
})

export type SuccessReplyReason = SuccessReplyReason_Auto | SuccessReplyReason_Manual | SuccessReplyReason_Unsupported

export interface SuccessReplyReason_Auto {
    __kind: 'Auto'
}

export interface SuccessReplyReason_Manual {
    __kind: 'Manual'
}

export interface SuccessReplyReason_Unsupported {
    __kind: 'Unsupported'
}

export const ErrorReplyReason: sts.Type<ErrorReplyReason> = sts.closedEnum(() => {
    return  {
        Execution: SimpleExecutionError,
        FailedToCreateProgram: SimpleProgramCreationError,
        InactiveProgram: sts.unit(),
        RemovedFromWaitlist: sts.unit(),
        Unsupported: sts.unit(),
    }
})

export const SimpleProgramCreationError: sts.Type<SimpleProgramCreationError> = sts.closedEnum(() => {
    return  {
        CodeNotExists: sts.unit(),
        Unsupported: sts.unit(),
    }
})

export type SimpleProgramCreationError = SimpleProgramCreationError_CodeNotExists | SimpleProgramCreationError_Unsupported

export interface SimpleProgramCreationError_CodeNotExists {
    __kind: 'CodeNotExists'
}

export interface SimpleProgramCreationError_Unsupported {
    __kind: 'Unsupported'
}

export const SimpleExecutionError: sts.Type<SimpleExecutionError> = sts.closedEnum(() => {
    return  {
        BackendError: sts.unit(),
        MemoryOverflow: sts.unit(),
        RanOutOfGas: sts.unit(),
        UnreachableInstruction: sts.unit(),
        Unsupported: sts.unit(),
        UserspacePanic: sts.unit(),
    }
})

export type SimpleExecutionError = SimpleExecutionError_BackendError | SimpleExecutionError_MemoryOverflow | SimpleExecutionError_RanOutOfGas | SimpleExecutionError_UnreachableInstruction | SimpleExecutionError_Unsupported | SimpleExecutionError_UserspacePanic

export interface SimpleExecutionError_BackendError {
    __kind: 'BackendError'
}

export interface SimpleExecutionError_MemoryOverflow {
    __kind: 'MemoryOverflow'
}

export interface SimpleExecutionError_RanOutOfGas {
    __kind: 'RanOutOfGas'
}

export interface SimpleExecutionError_UnreachableInstruction {
    __kind: 'UnreachableInstruction'
}

export interface SimpleExecutionError_Unsupported {
    __kind: 'Unsupported'
}

export interface SimpleExecutionError_UserspacePanic {
    __kind: 'UserspacePanic'
}

export type ErrorReplyReason = ErrorReplyReason_Execution | ErrorReplyReason_FailedToCreateProgram | ErrorReplyReason_InactiveProgram | ErrorReplyReason_RemovedFromWaitlist | ErrorReplyReason_Unsupported

export interface ErrorReplyReason_Execution {
    __kind: 'Execution'
    value: SimpleExecutionError
}

export interface ErrorReplyReason_FailedToCreateProgram {
    __kind: 'FailedToCreateProgram'
    value: SimpleProgramCreationError
}

export interface ErrorReplyReason_InactiveProgram {
    __kind: 'InactiveProgram'
}

export interface ErrorReplyReason_RemovedFromWaitlist {
    __kind: 'RemovedFromWaitlist'
}

export interface ErrorReplyReason_Unsupported {
    __kind: 'Unsupported'
}

export type ReplyCode = ReplyCode_Error | ReplyCode_Success | ReplyCode_Unsupported

export interface ReplyCode_Error {
    __kind: 'Error'
    value: ErrorReplyReason
}

export interface ReplyCode_Success {
    __kind: 'Success'
    value: SuccessReplyReason
}

export interface ReplyCode_Unsupported {
    __kind: 'Unsupported'
}

export interface ReplyDetails {
    to: MessageId
    code: ReplyCode
}

export type MessageId = Bytes

export const ProgramId = sts.bytes()

export const MessageId = sts.bytes()

export interface UserMessage {
    id: MessageId
    source: ProgramId
    destination: ProgramId
    payload: Bytes
    value: bigint
    details?: (ReplyDetails | undefined)
}

export type ProgramId = Bytes
