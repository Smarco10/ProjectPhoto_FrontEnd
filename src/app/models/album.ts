import { Slide } from "./slide"

export class Album extends Slide {

slides: Array<string>;

    constructor(id: string, slides: Array<string>, imageId: string, title: string) {
        super(id, imageId, title, "");
        this.slides = slides || [];
    }

    update(slides: Array<string>, imageId: string, title: string) {
        //TODO est ce que ça fonctionne avec this.slides = slides ?
        this.slides.splice(0, this.slides.length, slides);
    }
}
