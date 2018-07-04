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
            state('current', style({ transform: 'translateX(0)' })),
            state('next', style({ transform: 'translateX(-50%)' })),
            transition('* => *', animate(300))
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
    @Input() panes: Array<string> = ["left","right"];
    @Input() activePane: string = panes[0];
}
