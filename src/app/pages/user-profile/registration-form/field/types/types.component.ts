import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Field } from '../../../user-profile.model';
import { CommonModule } from '@angular/common';
import { FieldTextComponent } from './input.component';

@Component({
  selector: 'app-field-types',
  imports: [CommonModule, ReactiveFormsModule, FieldTextComponent],

  template: `
    @switch (field.type) {
      @case ('text') {
        <app-field-text
          [field]="field"
          [formGroup]="formGroup"
          [triggerSubmit]="triggerSubmit"
          (onCompleted)="onCompleted.emit()"
        ></app-field-text>
      }
      <!-- TODO Aggiungere tipo date (ad oggi viene usato solo nel readonly-section)  -->
    }
  `,
})
export class FieldTypesComponent {
  @Input() field!: Field;
  @Input() formGroup!: FormGroup;
  @Input() triggerSubmit!: boolean; // to ‘warn’ the child component for inserting/deleting text field attributes before form submit
  @Output() onCompleted = new EventEmitter<void>(); // event to be sent to the parent when the checks for inserting/deleting attributes for the field are finished
}
