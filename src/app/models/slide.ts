import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

function b64(e: ArrayBuffer): string {
    var t = "";
    var n = new Uint8Array(e);
    var r = n.byteLength;
    for (var i = 0; i < r; ++i) {
        t += String.fromCharCode(n[i]);
    }
    return window.btoa(t);
}

export class Slide {

    id: string;
    isLoaded: Boolean = false;

    imageId: string;
    mimetype: string;
    data: string;
    metadata: any;
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
                "position": "absolute",
                "top": "10%",
                "left": "0",
                "text-align": "center",
                "width": "100%"
            },
            {}
        );
    }

    updateFromServer(serverData: any) {
        this.title = serverData.title;
        this.text = serverData.text;
        if (this.imageId !== serverData.image) {
            this.imageId = serverData.image;
            this.isLoaded = false;
            this.imageIdSubject.next(this.imageId);
        }
        //TODO: how to update style???
    }

    setData(data: ArrayBuffer | string, metadata: any) {
        this.data = typeof (data) === "string" ? data : b64(data);
        this.metadata = metadata;
        this.mimetype = metadata["Mime type"];

        this.isLoaded = true;
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