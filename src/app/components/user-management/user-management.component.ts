import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService, FeathersService, ConfigurationService, ConfigurationTypes } from 'services';
import { User } from '@models/user';


import { ValidatorMethods, generateFormGroup, validateVariable, ValidatorStatus } from '@tools/validators'

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit, OnDestroy {

    private isConnectedUserAdmin: boolean = false;

    @Input() user: User;
    @Input() isAlone: boolean;

    private userPermissionsSubscription: Subscription;

    private deleteRequest: boolean = false;
    private passwordHide: boolean = true;

    private userForm: FormGroup;

    private userPermissions: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private userService: AuthService,
        private configurationService: ConfigurationService
    ) { }

    ngOnInit() {

        this.isConnectedUserAdmin = this.userService.getConnectedUser().isAdmin();

        this.configurationService.getConfig()
            .then(config => {
                this.userPermissions = config[ConfigurationTypes.PERMISSIONS];

                const shemaType = this.user.isCreated() ? ValidatorMethods.PATCH : ValidatorMethods.CREATE;
                this.userForm = generateFormGroup(config[ConfigurationTypes.VALIDATORS][shemaType].user);

                this.userPermissionsSubscription = this.user.getPermissionsObserver().subscribe(permissions => {
                    validateVariable(this.userForm.get("permissions"), permissions);
                });

                validateVariable(this.userForm.get("permissions"), this.user.permissions);
            })
            .catch(err => {
                console.error(err);
            });

        this.resetView();

        this.userService.onUpdated((user, context) => {
            this.user.updateFromServer(user);
        });
    }

    ngOnDestroy() {
        if (!!this.userPermissionsSubscription) {
            this.userPermissionsSubscription.unsubscribe();
        }
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
