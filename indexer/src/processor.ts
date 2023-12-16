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

export const MINT_ADDRESS = '0xfc0678839f288c0ed1b43241ff82e26422afbd39bf1d001714001d31e5def487'

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('vara-testnet', { release: 'ArrowSquid' }),
        chain: assertNotNull(process.env.RPC_ENDPOINT)
    })
    .setBlockRange({ from: 2473780 })
    .addGearUserMessageSent({ programId: [MINT_ADDRESS] })
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
