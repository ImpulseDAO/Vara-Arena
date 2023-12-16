import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1000 from '../v1000'

export const userMessageSent =  {
    name: 'Gear.UserMessageSent',
    /**
     * Somebody sent a message to the user.
     */
    v1000: new EventType(
        'Gear.UserMessageSent',
        sts.struct({
            /**
             * Message sent.
             */
            message: v1000.UserMessage,
            /**
             * Block number of expiration from `Mailbox`.
             * 
             * Equals `Some(_)` with block number when message
             * will be removed from `Mailbox` due to some
             * reasons (see #642, #646 and #1010).
             * 
             * Equals `None` if message wasn't inserted to
             * `Mailbox` and appears as only `Event`.
             */
            expiration: sts.option(() => sts.number()),
        })
    ),
}
