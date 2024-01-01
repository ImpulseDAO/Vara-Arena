import { ProgramMetadata } from '@gear-js/api';
import { assertNotNull } from '@subsquid/substrate-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store'

import { processor, MINT_ADDRESS, ARENA_ADDRESS } from './processor'
import { Character, Lobby, LobbyCharacter, BattleLog, CharacterState, BattleTurn, CharacterTurnState, TurnLog } from './model'
import { events } from './types'

const mintMeta = ProgramMetadata.from('0002000100000000000106000000010e0000000111000000000000000113000000311b5c00081c6d696e745f696f18436f6e666967000020012c6c697665735f636f756e7404010875380001686761735f666f725f6461696c795f646973747269627574696f6e08010c7536340001486d696e696d756d5f6761735f616d6f756e7408010c7536340001647570646174655f696e74657276616c5f696e5f626c6f636b730c010c7533320001487265736572766174696f6e5f616d6f756e7408010c7536340001507265736572766174696f6e5f6475726174696f6e0c010c7533320001246d696e745f636f73741001304f7074696f6e3c753132383e000140676f6c645f706f6f6c5f616d6f756e741401107531323800000400000503000800000506000c00000505001004184f7074696f6e04045401140108104e6f6e6500000010536f6d65040014000001000014000005070018081c6d696e745f696f284d696e74416374696f6e00012c2041646441646d696e04011461646d696e1c011c4163746f7249640000002c52656d6f766541646d696e04011461646d696e1c011c4163746f7249640001003c4372656174654368617261637465720c011c636f64655f6964240118436f646549640001106e616d65280118537472696e67000128617474726962757465732c0144496e697469616c4174747269627574657300020034436861726163746572496e666f0401206f776e65725f69641c011c4163746f72496400030030426174746c65526573756c740801206f776e65725f69641c011c4163746f7249640001186c6f736572733001305665633c4163746f7249643e000400205365744172656e610401206172656e615f69641c011c4163746f7249640005001c4c6576656c55700401106174747234013c41747472696275746543686f6963650006003c4d616b655265736572766174696f6e0007006853746172744461696c79476f6c64446973747269627574696f6e0008004c446973747269627574654461696c79506f6f6c0009006453746f704461696c79476f6c64446973747269627574696f6e000a00001c10106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004002001205b75383b2033325d0000200000032000000004002410106773746418636f6d6d6f6e287072696d69746976657318436f64654964000004002001205b75383b2033325d00002800000502002c081c6d696e745f696f44496e697469616c417474726962757465730000140120737472656e677468040108753800011c6167696c6974790401087538000120766974616c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e636504010875380000300000021c0034081c6d696e745f696f3c41747472696275746543686f69636500011420537472656e6774680000001c4167696c69747900010020566974616c6974790002001c5374616d696e6100030030496e74656c6c6967656e63650004000038081c6d696e745f696f244d696e744576656e7400011040436861726163746572437265617465640401386368617261637465725f696e666f3c0134436861726163746572496e666f00000034436861726163746572446965640401306368617261637465725f69641c011c4163746f7249640001002c5870496e637265617365640801306368617261637465725f69641c011c4163746f72496400010878700c010c753332000200304c6576656c557064617465640801306368617261637465725f69641c011c4163746f7249640001106174747234013c41747472696275746543686f696365000300003c081c6d696e745f696f34436861726163746572496e666f000014010869641c011c4163746f7249640001106e616d65280118537472696e670001286174747269627574657340014c436861726163746572417474726962757465730001146c6576656c0401087538000128657870657269656e63650c010c753332000040081c6d696e745f696f4c436861726163746572417474726962757465730000200120737472656e677468040108753800011c6167696c6974790401087538000120766974616c697479040108753800011c7374616d696e610401087538000130696e74656c6c6967656e6365040108753800012c6c697665735f636f756e74040108753800012c746965725f726174696e671401107531323800011c62616c616e636514011075313238000044000004084848004800000400004c081c6d696e745f696f244d696e74537461746500000401286368617261637465727350018042547265654d61703c4163746f7249642c20436861726163746572496e666f3e000050042042547265654d617008044b011c0456013c0004005400000054000002580058000004081c3c00')
const arenaMeta = ProgramMetadata.from('000200010000000000010300000001050000000113000000000000000115000000051d680010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000401205b75383b2033325d0000040000032000000008000800000503000c08206172656e615f696f2c4172656e61416374696f6e0001142c4372656174654c6f626279040120636170616369747908010875380000002052656769737465720801206c6f6262795f6964100110753132380001206f776e65725f696400011c4163746f72496400010010506c61790401206c6f6262795f69641001107531323800020028526573657276654761730401206c6f6262795f69641001107531323800030028436c65616e53746174650401206c6f6262795f696410011075313238000400001000000507001408206172656e615f696f284172656e614576656e74000110304c6f626279437265617465640801206c6f6262795f6964100110753132380001206361706163697479080108753800000040506c61796572526567697374657265640801206c6f6262795f696410011075313238000124706c617965725f696400011c4163746f7249640001002c47617352657365727665640401206c6f6262795f696410011075313238000200384c6f626279426174746c654c6f670c01206c6f6262795f69641001107531323800012477696e6e65725f696400011c4163746f7249640001106c6f67731801385665633c426174746c654c6f673e00030000180000021c001c08206172656e615f696f24426174746c654c6f6700000c01286368617261637465723120013c284163746f7249642c20626f6f6c290001286368617261637465723220013c284163746f7249642c20626f6f6c290001147475726e732801445665633c5665633c5475726e4c6f673e3e00002000000408002400240000050000280000022c002c00000230003008206172656e615f696f1c5475726e4c6f67000008012463686172616374657200011c4163746f724964000118616374696f6e3401245475726e4576656e7400003408206172656e615f696f245475726e4576656e740001203c4e6f74456e6f756768456e65726779040118616374696f6e380130426174746c65416374696f6e0000001841747461636b0801106b696e643c012841747461636b4b696e64000118726573756c7444013041747461636b526573756c74000100104d6f7665040120706f736974696f6e08010875380002001052657374040118656e657267790801087538000300145061727279000400284775617264627265616b04011c73756363657373240110626f6f6c00050024436173745370656c6c040118726573756c7448013c436173745370656c6c526573756c74000600204669726557616c6c04011864616d6167650801087538000700003808206172656e615f696f30426174746c65416374696f6e00011c1841747461636b0401106b696e643c012841747461636b4b696e64000000244d6f76655269676874000100204d6f76654c6566740002001052657374000300145061727279000400284775617264627265616b00050024436173745370656c6c0401147370656c6c4001145370656c6c000600003c08206172656e615f696f2841747461636b4b696e6400010c14517569636b0000001c50726563697365000100144865617679000200004008206172656e615f696f145370656c6c000124204669726557616c6c000000244561727468536b696e000100405761746572526573746f726174696f6e000200204669726562616c6c0003003445617274684361746170756c740004002857617465724275727374000500244669726548617374650006002c4561727468536d69746573000700344368696c6c696e67546f756368000800004408206172656e615f696f3041747461636b526573756c7400010c1844616d61676504000801087538000000145061727279000100104d697373000200004808206172656e615f696f3c436173745370656c6c526573756c74000124204669726557616c6c000000244561727468536b696e04011c646566656e63650801087538000100405761746572526573746f726174696f6e0401106865616c0801087538000200204669726562616c6c04011864616d61676508010875380003003445617274684361746170756c7408011864616d6167650801087538000138656e656d795f706f736974696f6e0801087538000400285761746572427572737404011864616d6167650801087538000500244669726548617374650006002c4561727468536d6974657304011864616d6167650801087538000700344368696c6c696e67546f756368000800004c000004085050005000000400005408206172656e615f696f284172656e61537461746500000c01106d696e7400011c4163746f72496400012c6c6561646572626f61726458015842547265654d61703c4163746f7249642c207533323e00012c6c6f6262795f636f756e7410011075313238000058042042547265654d617008044b01000456015c000400600000005c00000505006000000264006400000408005c00')

