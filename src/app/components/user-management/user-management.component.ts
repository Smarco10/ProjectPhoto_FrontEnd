import { Component, OnInit, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';

import { AuthService, FeathersService, ConfigurationService } from 'services';
import { User } from '@models/user';

import { FormGroup, FormControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { ValidatorMethods, generateFormGroup } from '@tools/validators'

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

    private userForm: FormGroup;

    private userPermissions: any = [];

    constructor(
        private formBuilder: FormBuilder,
        private userService: AuthService,
        private configurationService: ConfigurationService
    ) { }

    ngOnInit() {

        this.isConnectedUserAdmin = this.userService.getConnectedUser().isAdmin();

        this.configurationService.getPermissions()
            .then(permissions => {
            this.userPermissions = [...permissions, "invalid]; //TODO: Test with invalid value
            })
            .catch(err => {
                console.error(err);
            });

        this.configurationService.getValidators()
            .then(validators => {
                const shemaType = this.user.isCreated() ? ValidatorMethods.PATCH : ValidatorMethods.CREATE;
                this.userForm = generateFormGroup(validators[shemaType].user);
                //TODO: Associate user.permissions with this.userForm.permissions validator
            })
            .catch(err => {
                console.error(err);
            });

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
            if (!!this.userForm && this.userForm.valid) {
                this.userService.createUser(this.user)
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }

    private updateUser() {
        if (this.user.isCreated() && !!this.userForm && this.userForm.valid) {
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

    private addPermission(permission: string) {
        this.user.addPermission(this.userPermissions[permission]);
    }

    private removePermission(permission: string) {
        this.user.removePermission(permission);
    }

    private userPermissionsKeys(): Array<string> {
        return Object.keys(this.userPermissions);
    }
}
