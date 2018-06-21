import { Component, AfterContentInit, OnDestroy, ContentChildren, QueryList } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

//TODO: a deplacer dans une classe à part
class Guid {
    private static setOfGuids: new Array<string>();

    private static genGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    static newGuid(): string {
        let guid: string = genGuid();
        while(setOfGuids.indexOf(guid) >= 0) {
            guid = genGuid();
        }
        return guid;
    }
}

@Component({
    selector: 'app-gallery-elt',
    template: '<ng-content *ngIf="!isHidden"></ng-content>',
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

    private index: number = 0;
    private currentVisibleElt: GalleryElt;

    constructor() { }

    ngAfterContentInit() {
        console.log("GalleryComponent", this.galleryElts);
        this.index = 0;
        this.galleryEltsSubscription = this.galleryElts.changes.subscribe(() => {
            if(!this.currentVisibleElt) {
                this.currentVisibleElt = this.galleryElts.first;
            }
            this.setElementVisibility(true);
        });
    }

    ngOnDestroy(): void {
        if (!!this.galleryEltsSubscription) {
            this.galleryEltsSubscription.unsubscribe();
        }
    }

    private setElementVisibility(isVisible: boolean) {
        let elts = this.galleryElts.toArray();
        if (this.index < this.galleryElts.length && elts[this.index].isHidden == isVisible) {
            elts[this.index].isHidden = !isVisible;
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
