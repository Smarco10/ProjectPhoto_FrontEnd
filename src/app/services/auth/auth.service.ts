import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/shareReplay';

import { User } from '@models/user';
import { FeathersService } from "@services/feathers/feathers.service";

@Injectable()
export class AuthService {

    constructor(
        private feathers: FeathersService
    ) { }

    signup(email: string, password: string): Promise<any> {
        return this.feathers.service('users').create({ email, password })
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

    logout(): Promise<any> {
        return this.feathers.logout();
    }
}
