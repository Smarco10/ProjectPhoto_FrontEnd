import { Injectable } from '@angular/core';

import { Album } from '@models/album';

import {
    FeathersService,
    FeathersServiceEventListener,
    ServiceNames
} from "@services/feathers/feathers.service";

import { AuthService } from "@services/auth/auth.service";

@Injectable()
export class AlbumsService extends FeathersServiceEventListener {

    private albumsService: any;

    constructor(
        private client: FeathersService,
        private authenticationService: AuthService
    ) {
        super(client.service(ServiceNames.ALBUMS));
        this.albumsService = this.eventService;
    }

    getAlbums(query: any): Promise<any[]> {
        return this.albumsService.find({
            query: query
        });
    }

    uploadAlbum(album: Album): Promise<any> {
        return this.albumsService
            .create({
                /*TODO*/
            });
    }

    deleteAlbum(id: string): Promise<any> {
        return this.albumsService.remove(id, {});
    }
}
