import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from 'services';

import { AppComponent } from 'components'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        /* Try to auth with the server. If authed resolve to true, else resolve to false */
        return this.auth.checkLogin()
            .then(() => {
                return true;
            })
            .catch(() => {
                this.router.navigate(['/login'], {
                    queryParams: {
                        returnUrl: state.url
                    }
                });
                return false;
            });
    }
}
