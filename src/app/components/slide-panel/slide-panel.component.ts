import {
    ChangeDetectionStrategy,
    Component,
    Input
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
    @Input() panes: Array<string> = ["left", "right"];
    @Input() activePane: number = 0;

    private animStart(event): void {
        console.log("animStart", this.activePane, event);
    }

    private getTranslateX(): number {
        let x = this.activePane * 100 / this.panes.length;
        return x;
    }
}
