import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Lobby} from "./lobby.model"
import {Character} from "./character.model"

@Entity_()
export class LobbyCharacter {
    constructor(props?: Partial<LobbyCharacter>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Lobby, {nullable: true})
    lobby!: Lobby

    @Index_()
    @ManyToOne_(() => Character, {nullable: true})
    character!: Character
}
