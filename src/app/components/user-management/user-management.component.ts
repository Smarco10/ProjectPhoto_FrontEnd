import { Component, OnInit, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';

import { AuthService } from 'services';
import { User, UserPermissions } from '@models/user';
import { MatChipInputEvent } from "@angular/material/chips";
import { ENTER, COMMA, SPACE, TAB, ESCAPE } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

    private isConnectedUserAdmin: boolean = false;

    @Input() user: User;
    @Input() isAlone: boolean;

    private deleteRequest: boolean = false;
    private passwordHide: boolean = true;

    private separatorKeysCodes = [ENTER, COMMA, SPACE, TAB, ESCAPE];

    private userForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private userService: AuthService
    ) {
        //TODO: to get from server
        const validators = {
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.pattern('^.{5,}$')]]
        };

        this.userForm = this.formBuilder.group(validators);
    }

    ngOnInit() {

        this.isConnectedUserAdmin = this.userService.getConnectedUser().isAdmin();

        this.resetView();

        this.userService.onUpdated((user, context) => {
            if (user._id === this.user.id) {
                if (!!user.password) {
                    this.user.password = user.password;
                }
                if (!!user.email) {
                    this.user.email = user.email;
                }
                if (!!user.permissions) {
                    this.user.permissions = user.permissions;
                }
            }
        });
    }

    public resetView(): void {
        this.deleteRequest = false;
        this.passwordHide = true;
    }

    private createUser() {
        if (this.user.isCreated()) {
            this.updateUser();
        } else {
            if (this.userForm.valid) {
                this.userService.createUser(this.user)
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }

    private updateUser() {
        if (this.user.isCreated() && this.userForm.valid) {
            this.userService.updateUser(this.user)
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private deleteUser() {
        if (this.user.isCreated()) {
            this.userService.deleteUser(this.user.id)
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private addPermission(permission: UserPermissions) {
        this.user.addPermission(UserPermissions[permission]);
    }

    private removePermission(permission: UserPermissions) {
        this.user.removePermission(permission);
    }

    private userPermissionsKeys(): Array<string> {
        return Object.keys(UserPermissions);
    }
}
