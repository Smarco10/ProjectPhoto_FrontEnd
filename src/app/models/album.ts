import { Slide } from "./slide"

export class Album extends Slide {

    slides: Array<string>;

    constructor(serverData: any) {
        super(serverData);
        this.updateFromServer(serverData);
    }

    public updateFromServer(serverData: any) {
        super.updateFromServer(serverData);
        this.slides = serverData.slides || [];
    }
}
