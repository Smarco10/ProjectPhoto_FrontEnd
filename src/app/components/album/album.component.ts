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
        trigger('flyInOut', [
            state('hover', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-100%)'
                }),
                animate('0.2s ease-in')
            ]),
            transition('* => void', [
                animate('0.2s 0.1s ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class AlbumComponent implements OnInit {

    @Input() album: Album;
    private hover: boolean = false;

    constructor() { }

    ngOnInit() {
        this.hover = false;
    }

}
