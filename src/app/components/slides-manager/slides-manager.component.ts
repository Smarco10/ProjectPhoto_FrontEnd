import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slides-manager',
    templateUrl: './slides-manager.component.html',
    styleUrls: ['./slides-manager.component.css']
})
export class SlidesManagerComponent implements OnInit {

    private slides: Array<Slide>;

    constructor(
        private router: Router,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        let router = this.router;

        this.slideService.onCreated((message, context) => {
            this.slides.push(new Slide(message._id, message.image, message.title, message.text));
            this.loadSlideData(this.slides.length - 1);
        });

        this.slideService.onUpdated((message, context) => {

        });

        this.slideService.onRemoved((message, context) => {
            this.removeSlide(message);
        });

        this.updateSlides();
    }

    private updateSlides() {
        this.slides = new Array<Slide>();

        let slidesOutputArray = this.slides;
        let slideService = this.slideService;

        slideService.getSlides(undefined)
            .then(slides => {
                for (var i = 0; i < slides.length; ++i) {
                    let slide = new Slide(slides[i]._id, slides[i].image, slides[i].title, slides[i].text);
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
            this.slideService.getSlideData(this.slides[index].imageId, "PNG", 100, 100)
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
}
