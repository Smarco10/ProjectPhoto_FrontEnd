import { Injectable } from '@angular/core';

import {
    FeathersService,
    FeathersServiceEventListener,
    ServiceNames
} from "@services/feathers/feathers.service";

@Injectable()
export class SlideService extends FeathersServiceEventListener {

    constructor(
        private client: FeathersService
    ) {
        super(client.service(ServiceNames.PHOTOS));
    }

    getSlides(query?: any): Promise<any[]> {
        return this.eventService.find({ query });
    }

    uploadSlide(imageId: string, title: string, text: string): Promise<any> {
        return this.eventService.create({
            image: imageId,
            title,
            text
        });
    }

    deleteSlide(id: string): Promise<any> {
        return this.eventService.remove(id, {});
    }
}
