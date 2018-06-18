import { Component, AfterContentInit, ContentChildren, QueryList } from '@angular/core';

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
export class GalleryComponent implements AfterContentInit {

    @ContentChildren(GalleryElt)
    galleryElts: QueryList<GalleryElt>;

    private index: number = 0;

    constructor() { }

    ngAfterContentInit() {
        console.log("GalleryComponent", this.galleryElts);
        this.index = 0;
        if (this.galleryElts.length > this.index) {
            this.galleryElts[this.index].isHidden = false;
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
            this.galleryElts[this.index].isHidden = true;
            this.index--;
            this.galleryElts[this.index].isHidden = false;
            //TODO send externel event onPrevious
        }
    }

    private nextElt(): void {
        if (this.hasNextElt()) {
            this.galleryElts[this.index].isHidden = false;
            this.index++;
            this.galleryElts[this.index].isHidden = true;
            //TODO send externel event onNext
        }
    }
}
