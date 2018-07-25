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

    private _activePaneId: string;
    private activePaneIndex: number;

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

    private getPaneIndex(paneId: string): number {
    let i = 0;
        if(!!this.panes){
        for(; i < this.panes.length; ++i) {
            if(this.panes[i].id === paneId) {
                break;
            }
            }
            }
        return i;
    }

    @Input()
    set activePaneId(paneId: string) {
        this.updateState();
        this._activePaneId = this.getPaneIndex(paneId);
    }

    private updateState(): void {
        this.activeBinaryState = !this.activeBinaryState;
    }

    private getTranslateX(): number {
        return (this.panes.length === 0) ? 0 : (this._activePaneId * 100 / this.panes.length);
    }
}
