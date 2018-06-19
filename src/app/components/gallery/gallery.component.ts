import { Component, AfterContentInit, OnDestroy, ContentChildren, QueryList } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-gallery-elt',
    template: '<ng-content *ngIf="!isHidden"></ng-content>',
})
export class GalleryElt {
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

    private index: number = 0;

    constructor() { }

    ngAfterContentInit() {
        console.log("GalleryComponent", this.galleryElts);
        this.index = 0;
        this.galleryEltsSubscription = this.galleryElts.changes.subscribe(() => {
            this.setElementVisibility(true);
        });
    }

    ngOnDestroy(): void {
        if (!!this.galleryEltsSubscription) {
            this.galleryEltsSubscription.unsubscribe();
        }
    }

    private setElementVisibility(isVisible: boolean) {
        if (this.index < this.galleryElts.length && this.galleryElts[this.index].isHidden == isVisible) {
            this.galleryElts.toArray()[this.index].isHidden = !isVisible;
        }
    }

    private hasPreviousElt(): boolean {
        return this.index > 0;
    }

    private hasNextElt(): boolean {
        return this.index < this.galleryElts.length;
    }

    private previousElt(): void {
        if (this.hasPreviousElt()) {
            this.setElementVisibility(false);
            this.index--;
            this.setElementVisibility(true);
            //TODO send externel event onPrevious
        }
    }

    private nextElt(): void {
        if (this.hasNextElt()) {
            this.setElementVisibility(false);
            this.index++;
            this.setElementVisibility(true);
            //TODO send externel event onNext
        }
    }
}
