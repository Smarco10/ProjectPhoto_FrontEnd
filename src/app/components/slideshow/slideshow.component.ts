import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlbumsService, FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';
import { CollectionHelper } from '@models/collection_helper';

@Component({
    selector: 'app-slideshow',
    templateUrl: './slideshow.component.html',
    styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {

    private slides: Array<Slide> = new Array<Slide>();
    private idHelper: CollectionHelper<Slide> = new CollectionHelper<Slide>(this.slides);
    private currentSlideId: string;

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
            //TODO allow to slide composition of albumIds and slideIds
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

    private getSlideIndex(slideId: string): number {
        return !!this.idHelper ? this.idHelper.getIndex(slideId, Slide.isIdEqualTo) : 0;
    }

    private getSlideId(slideIndex: number): string {
        let id: string = null;
        if (!!this.idHelper) {
            const slide: Slide = this.idHelper.get(slideIndex);
            if (!!slide) {
                id = slide.id;
            }
        }
        return id;
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
                this.idHelper = new CollectionHelper<Slide>(this.slides);
                this.galleryLoadEvent(this.idHelper.first.id);
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

    public galleryLoadEvent(id: string) {
        let index = this.getSlideIndex(id);
        if (index < this.slides.length) {
            this.currentSlideId = id;

            //TODO: Implement a IsLoading state
            if (!this.slides[index].isLoaded) {
                this.loadSlideData(index);
            }
            this.loadSlideData(index + 1);
        }
    }
}
