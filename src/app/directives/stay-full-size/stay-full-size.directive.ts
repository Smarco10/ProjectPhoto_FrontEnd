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
        const widthPrior: boolean = (this.el.nativeElement.innerWidth > this.el.nativeElement.innerHeight);
        this.renderer.removeStyle(this.el.nativeElement, widthPrior ? "height" : "width");
        this.renderer.setStyle(this.el.nativeElement, widthPrior ? "width" : "height", "100%");
    }
}
