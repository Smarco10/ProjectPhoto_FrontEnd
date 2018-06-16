import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatRadioGroup } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService, AlbumsService, ConfigurationService, SlideService, FilesService } from 'services';

import { Album } from '@models/album';
import { Slide } from '@models/slide';

import { ValidatorMethods, generateFormGroup, validateVariable, UniqueRulesFormGroup } from '@tools/validators'

@Component({
    selector: 'app-album-edition',
    templateUrl: './album-edition.component.html',
    styleUrls: ['./album-edition.component.css']
})
export class AlbumEditionComponent implements OnInit, AfterViewInit, OnDestroy {

    private albumForm: FormGroup;
    private album: Album;
    private slides: Array<Slide> = new Array<Slide>();
    private addedSlides: Array<Slide> = new Array<Slide>();
    private albumSlidesSubscription: Subscription;

    private editAlbumName: boolean = false;
    private showDeleteConfimation: boolean = false;

    @ViewChild('frontImageRadioGroup', { read: MatRadioGroup })
    frontImageRadioGroup: MatRadioGroup;

    private getAlbumPromise: Promise<any>;
    private getSlidesPromise: Promise<any>;

    private uniqueRulesFormGroup: UniqueRulesFormGroup;

    constructor(
        private route: ActivatedRoute,
        private albumsService: AlbumsService,
        private slidesService: SlideService,
        private filesService: FilesService,
        private configurationService: ConfigurationService
    ) { }

    ngOnInit(): void {
        this.editAlbumName = false;
        this.showDeleteConfimation = false;

        const map = this.route.snapshot.paramMap
        if (map.has('id')) {
            let id = map.get('id');
            this.getAlbumPromise = new Promise((resolve) => {
                this.albumsService.getAlbum(id)
                    .then(album => {
                        this.initAlbum(album);
                        resolve();
                    })
                    .catch(err => {
                        console.error(err);
                        this.initAlbum();
                        resolve();
                    });
            });
        } else {
            this.initAlbum();
        }
    }

    ngAfterViewInit(): void {
        var promises: Array<Promise<any>> = new Array<Promise<any>>();
        if (!!this.getAlbumPromise) {
            promises.push(this.getAlbumPromise);
        }
        if (!!this.getSlidesPromise) {
            promises.push(this.getSlidesPromise);
        }
        if (promises.length > 0) {
            Promise.all(promises)
                .then(() => {
                    this.updateFrontImageRadioButton();
                });
        } else {
            this.updateFrontImageRadioButton();
        }
    }

    ngOnDestroy() {
        if (!!this.albumSlidesSubscription) {
            this.albumSlidesSubscription.unsubscribe();
        }
    }

    private updateFrontImageRadioButton(): void {
        if (!!this.frontImageRadioGroup) {
            var slideId: string = this.addedSlides.length > 0 ? this.addedSlides[0].id : undefined;
            for (var i = 0; i < this.addedSlides.length; ++i) {
                if (this.addedSlides[i].imageId === this.album.imageId) {
                    slideId = this.addedSlides[i].id;
                    break;
                }
            }
            this.frontImageRadioGroup.value = slideId;
        }
    }

    private initSlides(): void {
        this.getSlidesPromise = new Promise((resolve) => {
            this.slidesService.getSlides()
                .then(slides => {

                    slides.push({
                        _id: "NO_ID",
                        title: "INVALID"
                    });

                    for (let i = 0; i < slides.length; ++i) {
                        const slide: Slide = new Slide(slides[i]);
                        if (this.album.slides.indexOf(slide.id) > -1) {
                            this.addedSlides.push(slide);
                        } else {
                            this.slides.push(slide);
                        }
                    }

                    this.updateFrontImageRadioButton();
                    resolve();
                })
                .catch(err => {
                    console.error(err);
                    resolve();
                });
        });
    }

    private initAlbum(serverAlbum?: any): void {
        var tmpAlbum = new Album(serverAlbum || {});

        this.configurationService.getValidators()
            .then(validators => {
                const shemaType = tmpAlbum.isCreated() ? ValidatorMethods.PATCH : ValidatorMethods.CREATE;
                this.albumForm = generateFormGroup(validators[shemaType].album);

                this.uniqueRulesFormGroup = <UniqueRulesFormGroup>this.albumForm.get("slides");

                for (let slide of tmpAlbum.slides) {
                    this.uniqueRulesFormGroup.addControl(slide);
                    validateVariable(this.uniqueRulesFormGroup.get(slide), slide);
                }

                this.album = tmpAlbum;

                this.initSlides();

                if (!!serverAlbum) {
                    this.loadImageData();
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    private sendAlbum(): void {
        if (!!this.album && this.albumForm.valid) {
            this.albumsService.uploadAlbum(this.album.id, this.album.slides, this.album.imageId, this.album.title)
                .then(album => {
                    alert("Album \"" + album.title + "\" " + (this.album.isCreated() ? "updated" : "created"));
                    this.album.updateFromServer(album);
                })
                .catch(err => {
                    console.log(err);
                    alert("Error " + err);
                });
        }
    }

    private deleteAlbum(): void {
        if (this.album.isCreated()) {
            this.albumsService.deleteAlbum(this.album.id);
        }
    }

    private setImage(slideId: string): void {
        var imageId: string = this.album.imageId;
        for (let slide of this.addedSlides) {
            if (slide.id === slideId) {
                imageId = slide.imageId;
                break;
            }
        }

        this.album.imageId = imageId;

        this.loadImageData();
        this.updateFrontImageRadioButton();
    }

    private loadImageData() {
        this.album.unsetData();
        if (!!this.album.imageId) {
            this.filesService.getFileData(this.album.imageId, FilesService.getPictureParam('PNG', 500, 500))
                .then(data => {
                    this.album.setData(data.buffer, data.metadata);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }

    private transvaseSlide(slideId: string, fromArray: Array<Slide>, toArray: Array<Slide>): void {
        for (let i = 0; i < fromArray.length; ++i) {
            if (fromArray[i].id === slideId) {
                toArray.push(...fromArray.splice(i, 1));
                break;
            }
        }
    }

    private getImageIdFromSlideId(slideId: string, array: Array<Slide>): string {
        var imageId: string;
        for (var i = 0; i < array.length; ++i) {
            if (array[i].id == slideId) {
                imageId = array[i].imageId;
            }
        }
        return imageId;
    }

    private removeSlide(slideId: string): void {
        if (this.album.removeSlides(slideId)) {
            this.uniqueRulesFormGroup.removeControl(slideId);
            this.transvaseSlide(slideId, this.addedSlides, this.slides);

            if (this.album.slides.length > 0 && this.album.imageId === this.getImageIdFromSlideId(slideId, this.slides)) {
                this.setImage(this.album.slides[0]);
            } else {
                if (this.album.slides.length === 0) {
                    this.album.unsetData();
                }
            }
        }
    }

    private addSlide(slideId: string): void {
        this.uniqueRulesFormGroup.addControl(slideId);
        validateVariable(this.uniqueRulesFormGroup.get(slideId), slideId);

        if (this.album.addSlides(slideId)) {
            this.transvaseSlide(slideId, this.slides, this.addedSlides);
            if (this.album.slides.length === 1 && this.uniqueRulesFormGroup.get(slideId).valid) {
                this.setImage(slideId);
            }
        }
    }
}