function getFullHp(vitality: number): number {
    return 90 + vitality * 10
}

function getFullEnergy(stamina: number): number {
    return 20 + stamina * 3
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    let characters: Map<string, Character> = new Map()
    let lobbies = []
    let lobbiesCharacter = []
    let battleLogs: BattleLog[] = []

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
                    let data = mintMeta.createType(assertNotNull(mintMeta.types.handle.output), message.payload).toJSON() as any

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
                } else if (message.source == ARENA_ADDRESS) {
                    let data = arenaMeta.createType(assertNotNull(arenaMeta.types.handle.output), message.payload).toJSON() as any

                    if (data.lobbyCreated) {
                        let lobby = new Lobby({
                            id: data.lobbyCreated.lobbyId,
                            capacity: data.lobbyCreated.capacity,
                        })
                        lobbies.push(lobby)
                    } else if (data.playerRegistered) {
                        let lobbyCharacter = new LobbyCharacter({
                            id: event.id,
                            character: data.playerRegistered.playerId,
                            lobby: data.playerRegistered.lobbyId,
                        })
                        lobbiesCharacter.push(lobbyCharacter)
                    } else if (data.lobbyBattleLog) {
                        for (let idx = 0; idx < data.lobbyBattleLog.logs.length; idx++) {
                            let log = data.lobbyBattleLog.logs[idx];

                            let character1 = characters.get(log.character1[0])
                            if (character1 == null) {
                                character1 = await ctx.store.findOneOrFail(Character, { where: { id: log.character1[0] } })
                                characters.set(log.character1[0], character1)
                            }

                            let character2 = characters.get(log.character2[0])
                            if (character2 == null) {
                                character2 = await ctx.store.findOneOrFail(Character, { where: { id: log.character2[0] } })
                                characters.set(log.character2[0], character2)
                            }

                            let fullHpByCharacter = {
                                [character1.id]: getFullHp((character1.attributes as any).vitality),
                                [character2.id]: getFullHp((character2.attributes as any).vitality),
                            }
                            let fullEnergyByCharacter = {
                                [character1.id]: getFullEnergy((character1.attributes as any).stamina),
                                [character2.id]: getFullEnergy((character2.attributes as any).stamina),
                            }

                            let initialTurn = new BattleTurn({
                                character1: new CharacterTurnState({
                                    hp: fullHpByCharacter[character1.id],
                                    energy: fullEnergyByCharacter[character1.id],
                                    position: 6,
                                }),
                                character2: new CharacterTurnState({
                                    hp: fullHpByCharacter[character2.id],
                                    energy: fullEnergyByCharacter[character2.id],
                                    position: 10,
                                }),
                                logs: [],
                            })
                            let turns = [initialTurn]
                            for (let events of log.turns) {
                                let previous = turns[turns.length - 1]
                                let turn = new BattleTurn({
                                    character1: new CharacterTurnState({ ...previous.character1?.toJSON() }),
                                    character2: new CharacterTurnState({ ...previous.character2?.toJSON() }),
                                    logs: []
                                })
                                turn.logs = events.map((event: any) => {
                                    let player, enemy
                                    if (event.character == assertNotNull(character1).id) {
                                        player = assertNotNull(turn.character1)
                                        enemy = assertNotNull(turn.character2)
                                    } else {
                                        player = assertNotNull(turn.character2)
                                        enemy = assertNotNull(turn.character1)
                                    }

                                    let action = Object.keys(event.action)[0]
                                    switch (action) {
                                        case 'move':
                                            player.energy -= 1
                                            player.position = event.action.move.position
                                            break;
                                        case 'attack':
                                            switch (event.action.attack.kind) {
                                                case 'Quick':
                                                    player.energy -= 2
                                                    break
                                                case 'Precise':
                                                    player.energy -= 4
                                                    break
                                                case 'Heavy':
                                                    player.energy -= 6
                                                    break
                                                default:
                                                    throw new Error('attack kind is not supported')
                                            }

                                            let result = Object.keys(event.action.attack.result)[0]
                                            if (result == 'damage') {
                                                enemy.hp = Math.max(enemy.hp - event.action.attack.result.damage, 0)
                                            }
                                            break
                                        case 'rest':
                                            let fullEnergy = fullEnergyByCharacter[event.character]
                                            player.energy = Math.max(player.energy + event.action.rest.energy, fullEnergy)
                                            break
                                        case 'castSpell':
                                            let spell = Object.keys(event.action.castSpell)[0]
                                            player.energy -= 5
                                            switch (spell) {
                                                case 'fireball':
                                                    enemy.hp = Math.max(enemy.hp - event.action.castSpell.fireball.damage, 0)
                                                    break
                                                case 'waterRestoration':
                                                    let fullHp = fullHpByCharacter[event.character]
                                                    player.hp = Math.min(player.hp + event.action.castSpell.waterRestoration.heal, fullHp)
                                                    break
                                                case 'earthCatapult':
                                                    enemy.hp = Math.max(enemy.hp - event.action.castSpell.earthCatapult.damage, 0)
                                                    enemy.position = event.action.castSpell.earthCatapult.enemyPosition
                                                    break
                                                case 'waterBurst':
                                                    enemy.hp = Math.max(enemy.hp - event.action.castSpell.waterBurst.damage, 0)
                                                    break
                                                case 'fireWall':
                                                case 'fireHaste':
                                                case 'earthSmites':
                                                case 'earthSkin':
                                                case 'chillingTouch':
                                                    break
                                                default:
                                                    throw new Error('spell is not supported')
                                            }
                                            break
                                        case 'fireWall':
                                            player.hp = Math.max(player.hp - event.action.fireWall.damage, 0)
                                            break
                                        case 'notEnoughEnergy':
                                            break
                                        case 'parry':
                                            player.energy -= 2
                                            break
                                        case 'guardbreak':
                                            player.energy -= 2
                                            break
                                        default:
                                            throw new Error('action is not supported')
                                    }
                                    return new TurnLog(event)
                                })
                                turns.push(turn)
                            }
                            let battleLog = new BattleLog({
                                id: `${data.lobbyBattleLog.lobbyId}-${idx}`,
                                battleIndex: idx,
                                lobby: data.lobbyBattleLog.lobbyId,
                                character1: new CharacterState({
                                    character: character1.id,
                                    attributes: character1.attributes,
                                    experience: character1.experience,
                                    level: character1.level,
                                    rating: 0,
                                }),
                                character2: new CharacterState({
                                    character: character2.id,
                                    attributes: character2.attributes,
                                    experience: character2.experience,
                                    level: character2.level,
                                    rating: 0,
                                }),
                                turns,
                            })
                            battleLogs.push(battleLog)
                        }
                    } else {
                        throw new Error('event is not supported')
                    }
                }
            }
        }
    }

    await ctx.store.upsert([...characters.values()])
    await ctx.store.upsert(lobbies)
    await ctx.store.upsert(lobbiesCharacter)
    await ctx.store.insert(battleLogs)
})
