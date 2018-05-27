import { Component, OnInit, Input } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { SlideService } from 'services'
import { Album } from '@models/album'

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.css'],
    animations: [
        trigger('mouseInOut', [
            state('in', style({
                opacity: 1,
                transform: 'translateY(0) scaleY(1)'
            })),
            state('out', style({
                opacity: 0,
                transform: 'translateY(100%) scaleY(0)'
            })),
            transition('in => out', animate('100ms ease-out')),
            transition('out => in', animate('100ms ease-in'))
        ])
    ]
})
export class AlbumComponent implements OnInit {

    @Input() album: Album;
    @Input() hover: string = 'out';

    constructor(
        private slideService: SlideService
    ) { }

    ngOnInit() {
        this.hover = 'out';

        this.loadAlbumData();
    }

    private loadAlbumData() {
        if (!this.album.isLoaded) {
            var imageWidth = 600;
            this.slideService.getSlideData(this.album.imageId, "PNG", imageWidth, imageWidth)
                .then(data => {
                    this.album.setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
}
