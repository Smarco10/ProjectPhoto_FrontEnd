import { Injectable } from '@angular/core';

import {
    FeathersService,
    ServiceNames
} from "@services/feathers/feathers.service";

@Injectable()
export class FilesService {

    private filesService: any;

    constructor(
        private client: FeathersService
    ) {
        this.filesService = this.client.service(ServiceNames.FILES);
    }

    getFileData(id: string, options?: any): Promise<any> {
        return this.filesService.get(id, {
            query: options
        });
    }

    uploadFile(data: string, name?: string, format?: string): Promise<any> {
        let query: any = { uri: data };
        if (!!format) {
            Object.assign(query, { format });
        }
        if (!!name) {
            Object.assign(query, { name });
        }
        return this.filesService.create(query);
    }

    deleteFile(id: string): Promise<any> {
        return this.filesService.remove(id, {});
    }

    static getPictureParam(format: string, width: number, height: number): any {
        return {
            format,
            size: {
                width,
                height
            }
        };
    }
}
