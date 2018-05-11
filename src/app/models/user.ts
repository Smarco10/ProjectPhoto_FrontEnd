
export enum UserPermissions {
    ADMIN = "admin",
    USER = "user"
}

export class User {

    id: string;
    email: string;
    _permissions: UserPermissions[];

    _password?: string;

    constructor(id: string = undefined, email: string = undefined, permissions: UserPermissions[] = [UserPermissions.USER]) {
        this.id = id;
        this.email = email;
        this.permissions = permissions;
        this.password = undefined;
    }

    set permissions(permissions: UserPermissions[]) {
        this._permissions = permissions || [];
    }

    get permissions() {
        return this._permissions;
    }

    set password(password: string) {
        this._password = password;
    }

    get password() {
        return this._password;
    }

    public isCreated(): boolean {
        return !!this.id;
    }

    public hasPermission(permission: UserPermissions): boolean {
        return this.permissions.indexOf(permission) >= 0;
    }

    public isAdmin(): boolean {
        return this.hasPermission(UserPermissions.ADMIN);
    }

    public addPermission(permission: UserPermissions): boolean {
        let previousLenght = this.permissions.length;

        if (this.permissions.indexOf(permission) < 0) {
            this.permissions.push(permission);
        }

        return previousLenght < this.permissions.length;
    }

    public removePermission(permission: UserPermissions): boolean {
        let previousLenght = this.permissions.length;

        let index = this.permissions.indexOf(permission);
        if (index >= 0) {
            this.permissions.splice(index, 1);
        }

        return previousLenght > this.permissions.length;
    }
}