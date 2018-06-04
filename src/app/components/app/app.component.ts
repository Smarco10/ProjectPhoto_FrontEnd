import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FeathersService } from 'services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'ProjectPhoto';
    logged = false;
    allowed = {
        manageSlides: false,
        manageUsers: false
    }

    @ViewChild('myToolbar', { read: ElementRef })
    myToolbar: ElementRef;

    private toolbarHeight: number = 0;

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

    ngOnInit(): void {
        this.updateLogin();
    }

    private resizeSidenavDrawer(): void {
        this.toolbarHeight = this.myToolbar.nativeElement.offsetHeight;
    }

    private getUserId(): string {
        return this.auth.getConnectedUser().email;
    }

    public updateLogin() {
        let user = this.auth.getConnectedUser();
        this.logged = !!user;
        this.allowed.manageSlides = this.logged && user.isAdmin();
        this.allowed.manageUsers = this.logged && user.isAdmin();
    }

    public logout(goToRoot: boolean) {
        // reset login status
        this.auth.logout();

        if (goToRoot == true) {
            this.router.navigateByUrl('/');
        }
    }
}
