import { Observable, Subject } from 'rxjs';
import { Slide } from "./slide"

export class Album extends Slide {

    private _slides: Array<string>;
    private slidesSubject: Subject<Array<string>> = new Subject<Array<string>>();

    constructor(serverData: any) {
        super(serverData);
    }

    public updateFromServer(serverData: any): boolean {
        const serverDataAreValid = super.updateFromServer(serverData);
        if (serverDataAreValid) {
            //we cannot use this.slides because it is called by parent and own objects (like this.slidesSubject) aren't created yet
            this._slides = serverData.slides || [];
        }
        return serverDataAreValid;
    }

    set slides(slides: Array<string>) {
        this._slides = slides || [];
        this.slidesSubject.next(this._slides);
    }

    get slides(): Array<string> {
        return this._slides;
    }

    getSlidesObserver(): Observable<Array<string>> {
        return this.slidesSubject.asObservable();
    }

    public addSlides(...slides: string[]): boolean {
        let previousLenght = this._slides.length;

        for (let slide of slides) {
            if (this._slides.indexOf(slide) < 0) {
                this._slides.push(slide);
            }
        }

        const succeed: boolean = previousLenght < this._slides.length;

        if (succeed) {
            this.slidesSubject.next(this._slides);
        }

        return succeed;
    }

    public removeSlides(...slides: string[]): boolean {
        let previousLenght = this._slides.length;
        for (let slide of slides) {
            let index = this._slides.indexOf(slide);
            if (index >= 0) {
                this._slides.splice(index, 1);
            }
        }

        const succeed: boolean = previousLenght > this._slides.length;

        if (succeed) {
            this.slidesSubject.next(this._slides);
        }

        return succeed;
    }
}
