import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { DesignAngularKitModule } from 'design-angular-kit';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule, DesignAngularKitModule],
  template: `<div
    [ngClass]="[fullScreen() ? 'full-screen-spinner' : '', className()]"
    class="d-flex"
  >
    <it-spinner [small]="small()"></it-spinner>
    <div>{{ text() }}</div>
  </div>`,
  styleUrl: './spinner.scss',
})
export class Spinner {
  readonly fullScreen = input<boolean>(false);
  readonly small = input<boolean>(false);
  readonly className = input<string>('');
  readonly text = input<string>('');

  //Use
  // <app-spinner
  //       [fullScreen]="true"
  //       text="Loading"
  //       [className]="'flex-column gap-3 text-danger'"
  //     ></app-spinner>
}
