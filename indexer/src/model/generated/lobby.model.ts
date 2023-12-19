import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {LobbyCharacter} from "./lobbyCharacter.model"

@Entity_()
export class Lobby {
    constructor(props?: Partial<Lobby>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => LobbyCharacter, e => e.lobby)
    characters!: LobbyCharacter[]
}
