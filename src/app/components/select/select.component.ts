import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  readonly formGroup = input<FormGroup | null>(null);
  readonly control = input<FormControl | null>(null);
  readonly fieldName = input.required<string>();
  readonly label = input('');
  readonly options = input<{ value: string; label: string }[]>([]);
  readonly selectClass = input('form-control');
  readonly wrapperClass = input('select-wrapper mb-3');
  readonly autocomplete = input('off');
  readonly placeholder = input('');
  readonly showLabel = input(true);
  readonly showErrors = input(true);
  readonly ariaLabel = input<string | undefined>(undefined);

  @Output() valueChanged = new EventEmitter<string>();

  protected readonly hasControl = () => !!this.control();

  onSelectChange(value: string) {
    this.valueChanged.emit(value);
  }

  focusNext() {
    const label = document.querySelector(`label[for="${this.fieldName()}"]`);
    label?.setAttribute('class', 'active');
  }
}
