import { Component, OnInit, Input } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { Album } from '@models/album'

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.css'],
    animations: [
        trigger('mouseInOut', [
            state('in', style({
                opacity: 1, 
                transform: 'translateY(-100%)'
            })),
            state('out', style({
                opacity: 0,
                transform: 'translateY(0)'
            })),
        ])
    ]
})
export class AlbumComponent implements OnInit {

    @Input() album: Album;
    private hover: string = 'out';

    constructor() { }

    ngOnInit() {
        this.hover = 'out';
    }

}
