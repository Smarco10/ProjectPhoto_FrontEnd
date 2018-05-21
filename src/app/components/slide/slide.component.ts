import { ElementRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

    @Input() slide: Slide;
    @Input() layout: string = "view";

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        if (this.layout == 'view') {
            this.updateSlide();
        }
    }

    updateSlide(): void {
        const map = this.route.snapshot.paramMap
        if (map.has('id')) {
            var id = map.get('id');
            this.slideService.getSlides({
                _id: id
            })
                .then(slidesFound => {
                    if (slidesFound.length > 0) {
                        this.slide = new Slide(slidesFound[0]._id, slidesFound[0].image, slidesFound[0].title, slidesFound[0].text);
                        this.slideService.getSlideData(this.slide.imageId, "PNG", window.innerWidth, window.innerHeight)
                            .then(data => {
                                this.slide.setData(data.buffer, data.metadata);
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    } else {
                        console.log("No slides found");
                        this.router.navigateByUrl("/");
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.router.navigateByUrl("/");
                });
        }
        else {
            this.router.navigateByUrl("/");
        }
    }
}
