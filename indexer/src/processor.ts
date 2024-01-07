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

export const MINT_ADDRESS = '0x356733d944f2f35a312c0258d9ba859fd72ecf567485ad1c0ea82e38783a6328'
export const ARENA_ADDRESS = '0xfa29e61fefa098fc2b33e72e34c952dce40aacfc1c1067d60ec3d07b372e2f45'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('vara-testnet', { release: 'ArrowSquid' }),
        chain: assertNotNull(process.env.RPC_ENDPOINT)
    })
    .setBlockRange({ from: 3050802 })
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
