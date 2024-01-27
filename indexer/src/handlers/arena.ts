import { ProgramMetadata } from '@gear-js/api'
import { assertNotNull } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'

import { Character, Lobby, LobbyCharacter, BattleLog, CharacterState, BattleTurn, CharacterTurnState, TurnLog } from '../model'
import { UserMessage } from '../types/v1000'

const arenaMeta = ProgramMetadata.from('000200010000000000010300000001050000000113000000000000000115000000211b580010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000401205b75383b2033325d0000040000032000000008000800000503000c08206172656e615f696f2c4172656e61416374696f6e0001102c4372656174654c6f626279040120636170616369747908010875380000002052656769737465720801206c6f6262795f6964100110753132380001206f776e65725f696400011c4163746f72496400010010506c61790401206c6f6262795f69641001107531323800020028526573657276654761730401206c6f6262795f696410011075313238000300001000000507001408206172656e615f696f284172656e614576656e74000110304c6f626279437265617465640801206c6f6262795f6964100110753132380001206361706163697479080108753800000040506c61796572526567697374657265640c01206c6f6262795f696410011075313238000124706c617965725f6964100110753132380001107469657208010875380001002c47617352657365727665640401206c6f6262795f696410011075313238000200384c6f626279426174746c654c6f670c01206c6f6262795f69641001107531323800012477696e6e65725f6964100110753132380001106c6f67731801385665633c426174746c654c6f673e00030000180000021c001c08206172656e615f696f24426174746c654c6f6700000c01286368617261637465723120013028753132382c20626f6f6c290001286368617261637465723220013028753132382c20626f6f6c290001147475726e732801445665633c5665633c5475726e4c6f673e3e00002000000408102400240000050000280000022c002c00000230003008206172656e615f696f1c5475726e4c6f67000008012463686172616374657210011075313238000118616374696f6e3401245475726e4576656e7400003408206172656e615f696f245475726e4576656e740001203c4e6f74456e6f756768456e65726779040118616374696f6e380130426174746c65416374696f6e0000001841747461636b0801106b696e643c012841747461636b4b696e64000118726573756c7444013041747461636b526573756c74000100104d6f7665040120706f736974696f6e08010875380002001052657374040118656e657267790801087538000300145061727279000400284775617264627265616b04011c73756363657373240110626f6f6c00050024436173745370656c6c040118726573756c7448013c436173745370656c6c526573756c74000600204669726557616c6c04011864616d6167650801087538000700003808206172656e615f696f30426174746c65416374696f6e00011c1841747461636b0401106b696e643c012841747461636b4b696e64000000244d6f76655269676874000100204d6f76654c6566740002001052657374000300145061727279000400284775617264627265616b00050024436173745370656c6c0401147370656c6c4001145370656c6c000600003c08206172656e615f696f2841747461636b4b696e6400010c14517569636b0000001c50726563697365000100144865617679000200004008206172656e615f696f145370656c6c000124204669726557616c6c000000244561727468536b696e000100405761746572526573746f726174696f6e000200204669726562616c6c0003003445617274684361746170756c740004002857617465724275727374000500244669726548617374650006002c4561727468536d69746573000700344368696c6c696e67546f756368000800004408206172656e615f696f3041747461636b526573756c7400010c1844616d61676504000801087538000000145061727279000100104d697373000200004808206172656e615f696f3c436173745370656c6c526573756c74000124204669726557616c6c000000244561727468536b696e04011c646566656e63650801087538000100405761746572526573746f726174696f6e0401106865616c0801087538000200204669726562616c6c04011864616d61676508010875380003003445617274684361746170756c7408011864616d6167650801087538000138656e656d795f706f736974696f6e0801087538000400285761746572427572737404011864616d6167650801087538000500244669726548617374650006002c4561727468536d6974657304011864616d6167650801087538000700344368696c6c696e67546f756368000800004c000004085050005000000400005408206172656e615f696f284172656e61537461746500000801106d696e7400011c4163746f72496400012c6c6f6262795f636f756e74100110753132380000')

