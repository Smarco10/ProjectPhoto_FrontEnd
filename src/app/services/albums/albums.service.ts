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
    ) {
        super(client.service(ServiceNames.ALBUMS));
    }

    getAlbums(query?: any): Promise<any> {
        return this.eventService.find({
            query
        });
    }

    getAlbum(id: string, options?: any): Promise<any> {
        return this.eventService.get(id, options);
    }

    uploadAlbum(id: string, slides: string[], image: string, title: string): Promise<any> {
        const body = {
            slides,
            image,
            title
        };

        if (id) {
            return this.eventService
                .patch(id, body);
        } else {
            return this.eventService
                .create(body);
        }
    }

    deleteAlbum(id: string): Promise<any> {
        return this.eventService.remove(id, {});
    }
}
