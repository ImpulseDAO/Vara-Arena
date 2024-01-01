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

export const MINT_ADDRESS = '0x8601d263613d1b34249b5846b2c7085a7990e2c7b8a6effebb79157aa8725daf'
export const ARENA_ADDRESS = '0x3dd15018150e5eab8a0d5b767697779e99bf9dce020a5c4d6fca73c99ce93ed5'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('vara-testnet', { release: 'ArrowSquid' }),
        chain: assertNotNull(process.env.RPC_ENDPOINT)
    })
    .setBlockRange({ from: 2919401 })
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
