import { ElementRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.component.html',
    styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit, OnDestroy {

    @Input() slide: Slide;
    private slideImageIdSubscription: Subscription;
    @Input() layout: string = "view";

    constructor(
        private route: ActivatedRoute,
        private filesService: FilesService,
        private router: Router,
        private slideService: SlideService
    ) {
    }

    ngOnInit() {
        if (this.layout == 'view') {
            this.updateSlide();
        } else {
            if (!!this.slide) {
                this.slideImageIdSubscription = this.slide.getImageIdObserver()
                    .subscribe(message => { this.loadSlideData(); });
            }
            //TODO: this.loadSlideData();
        }
    }

    ngOnDestroy() {
        if (!!this.slideImageIdSubscription) {
            this.slideImageIdSubscription.unsubscribe();
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
                        this.slide = new Slide(slidesFound[0]);
                        this.slideImageIdSubscription = this.slide.getImageIdObserver()
                            .subscribe(message => { this.loadSlideData(); });
                        this.loadSlideData();
                    } else {
                        this.router.navigateByUrl("/");
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.router.navigateByUrl("/");
                });
        } else {
            this.router.navigateByUrl("/");
        }
    }

    private loadSlideData() {
        this.filesService.getFileData(this.slide.imageId, FilesService.getPictureParam('PNG', window.innerWidth, window.innerHeight))
            .then(data => {
                this.slide.setData(data.buffer, data.metadata);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
