import { Component, AfterContentInit } from '@angular/core';

@Component({
    selector: 'app-gallery-elt',
    template: '<ng-content *ngIf="!isHidden"></ng-content>',
})
export class GalleryElt {
    isHidden: boolean = true;
    constructor(){}
}

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements AfterContentInit {

@ContentChildren(GalleryElt)
galleryElts: QueryList<GalleryElt>;
    index: number = 0;

    constructor() { }

    ngAfterContentInit() {
        console.log(galleryElts);
        //show first elt if possible
    }

    private hasPreviousElt(): boolean {
    return this.index > 0;
    }

    private previousElt(): void {
    if(hasPreviousElt()){
    this.index--;
    //TODO change visible elt and send externel event onPrevious
    }
    }

    private hasNextElt(): boolean {
    return this.index < galleryElts.length;
    }

    private nextElt(): void {
    if(hasNextElt()) {
    this.index++;
    //TODO change visible elt and send externel event onNext
    }
    }
}
