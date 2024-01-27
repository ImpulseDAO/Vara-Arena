import { ProgramMetadata } from '@gear-js/api'
import { assertNotNull } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'

import { Character, Mint } from '../model'
import { UserMessage } from '../types/v1000'

const mintMeta = ProgramMetadata.from('00020001000000000001060000000114000000011b00000000000000011d00000075288400081c6d696e745f696f18436f6e666967000024012c6c697665735f636f756e7404010875380001686761735f666f725f6461696c795f646973747269627574696f6e08010c7536340001486d696e696d756d5f6761735f616d6f756e7408010c7536340001647570646174655f696e74657276616c5f696e5f626c6f636b730c010c7533320001487265736572766174696f6e5f616d6f756e7408010c7536340001507265736572766174696f6e5f6475726174696f6e0c010c7533320001246d696e745f636f73741001304f7074696f6e3c753132383e000140676f6c645f706f6f6c5f616d6f756e741401107531323800015c736561736f6e5f6475726174696f6e5f696e5f646179731401107531323800000400000503000800000506000c00000505001004184f7074696f6e04045401140108104e6f6e6500000010536f6d65040014000001000014000005070018081c6d696e745f696f284d696e74416374696f6e00013c2041646441646d696e04011461646d696e1c011c4163746f7249640000002c52656d6f766541646d696e04011461646d696e1c011c4163746f7249640001003c4372656174654368617261637465720c011c636f64655f6964240118436f646549640001106e616d65280118537472696e67000128617474726962757465732c0144496e697469616c417474726962757465730002003c55706461746543686172616374657208011c636f64655f69643001384f7074696f6e3c436f646549643e00011c6164647265737334013c4f7074696f6e3c4163746f7249643e00030034436861726163746572496e666f0401206f776e65725f69641c011c4163746f72496400040030426174746c65526573756c741001206f776e65725f69641c011c4163746f7249640001306368617261637465725f6964140110753132380001186c6f736572733801305665633c4163746f7249643e0001207265706c795f746f1c011c4163746f724964000500205365744172656e610401206172656e615f69641c011c4163746f7249640006001c4c6576656c5570040110617474723c013c41747472696275746543686f6963650007003c4d616b655265736572766174696f6e0008006853746172744461696c79476f6c64446973747269627574696f6e0009004c446973747269627574654461696c79506f6f6c000a006453746f704461696c79476f6c64446973747269627574696f6e000b0030557064617465436f6e6669671c01686761735f666f725f6461696c795f646973747269627574696f6e40012c4f7074696f6e3c7536343e0001486d696e696d756d5f6761735f616d6f756e7440012c4f7074696f6e3c7536343e0001647570646174655f696e74657276616c5f696e5f626c6f636b7344012c4f7074696f6e3c7533323e0001487265736572766174696f6e5f616d6f756e7440012c4f7074696f6e3c7536343e0001507265736572766174696f6e5f6475726174696f6e44012c4f7074696f6e3c7533323e0001246d696e745f636f73741001304f7074696f6e3c753132383e000140676f6c645f706f6f6c5f616d6f756e741001304f7074696f6e3c753132383e000c002c4465706f73697456617261000d004446696e616c446973747269627574696f6e040180706c617965725f70657263656e746167655f666f725f766172615f646973747248012c4f7074696f6e3c7531363e000e00001c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004002001205b75383b2033325d0000200000032000000004002410106773746418636f6d6d6f6e287072696d69746976657318436f64654964000004002001205b75383b2033325d00002800000502002c081c6d696e745f696f44496e697469616c417474726962757465730000140120737472656e677468040108753800011c6167696c6974790401087538000120766974616c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e6365040108753800003004184f7074696f6e04045401240108104e6f6e6500000010536f6d6504002400000100003404184f7074696f6e040454011c0108104e6f6e6500000010536f6d6504001c0000010000380000021c003c081c6d696e745f696f3c41747472696275746543686f69636500011420537472656e6774680000001c4167696c69747900010020566974616c6974790002001c5374616d696e6100030030496e74656c6c6967656e6365000400004004184f7074696f6e04045401080108104e6f6e6500000010536f6d6504000800000100004404184f7074696f6e040454010c0108104e6f6e6500000010536f6d6504000c00000100004804184f7074696f6e040454014c0108104e6f6e6500000010536f6d6504004c00000100004c000005040050081c6d696e745f696f244d696e744576656e7400011440436861726163746572437265617465640401386368617261637465725f696e666f540134436861726163746572496e666f000000304c6576656c557064617465640801306368617261637465725f696414011075313238000110617474723c013c41747472696275746543686f69636500010040436861726163746572557064617465640002004c426174746c65526573756c7448616e646c656410012477696e6e65725f69641401107531323800012477696e6e65725f78700c010c75333200013477696e6e65725f726174696e67140110753132380001186c6f736572735c01245665633c753132383e0003003c476f6c644469737472696275746564040130646973747269627574696f6e60015042547265654d61703c753132382c20753132383e0004000054081c6d696e745f696f34436861726163746572496e666f0000180108696414011075313238000130616c676f726974686d5f69641c011c4163746f7249640001106e616d65280118537472696e670001286174747269627574657358014c436861726163746572417474726962757465730001146c6576656c0401087538000128657870657269656e63650c010c753332000058081c6d696e745f696f4c436861726163746572417474726962757465730000200120737472656e677468040108753800011c6167696c6974790401087538000120766974616c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e6365040108753800012c6c697665735f636f756e74040108753800012c746965725f726174696e671401107531323800011c62616c616e63651401107531323800005c000002140060042042547265654d617008044b0114045601140004006400000064000002680068000004081414006c0000040870700070000004000074081c6d696e745f696f244d696e74537461746500000401286368617261637465727378018042547265654d61703c4163746f7249642c20436861726163746572496e666f3e000078042042547265654d617008044b011c045601540004007c0000007c000002800080000004081c5400')
const mintCost = parseInt(assertNotNull(process.env.MINT_COST))
const levelXp = [0, 300, 600, 1800, 5400, 16200, 48600, 145800, 437400, 1312200, 3936600];

