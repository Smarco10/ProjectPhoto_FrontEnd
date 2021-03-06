import { Observable, Subject } from 'rxjs';
import { Identifiable } from "./identifiable"

function b64(e: ArrayBuffer): string {
    let t = "";
    let n = new Uint8Array(e);
    let r = n.byteLength;
    for (let i = 0; i < r; ++i) {
        t += String.fromCharCode(n[i]);
    }
    return window.btoa(t);
}

export class Slide extends Identifiable {

    isLoaded: boolean = false;
    isHidden: boolean = false;

    title: string;
    text: string;
    mimetype: string;
    data: string;
    metadata: any;

    private _imageId: string;
    private imageIdSubject: Subject<string> = new Subject<string>();

    constructor(serverData: any) {
        super(serverData);
    }

    updateFromServer(serverData: any): boolean {
        let superIsUpdated = super.updateFromServer(serverData);
        let thisCanBeUpdated = superIsUpdated || super.serverDataAreValid(serverData);
        if (thisCanBeUpdated) {
            this.title = serverData.title;
            this.text = serverData.text;
            if (this.imageId !== serverData.image) {
                this.imageId = serverData.image;
                this.isLoaded = false;
            }
        }
        return thisCanBeUpdated;
    }

    setData(data: ArrayBuffer | string, metadata: any): void {
        this.data = typeof (data) === "string" ? data : b64(data);
        this.metadata = metadata;
        if (!!metadata) {
            this.mimetype = metadata["Mime type"];
        }
        this.isLoaded = true;
    }

    unsetData() {
        this.isLoaded = false;
    }

    get imageId(): string {
        return this._imageId;
    }

    set imageId(imageId: string) {
        if (this._imageId !== imageId) {
            this._imageId = imageId;
            if (!!this.imageIdSubject) {
                this.imageIdSubject.next(this.imageId);
            }
        }
    }

    getImageIdObserver(): Observable<string> {
        return this.imageIdSubject.asObservable();
    }

    getWidth(): Number {
        return this.metadata.size.width;
    }

    getHeight(): Number {
        return this.metadata.size.height;
    }
}