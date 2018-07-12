import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Input,
    TemplateRef
} from '@angular/core';

import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

// this method is run each time the `myAnimationTrigger` trigger value changes.
function myInlineMatcherFn(fromState: string, toState: string, element: any, params: { [key: string]: any }): boolean {
    console.log(fromState, "=>", toState, params, element);

    return true;
}

@Component({
    selector: 'app-slide-panel',
    styleUrls: ['slide-panel.component.scss'],
    templateUrl: 'slide-panel.component.html',
    animations: [
        trigger('slide', [
            state('state1', style({
                transform: 'translateX(-{{translate_x}}%)'
            }), { params: { translate_x: 0 } }
            ),
            state('state2', style({
                transform: 'translateX(-{{translate_x}}%)'
            }), { params: { translate_x: 0 } }
            ),
            /*transition('* => *', animate(300))*/
            /*transition('state1 => state2', animate(300)),
            transition('state2 => state1', animate(300))*/
            transition(myInlineMatcherFn, animate(300))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
    @Input() panes: Array<string> = new Array<string>();

    @Input() activePane: number = 0;
    private previousPane: number = this.activePane;

    private activeState: string = 'state1';

    @ContentChild('paneSlide') paneSlideTmpl: TemplateRef<any>;

    private animStart(event): void {
        console.log("animStart", this.activePane, this.activeState, event);
    }

    private updateState(): void {
        //TODO: ne marche pas bien, a corriger
        console.log("updateState", this.previousPane, this.activePane, this.activeState);
        if (this.previousPane != this.activePane) {
            switch (this.activeState) {
                case 'state1':
                    this.activeState = 'state2';
                    break;
                case 'state2':
                    this.activeState = 'state1';
                    break;
                default:
                    console.error("active state is not knwon: ", this.activeState);
                    break;
            }
            console.log("active state:", this.activeState);
        }
        this.previousPane = this.activePane;
    }

    private getTranslateX(): number {
        if (this.activePane < 0) {
            this.activePane = 0;
        }
        if (this.activePane > this.panes.length - 1) {
            this.activePane = this.panes.length - 1;
        }

        this.updateState();

        let x = (this.panes.length === 0) ? 0 : (this.activePane * 100 / this.panes.length);
        console.log("getTranslateX", this.activePane, x);
        return x;
    }

    private animDone(event): void {
        console.log("animDone", this.activePane, this.activeState, event);
    }
}
