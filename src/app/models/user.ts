
export class User {

    id: string;
    email: string;
    _permissions: string[];

    _password?: string;

    constructor(id: string, email: string, permissions: string[]) {
        this.id = id;
        this.email = email;
        this.permissions = permissions;
        this.password = undefined;
    }

    set permissions(permissions: string[]) {
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

    public hasPermission(permission: string): boolean {
        return this.permissions.indexOf(permission) >= 0;
    }
}