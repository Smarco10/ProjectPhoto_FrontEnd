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

enum AnimState {
    STATE1: "state1",
    STATE2: "state2"
}

@Component({
    selector: 'app-slide-panel',
    styleUrls: ['slide-panel.component.scss'],
    templateUrl: 'slide-panel.component.html',
    animations: [
        trigger('slide', [
            state(AnimState.STATE1, style({
                transform: 'translateX(-{{translate_x}}%)'
            }), { params: { translate_x: 0 } }
            ),
            state(AnimState.STATE2, style({
                transform: 'translateX(-{{translate_x}}%)'
            }), { params: { translate_x: 0 } }
            ),
            transition('* => *', animate(300))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
    @Input() panes: Array<string>;

    private _activePaneId: number = 0;
    private previousPane: number = -1;

    private activeState: AnimState = AnimState.STATE1;

    /*TODO: implement options like this
        let galleryOptions = {
            grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
            slide: 1,
            speed: 400,
            animation: 'lazy',
            point: {
                visible: true
            },
            load: 1,
            touch: true,
            loop: true,
            easing: 'ease'
        }
*/

    @ContentChild('paneSlide') paneSlideTmpl: TemplateRef<any>;

    @Input()
    set activePaneId(paneId: number) {
        this.updateState();
        this._activePaneId = paneId;
    }

    get activePaneId(): number {
        return this._activePaneId;
    }

    private updateState(): void {
        switch (this.activeState) {
            case AnimState.STATE1:
                this.activeState = AnimState.STATE2;
                break;
            case AnimState.STATE2:
                this.activeState = AnimState.STATE1;
                break;
            default:
                console.error("active state is not knwon: ", this.activeState);
                break;
        }

        this.previousPane = this.activePaneId;
    }

    private getTranslateX(): number {
        if (this.activePaneId < 0) {
            this.activePaneId = 0;
        } else if (this.activePaneId > this.panes.length - 1) {
            this.activePaneId = this.panes.length - 1;
        }

        return (this.panes.length === 0) ? 0 : (this.activePaneId * 100 / this.panes.length);
    }
}
