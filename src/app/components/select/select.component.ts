import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-select-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputErrorComponent,
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly fieldName = input('');
  readonly label = input.required<string>();
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly type = input('text');

  constructor() {}

  focusNext() {
    // @ts-ignore
    document.querySelector('#label-focus')!.setAttribute('class', 'active');
  }
}
