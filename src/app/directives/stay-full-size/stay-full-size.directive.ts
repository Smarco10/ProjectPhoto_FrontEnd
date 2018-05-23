import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appStayFullSize]'
})
export class StayFullSizeDirective implements OnInit {

    constructor(
        private renderer: Renderer2,
        private el: ElementRef
    ) { }

    ngOnInit(): void {
        /*this.renderer.listen('window', 'resize', event => {
            this.resize();
        });*/

        this.resize();
    }

    private resize(): void {

        /*if (metadata !== undefined && metadata.size !== undefined) {
            const rScreen = window.innerWidth / window.innerHeight;
            const rSlide = metadata.size.width / metadata.size.height;
            if ((rSlide > rScreen && metadata.size.width > metadata.size.height) || window.innerHeight > window.innerWidth) {
                Object.assign(this.imgStyle, {
                    "width": "100%"
                });
            } else {
                Object.assign(this.imgStyle, {
                    "height": "100%"
                });
            }
        }*/

        const widthPrior: boolean = (this.el.nativeElement.innerWidth > this.el.nativeElement.innerHeight);
        this.renderer.removeStyle(this.el.nativeElement, widthPrior ? "height" : "width");
        this.renderer.setStyle(this.el.nativeElement, widthPrior ? "width" : "height", "100%");
    }
}
