export class Idable {

    private _id: string;

    constructor(serverData: any) {
        this._id = serverData._id;
    }

    get id(): string {
        return this._id;
    }

    public isCreated(): boolean {
        return !!this.id;
    }

    serverDataAreValid(serverData: any): boolean {
        return Idable.isIdEqualTo(this, serverData._id);
    }

    static isIdEqualTo(elt1: Idable, elt2: string): boolean {
        return !!elt1 ? (elt1.id === elt2) : false;
    }

    static isEqualTo(elt1: Idable, elt2: Idable): boolean {
        return !!elt2 ? Idable.isIdEqualTo(elt1, elt2.id) : false;
    }
}