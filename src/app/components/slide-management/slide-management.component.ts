import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
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

    @Output() onEdit: EventEmitter<Slide> = new EventEmitter();
    @Output() onDelete: EventEmitter<Slide> = new EventEmitter();

    @Input() slide: Slide;
    private slideImageIdSubscription: Subscription;
    private deleteRequested: boolean = false;

    @Input() iconEdit: string = "edit";
    @Input() iconDelete: string = "delete";

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

    private modifySlide() {
        this.onEdit.emit(this.slide);
    }

    private deleteSlide() {
        this.deleteRequested = false;
        this.onDelete.emit(this.slide);
    }
}
