import assert from "assert"
import * as marshal from "./marshal"
import {CharacterTurnState} from "./_characterTurnState"
import {TurnLog} from "./_turnLog"

export class BattleTurn {
    private _character1!: CharacterTurnState | undefined | null
    private _character2!: CharacterTurnState | undefined | null
    private _logs!: (TurnLog)[]

    constructor(props?: Partial<Omit<BattleTurn, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._character1 = json.character1 == null ? undefined : new CharacterTurnState(undefined, json.character1)
            this._character2 = json.character2 == null ? undefined : new CharacterTurnState(undefined, json.character2)
            this._logs = marshal.fromList(json.logs, val => new TurnLog(undefined, marshal.nonNull(val)))
        }
    }

    get character1(): CharacterTurnState | undefined | null {
        return this._character1
    }

    set character1(value: CharacterTurnState | undefined | null) {
        this._character1 = value
    }

    get character2(): CharacterTurnState | undefined | null {
        return this._character2
    }

    set character2(value: CharacterTurnState | undefined | null) {
        this._character2 = value
    }

    get logs(): (TurnLog)[] {
        assert(this._logs != null, 'uninitialized access')
        return this._logs
    }

    set logs(value: (TurnLog)[]) {
        this._logs = value
    }

    toJSON(): object {
        return {
            character1: this.character1 == null ? undefined : this.character1.toJSON(),
            character2: this.character2 == null ? undefined : this.character2.toJSON(),
            logs: this.logs.map((val: any) => val.toJSON()),
        }
    }
}
