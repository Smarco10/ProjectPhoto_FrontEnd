import {
    Component,
    AfterContentInit,
    OnDestroy,
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

@Component({
    selector: 'app-gallery-elt',
    template: `
		<div *ngIf="!isHidden" [@visibilityState]="visibilityRequested" (@visibilityState.done)="applyState()">
			<ng-content></ng-content>
		</div>
	`, //TODO: ngIf provoque une erreur
    animations: [
        trigger('visibilityState', [
            state('hide', style({
                opacity: 0
                //transform: 'translateX(100vw + 100%)'
            })),
            state('show', style({
                opacity: 1
                //transform: 'translateX(0vw)'
            })),
            /*transition('hide => show', animate('1000ms ease-out')),
            transition('show => hide', animate('1000ms ease-out'))*/
            transition('* => *', animate(300))
        ])
    ]
})
export class GalleryElt {
    private _id: string = Guid.newGuid();
    private _isHidden: boolean = true;
    private visibilityRequested: string = 'hide';

    constructor() { }
    /*
    defaut: isHidden = true && visibilityRequested = 'hide'
    visible: setIsHidden(false) => isHidden = false && visibilityRequested = 'show' => transition: 'hide' -> 'show'
    invisible: setIsHidden(true) => visibilityRequested = 'hide' => transition: 'show' -> 'hide' && isHidden = true
    */
    get id(): string {
        return this._id;
    }

    get isHidden(): boolean {
        return this._isHidden;
    }

    set isHidden(isHidden: boolean) {
        if (!isHidden) {
            this.applyState();
        }
        this.visibilityRequested = isHidden ? 'hide' : 'show';
        console.log("isHidden", this.visibilityRequested, isHidden);
    }

    private applyState(): void {
        this._isHidden = this.visibilityRequested === 'hide';
        console.log("applyState", this.visibilityRequested, this.isHidden);
    }
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

    @Output() onload: EventEmitter<number> = new EventEmitter();

    private currentSlide: Slide = undefined;
    @Input slides: Array<Slide>;

    //TODO: used only for slidepane tests
    private activePane: number = 0;
    private panes: Array<any> = [
        { color: 'green', name: 'left' },
        { color: 'blue', name: 'center' },
        { color: 'red', name: 'right' },
        { color: 'maroon', name: '1' },
        { color: 'yellow', name: '2' }
    ];

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
