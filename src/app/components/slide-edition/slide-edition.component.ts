import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Identifiable } from '@models/identifiable'
import { Slide } from '@models/slide'
import { Album } from '@models/album'
import { CollectionHelper } from '@models/collection_helper';
import { AlbumsService, FilesService, SlideService } from 'services'

//https://www.npmjs.com/package/markdown

@Component({
    selector: 'app-slide-edition',
    templateUrl: './slide-edition.component.html',
    styleUrls: ['./slide-edition.component.css']
})
export class SlideEditionComponent implements OnInit {

    private slidesImported: Array<Slide> = new Array<Slide>();
    private idHelper: CollectionHelper<Slide> = new CollectionHelper<Slide>(this.slidesImported);

    private slideImportedReaders: Array<FileReader> = new Array<FileReader>();
    private lastReaderStarted: number = 0;
    private static MAX_READER_STARTED: number = 3;

    private currentSlidePreview: boolean = false;
    private currentSlideEdit: Slide;

    constructor(
        private albumsService: AlbumsService,
        private formBuilder: FormBuilder,
        private filesService: FilesService,
        private slideService: SlideService
    ) { }

    ngOnInit() { }

    loadFiles(event: any) {
        let that = this;
        let fileList: FileList = event.target.files;

        if (!!fileList) {
            for (let i = 0; i < fileList.length; ++i) {
                let slide: Slide = new Slide({
                    title: fileList[i].name
                });

                //slide.setStyle({ height: "100px" }, undefined, undefined);

                this.slidesImported.push(slide);

                if (!this.currentSlideEdit) {
                    this.editSlide(slide);
                }

                let reader = new FileReader();
                reader.addEventListener("load", function() {
                    let data: string = (<string>reader.result).substring(("data:" + fileList[i].type + ";base64,").length);
                    slide.setData(data, { "Mime type": fileList[i].type });

                    do {
                        ++that.lastReaderStarted;
                    } while (that.lastReaderStarted < that.slideImportedReaders.length && that.slideImportedReaders[that.lastReaderStarted].readyState !== that.slideImportedReaders[that.lastReaderStarted].EMPTY);

                    if (that.lastReaderStarted < that.slideImportedReaders.length && that.slideImportedReaders[that.lastReaderStarted].readyState === that.slideImportedReaders[that.lastReaderStarted].EMPTY) {
                        that.slideImportedReaders[that.lastReaderStarted].readAsDataURL(fileList[that.lastReaderStarted]);
                    }
                }, false);

                this.slideImportedReaders.push(reader);

                /* TODO: to test
				if (i == 0) {
                    this.filesService.uploadFiles(fileList[0]);
                }*/

                if (i < SlideEditionComponent.MAX_READER_STARTED) {
                    reader.readAsDataURL(fileList[i]);
                    this.lastReaderStarted = i;
                }
            }
        }
    }

    loadCurrentSlideFile(event: any) {
        let that = this;
        let fileList: FileList = event.target.files;

        if (!!fileList && fileList.length > 0) {
            let reader = new FileReader();
            reader.addEventListener("load", function() {
                let data: string = (<string>reader.result).substring(("data:" + fileList[0].type + ";base64,").length);
                that.currentSlideEdit.setData(data, { "Mime type": fileList[0].type });
            }, false);

            that.currentSlideEdit.unsetData();
            reader.readAsDataURL(fileList[0]);
        }
    }

    upload(...slides: Slide[]) {
        for (let slide of slides) {
            if (slide.isLoaded) {
                this.filesService.uploadFile("data:" + slide.mimetype + ";base64," + slide.data)
                    .then(data => {
                        slide.imageId = data.id;
                        this.slideService
                            .uploadSlide(slide.imageId, slide.title, slide.text)
                            .then(data => {
                                slide.id = data._id;
                                console.log("Succeed to upload slide " + slide.id);
                            })
                            .catch(err => {
                                console.error("Failed to upload slide: " + slide.title, err);
                            });
                    })
                    .catch(err => {
                        console.error("Failed to upload picture: " + slide.title, err);
                    });
            } else {
                console.error("cannot upload empty slide");
            }
        }
    }

    editSlide(slide: Slide) {
        this.currentSlideEdit = slide;
    }

    removeSlide(slide: Slide) {
        let slideIdx = this.idHelper.getIndex(slide, (elt1: Slide, elt2: Slide): boolean => {
            return elt1.title === elt2.title;
        });
        if (slideIdx < this.slidesImported.length) {
            let deletedSlide = this.slidesImported.splice(slideIdx, 1)[0];
            if (deletedSlide === this.currentSlideEdit) {
                this.editSlide(this.slidesImported.length > 0 ? this.slidesImported[0] : undefined);
            }
        }
    }
}
