import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatRadioGroup } from '@angular/material';
import { AuthService, AlbumsService, SlideService, FilesService } from 'services';
import { Album } from '@models/album';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-album-edition',
    templateUrl: './album-edition.component.html',
    styleUrls: ['./album-edition.component.css']
})
export class AlbumEditionComponent implements OnInit, AfterViewInit {

    private album: Album;
    private slides: Array<Slide> = new Array<Slide>();
    private addedSlides: Array<Slide> = new Array<Slide>();
    @ViewChild('frontImageRadioGroup', { read: MatRadioGroup })
    frontImageRadioGroup: MatRadioGroup;
    private getAlbumPromise: Promise<any>;

    constructor(
        private route: ActivatedRoute,
        private albumsService: AlbumsService,
        private slidesService: SlideService,
        private filesService: FilesService
    ) { }

    ngOnInit(): void {
        const map = this.route.snapshot.paramMap
        if (map.has('id')) {
            let id = map.get('id');
            this.getAlbumPromise = new Promise((resolve) => {
                this.albumsService.getAlbum(id)
                    .then(album => {
                        this.initAlbum(album);
                        resolve();
                    })
                    .catch(err => {
                        console.error(err);
                        this.initAlbum();
                        resolve();
                    });
            });
        } else {
            this.getAlbumPromise = new Promise((resolve) => { resolve(); });
            this.initAlbum();
        }

        this.slidesService.getSlides()
            .then(slides => {
                for (let i = 0; i < slides.length; ++i) {
                    this.slides.push(new Slide(slides[i]));
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    ngAfterViewInit(): void {
        if (!!this.getAlbumPromise) {
            this.getAlbumPromise
                .then(() => {
                    this.updateFrontImageRadioButton();
                });
        } else {
            this.updateFrontImageRadioButton();
        }
    }

    private updateFrontImageRadioButton(): void {
        var slideId: string;
        for (var i = 0; i < this.addedSlides.length; ++i) {
            if (this.addedSlides[i].imageId === this.album.imageId) {
                slideId = this.addedSlides[i].id;
                break;
            }
        }
        console.log(this.frontImageRadioGroup, ".value", slideId);
        //TODO: ne marche pas: this.frontImageRadioGroup.value = slideId;
    }

    private initAddedSlidesArray(): void {
        for (let i = 0; i < this.slides.length; ++i) {
            if (this.album.slides.indexOf(this.slides[i].id) > -1) {
                let slides = this.slides.splice(i, 1);
                this.addedSlides.push(...slides);
                i--;
            }
        }
    }

    private initAlbum(serverAlbum?: any): void {
        this.album = new Album(serverAlbum || {});
        let slideId: string;

        if (!!serverAlbum) {
            initAddedSlidesArray();
            this.loadImageData();
        }
    }

    private sendAlbum(): void {
        if (!!this.album) {
            this.albumsService.uploadAlbum(this.album.id, this.album.slides, this.album.imageId, this.album.title)
                .then(album => {
                    if (this.album.id) {
                        this.album.updateFromServer(album);
                    } else {
                        this.album = new Album(album);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.album = new Album(album);
                });
        }
    }

    private setImage(slideId: string): void {
        var imageId: string;
        for (let slide of this.addedSlides) {
            if (slide.id === slideId) {
                imageId = slide.imageId;
                break;
            }
        }

        if (!!imageId) {
            this.album.imageId = imageId;
            this.loadImageData();
        }
    }

    private slideIdFromImageId(imageId: string): string {
        var slideId: string;
        for (let slide of this.addedSlides) {
            if (slide.imageId === imageId) {
                slideId = slide.id;
                break;
            }
        }
        console.log("slideId: ", imageId, slideId);
        return slideId;
    }

    private loadImageData() {
        this.album.unsetData();
        if (!!this.album.imageId) {
            this.filesService.getFileData(this.album.imageId, { format: 'PNG', size: { width: 500, height: 500 } })
                .then(data => {
                    this.album.setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private removeSlide(slideId: string): void {
        for (let i = 0; i < this.album.slides.length; ++i) {
            if (this.album.slides[i] === slideId) {
                if (this.album.imageId === this.album.imageId) {
                    this.album.unsetData();
                }
                this.album.slides.splice(i, 1);
                if (this.album.slides.length === 1) {
                    this.setImage(this.album.slides[0]);
                }
                break;
            }
        }

        for (let i = 0; i < this.addedSlides.length; ++i) {
            if (this.addedSlides[i].id === slideId) {
                let slides = this.addedSlides.splice(i, 1);
                this.slides.splice(this.slides.length, 0, ...slides);
                break;
            }
        }
    }

    private addSlide(slideId: string): void {
        this.album.slides.splice(this.album.slides.length, 0, slideId);
        if (this.album.slides.length === 1) {
            this.setImage(slideId);
        }

        for (let i = 0; i < this.slides.length; ++i) {
            if (this.slides[i].id === slideId) {
                let slides = this.slides.splice(i, 1);
                this.addedSlides.splice(this.addedSlides.length, 0, ...slides);
                break;
            }
        }
    }
}
