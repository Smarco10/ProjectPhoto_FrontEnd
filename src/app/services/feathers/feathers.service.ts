import { Injectable } from '@angular/core';

import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

import * as io from 'socket.io-client';
import { FORBIDDEN, UNAUTHORIZED } from 'http-status-codes'

import { User } from '@models/user';

export enum ServiceNames {
    CONFIGURATION = "configuration",
    USERS = "users",
    FILES = "uploads",
    PHOTOS = "photos",
    ALBUMS = "albums"
};

export enum ServiceEventNames {
    LOGOUT = 'logout',
    REAUTHENTICATION_ERR = 'reauthentication-error',
    CREATED = 'created',
    UPDATED = 'updated',
    PATCHED = 'patched',
    REMOVED = 'removed'
}

const LocalUserPassportFieldName: string = 'user';

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
            this._feathers.set(LocalUserPassportFieldName, undefined);
        });

        this.onReauthenticationError(() => {
            console.log("Reauthentication Error");
            this._feathers.set(LocalUserPassportFieldName, undefined);
        });
    }

    // expose authentication
    public async authenticate(credentials?: any) {
        let authicated: boolean = false;

        try {
            let response = await this._feathers.authenticate(credentials);
            let payload = await this._feathers.passport.verifyJWT(response.accessToken);
            console.log("successfully logged in");

            let user = await this.service(ServiceNames.USERS).get(payload.userId);
            this._feathers.set(LocalUserPassportFieldName, new User(user._id, user.email, user.permissions));

            authicated = true;

        } catch (err) {
            authicated = false;
            console.error("Authentication err", err);
            this._feathers.set(LocalUserPassportFieldName, undefined);
            this.logout();
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
        return this._feathers.get(LocalUserPassportFieldName);
    }

    // expose logout
    public logout() {
        return this._feathers.logout();
    }

    // expose services
    public service(name: ServiceNames) {
        return this._feathers.service(name);
    }

    // expose signals
    public onAuthenticated(callback: Function) {
        this._authenticatedEventCallbackQueue.push(callback);
    }

    public onLogout(callback: Function) {
        this._feathers.on(ServiceEventNames.LOGOUT, callback);
    }

    public onReauthenticationError(callback: Function) {
        this._feathers.on(ServiceEventNames.REAUTHENTICATION_ERR, callback);
    }
}

export class FeathersServiceEventListener {

    constructor(protected eventService: any) { }

    onEvent(event: ServiceEventNames, callback: Function) {
        this.eventService.on(event, callback);
    }

    onCreated(callback: Function) {
        this.onEvent(ServiceEventNames.CREATED, callback);
    }

    onUpdated(callback: Function) {
        this.onEvent(ServiceEventNames.UPDATED, callback);
        this.onEvent(ServiceEventNames.PATCHED, callback);
    }

    onRemoved(callback: Function) {
        this.onEvent(ServiceEventNames.REMOVED, callback);
    }
}
