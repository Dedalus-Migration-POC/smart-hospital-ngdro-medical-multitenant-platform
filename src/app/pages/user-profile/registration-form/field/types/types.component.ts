import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Field } from '../../../user-profile.model';
import { CommonModule } from '@angular/common';
import { FieldTextComponent } from './input.component';

@Component({
  selector: 'app-field-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FieldTextComponent],

  template: `
    @switch (field().type) {
      @case ('text') {
        <app-field-text
          [field]="field()"
          [formGroup]="formGroup()"
          [triggerSubmit]="triggerSubmit()"
          (onCompleted)="onCompleted.emit()"
        ></app-field-text>
      }
      <!-- TODO Aggiungere tipo date (ad oggi viene usato solo nel readonly-section)  -->
    }
  `,
})
export class FieldTypesComponent {
  readonly field = input.required<Field>();
  readonly formGroup = input.required<FormGroup>();
  readonly triggerSubmit = input.required<boolean>();
  readonly onCompleted = output<void>();
}
