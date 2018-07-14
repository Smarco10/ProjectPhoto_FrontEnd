import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
    selector: 'app-search-mat-fab',
    templateUrl: './search-mat-fab.component.html',
    styleUrls: ['./search-mat-fab.component.css'],
    animations: [
        trigger('searchMouseInOut', [
            state('true', style({
                width: '250px'
            })),
            state('false', style({
                width: '*'
            })),
            transition('1 => 0', animate('300ms ease-out')),
            transition('0 => 1', animate('300ms ease-in'))
        ])
    ]
})
export class SearchMatFabComponent implements OnInit {

    private searchExpended: boolean = false;
    private showInput: boolean = false;

    @Output() search: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
        this.searchExpended = false;
    }

    private searchMouseInOutStart(): void {
        if (!this.searchExpended) {
            this.showInput = false;
        }
    }

    private searchMouseInOutDone(): void {
        if (this.searchExpended) {
            this.showInput = true;
        }
    }

}
