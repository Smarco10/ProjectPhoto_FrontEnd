import { Component, OnInit, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';

import { AuthService, FeathersService, ConfigurationService } from 'services';
import { User } from '@models/user';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { generateShema } from '@tools/validators'

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

    private userCreateForm: FormGroup;
    private userPatchForm: FormGroup;

    private userPermissions: any = [];

    private userCreateValidators: any = {};
    private userPatchValidators: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private userService: AuthService,
        private configurationService: ConfigurationService
    ) {
        this.userCreateValidators = {
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern('^.{2,}$')]]
        };
        this.userPatchValidators = {
            email: ['', [Validators.required]], //TODO: Validators.email
            password: ['', [Validators.pattern('^.{2,}$')]]
        };

        console.log("init", this.userPatchValidators);

        this.userCreateForm = this.formBuilder.group(this.userCreateValidators);
        this.userPatchForm = this.formBuilder.group(this.userPatchValidators);
    }

    ngOnInit() {

        this.isConnectedUserAdmin = this.userService.getConnectedUser().isAdmin();

        this.configurationService.getPermissions()
            .then(permissions => {
                this.userPermissions = permissions;
            })
            .catch(err => {
                console.error(err);
            });

        this.configurationService.getValidators()
            .then(validators => {
                //TODO: do not work properly
                for (let validatorName of Object.keys(validators["userCreateData"])) {
                    this.userCreateValidators[validatorName] = generateShema(validators["userCreateData"][validatorName]);
                }
                for (let validatorName of Object.keys(validators["uerPatchData"])) {
                    this.userPatchValidators[validatorName] = generateShema(validators["userCreateData"][validatorName]);
                }
                console.log("after", this.userPatchValidators);
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

    private getFormGroup() {
        return this.user.isCreated() ? this.userPatchForm : this.userCreateForm;
    }

    public resetView(): void {
        this.deleteRequest = false;
        this.passwordHide = true;
    }

    private createUser() {
        if (this.user.isCreated()) {
            this.updateUser();
        } else {
            if (this.userCreateForm.valid) {
                this.userService.createUser(this.user)
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }

    private updateUser() {
        if (this.user.isCreated() && this.userCreateForm.valid) {
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
