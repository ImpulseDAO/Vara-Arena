import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {LobbyCharacter} from "./lobbyCharacter.model"
import {BattleLog} from "./battleLog.model"

@Entity_()
export class Lobby {
    constructor(props?: Partial<Lobby>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    capacity!: number

    @OneToMany_(() => LobbyCharacter, e => e.lobby)
    characters!: LobbyCharacter[]

    @OneToMany_(() => BattleLog, e => e.lobby)
    battleLogs!: BattleLog[]
}
