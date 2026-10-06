import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-input-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputErrorComponent,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  readonly formGroup = input<FormGroup | null>(null);
  readonly control = input<FormControl | null>(null);
  readonly fieldName = input.required<string | number | null>();
  readonly label = input('');
  readonly type = input('text');
  readonly minlength = input<number | undefined>(undefined);
  readonly maxlength = input<number | undefined>(undefined);
  readonly min = input<string | number | null | undefined>(undefined);
  readonly max = input<string | number | null | undefined>(undefined);
  readonly autocomplete = input('on'); //TODO: change to 'off' for deploy
  readonly inputClass = input('form-control');
  readonly wrapperClass = input('form-floating mb-3');
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly ariaLabelledby = input<string | undefined>(undefined);
  readonly showErrors = input(true);
  readonly placeholder = input<string | undefined>(undefined);
  readonly showLabel = input(true);
  readonly errorMessages = input<Record<string, string> | undefined>(undefined);
  readonly iconClass = input<string | undefined>(undefined);

  protected readonly passwordVisible = signal(false);
  protected readonly effectiveType = computed(() =>
    this.type() === 'password' && this.passwordVisible() ? 'text' : this.type(),
  );
  protected readonly hasControl = () => !!this.control();
  protected readonly isDisabled = () =>
    (this.control() ?? this.formGroup()?.get(String(this.fieldName())))?.disabled ?? false;

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }
}
