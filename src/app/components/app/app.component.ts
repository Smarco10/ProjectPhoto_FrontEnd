

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FeathersService } from 'services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'ProjectPhoto';
    logged = false;
    allowed = {
        manageSlides: false,
        manageUsers: true
    }

    constructor(
        private auth: AuthService,
        private feathers: FeathersService,
        private router: Router
    ) {
        this.feathers.onAuthenticated(() => {
            this.updateLogin();
        });

        this.feathers.onLogout(() => {
            this.updateLogin();
        });

        this.feathers.onReauthenticationError(() => {
            this.updateLogin();
        });
    }

    private getUserId(): string {
        return this.auth.getUser().email;
    }

    public updateLogin() {
        let user = this.auth.getUser();
        this.logged = !!user;
        this.allowed.manageSlides = this.logged && user.hasPermission("admin");
    }

    public logout(goToRoot: boolean) {
        // reset login status
        this.auth.logout();

        if (goToRoot == true) {
            this.router.navigateByUrl('/');
        }
    }
}
