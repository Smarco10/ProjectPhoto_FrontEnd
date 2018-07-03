import {
    Component,
    AfterContentInit,
    OnDestroy,
    ContentChildren,
    QueryList,
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

@Component({
    selector: 'app-gallery-elt',
    template: '<ng-content *ngIf="!isHidden" [@visibilityState]="isHidden"></ng-content>', //TODO: ngIf provoque une erreur
    animations: [
        trigger('visibilityState', [
            state('false', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            state('true', style({
                opacity: 0,
                transform: 'translateX(100%)'
            })),
            transition('false => true', animate('100ms ease-out')),
            transition('true => false', animate('100ms ease-in'))
        ])
    ]
})
export class GalleryElt {
    id: string = Guid.newGuid();
    isHidden: boolean = true;
    constructor() { }
}

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterContentInit, OnDestroy {

    @ContentChildren(GalleryElt)
    galleryElts: QueryList<GalleryElt>;
    private galleryEltsSubscription: Subscription;
    private currentVisibleElt: GalleryElt;

    private hasNextElement: boolean = false;
    private hasPreviousElement: boolean = false;

    @Output() onload: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngAfterContentInit() {
        this.setElementVisibility(true);

        this.galleryEltsSubscription = this.galleryElts.changes.subscribe(() => {
            this.setElementVisibility(true);
        });
    }

    ngOnDestroy(): void {
        if (!!this.galleryEltsSubscription) {
            this.galleryEltsSubscription.unsubscribe();
        }
    }

    private setElementVisibility(isVisible: boolean): void {
        if (!!this.galleryElts && this.galleryElts.length > 0 && !this.currentVisibleElt) {
            this.currentVisibleElt = this.galleryElts.first;
        }

        if (!!this.currentVisibleElt && this.currentVisibleElt.isHidden == isVisible) {
            this.currentVisibleElt.isHidden = !isVisible;
        }

        this.updateButtonVisibility();
    }

    private getIndexOfCurrentElt(): number {
        let index: number = -1;
        if (!!this.currentVisibleElt) {
            let arr: Array<GalleryElt> = this.galleryElts.toArray();
            let tmpIndex: number = 0;
            for (let elt of arr) {
                if (elt.id === this.currentVisibleElt.id) {
                    index = tmpIndex;
                    break;
                }
                tmpIndex++;
            };
        }
        return index;
    }

    private offsetCurrentElement(by: number): void {
        let index = this.getIndexOfCurrentElt();
        if ((index + by > -1) && (index + by < this.galleryElts.length)) {
            this.setElementVisibility(false);
            this.currentVisibleElt = this.galleryElts.toArray()[index + by];
            this.setElementVisibility(true);
            this.onload.emit(index + by);
        }
    }

    private updateButtonVisibility(): void {
        let index = this.getIndexOfCurrentElt();
        this.hasPreviousElement = (index > 0);
        this.hasNextElement = (index > -1) && (index < (this.galleryElts.length - 1));
    }

    private previousElt(): void {
        this.offsetCurrentElement(-1);
    }

    private nextElt(): void {
        this.offsetCurrentElement(+1);
    }
}
