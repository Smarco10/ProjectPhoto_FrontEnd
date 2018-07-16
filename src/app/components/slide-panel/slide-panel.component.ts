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

const stateStyle = {
    transform: 'translateX(-{{translate_x}}%)'
};
const defaultParams = { params: { translate_x: 0 } };

@Component({
    selector: 'app-slide-panel',
    styleUrls: ['slide-panel.component.scss'],
    templateUrl: 'slide-panel.component.html',
    animations: [
        trigger('slideBinaryState', [
            state('true', style(stateStyle), defaultParams),
            state('false', style(stateStyle), defaultParams),
            transition('* => *', animate(300))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
    @Input() panes: Array<any>;

    private _activePaneId: number = 0;

    private activeBinaryState: boolean = true;

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

    @ContentChild('paneTmpl') paneTmpl: TemplateRef<any>;

    @Input()
    set activePaneId(paneId: number) {
        this.updateState();
        this._activePaneId = paneId;
    }

    get activePaneId(): number {
        return this._activePaneId;
    }

    private updateState(): void {
        this.activeBinaryState = !this.activeBinaryState;
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
