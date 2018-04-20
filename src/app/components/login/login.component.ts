import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from "@services/auth/auth.service";
import { AppComponent } from "@components/app/app.component";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    error = '';
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private root: AppComponent,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern('^.{5,}$')]]
        });

        this.root.logout(false);
        // Get the query params
        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/');
    }

    signup() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.authService.signup(this.loginForm.value.login, this.loginForm.value.password)
                .then(() => {
                    this.error = 'Account successfully created'
                    console.log(this.error);
                    this.loading = false;
                })
                .catch(err => {
                    // signup failed
                    this.error = 'Failed to create account, try with another email';
                    console.error(this.error);
                    this.loading = false;
                });
        }
        else {
            console.error("Some element in the login form are invalid");
        }
    }

    login() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.authService.login(this.loginForm.value.login, this.loginForm.value.password)
                .then(() => {
                    this.root.setLogged(true);
                    console.log("successfully logged in");
                    this.router.navigateByUrl(this.returnUrl);
                })
                .catch(err => {
                    // login failed
                    this.error = 'Email or password is incorrect';
                    console.error(this.error);
                    this.loading = false;
                });
        }
        else {
            console.error("Some element in the login form are invalid");
        }
    }
}
