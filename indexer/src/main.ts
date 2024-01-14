import { TypeormDatabase } from '@subsquid/typeorm-store'
import { Store } from '@subsquid/typeorm-store'

import { processor, MINT_ADDRESS, ARENA_ADDRESS } from './processor'
import { Character, Lobby, LobbyCharacter, BattleLog, Mint } from './model'
import { events } from './types'
import { handleMintMessage, handleArenaMessage } from './handlers'

let mint: Mint | undefined

async function getMint(store: Store) {
    if (mint) {
        return mint
    }

    mint = await store.findOne(Mint, { where: { id: "0" } })

    if (!mint) {
        mint = new Mint({ id: '0', poolAmount: 0 })
    }

    return mint
}


processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    let characters: Map<string, Character> = new Map()
    let lobbies: Map<string, Lobby> = new Map()
    let lobbiesCharacter: Map<string, LobbyCharacter> = new Map()
    let battleLogs: Map<string, BattleLog> = new Map()
    let mint = await getMint(ctx.store)

    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (events.gear.userMessageSent.v1000.is(event)) {
                let { message } = events.gear.userMessageSent.v1000.decode(event)

                if (message.details?.code.__kind == 'Error') {
                    console.log('skipping unsuccessful message')
                    continue
                }

                if (message.payload == '0x') {
                    console.log('skipping contract initialization event')
                    continue
                }

                if (message.source == MINT_ADDRESS) {
                    await handleMintMessage(message, ctx.store, mint, characters)
                } else if (message.source == ARENA_ADDRESS) {
                    await handleArenaMessage(message, ctx.store, characters, lobbies, lobbiesCharacter, battleLogs)
                }
            }
        }
    }

    await ctx.store.upsert([...characters.values()])
    await ctx.store.upsert([...lobbies.values()])
    await ctx.store.insert([...lobbiesCharacter.values()])
    await ctx.store.insert([...battleLogs.values()])
    await ctx.store.upsert(mint)
})
