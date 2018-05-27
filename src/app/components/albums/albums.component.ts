import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';

import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';

import { AuthService, AlbumsService, FeathersService, SlideService } from 'services';
import { Slide } from '@models/slide';
import { Album } from '@models/album';
import { MediaScreenSize } from '@tools/common';

@Component({
    selector: 'app-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.css'],
    animations: [
        trigger('mouseInOut', [
            state('in', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            state('out', style({
                opacity: 0,
                transform: 'translateX(100%)'
            })),
            transition('in => out', animate('100ms ease-out')),
            transition('out => in', animate('100ms ease-in'))
        ])
    ]
})
export class AlbumsComponent implements OnInit, AfterViewInit, OnDestroy {

    private watcher: Subscription;
    private activeMediaQuery = "";

    @Input() nbCols: number = 4;

    private albums: Array<Album> = new Array<Album>();

    allowed = {
        manageAlbum: false
    }

    constructor(
        private media: ObservableMedia,
        private auth: AuthService,
        private albumsService: AlbumsService,
        private feathers: FeathersService,
        private slideService: SlideService
    ) {
        this.feathers.onAuthenticated(() => {
            this.updateLogin();
        });

        this.feathers.onLogout(() => {
            this.updateLogin();
        });

        this.feathers.onReauthenticationError(() => {
            this.updateLogin();
        });

        this.watcher = media.subscribe((change: MediaChange) => { this.updateGrid(); });

        this.albumsService.onCreated((message, context) => {
            this.albums.push(new Album(message._id, message.slides, message.image, message.title));
        });

        this.albumsService.onUpdated((message, context) => {

        });

        this.albumsService.onRemoved((message, context) => {
            this.removeAlbum(message);
        });
    }

    ngOnInit() {
        this.updateLogin();

        this.albumsService.getAlbums(undefined)
            .then(albums => {
                for (var i = 0; i < albums.length; ++i) {
                    this.albums.push(new Album(albums[i]._id, albums[i].slides, albums[i].imageId, albums[i].title));
                }
            })
            .catch(err => {
                console.log(err);
            });

        //XXX: to remove
        this.slideService.getSlides(undefined)
            .then(slides => {
                var albumSlides: Array<Slide> = new Array<Slide>();

                for (var i = 0; i < slides.length; ++i) {
                    albumSlides.push(new Slide(slides[i]._id, slides[i].image, slides[i].title, slides[i].text));
                }

                for (var i = 0; i < albumSlides.length; ++i) {
                    this.albums.push(new Album("id", albumSlides, albumSlides[i].imageId, "album " + (i + 1)));
                }
            })
            .catch(err => {
                console.log(err);
            });
        //XXX: end to remove
    }

    ngAfterViewInit() {
        this.updateGrid();
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

    private updateLogin() {
        let user = this.auth.getConnectedUser();
        this.allowed.manageAlbum = !!user && user.isAdmin();
    }

    private updateGrid(): void {
        if (this.media.isActive(MediaScreenSize.EXTRA_LARGE)) { this.nbCols = 5; }
        else if (this.media.isActive(MediaScreenSize.LARGE)) { this.nbCols = 4; }
        else if (this.media.isActive(MediaScreenSize.MEDIUM)) { this.nbCols = 3; }
        else if (this.media.isActive(MediaScreenSize.SMALL)) { this.nbCols = 2; }
        else if (this.media.isActive(MediaScreenSize.EXTRA_SMALL)) { this.nbCols = 1; }
    }

    private removeAlbum(albumId: string) {
        for (var i = 0; i < this.albums.length; ++i) {
            if (this.albums[i].id === albumId) {
                this.albums.splice(i, 1);
                break;
            }
        }
    }
}
