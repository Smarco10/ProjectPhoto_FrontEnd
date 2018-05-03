import { Injectable } from '@angular/core';

import { Slide } from '@models/slide'

import { FeathersService, FeathersServiceEventListener } from "@services/feathers/feathers.service";
import { AuthService } from "@services/auth/auth.service";

@Injectable()
export class SlideService extends FeathersServiceEventListener {

    private photosService: any;
    private uploadService: any;

    constructor(
        private client: FeathersService,
        private authenticationService: AuthService
    ) {
        super(client.service('photos'));
        this.photosService = this.eventService;
        this.uploadService = this.client.service('uploads');
    }

    getSlides(query: any): Promise<any[]> {
        return this.photosService.find({
            query: query
        });
    }

    getSlideData(id: string, format: string, width: number, height: number): Promise<any> {
        return this.uploadService.get(id, {
            query: {
                size: {
                    width: width,
                    height: height
                },
                format: format
            }
        });
    }

    uploadFile(fileData: string): Promise<any> {
        return this.uploadService.create({ uri: fileData });
    }

    uploadSlide(fileData: string, title: string, text: string): Promise<any> {
        let that = this;
        return new Promise<any>(function(accept, refuse) {
            that.uploadFile(fileData)
                .then(data => {
                    that.photosService
                        .create({
                            image: data.id,
                            title: title,
                            text: text
                        })
                        .then(data => {
                            accept(data);
                        })
                        .catch(err => {
                            refuse(err);
                        });
                })
                .catch(err => {
                    refuse(err);
                });
        });
    }

    deleteSlide(id: string): Promise<any> {
        return this.photosService.remove(id, {});
    }
}
