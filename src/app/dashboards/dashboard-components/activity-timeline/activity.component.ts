import { Component } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [NgScrollbarModule],
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
  constructor() {}
}
