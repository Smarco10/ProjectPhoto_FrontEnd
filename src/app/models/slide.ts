
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
    title: string;
    text: string;

    style: object;
    imgStyle: object;
    titleStyle: object;
    textStyle: object;

    constructor(id: string, imageId: string, title: string, text: string) {
        this.id = id;
        this.imageId = imageId;

        this.title = title;
        this.text = text;

        this.style = {
            //"position": "absolute",
            "width": "100%"
        };

        this.imgStyle = {
            "display": "block",
            "margin": "auto",
            "vertical-align": "middle"
        }

        this.titleStyle = {
            "position": "absolute",
            "top": "10%",
            "left": "0",
            "text-align": "center",
            "width": "100%"
        };
        this.textStyle = {};

        this.isLoaded = false;
    }

    setData(data: ArrayBuffer | string, metadata: any) {
        this.data = typeof (data) === "string" ? data : b64(data);
        this.metadata = metadata;
        this.mimetype = metadata["Mime type"];

        this.isLoaded = true;
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