export async function handleMintMessage(
    message: UserMessage,
    store: Store,
    mint: Mint,
    characters: Map<string, Character>,
) {
    let data = mintMeta.createType(assertNotNull(mintMeta.types.handle.output), message.payload).toJSON() as any
    if (data.characterCreated) {
        let info = data.characterCreated.characterInfo
        let { tierRating, livesCount, balance, ...attributes } = data.characterCreated.characterInfo.attributes
        let character = new Character({
            ...info,
            attributes,
            livesCount,
            rating: tierRating,
            balance,
            owner: message.destination
        })
        characters.set(character.id, character)
        mint.poolAmount += mintCost
    } else if (data.battleResultHandled) {
        let { winnerId, winnerXp, winnerRating, losers } = data.battleResultHandled

        let character = characters.get(winnerId)
        if (character == null) {
            character = await store.findOneOrFail(Character, { where: { id: winnerId } })
            characters.set(character.id, character)
        }
        character.rating = winnerRating
        character.experience = winnerXp

        for (let loserId of losers) {
            let character = characters.get(loserId)
            if (character == null) {
                character = await store.findOneOrFail(Character, { where: { id: loserId } })
                characters.set(character.id, character)
            }
            character.livesCount -= 1
        }
    } else if (data.levelUpdated) {
        if (!['Strength', 'Agility', 'Vitality', 'Stamina', 'Intelligence'].includes(data.levelUpdated.attr)) {
            console.log(data.levelUpdated.attr)
            throw new Error('unknown attr')
        }

        let character = characters.get(data.levelUpdated.characterId)
        if (character == null) {
            character = await store.findOneOrFail(Character, { where: { id: data.levelUpdated.characterId } })
            characters.set(character.id, character)
        }

        let attributes = character.attributes as any
        attributes[data.levelUpdated.attr.toLowerCase()] += 1

        let xpConsume = levelXp[character.level]
        character.level += 1
        character.experience -= xpConsume
    } else if (data.characterUpdated) {
        let character = characters.get(data.characterUpdated.characterId)
        if (character == null) {
            character = await store.findOneOrFail(Character, { where: { id: data.characterUpdated.characterId } })
            characters.set(character.id, character)
        }

        character.algorithmId = data.characterUpdated.algorithmId
    } else if (data.goldDistributed) {
        for (let characterId in data.goldDistributed.distribution) {
            let balance = data.goldDistributed.distribution[characterId]

            let character = characters.get(characterId)
            if (character == null) {
                character = await store.findOneOrFail(Character, { where: { id: characterId } })
                characters.set(character.id, character)
            }

            character.balance = balance
        }
    } else {
        console.log(data);
        throw new Error('event is not supported')
    }
}
