import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from "@services/auth/auth.service";

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
    passwordHide: true;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.pattern('^.{5,}$')]]
        });

        this.authService.logout();
        // Get the query params
        this.route.queryParams.subscribe(params => this.returnUrl = params['returnUrl'] || '/');

        this.passwordHide = true;
    }

    login() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.authService.login(this.loginForm.value.login, this.loginForm.value.password)
                .then(() => {
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
