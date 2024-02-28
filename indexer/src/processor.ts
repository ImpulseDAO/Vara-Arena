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

export const MINT_ADDRESS = '0x4367a287b400b2c061714b31615649dcd61853a859fdf2c77f956b1a8cb2c779'
export const ARENA_ADDRESS = '0xe2aa664e81202c9ae6d0a59dbfc52951e26ca0992ad354f3533eb3d63873d2f0'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('vara', { release: 'ArrowSquid' }),
        chain: assertNotNull(process.env.RPC_ENDPOINT)
    })
    .setBlockRange({ from: 9373896 })
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
