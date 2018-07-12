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
            transition('* => *', animate(300))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
    @Input() panes: Array<string> = new Array<string>();

    private _activePaneId: number = 0;
    private previousPane: number = -1;

    private activeState: string = 'state1';

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

        this.previousPane = this.activePaneId;
    }

    private getTranslateX(): number {
        if (this.activePaneId < 0) {
            this.activePaneId = 0;
        }
        if (this.activePaneId > this.panes.length - 1) {
            this.activePaneId = this.panes.length - 1;
        }

        return (this.panes.length === 0) ? 0 : (this.activePaneId * 100 / this.panes.length);
    }
}
