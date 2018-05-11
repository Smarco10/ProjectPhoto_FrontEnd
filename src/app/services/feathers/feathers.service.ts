import { Injectable } from '@angular/core';

import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

import * as io from 'socket.io-client';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes'

import { User } from '@models/user';

/**
 * Simple wrapper for feathers
 */
@Injectable()
export class FeathersService {
    // There are no proper typings available for feathers, due to its plugin-heavy nature
    private _feathers: any;
    private _socket: any;

    private _authenticatedEventCallbackQueue: Array<Function> = new Array<Function>();

    constructor() {
        const serverAddressStartIndex = window.location.href.indexOf("//") + 2;
        let serverAddressEndIndex = window.location.href.indexOf(":", serverAddressStartIndex);
        if (serverAddressEndIndex == -1)
            serverAddressEndIndex = window.location.href.indexOf("/", serverAddressStartIndex);

        const serverAddress = window.location.href.substring(serverAddressStartIndex, serverAddressEndIndex);
        const serverPort = 3030;
        const serverProtocol = 'http';
        const serverUrl = serverProtocol + '://' + serverAddress + ':' + serverPort;

        this._socket = io(serverUrl, {
            transports: ['websocket'],
            forceNew: true
        });       // init socket.io

        this._feathers = feathers()         // init Feathers
            .configure(socketio(this._socket))	// add socket.io plugin
            .configure(authentication({         // add authentication plugin
                storage: window.localStorage
            }));

        this.onLogout(() => {
            console.log("successfully logged out");
            this._feathers.set('user', undefined);
        });

        this.onReauthenticationError(() => {
            console.log("Reauthentication Error");
            this._feathers.set('user', undefined);
        });
    }

    // expose authentication
    public async authenticate(credentials?) {
        var authicated: boolean = false;

        try {
            let response = await this._feathers.authenticate(credentials);
            let payload = await this._feathers.passport.verifyJWT(response.accessToken);
            console.log("successfully logged in");

            let user = await this.service('users').get(payload.userId);
            console.log("User:", user);
            this._feathers.set('user', new User(user._id, user.email, user.permissions));

            authicated = true;

        } catch (err) {
            authicated = false;
            this._feathers.set('user', undefined);
            this.logout();
            console.error("Authentication err");
            if (err.code != UNAUTHORIZED) {
                console.error(err);
            }
        }

        if (authicated) {
            for (let callback of this._authenticatedEventCallbackQueue) {
                callback();
            }
        }

        return new Promise<any>((resolve, reject) => {
            if (authicated)
                resolve();
            else
                reject();
        });
    }

    public getConnectedUser(): User {
        return this._feathers.get('user');
    }

    // expose logout
    public logout() {
        return this._feathers.logout();
    }

    // expose services
    public service(name: string) {
        return this._feathers.service(name);
    }

    // expose signals
    public onAuthenticated(callback: Function) {
        this._authenticatedEventCallbackQueue.push(callback);
    }

    public onLogout(callback: Function) {
        this._feathers.on('logout', callback);
    }

    public onReauthenticationError(callback: Function) {
        this._feathers.on('reauthentication-error', callback);
    }
}

export class FeathersServiceEventListener {

    constructor(protected eventService: any) { }

    onEvent(event: string, callback: Function) {
        this.eventService.on(event, callback);
    }

    onCreated(callback: Function) {
        this.onEvent('created', callback);
    }

    onUpdated(callback: Function) {
        this.onEvent('updated', callback);
        this.onEvent('patched', callback);
    }

    onRemoved(callback: Function) {
        this.onEvent('removed', callback);
    }
}
