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

enum SWIPE_ACTION {
    LEFT = 'swipeleft',
    RIGHT = 'swiperight'
};

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterViewInit {

    @Output() onLoad: EventEmitter<string> = new EventEmitter();

    private currentElement: string;
    private _elements: Array<Slide>;

    private hasNextElement: boolean = false;
    private hasPreviousElement: boolean = false;

    @Input()
    set elements(elements: Array<Slide>) {
        this._elements = elements;
        if (this.elements.length > 0) {
            this.currentElement = elements[0].id;
        }
        this.updateButtonVisibility();
    }

    get elements(): Array<Slide> {
        return this.elements;
    }

    constructor() { }

    ngAfterViewInit(): void {
        this.updateButtonVisibility();
    }

    private getElementIndex(elementId: string): number {
        let i = 0;
        for (; !!this.elements && (i < this.elements.length) && (this.elements[i].id !== elementId); ++i);
        return i;
    }

    private getElementId(elementIndex: number): string {
        let id: string;
        if (!!this.elements) {
            if (elementIndex < 0) {
                id = this.elements[0].id;
            } else if (elementIndex >= this.elements.length) {
                id = this.elements[this.elements.length - 1].id;
            } else {
                id = this.elements[elementIndex].id;
            }
        }
        return id;
    }

    private updateButtonVisibility(): void {
        let elementIdex = this.getElementIndex(this.currentElement);
        this.hasPreviousElement = (elementIdex > 0);
        this.hasNextElement = (elementIdex > -1) && !!this.elements && (elementIdex < (this.elements.length - 1));
    }

    private setCurrentElement(currentEltIndex: number): void {
        this.currentElement = this.getElementId(currentEltIndex);
        if (!!this.currentElement) {
            this.onLoad.emit(this.currentElement);
        }
        this.updateButtonVisibility();
    }

    private previousElt(): void {
        if (this.hasPreviousElement) {
            this.setCurrentElement(this.getElementIndex(this.currentElement) - 1);
        }
    }

    private nextElt(): void {
        if (this.hasNextElement) {
            this.setCurrentElement(this.getElementIndex(this.currentElement) + 1);
        }
    }

    private onSwipeLeft(event: any) {
        this.nextElt();
    }

    private onSwipeRight(event: any) {
        this.previousElt();
    }

    private getIndexes(): Array<number> {
        //TODO: to change in order to allow dynamic update
        return Array(this.elements.length).fill(0).map((x, i) => i);
    }

    private spotSelected(index: number): void {
        if (index < this.elements.length) {
            this.setCurrentElement(index);
        }
    }
}
