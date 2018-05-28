import { Injectable } from '@angular/core';

import {
    FeathersService,
    ServiceNames
} from "@services/feathers/feathers.service";

@Injectable()
export class FilesService {

    private photosService: any;
    private uploadService: any;

    constructor(
        private client: FeathersService
    ) {
        this.uploadService = this.client.service(ServiceNames.FILES);
    }

    getFileData(id: string, options?: any): Promise<any> {
        return this.uploadService.get(id, {
            query: options
        });
    }

    uploadFile(fileData: string): Promise<any> {
        return this.uploadService.create({ uri: fileData });
    }

    deleteFile(id: string): Promise<any> {
        return this.photosService.remove(id, {});
    }
}
