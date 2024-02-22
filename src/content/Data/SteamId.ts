
enum Type {
    App = "app",
    Sub = "sub",
    Bundle = "bundle"
}

export default class SteamId {

    _type: Type;
    _id: number;

    constructor(id: string) {
        const m = id.match(/(app|apps|sub|bundle)\/([0-9]+)/);

        if (!m) {
            throw new Error(`Invalid SteamId ${id}`);
        }

        switch(m[1]) {
            case "app":
            case "apps":
                this._type = Type.App;
                break;

            case "sub":
                this._type = Type.Sub;
                break;

            case "bundle":
                this._type = Type.Bundle;
                break;

            default:
                throw new Error(`Invalid ID Type ${m[1]}`);
        }

        this._id = Number(m[2]);
    }

    get type(): Type {
        return this._type;
    }

    get id(): number {
        return this._id;
    }

    toString(): string {
        return `${this._type}/${this._id}`;
    }
}