export async function handleArenaMessage(
    message: UserMessage,
    store: Store,
    characters: Map<string, Character>,
    lobbies: Map<string, Lobby>,
    lobbiesCharacter: Map<string, LobbyCharacter>,
    battleLogs: Map<string, BattleLog>,
) {
    let data
    try {
        data = arenaMeta.createType(assertNotNull(arenaMeta.types.handle.output), message.payload).toJSON() as any
    } catch (e) {
        console.log('error happened during message decoding')
        return
    }

    if (data.lobbyCreated) {
        let lobby = new Lobby({
            id: data.lobbyCreated.lobbyId,
            capacity: data.lobbyCreated.capacity,
            reservationsCount: 0,
            tier: 0,
        })
        lobbies.set(lobby.id, lobby)
    } else if (data.playerRegistered) {
        let lobby = lobbies.get(data.playerRegistered.lobbyId)
        if (lobby == null) {
            lobby = await store.findOneOrFail(Lobby, { where: { id: data.playerRegistered.lobbyId } })
            lobbies.set(lobby.id, lobby)
        }
        lobby.tier = data.playerRegistered.tier

        let lobbyCharacter = new LobbyCharacter({
            id: `${data.playerRegistered.lobbyId}-${data.playerRegistered.playerId}`,
            character: data.playerRegistered.playerId,
            lobby: data.playerRegistered.lobbyId,
        })
        lobbiesCharacter.set(lobbyCharacter.id, lobbyCharacter)
    } else if (data.lobbyBattleLog) {
        for (let idx = 0; idx < data.lobbyBattleLog.logs.length; idx++) {
            let log = data.lobbyBattleLog.logs[idx];

            let character1 = characters.get(log.character1[0])
            if (character1 == null) {
                character1 = await store.findOneOrFail(Character, { where: { id: log.character1[0] } })
                characters.set(log.character1[0], character1)
            }

            let character2 = characters.get(log.character2[0])
            if (character2 == null) {
                character2 = await store.findOneOrFail(Character, { where: { id: log.character2[0] } })
                characters.set(log.character2[0], character2)
            }

            let fullHpByCharacter = {
                [character1.id]: getFullHp(character1.level),
                [character2.id]: getFullHp(character2.level),
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
                    chillingTouch: 0,
                    earthSkin: 0,
                    earthSmites: 0,
                    fireHaste: 0,
                    fireWall: 0,
                    waterBurst: 0,
                }),
                character2: new CharacterTurnState({
                    hp: fullHpByCharacter[character2.id],
                    energy: fullEnergyByCharacter[character2.id],
                    position: 10,
                    chillingTouch: 0,
                    earthSkin: 0,
                    earthSmites: 0,
                    fireHaste: 0,
                    fireWall: 0,
                    waterBurst: 0,
                }),
                logs: [],
            })
            let turns = [initialTurn]
            for (let events of log.turns) {
                let previous = turns[turns.length - 1]
                let turn = new BattleTurn({
                    character1: new CharacterTurnState({
                        ...previous.character1?.toJSON(),
                        chillingTouch: Math.max(previous.character1!.chillingTouch - 1, 0),
                        earthSkin: Math.max(previous.character1!.earthSkin - 1, 0),
                        earthSmites: Math.max(previous.character1!.earthSmites - 1, 0),
                        fireHaste: Math.max(previous.character1!.fireHaste - 1, 0),
                        fireWall: Math.max(previous.character1!.fireWall - 1, 0),
                        waterBurst: Math.max(previous.character1!.waterBurst - 1, 0),
                    }),
                    character2: new CharacterTurnState({
                        ...previous.character2?.toJSON(),
                        chillingTouch: Math.max(previous.character2!.chillingTouch - 1, 0),
                        earthSkin: Math.max(previous.character2!.earthSkin - 1, 0),
                        earthSmites: Math.max(previous.character2!.earthSmites - 1, 0),
                        fireHaste: Math.max(previous.character2!.fireHaste - 1, 0),
                        fireWall: Math.max(previous.character2!.fireWall - 1, 0),
                        waterBurst: Math.max(previous.character2!.waterBurst - 1, 0),
                    }),
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
                                    throw new Error(`attack kind "${event.action.attack.kind}" is not supported`)
                            }

                            let result = Object.keys(event.action.attack.result)[0]
                            if (result == 'damage') {
                                enemy.hp = Math.max(enemy.hp - event.action.attack.result.damage, 0)
                            }
                            break
                        case 'rest':
                            let fullEnergy = fullEnergyByCharacter[event.character]
                            player.energy = Math.min(player.energy + event.action.rest.energy, fullEnergy)
                            break
                        case 'castSpell':
                            let spell = Object.keys(event.action.castSpell.result)[0]
                            switch (spell) {
                                case 'fireball':
                                    enemy.hp = Math.max(enemy.hp - event.action.castSpell.result.fireball.damage, 0)
                                    player.energy -= 5
                                    break
                                case 'waterRestoration':
                                    let fullHp = fullHpByCharacter[event.character]
                                    player.hp = Math.min(player.hp + event.action.castSpell.result.waterRestoration.heal, fullHp)
                                    player.energy -= 5
                                    break
                                case 'waterBurst':
                                    enemy.hp = Math.max(enemy.hp - event.action.castSpell.result.waterBurst.damage, 0)
                                    enemy.waterBurst = 3
                                    player.energy -= 5
                                    break
                                case 'fireWall':
                                    player.fireWall = 3
                                    player.energy -= 5
                                    break
                                case 'fireHaste':
                                    player.fireHaste = 4
                                    player.energy -= 5
                                    break
                                case 'earthSmites':
                                    player.earthSmites = 3
                                    player.energy -= 5
                                    break
                                case 'earthSkin':
                                    player.earthSkin = 3
                                    player.energy -= 5
                                    break
                                case 'chillingTouch':
                                    enemy.chillingTouch = 4
                                    player.energy -= 5
                                    break
                                default:
                                    throw new Error(`spell "${spell}" is not supported`)
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
                            throw new Error(`action "${action}" is not supported`)
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
                    winner: log.character1[1],
                }),
                character2: new CharacterState({
                    character: character2.id,
                    attributes: character2.attributes,
                    experience: character2.experience,
                    level: character2.level,
                    rating: 0,
                    winner: log.character2[1],
                }),
                turns,
            })
            battleLogs.set(battleLog.id, battleLog)
        }
    } else if (data.gasReserved) {
        let lobby = lobbies.get(data.gasReserved.lobbyId)
        if (lobby == null) {
            lobby = await store.findOneOrFail(Lobby, { where: { id: data.gasReserved.lobbyId } })
            lobbies.set(lobby.id, lobby)
        }
        lobby.reservationsCount += 1
    } else if (data.battleStarted) {
        let lobby = lobbies.get(data.battleStarted.lobbyId)
        if (lobby == null) {
            lobby = await store.findOneOrFail(Lobby, { where: { id: data.battleStarted.lobbyId } })
            lobbies.set(lobby.id, lobby)
        }
        lobby.started = true
    } else {
        console.log(data)
        throw new Error('event is not supported')
    }
}

function getFullHp(level: number): number {
    return 90 + level * 15
}

function getFullEnergy(stamina: number): number {
    return 20 + stamina * 3
}
