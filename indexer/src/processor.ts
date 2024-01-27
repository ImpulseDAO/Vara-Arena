import { assertNotNull } from '@subsquid/util-internal'
import { lookupArchive } from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

export const MINT_ADDRESS = '0xd79b893958808919fd706a3ac9246efec62886cbf7543e45b1ac8091ac497298'
export const ARENA_ADDRESS = '0xc9a092eca4ee816f331b7528dc6f0ff571f00c58504ec47ab8157ccb2e79e40c'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('vara-testnet', { release: 'ArrowSquid' }),
        chain: assertNotNull(process.env.RPC_ENDPOINT)
    })
    .setBlockRange({ from: 3320839 })
    .addGearUserMessageSent({ programId: [MINT_ADDRESS, ARENA_ADDRESS] })
    .setFields({
        event: {
            args: true
        },
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
