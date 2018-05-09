import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'services';
import { User } from '@models/user';

import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes'

import { AppComponent } from "@components/app/app.component";

@Component({
    selector: 'app-users-manager',
    templateUrl: './users-manager.component.html',
    styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {

    private users: Array<User> = new Array<User>();

    constructor(
        private router: Router,
        private root: AppComponent,
        private userService: AuthService
    ) {
        this.users.push(undefined); //used for newUser
    }

    ngOnInit() {

        this.userService.onCreated((user, context) => {
            this.users.splice(this.users.length - 1, 0, new User(user._id, user.email, user.permissions));
        });

        this.userService.onRemoved((user, context) => {
            for (var i = 0; i < this.users.length; ++i) {
                if (this.users[i].id === user._id) {
                    this.users.splice(i, 1);
                    break;
                }
            }

            if (user._id === this.userService.getUser().id) {
                this.root.logout(true);
            }
        });

        this.getUsers();
    }

    private getUsers() {
        let usersOutputArray = this.users;

        this.userService.getUsers()
            .then(users => {
                for (var i = 0; i < users.data.length; ++i) {
                    let permissions = typeof (users.data[i].permissions) === "string" ? [users.data[i].permissions] : users.data[i].permissions;
                    usersOutputArray.splice(this.users.length - 1, 0, new User(users.data[i]._id, users.data[i].email, permissions));
                }
            })
            .catch(err => {
                if (err.code === FORBIDDEN || err.code === UNAUTHORIZED) {
                    let user = this.userService.getUser();
                    if (!!user) {
                        usersOutputArray.splice(0, this.users.length, user);
                    } else {
                        this.router.navigateByUrl('/');
                    }
                } else {
                    console.error(err);
                }
            });
    }
}
