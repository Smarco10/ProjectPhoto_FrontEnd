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
    private getSlidesPromise: Promise<any>;

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
            this.initAlbum();
        }
    }

    ngAfterViewInit(): void {
        var promises: Array<Promise<any>> = new Array<Promise<any>>();
        if (!!this.getAlbumPromise) {
            promises.push(this.getAlbumPromise);
        }
        if (!!this.getSlidesPromise) {
            promises.push(this.getSlidesPromise);
        }
        if (promises.length > 0) {
            Promise.all(promises)
                .then(() => {
                    this.updateFrontImageRadioButton();
                });
        } else {
            this.updateFrontImageRadioButton();
        }
    }

    private updateFrontImageRadioButton(): void {
        if (!!this.frontImageRadioGroup) {
            var slideId: string = this.addedSlides.length > 0 ? this.addedSlides[0].id : undefined;
            for (var i = 0; i < this.addedSlides.length; ++i) {
                if (this.addedSlides[i].imageId === this.album.imageId) {
                    slideId = this.addedSlides[i].id;
                    break;
                }
            }
            this.frontImageRadioGroup.value = slideId;
        }
    }

    private initSlides(): void {
        this.getSlidesPromise = new Promise((resolve) => {
            this.slidesService.getSlides()
                .then(slides => {
                    for (let i = 0; i < slides.length; ++i) {
                        const slide: Slide = new Slide(slides[i]);
                        if (this.album.slides.indexOf(slide.id) > -1) {
                            this.addedSlides.push(slide);
                        } else {
                            this.slides.push(slide);
                        }
                    }
                    this.updateFrontImageRadioButton();
                    resolve();
                })
                .catch(err => {
                    console.error(err);
                    resolve();
                });
        });
    }

    private initAlbum(serverAlbum?: any): void {
        this.album = new Album(serverAlbum || {});

        this.initSlides();

        if (!!serverAlbum) {
            this.loadImageData();
        }
    }

    private sendAlbum(): void {
        if (!!this.album) {
            this.albumsService.uploadAlbum(this.album.id, this.album.slides, this.album.imageId, this.album.title)
                .then(album => {
                    if (!!this.album.id) {
                        alert("album updated");
                    } else {
                        alert("album created");
                    }
                    this.album.updateFromServer(album);
                })
                .catch(err => {
                    console.log(err);
                    alert("Error " + err);
                });
        }
    }

    private setImage(slideId: string): void {
        var imageId: string = this.album.imageId;
        for (let slide of this.addedSlides) {
            if (slide.id === slideId) {
                imageId = slide.imageId;
                break;
            }
        }

        this.album.imageId = imageId;

        this.loadImageData();
        this.updateFrontImageRadioButton();
    }

    private loadImageData() {
        this.album.unsetData();
        if (!!this.album.imageId) {
            this.filesService.getFileData(this.album.imageId, FilesService.getPictureParam('PNG', 500, 500))
                .then(data => {
                    this.album.setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private transvaseSlide(slideId: string, fromArray: Array<Slide>, toArray: Array<Slide>): void {
        for (let i = 0; i < fromArray.length; ++i) {
            if (fromArray[i].id === slideId) {
                toArray.push(...fromArray.splice(i, 1));
                break;
            }
        }
    }

    private getImageIdFromSlideId(slideId: string, array: Array<Slide>): string {
        var imageId: string;
        for (var i = 0; i < array.length; ++i) {
            if (array[i].id == slideId) {
                imageId = array[i].imageId;
            }
        }
        return imageId;
    }

    private removeSlide(slideId: string): void {
        for (let i = 0; i < this.album.slides.length; ++i) {
            if (this.album.slides[i] === slideId) {
                this.album.slides.splice(i, 1);
                this.transvaseSlide(slideId, this.addedSlides, this.slides);

                if (this.album.slides.length > 0 && this.album.imageId === this.getImageIdFromSlideId(slideId, this.slides)) {
                    this.setImage(this.album.slides[0]);
                } else {
                    if (this.album.slides.length === 0) {
                        this.album.unsetData();
                    }
                }
                break;
            }
        }
    }

    private addSlide(slideId: string): void {
        this.album.slides.push(slideId);
        this.transvaseSlide(slideId, this.slides, this.addedSlides);

        if (this.album.slides.length === 1) {
            this.setImage(slideId);
        }
    }
}
