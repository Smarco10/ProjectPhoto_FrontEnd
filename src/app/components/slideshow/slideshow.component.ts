import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';

import { SlideService } from 'services';
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

        this.slideService.onCreated((message, context) => {
            this.slides.push(new Slide(message._id, message.image, message.title, message.text));
            this.loadSlideData(this.slides.length - 1);
        });

        this.slideService.onUpdated((message, context) => {

        });

        this.slideService.onRemoved((message, context) => {
            this.removeSlide(message);
        });
    }

    private loadSlideData(index: number) {
        if (index < this.slides.length && !this.slides[index].isLoaded) {
            this.slideService.getSlideData(this.slides[index].imageId, "PNG", window.innerWidth - 100, 500)
                .then(data => {
                    this.slides[index].setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private removeSlide(slideId: string) {
        for (var i = 0; i < this.slides.length; ++i) {
            if (this.slides[i].id === slideId) {
                this.slides.splice(i, 1);
                break;
            }
        }
    }

    ngAfterViewInit() {
        this.slideService.getSlides(undefined)
            .then(slides => {
                for (var i = 0; i < slides.length; ++i) {
                    this.slides.push(new Slide(slides[i]._id, slides[i].image, slides[i].title, slides[i].text));
                }

                this.carouselLoadEvent(0);
            })
            .catch(err => {
                console.log(err);
            });
    }

    public carouselLoadEvent(event: number) {
        this.loadSlideData(event);
        if (event < (this.slides.length - 1)) {
            this.loadSlideData(event + 1);
        }
    }

    public onMoveEvent(data: NgxCarouselStore) { }
}