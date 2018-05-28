import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Slide } from '@models/slide'
import { AlbumsService, FilesService, SlideService } from 'services'

@Component({
    selector: 'app-uploads',
    templateUrl: './uploads.component.html',
    styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {

    mkTextUp: string = "";

    //https://markdown-it.github.io/
    mkTextDown: string = "<div style=\"background-color:rgb(55,55,55); padding: 10px; text-align: justify;\"/>\n\
### <span style=\"color:rgb(200,200,200)\">Lorem Ipsum</span>\n\
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam blandit ex quis iaculis egestas. Ut et consectetur nisi, nec faucibus leo. Curabitur at purus maximus, blandit ante in, eleifend arcu. Mauris rhoncus ex quam, vel bibendum diam blandit a. In pretium tellus in ipsum finibus porttitor. Aliquam hendrerit ac tellus et porta. Suspendisse ultrices urna vel augue egestas accumsan. Proin eleifend facilisis massa sit amet tempor. Vivamus eleifend libero ac nunc sodales, eu gravida ligula finibus. Integer gravida luctus felis, eget vulputate leo maximus in. Etiam tellus lorem, iaculis id eleifend sit amet, porta sit amet lectus. In pellentesque quam eu tincidunt vehicula. Pellentesque pellentesque arcu quis nulla pellentesque, ac rhoncus ipsum ornare.\n\
";

    slideData: string;
    fileList: FileList;

    showMkTextUp: boolean = false;
    showMkTextLeft: boolean = false;
    showMkTextRight: boolean = false;
    showMkTextDown: boolean = false;

    showTextUp: boolean = true;
    showTextLeft: boolean = true;
    showTextRight: boolean = true;
    showTextDown: boolean = true;

    constructor(
        private albumsService: AlbumsService,
        private formBuilder: FormBuilder,
        private filesService: FilesService,
        private slideService: SlideService
    ) { }

    ngOnInit() { }

    previewFile(event) {
        this.fileList = event.target.files;
        var thus = this;
        var reader = new FileReader();

        reader.addEventListener("load", function() {
            thus.slideData = reader.result;
        }, false);

        if (this.fileList && this.fileList.length > 0) {
            reader.readAsDataURL(this.fileList[0]);
        }
    }

    upload() {
        if (this.slideData) {
            this.filesService.uploadFile(this.slideData)
                .then(data => {
                    this.slideService
                        .uploadSlide(data.id, this.mkTextUp, this.mkTextDown)
                        .then(() => {
                            alert("Succeed to upload slide");
                        })
                        .catch(err => {
                            console.error("Failed to upload slide: " + err);
                        });
                })
                .catch(err => {
                    console.error("Failed to upload slide: " + err);
                });
        } else {
            console.error("cannot upload undefined slide");
        }
    }

    previewSlide() {
        if (this.slideData) {
            console.log("preview slide");
        } else {
            console.error("cannot preview undefined slide");
        }
    }
}
