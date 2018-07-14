import { Observable, Subject } from 'rxjs';

function b64(e: ArrayBuffer): string {
    let t = "";
    let n = new Uint8Array(e);
    let r = n.byteLength;
    for (let i = 0; i < r; ++i) {
        t += String.fromCharCode(n[i]);
    }
    return window.btoa(t);
}

export class Slide {

    id: string;
    isLoaded: boolean = false;
    isHidden: boolean = false;

    mimetype: string;
    data: string;
    metadata: any;

    private _imageId: string;
    private imageIdSubject: Subject<string> = new Subject<string>();

    title: string;
    text: string;

    style: object;
    imgStyle: object;
    titleStyle: object;
    textStyle: object;

    constructor(serverData: any) {
        this.id = serverData._id;
        this.updateFromServer(serverData);

        this.style = {
            "width": "100%"
        };

        this.setStyle(
            {
                "display": "block",
                "margin": "auto",
                "vertical-align": "middle"
            },
            {
                //"position": "absolute",
                "top": "10%",
                "left": "0",
                "text-align": "center",
                "width": "100%"
            },
            {}
        );
    }

    public isCreated(): boolean {
        return !!this.id;
    }

    updateFromServer(serverData: any): boolean {
        const serverDataAreValid: boolean = serverData._id === this.id;
        if (serverDataAreValid) {
            this.title = serverData.title;
            this.text = serverData.text;
            if (this.imageId !== serverData.image) {
                this.imageId = serverData.image;
                this.isLoaded = false;
            }
            //TODO: how to update style???
        }
        return serverDataAreValid;
    }

    setData(data: ArrayBuffer | string, metadata: any): void {
        this.data = typeof (data) === "string" ? data : b64(data);
        this.metadata = metadata;
        this.mimetype = metadata["Mime type"];

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
            this.imageIdSubject.next(this.imageId);
        }
    }

    getImageIdObserver(): Observable<string> {
        return this.imageIdSubject.asObservable();
    }

    setStyle(imgStyle: object, titleStyle: object, textStyle: object) {
        this.imgStyle = imgStyle;
        this.titleStyle = titleStyle;
        this.textStyle = textStyle;
    }

    getWidth(): Number {
        return this.metadata.size.width;
    }

    getHeight(): Number {
        return this.metadata.size.height;
    }
}