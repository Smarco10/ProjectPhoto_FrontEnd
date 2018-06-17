import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

    componentToExpose: any;

    constructor() { }

    ngOnInit() {
    }

    private hasPreviousElt(): boolean {
        return true; //TODO
    }

    private previousElt(): void {
        //TODO
    }

    private hasNextElt(): boolean {
        return true; //TODO
    }

    private nextElt(): void {
        //TODO
    }
}
