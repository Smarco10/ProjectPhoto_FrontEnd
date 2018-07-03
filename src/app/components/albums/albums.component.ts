import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

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

    private mediaWatcher: Subscription;
    private searchExpended: boolean = false;

    @Input() nbCols: number = 4;

    private albums: Array<Album> = new Array<Album>();

    allowed = {
        manageAlbum: false
    }

    constructor(
        private media: ObservableMedia,
        private router: Router,
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

        this.mediaWatcher = media.subscribe((change: MediaChange) => { this.updateGrid(); });

        this.albumsService.onCreated((albumCreated, context) => {
            this.albums.push(new Album(albumCreated));
        });

        this.albumsService.onUpdated((updatedAlbum, context) => {
            this.applyOnAlbum(updatedAlbum._id, this.updateAlbum, updatedAlbum);
        });

        this.albumsService.onRemoved((albumRemoved, context) => {
            this.applyOnAlbum(albumRemoved._id, this.removeAlbum);
        });
    }

    ngOnInit() {
        this.searchExpended = false;

        this.updateLogin();

        this.albumsService.getAlbums()
            .then(albums => {
                //TODO: pourquoi je recois un .data???
                for (var i = 0; i < albums.data.length; ++i) {
                    this.albums.push(new Album(albums.data[i]));
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    ngAfterViewInit() {
        this.updateGrid();
    }

    ngOnDestroy() {
        this.mediaWatcher.unsubscribe();
    }

    private updateLogin() {
        let user = this.auth.getConnectedUser();
        console.log("updateLogin", user); //pk user disparait???
        this.allowed.manageAlbum = !!user && user.isAdmin();
    }

    private updateGrid(): void {
        if (this.media.isActive(MediaScreenSize.EXTRA_LARGE)) { this.nbCols = 5; }
        else if (this.media.isActive(MediaScreenSize.LARGE)) { this.nbCols = 4; }
        else if (this.media.isActive(MediaScreenSize.MEDIUM)) { this.nbCols = 3; }
        else if (this.media.isActive(MediaScreenSize.SMALL)) { this.nbCols = 2; }
        else if (this.media.isActive(MediaScreenSize.EXTRA_SMALL)) { this.nbCols = 1; }
    }

    private applyOnAlbum(albumId: string, cb: (index: number, options?: any) => void, options?: any) {
        for (var i = 0; i < this.albums.length; ++i) {
            if (this.albums[i].id === albumId) {
                cb(i, options);
                break;
            }
        }
    }

    private updateAlbum(index: number, updatedAlbum: any): void {
        this.albums[index].updateFromServer(updatedAlbum);
    }

    private removeAlbum(index: number): void {
        this.albums.splice(index, 1);
    }

    private deleteAlbum(event, id: string): void {
        event.stopPropagation();
        this.albumsService.deleteAlbum(id);
    }

    private childNavigation(event, rootLink): void {
        event.stopPropagation();
        this.router.navigate(rootLink);
    }

    private search(input: string): void {
        let searchInput = input.trim().toLowerCase();
        for (let album of this.albums) {
            album.isHidden = (album.title.trim().toLowerCase().indexOf(searchInput) === -1);
        }
    }
}
