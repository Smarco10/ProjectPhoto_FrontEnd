import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import { AuthService } from 'services';
import { User } from '@models/user';
import { MatChipInputEvent } from "@angular/material/chips";
import { ENTER, COMMA, SPACE, TAB, ESCAPE } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

    @Input() user: User;
    private newUser: User = new User(undefined, undefined, ["user", "view"]);

    private deleteRequest: boolean = false;
    private passwordHide: boolean = true;

    private separatorKeysCodes = [ENTER, COMMA, SPACE, TAB, ESCAPE];

    constructor(
        private userService: AuthService
    ) { }

    ngOnInit() {

        this.resetView();

        this.userService.onUpdated((user, context) => {
            if (user.id === this.user.id) {
                //TODO update user
            }
        });
    }

    public resetView(): void {
        //TODO: is it usefull
        this.deleteRequest = false;
        this.passwordHide = true;
    }

    private updateUser() {
        this.userService.updateUser(this.user)
            .catch(err => {
                console.error(err);
            });
    }

    private deleteUser() {
        this.userService.deleteUser(this.user.id)
            .catch(err => {
                console.error(err);
            });
    }

    private addPermission(event: MatChipInputEvent) {
        let permission = (event.value || '').trim();

        if (!!permission) {
            let index = this.user.permissions.indexOf(permission);
            if (index < 0) {
                this.user.permissions.push(permission.toLowerCase());

                // Reset the input value
                if (event.input) {
                    event.input.value = '';
                }
            }
        }
    }

    private removePermission(permission: string) {
        if (!!permission) {
            let index = this.user.permissions.indexOf(permission.toLowerCase());
            if (index >= 0) {
                this.user.permissions.splice(index, 1);
            }
        }
    }
}
