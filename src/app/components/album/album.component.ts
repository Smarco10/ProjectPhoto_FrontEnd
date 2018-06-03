import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

import { FilesService, SlideService } from 'services'
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
export class AlbumComponent implements OnInit, OnDestroy {

    @Input() album: Album;
    private albumImageIdSubscription: Subscription;
    @Input() hover: string = 'out';

    constructor(
        private filesService: FilesService,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        this.albumImageIdSubscription = this.album.getImageIdObserver()
            .subscribe(message => { this.loadAlbumData(); });
        this.hover = 'out';
        this.loadAlbumData();
    }

    ngOnDestroy() {
        this.albumImageIdSubscription.unsubscribe();
    }

    private loadAlbumData() {
        if (!this.album.isLoaded) {
            var imageWidth = 600;
            console.log("get front image", this.album.imageId);
            this.filesService.getFileData(this.album.imageId, { format: "PNG", size: { width: imageWidth, height: imageWidth } })
                .then(data => {
                    console.log("front image received");
                    this.album.setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
}
