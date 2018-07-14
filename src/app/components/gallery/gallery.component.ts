import {
    Component,
    AfterViewInit,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';

import { Guid } from '@models/guid'
import { Slide } from '@models/slide'

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterViewInit {

    private hasNextElement: boolean = false;
    private hasPreviousElement: boolean = false;

    @Output() onload: EventEmitter<number> = new EventEmitter();

    private currentSlideId: number = 0;

    private _slides: Array<Slide>;

    @Input()
    set slides(slides: Array<Slide>) {
        this._slides = slides;
        this.updateButtonVisibility();
    }

    get slides(): Array<Slide> {
        return this._slides;
    }

    constructor() { }

    ngAfterViewInit(): void {
        this.updateButtonVisibility();
    }

    private updateButtonVisibility(): void {
        let index = this.currentSlideId;
        this.hasPreviousElement = (index > 0);
        this.hasNextElement = (index > -1) && (index < (this.slides.length - 1));
    }

    private previousElt(): void {
        if (this.hasPreviousElement) {
            this.currentSlideId -= 1;
            this.onload.emit(this.currentSlideId);
            this.updateButtonVisibility();
        }
    }

    private nextElt(): void {
        if (this.hasNextElement) {
            this.currentSlideId += 1;
            this.onload.emit(this.currentSlideId);
            this.updateButtonVisibility();
        }
    }
}
