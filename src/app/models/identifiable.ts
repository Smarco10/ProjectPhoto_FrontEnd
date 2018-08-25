import { Observable, Subject } from 'rxjs';

export class Identifiable {

    public id: string;

    constructor(serverData?: any) {
        if (!!serverData) {
            this.updateFromServer(serverData);
        }
    }

    public updateFromServer(serverData: any): boolean {
        if (!!serverData._id) {
            this.id = serverData._id;
        }
        return !!serverData._id;
    }

    public isCreated(): boolean {
        return !!this.id;
    }

    public serverDataAreValid(serverData: any): boolean {
        return Identifiable.isIdEqualTo(this, serverData._id);
    }

    static isIdEqualTo(elt1: Identifiable, elt2: string): boolean {
        return !!elt1 ? (elt1.id === elt2) : false;
    }

    static isEqualTo(elt1: Identifiable, elt2: Identifiable): boolean {
        return !!elt2 ? Identifiable.isIdEqualTo(elt1, elt2.id) : false;
    }
}