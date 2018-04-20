

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

    constructor(
        private auth: AuthService,
        private feathers: FeathersService,
        private router: Router
    ) {
        //TODO: pose des problemes (error au chargement avant connection et au logout)
        this.auth.checkLogin()
            .then(() => this.setLogged(true))
            .catch(() => this.setLogged(false));
    }

    public setLogged(logged: boolean) {
        this.logged = logged;
    }

    logout(goToRoot: boolean) {
        // reset login status
        this.auth.logout();
        this.setLogged(false);
        console.log("successfully logged out");

        if (goToRoot == true) {
            this.router.navigateByUrl('/');
        }
    }
}
