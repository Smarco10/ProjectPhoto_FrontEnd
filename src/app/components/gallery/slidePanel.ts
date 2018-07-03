import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import {
  animate, state, style, transition, trigger
} from '@angular/animations';

type PaneType = 'left' | 'right';

@Component({
  selector: 'my-slide-panel',
  style: `
:host {
  display: block;
  overflow: hidden; /* Hide everything that doesn't fit compoennt */
}
.parent {
  height: 100%;
  width: 200%;      /* Make the parent element to take up twice
                       of the component's width */
  display: flex;    /* Align all children in a row */
  div { flex: 1; }  /* Evenly divide width between children */
}`,
  template: `
<div class="parent" [@slide]="activePane">
  <div><ng-content select="[leftPane]"></ng-content></div>
  <div><ng-content select="[rightPane]"></ng-content></div>
</div>
As me discussed
  `,
animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
      ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidePanelComponent {
@Input() activePane: PaneType = 'left';

}
/*
example:

<my-slide-panel [activePane]="isLeftVisible ? 'left' : 'right'">
  <div leftPane>LEFT</div>
  <div rightPane>RIGHT</div>
</my-slide-panel>

<button (click)="isLeftVisible = !isLeftVisible">
  Toggle panes
</button>
*/
