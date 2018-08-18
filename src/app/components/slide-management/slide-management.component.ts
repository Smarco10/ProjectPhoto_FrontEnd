import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FilesService, SlideService } from 'services';
import { Slide } from '@models/slide';

@Component({
    selector: 'app-slide-management',
    templateUrl: './slide-management.component.html',
    styleUrls: ['./slide-management.component.css']
})
export class SlideManagementComponent implements OnInit, OnDestroy {

    @Input() slide: Slide;
    private slideImageIdSubscription: Subscription;
    private deleteRequested: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private filesService: FilesService,
        private router: Router,
        private slideService: SlideService
    ) { }

    ngOnInit() {
        this.deleteRequested = false;
        this.slideImageIdSubscription = this.slide.getImageIdObserver()
            .subscribe(message => { this.loadSlideData(); });
    }

    ngOnDestroy() {
        this.slideImageIdSubscription.unsubscribe();
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

    modifySlide() {
        console.log("modifySlide(" + this.slide.id + ")");
    }

    deleteSlide() {
        let id = this.slide.id;

        this.deleteRequested = false;

        this.slideService.deleteSlide(id)
            .then(ret => {
                console.log("Succeed to remove " + ret);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
