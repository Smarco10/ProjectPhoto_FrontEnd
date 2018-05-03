import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/shareReplay';

import { User } from '@models/user';
import { FeathersService, FeathersServiceEventListener } from "@services/feathers/feathers.service";

@Injectable()
export class AuthService extends FeathersServiceEventListener {

    private usersService: any;

    constructor(
        private feathers: FeathersService
    ) {
        super(feathers.service('users'));
        this.usersService = this.eventService;
    }

    createUser(user: User): Promise<any> {
        return this.usersService.create({
            email: user.email,
            password: user.password,
            permissions: user.permissions
        });
    }

    updateUser(user: User): Promise<any> {
        var query: any = {
            email: user.email,
            permissions: user.permissions
        };
        if (!!user.password) {
            Object.assign(query, { password: user.password });
        }
        return this.usersService.patch(user.id, query);
    }

    getUsers(): Promise<any> {
        return this.usersService.find();
    }

    deleteUser(id: string): Promise<any> {
        return this.usersService.remove(id);
    }

    checkLogin(): Promise<any> {
        return this.feathers.authenticate();
    }

    login(email: string, password: string): Promise<any> {
        // try to authenticate with feathers
        return this.feathers.authenticate({
            strategy: 'local',
            email,
            password
        });
    }

    getUser(): User {
        return this.feathers.getUser();
    }

    logout(): Promise<any> {
        return this.feathers.logout();
    }
}
