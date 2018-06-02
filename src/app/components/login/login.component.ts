import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { AuthService } from "@services/auth/auth.service";
import { ConfigurationService } from "@services/configuration/configuration.service";

import { generateFormGroup } from '@tools/validators'

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    error = '';
    returnUrl: string = '/';
    passwordHide: boolean = true;

    constructor(
        private authService: AuthService,
        private configurationService: ConfigurationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.configurationService.getValidators()
            .then(validators => {
                this.loginForm = generateFormGroup(validators["loginData"]);
            })
            .catch(err => {
                console.error(err);
            });

        this.authService.logout();
        // Get the query params
        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/');

        this.passwordHide = true;
    }

    login() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
                .then(() => {
                    this.router.navigateByUrl(this.returnUrl);
                })
                .catch(err => {
                    // login failed
                    console.error(err);
                    this.error = 'Email or password is incorrect';
                    this.loading = false;
                });
        }
        else {
            console.error("Some element in the login form are invalid");
        }
    }
}
