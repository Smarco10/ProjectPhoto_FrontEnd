
const waitRotationGifData = "R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==";

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

        this.setData(waitRotationGifData, {
            "Mime type": "image/gif"
        });

        this.isLoaded = false;
    }

    setData(data: ArrayBuffer | string, metadata: any) {
        this.data = typeof (data) === "string" ? data : b64(data);
        this.metadata = metadata;
        this.mimetype = metadata["Mime type"];

        if (metadata !== undefined && metadata.size !== undefined) {
            const rScreen = window.innerWidth / window.innerHeight;
            const rSlide = metadata.size.width / metadata.size.height;
            if ((rSlide > rScreen && metadata.size.width > metadata.size.height) || window.innerHeight > window.innerWidth) {
                Object.assign(this.imgStyle, {
                    "width": "100%"
                });
            } else {
                Object.assign(this.imgStyle, {
                    "height": "100%"
                });
            }
        }

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