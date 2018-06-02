import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, AlbumsService, SlideService, FilesService } from 'services';
import { Album } from '@models/album';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-album-edition',
    templateUrl: './album-edition.component.html',
    styleUrls: ['./album-edition.component.css']
})
export class AlbumEditionComponent implements OnInit {

    private album: Album;
    private slides: Array<Slide> = new Array<Slide>();
    private addedSlides: Array<Slide> = new Array<Slide>(); //TODO: instead of this, use an array of Slide in Album

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
            this.albumsService.getAlbum(id)
                .then(album => {
                    this.initAlbum(album);
                })
                .catch(err => {
                    console.error(err);
                    this.initAlbum();
                });
        } else {
            this.initAlbum();
        }

        this.slidesService.getSlides()
            .then(slides => {
                for (let i = 0; i < slides.length; ++i) {
                    this.slides.splice(slides.length, 0, new Slide(slides[i]));
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    private initAlbum(serverAlbum?: any): void {
        this.album = new Album(serverAlbum || {});
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
                });
        }
    }

    private setImage(slideId: string): void {
        var imageId: string;
        for (let slide of this.slides) {
            if (slide.id === slideId) {
                imageId = slide.imageId;
                break;
            }
        }

        if (!!imageId) {
            this.album.unsetData();

            this.filesService.getFileData(imageId, { format: 'PNG', size: { width: 500, height: 500 } })
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

        //TODO: move from this.slides to  this.addSlides
        for (let i = 0; i < this.slides.length; ++i) {
            if (this.slides[i].id === slideId) {
                let slides = this.slides.splice(i, 1);
                this.addedSlides.splice(this.addedSlides.length, 0, ...slides);
                break;
            }
        }
    }
}
