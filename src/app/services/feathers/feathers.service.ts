import { Injectable } from '@angular/core';

import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import * as io from 'socket.io-client';

/**
 * Simple wrapper for feathers
 */
@Injectable()
export class FeathersService {
    // There are no proper typings available for feathers, due to its plugin-heavy nature
    private _feathers: any;
    private _socket: any;

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
    }

    // expose authentication
    public authenticate(credentials?): Promise<any> {
        let auth = this._feathers.authenticate(credentials);
        auth.then(response => {
            return this._feathers.passport.verifyJWT(response.accessToken);
        })
            .then(payload => {
                console.log('JWT Payload', payload);
            });
        return auth;
    }

    // expose logout
    public logout() {
        return this._feathers.logout();
    }

    // expose services
    public service(name: string) {
        return this._feathers.service(name);
    }
}
