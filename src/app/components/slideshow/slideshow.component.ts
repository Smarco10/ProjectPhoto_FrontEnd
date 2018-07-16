import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlbumsService, FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slideshow',
    templateUrl: './slideshow.component.html',
    styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {

    private slides: Array<Slide> = new Array<Slide>();
    private currentSlideId: number = 0;

    constructor(
        private route: ActivatedRoute,
        private albumsService: AlbumsService,
        private filesService: FilesService,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        this.slideService.onCreated((newSlide, context) => {
            this.slides.push(new Slide(newSlide));
        });

        this.slideService.onUpdated((updatedSlide, context) => {
            this.applyOnSlide(updatedSlide._id, this.updateSlide, updatedSlide);
        });

        this.slideService.onRemoved((slideRemoved, context) => {
            this.applyOnSlide(slideRemoved._id, this.removeSlide);
        });
    }

    ngAfterViewInit() {
        const map = this.route.snapshot.paramMap
        if (map.has('id')) {
            this.loadAlbum(map.get('id'));
        } else {
            this.loadSlides(); //TODO or redirect to '/'
        }
    }

    private loadAlbum(albumId: string): void {
        this.albumsService.getAlbum(albumId)
            .then(album => {
                this.loadSlides(album.slides);
            })
            .catch(err => {
                console.log(err);
            });
    }

    private loadSlides(slideIds?: string[]): void {
        const query = slideIds && { _id: { $in: slideIds } };
        this.slideService.getSlides(query)
            .then(slides => {
                let slidesArr: Array<Slide> = new Array<Slide>();
                for (let i = 0; i < slides.length; ++i) {
                    slidesArr.push(new Slide(slides[i]));
                }
                this.slides = slidesArr; //TODO: oblige de faire ca sinon slide-panel ne voit pas les changements
                this.galleryLoadEvent(0);
            })
            .catch(err => {
                console.log(err);
            });
    }

    private loadSlideData(index: number) {
        if (index < this.slides.length && !this.slides[index].isLoaded) {
            this.filesService.getFileData(this.slides[index].imageId, FilesService.getPictureParam('PNG', window.innerWidth - 100, 500))
                .then(data => {
                    this.slides[index].setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private applyOnSlide(slideId: string, cb: (index: number, options?: any) => void, options?: any) {
        for (let i = 0; i < this.slides.length; ++i) {
            if (this.slides[i].id === slideId) {
                cb(i, options);
                break;
            }
        }
    }

    private updateSlide(index: number, updatedSlide: any) {
        this.slides[index].updateFromServer(updatedSlide);
    }

    private removeSlide(index: number) {
        this.slides.splice(index, 1);
    }

    public galleryLoadEvent(index: number) {
        if (index < this.slides.length) {
            this.currentSlideId = index;
            //TODO: Implement a IsLoading state
            if (!this.slides[index].isLoaded) {
                this.loadSlideData(index);
            }
            this.loadSlideData(index + 1);
        }
    }
}
