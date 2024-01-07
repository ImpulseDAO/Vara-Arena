import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Lobby} from "./lobby.model"
import {CharacterState} from "./_characterState"
import {BattleTurn} from "./_battleTurn"

@Entity_()
export class BattleLog {
    constructor(props?: Partial<BattleLog>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Lobby, {nullable: true})
    lobby!: Lobby

    @Column_("int4", {nullable: false})
    battleIndex!: number

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new CharacterState(undefined, obj)}, nullable: false})
    character1!: CharacterState

    @Column_("jsonb", {transformer: {to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new CharacterState(undefined, obj)}, nullable: false})
    character2!: CharacterState

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new BattleTurn(undefined, marshal.nonNull(val)))}, nullable: false})
    turns!: (BattleTurn)[]
}
