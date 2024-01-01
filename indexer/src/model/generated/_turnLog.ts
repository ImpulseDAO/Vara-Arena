import assert from "assert"
import * as marshal from "./marshal"

export class TurnLog {
    private _character!: string
    private _action!: unknown

    constructor(props?: Partial<Omit<TurnLog, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._character = marshal.string.fromJSON(json.character)
            this._action = json.action
        }
    }

    get character(): string {
        assert(this._character != null, 'uninitialized access')
        return this._character
    }

    set character(value: string) {
        this._character = value
    }

    get action(): unknown {
        assert(this._action != null, 'uninitialized access')
        return this._action
    }

    set action(value: unknown) {
        this._action = value
    }

    toJSON(): object {
        return {
            character: this.character,
            action: this.action,
        }
    }
}
