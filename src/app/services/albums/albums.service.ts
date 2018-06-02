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

    getAlbum(id: string, options?: any): Promise<any> {
        return this.albumsService.get(id, options);
    }

    uploadAlbum(id: string, slides: string[], imageId: string, title: string): Promise<any> {
        const body = {
            slides,
            imageId,
            title
        };

        if (id) {
            return this.albumsService
                .patch(id, body);
        } else {
            return this.albumsService
                .create(body);
        }
    }

    deleteAlbum(id: string): Promise<any> {
        return this.albumsService.remove(id, {});
    }
}
