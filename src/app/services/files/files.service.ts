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

    uploadFile(data: string, name?: string): Promise<any> {
        let query: any = { uri: data };
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

    uploadFiles(files) {
        let xhr = new XMLHttpRequest();

        const method = "post";
        const url = "http://localhost:3030/" + ServiceNames.FILES;

        xhr.open(method, url, true);
        xhr.withCredentials = true;

        xhr.onload = (function(e) {
            console.log("xhr.onload", xhr.readyState);
            if (xhr.readyState !== 4) {
                return;
            }

            if (!!xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
                try {
                    console.error("xhr.onload", xhr.responseText);
                } catch (_error) {
                    console.error("xhr.onload", "Invalid JSON response from server.");
                }
            }

            //xhr.onprogress(xhr, null);

            if (!(200 <= xhr.status && xhr.status < 300)) {
                console.error("xhr.onload error status code", xhr.status);
            } else {
                console.log("xhr.onload finished");
            }
        });

        xhr.onerror = (function() {
            console.error("xhr.onerror", xhr.status);
        })

        xhr.onprogress = (evt => {
            let progress = 0;
            let allFilesFinished = false;

            if (evt != null) {
                progress = 100 * evt.loaded / evt.total;
            } else {
                allFilesFinished = true;
                progress = 100;
            }

            console.log("xhr.onprogress: ", progress, allFilesFinished);
        });

        let headers = {
            "Accept": "application/json",
            "Cache-Control": "no-cache",
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": "Bearer " + this.client.getJWT()
        };

        for (let headerName in headers) {
            let headerValue = headers[headerName];
            if (!!headerValue) {
                xhr.setRequestHeader(headerName, headerValue);
            }
        }

        //FormData
        let formData = new FormData();

        for (let i = 0; i < files.length; ++i) {
            formData.append("file" + i, files[i], files[i].name);
        }

        return xhr.send(formData);
    }
}
