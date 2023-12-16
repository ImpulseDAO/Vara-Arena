import { ProgramMetadata } from '@gear-js/api';
import { assertNotNull } from '@subsquid/substrate-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store'

import { processor, MINT_ADDRESS } from './processor'
import { Character } from './model'
import { events } from './types'

const meta = ProgramMetadata.from('000200000001000000000108000000010b00000000000000010d00000005104400081c6d696e745f696f284d696e74416374696f6e0001143c4372656174654368617261637465720c011c636f64655f6964040118436f646549640001106e616d65100118537472696e670001286174747269627574657314014c4368617261637465724174747269627574657300000034436861726163746572496e666f0401206f776e65725f696418011c4163746f72496400010030426174746c65526573756c740401206f776e65725f696418011c4163746f724964000200205365744172656e610401206172656e615f696418011c4163746f7249640003001c4c6576656c5570040110617474721c013c41747472696275746543686f696365000400000410106773746418636f6d6d6f6e287072696d69746976657318436f64654964000004000801205b75383b2033325d000008000003200000000c000c000005030010000005020014081c6d696e745f696f4c436861726163746572417474726962757465730000140120737472656e6774680c0108753800011c6167696c6974790c01087538000120766974616c6974790c0108753800011c7374616d696e610c01087538000130696e74656c6c6967656e63650c0108753800001810106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d00001c081c6d696e745f696f3c41747472696275746543686f69636500011020537472656e6774680000001c4167696c69747900010020566974616c6974790002001c5374616d696e610003000020081c6d696e745f696f244d696e744576656e7400010c40436861726163746572437265617465640401386368617261637465725f696e666f240134436861726163746572496e666f0000002c5870496e637265617365640801306368617261637465725f696418011c4163746f724964000108787028010c753332000100304c6576656c557064617465640801306368617261637465725f696418011c4163746f724964000110617474721c013c41747472696275746543686f6963650002000024081c6d696e745f696f34436861726163746572496e666f0000140108696418011c4163746f7249640001106e616d65100118537472696e670001286174747269627574657314014c436861726163746572417474726962757465730001146c6576656c0c01087538000128657870657269656e636528010c75333200002800000505002c0000040830300030000004000034081c6d696e745f696f244d696e74537461746500000401286368617261637465727338018042547265654d61703c4163746f7249642c20436861726163746572496e666f3e000038042042547265654d617008044b0118045601240004003c0000003c00000240004000000408182400')

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    let characters: Map<string, Character> = new Map()

    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (events.gear.userMessageSent.v1000.is(event)) {
                let { message } = events.gear.userMessageSent.v1000.decode(event)
                if (message.source == MINT_ADDRESS) {
                    let data = meta.createType(assertNotNull(meta.types.handle.output), message.payload).toJSON() as any

                    if (data.characterCreated) {
                        let info = data.characterCreated.characterInfo
                        let character = new Character({
                            ...info,
                            owner: message.destination
                        })
                        characters.set(character.id, character)
                    } else if (data.xpIncreased) {
                        let character = characters.get(data.xpIncreased.characterId)
                        if (character == null) {
                            character = await ctx.store.findOneOrFail(Character, { where: { id: data.xpIncreased.characterId } })
                            characters.set(character.id, character)
                        }
                        character.experience = data.xpIncreased.xp
                    } else if (data.levelUpdated) {
                        if (!['strength', 'agility', 'vitality', 'stamina'].includes(data.levelUpdated.attr)) {
                            console.log(data.levelUpdated.attr)
                            throw new Error('unknown attr')
                        }

                        let character = characters.get(data.levelUpdated.characterId)
                        if (character == null) {
                            character = await ctx.store.findOneOrFail(Character, { where: { id: data.levelUpdated.characterId } })
                            characters.set(character.id, character)
                        }
                        let attributes = JSON.parse(character.attributes as any)
                        attributes[data.levelUpdated.attr] += 1
                        character.attributes = JSON.stringify(attributes)
                    } else {
                        console.log(data);
                        throw new Error('event is not supported')
                    }
                }
            }
        }
    }

    await ctx.store.upsert([...characters.values()])
})
