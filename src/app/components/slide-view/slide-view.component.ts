import { Component, Input, OnInit } from '@angular/core';

import { Slide } from '@models/slide';

@Component({
    selector: 'app-slide-view',
    templateUrl: './slide-view.component.html',
    styleUrls: ['./slide-view.component.css']
})
export class SlideViewComponent implements OnInit {

    @Input() slide: Slide;

    constructor() { }

    ngOnInit() {
    }

}
