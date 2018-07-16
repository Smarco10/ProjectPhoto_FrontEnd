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

    @Output() onLoad: EventEmitter<number> = new EventEmitter();

    private currentElement: number = 0;
    private _nbElements: number = 0;

    private hasNextElement: boolean = false;
    private hasPreviousElement: boolean = false;

    @Input()
    set nbElements(nbElements: number) {
        this._nbElements = nbElements;
        this.updateButtonVisibility();
    }

    get nbElements(): number {
        return this._nbElements;
    }

    constructor() { }

    ngAfterViewInit(): void {
        this.updateButtonVisibility();
    }

    private updateButtonVisibility(): void {
        this.hasPreviousElement = (this.currentElement > 0);
        this.hasNextElement = (this.currentElement > -1) && (this.currentElement < (this.nbElements - 1));
    }

    private previousElt(): void {
        if (this.hasPreviousElement) {
            this.currentElement -= 1;
            this.onLoad.emit(this.currentElement);
            this.updateButtonVisibility();
        }
    }

    private nextElt(): void {
        if (this.hasNextElement) {
            this.currentElement += 1;
            this.onLoad.emit(this.currentElement);
            this.updateButtonVisibility();
        }
    }
}
