import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slides-manager',
    templateUrl: './slides-manager.component.html',
    styleUrls: ['./slides-manager.component.css']
})
export class SlidesManagerComponent implements OnInit {

    private slides: Array<Slide>;

    constructor(
        private filesService: FilesService,
        private router: Router,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        let router = this.router;

        this.slideService.onCreated((newSlide, context) => {
            this.slides.push(new Slide(newSlide));
            this.loadSlideData(this.slides.length - 1);
        });

        this.slideService.onUpdated((updatedSlide, context) => {
            this.applyOnSlide(updatedSlide._id, updatedSlide, updatedSlide);
        });

        this.slideService.onRemoved((id, context) => {
            this.applyOnSlide(id, this.removeSlide);
        });

        this.updateSlides();
    }

    private updateSlides() {
        this.slides = new Array<Slide>();

        let slidesOutputArray = this.slides;
        let slideService = this.slideService;

        slideService.getSlides(undefined)
            .then(slides => {
                for (let i = 0; i < slides.length; ++i) {
                    let slide = new Slide(slides[i]);
                    slidesOutputArray.push(slide);
                    this.loadSlideData(i);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    private loadSlideData(index: number) {
        if (index < this.slides.length && !this.slides[index].isLoaded) {
            this.filesService.getFileData(this.slides[index].imageId, FilesService.getPictureParam('PNG', 100, 100))
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
}
