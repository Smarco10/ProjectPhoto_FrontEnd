import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';

import { AlbumsService, FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slideshow',
    templateUrl: './slideshow.component.html',
    styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {

    private slides: Array<Slide> = new Array<Slide>();
    public carouselOne: NgxCarousel;

    constructor(
        private route: ActivatedRoute,
        private albumsService: AlbumsService,
        private filesService: FilesService,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        this.carouselOne = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            animation: 'lazy',
            point: {
                visible: true
            },
            load: 1,
            touch: true,
            loop: true,
            easing: 'ease'
        }

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
        const query = slideIds && { _id: { $in: slideIds } }
        this.slideService.getSlides(query)
            .then(slides => {
                for (var i = 0; i < slides.length; ++i) {
                    this.slides.push(new Slide(slides[i]));
                }
                this.carouselLoadEvent(0);
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
        for (var i = 0; i < this.slides.length; ++i) {
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

    public carouselLoadEvent(event: number) {
        if (event < this.slides.length) {
            //TODO: Implement a IsLoading state
            if (!this.slides[event].isLoaded) {
                this.loadSlideData(event);
            }
            this.loadSlideData(event + 1);
        }
    }

    public onMoveEvent(data: NgxCarouselStore) { }
}
