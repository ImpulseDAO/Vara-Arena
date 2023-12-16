import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Character {
    constructor(props?: Partial<Character>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    owner!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    attributes!: unknown

    @Column_("int4", {nullable: false})
    level!: number

    @Column_("int4", {nullable: false})
    experience!: number
}
