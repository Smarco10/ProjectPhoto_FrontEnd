import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slide-management',
    templateUrl: './slide-management.component.html',
    styleUrls: ['./slide-management.component.css']
})
export class SlideManagementComponent implements OnInit {

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

    modifySlide() {
        console.log("modifySlide(" + this.slide.id + ")");
    }

    deleteSlide() {
        let id = this.slide.id;
        let router = this.router;

        this.slideService.deleteSlide(id)
            .then(ret => {
                console.log("Succeed to remove " + ret);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
