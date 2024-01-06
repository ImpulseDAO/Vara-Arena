import assert from "assert"
import * as marshal from "./marshal"

export class CharacterTurnState {
    private _hp!: number
    private _energy!: number
    private _position!: number
    private _fireWall!: number
    private _fireHaste!: number
    private _earthSmites!: number
    private _earthSkin!: number
    private _chillingTouch!: number
    private _waterBurst!: number

    constructor(props?: Partial<Omit<CharacterTurnState, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._hp = marshal.int.fromJSON(json.hp)
            this._energy = marshal.int.fromJSON(json.energy)
            this._position = marshal.int.fromJSON(json.position)
            this._fireWall = marshal.int.fromJSON(json.fireWall)
            this._fireHaste = marshal.int.fromJSON(json.fireHaste)
            this._earthSmites = marshal.int.fromJSON(json.earthSmites)
            this._earthSkin = marshal.int.fromJSON(json.earthSkin)
            this._chillingTouch = marshal.int.fromJSON(json.chillingTouch)
            this._waterBurst = marshal.int.fromJSON(json.waterBurst)
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

    get fireWall(): number {
        assert(this._fireWall != null, 'uninitialized access')
        return this._fireWall
    }

    set fireWall(value: number) {
        this._fireWall = value
    }

    get fireHaste(): number {
        assert(this._fireHaste != null, 'uninitialized access')
        return this._fireHaste
    }

    set fireHaste(value: number) {
        this._fireHaste = value
    }

    get earthSmites(): number {
        assert(this._earthSmites != null, 'uninitialized access')
        return this._earthSmites
    }

    set earthSmites(value: number) {
        this._earthSmites = value
    }

    get earthSkin(): number {
        assert(this._earthSkin != null, 'uninitialized access')
        return this._earthSkin
    }

    set earthSkin(value: number) {
        this._earthSkin = value
    }

    get chillingTouch(): number {
        assert(this._chillingTouch != null, 'uninitialized access')
        return this._chillingTouch
    }

    set chillingTouch(value: number) {
        this._chillingTouch = value
    }

    get waterBurst(): number {
        assert(this._waterBurst != null, 'uninitialized access')
        return this._waterBurst
    }

    set waterBurst(value: number) {
        this._waterBurst = value
    }

    toJSON(): object {
        return {
            hp: this.hp,
            energy: this.energy,
            position: this.position,
            fireWall: this.fireWall,
            fireHaste: this.fireHaste,
            earthSmites: this.earthSmites,
            earthSkin: this.earthSkin,
            chillingTouch: this.chillingTouch,
            waterBurst: this.waterBurst,
        }
    }
}
