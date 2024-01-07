import assert from "assert"
import * as marshal from "./marshal"

export class CharacterState {
    private _character!: string
    private _attributes!: unknown
    private _level!: number
    private _experience!: number
    private _rating!: number
    private _winner!: boolean

    constructor(props?: Partial<Omit<CharacterState, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._character = marshal.string.fromJSON(json.character)
            this._attributes = json.attributes
            this._level = marshal.int.fromJSON(json.level)
            this._experience = marshal.int.fromJSON(json.experience)
            this._rating = marshal.int.fromJSON(json.rating)
            this._winner = marshal.boolean.fromJSON(json.winner)
        }
    }

    get character(): string {
        assert(this._character != null, 'uninitialized access')
        return this._character
    }

    set character(value: string) {
        this._character = value
    }

    get attributes(): unknown {
        assert(this._attributes != null, 'uninitialized access')
        return this._attributes
    }

    set attributes(value: unknown) {
        this._attributes = value
    }

    get level(): number {
        assert(this._level != null, 'uninitialized access')
        return this._level
    }

    set level(value: number) {
        this._level = value
    }

    get experience(): number {
        assert(this._experience != null, 'uninitialized access')
        return this._experience
    }

    set experience(value: number) {
        this._experience = value
    }

    get rating(): number {
        assert(this._rating != null, 'uninitialized access')
        return this._rating
    }

    set rating(value: number) {
        this._rating = value
    }

    get winner(): boolean {
        assert(this._winner != null, 'uninitialized access')
        return this._winner
    }

    set winner(value: boolean) {
        this._winner = value
    }

    toJSON(): object {
        return {
            character: this.character,
            attributes: this.attributes,
            level: this.level,
            experience: this.experience,
            rating: this.rating,
            winner: this.winner,
        }
    }
}
