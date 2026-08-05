import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';

@Component({
  selector: 'app-input-error-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly fieldName = input.required<string | number | null>();
  readonly errorMessages = input<Record<string, string> | undefined>(undefined);

  protected readonly fieldControl = computed<AbstractControl | null>(() => {
    const fieldName = this.fieldName();
    if (fieldName === null || fieldName === undefined) {
      return null;
    }

    return this.formGroup().get(String(fieldName));
  });
}
