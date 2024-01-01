import assert from "assert"
import * as marshal from "./marshal"

export class CharacterTurnState {
    private _hp!: number
    private _energy!: number
    private _position!: number

    constructor(props?: Partial<Omit<CharacterTurnState, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._hp = marshal.int.fromJSON(json.hp)
            this._energy = marshal.int.fromJSON(json.energy)
            this._position = marshal.int.fromJSON(json.position)
        }
    }

    get hp(): number {
        assert(this._hp != null, 'uninitialized access')
        return this._hp
    }

    set hp(value: number) {
        this._hp = value
    }

    get energy(): number {
        assert(this._energy != null, 'uninitialized access')
        return this._energy
    }

    set energy(value: number) {
        this._energy = value
    }

    get position(): number {
        assert(this._position != null, 'uninitialized access')
        return this._position
    }

    set position(value: number) {
        this._position = value
    }

    toJSON(): object {
        return {
            hp: this.hp,
            energy: this.energy,
            position: this.position,
        }
    }
}
