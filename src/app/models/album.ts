import { Slide } from "./slide"

export class Album extends Slide {

    slides: Array<Slide>;

    constructor(id: string, slides: Array<Slide>, imageId: string, title: string, text: string) {
        super(id, imageId, title, text);
        this.slides = slides || [];
    }
}