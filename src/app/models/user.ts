import { Observable, Subject } from 'rxjs';

export class User {

    id: string;
    email: string;
    private _permissions: string[];
    private permissionsSubject: Subject<Array<string>> = new Subject<Array<string>>();

    password?: string;

    constructor(id: string = undefined, email: string = undefined, permissions: string[] = []) {
        this.id = id;
        this.email = email;
        this._permissions = permissions;
        this.password = undefined;
    }

    updateFromServer(serverData: any): boolean {
        const serverDataAreValid: boolean = serverData._id === this.id;
        if (serverDataAreValid) {
            this.email = serverData.email;
            this._permissions = serverData.permissions;
        }
        return serverDataAreValid;
    }

    set permissions(permissions: string[]) {
        this._permissions = permissions || [];
        this.permissionsSubject.next(this._permissions);
    }

    get permissions() {
        return this._permissions;
    }

    getPermissionsObserver(): Observable<Array<string>> {
        return this.permissionsSubject.asObservable();
    }

    public isCreated(): boolean {
        return !!this.id;
    }

    public hasPermission(permission: string): boolean {
        return this._permissions.indexOf(permission.toLowerCase()) >= 0;
    }

    public isAdmin(): boolean {
        return this.hasPermission("admin");
    }

    public addPermission(permission: string): boolean {
        let previousLenght = this._permissions.length;

        if (this._permissions.indexOf(permission) < 0) {
            this._permissions.push(permission);
        }

        const succeed: boolean = previousLenght < this._permissions.length;

        if (succeed) {
            this.permissionsSubject.next(this._permissions);
        }

        return succeed;
    }

    public removePermission(permission: string): boolean {
        let previousLenght = this._permissions.length;

        let index = this._permissions.indexOf(permission);
        if (index >= 0) {
            this._permissions.splice(index, 1);
        }

        const succeed: boolean = previousLenght > this._permissions.length;

        if (succeed) {
            this.permissionsSubject.next(this._permissions);
        }

        return succeed;
    }
}