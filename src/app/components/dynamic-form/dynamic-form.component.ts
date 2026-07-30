import { Component, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DynamicFormConfig,
  FormFieldConfig,
  SelectOptionConfig,
  ValidatorConfig,
} from './dynamic-form.model';
import { NgxFormValidators } from '../../../validators';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { getLocalizedText } from '../../shared/utility/text.utils';
import { LocalizedText } from '../../shared/models/shared_model';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, InputComponent, SelectComponent],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent {
  formConfig = input<DynamicFormConfig>();
  formSubmit = output<any>();
  lang = input<keyof LocalizedText>('it' as keyof LocalizedText);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  formGroup = signal<FormGroup | null>(null);

  constructor(private fb: FormBuilder) {
    effect(() => {
      const config = this.formConfig();
      if (config) {
        this.formGroup.set(this.buildForm(config));
      }
    });
  }

  private buildForm(config: DynamicFormConfig): FormGroup {
    const group: { [key: string]: any } = {};

    config.fields.forEach((field) => {
      const validators = this.buildValidators(field.validators);
      group[field.id] = ['', validators];
    });

    return this.fb.group(group);
  }

  private buildValidators(validatorConfigs?: ValidatorConfig[]): any[] {
    if (!validatorConfigs || validatorConfigs.length === 0) {
      return [];
    }

    return validatorConfigs
      .map((config) => {
        switch (config.type) {
          case 'required':
            return Validators.required;
          case 'email':
            return Validators.email;
          case 'pattern':
            return Validators.pattern(config.value as string);
          case 'min':
            return Validators.min(config.value as number);
          case 'max':
            return Validators.max(config.value as number);
          case 'minLength':
            return Validators.minLength(config.value as number);
          case 'maxLength':
            return Validators.maxLength(config.value as number);
          case 'taxCode':
            return NgxFormValidators.taxCodeValidator;
          default:
            return null;
        }
      })
      .filter((v) => v !== null);
  }

  getFieldLabel(fieldId: string): string {
    const field = this.formConfig()?.fields.find((f) => f.id === fieldId);
    const localizedLabel = this.getLocalizedLabel(field?.label);
    return localizedLabel || fieldId;
  }

  getFieldPlaceholder(fieldId: string): string {
    const field = this.formConfig()?.fields.find((f) => f.id === fieldId);
    return this.getLocalizedLabel(field?.placeholder);
  }

  getFieldType(fieldId: string): string {
    const field = this.formConfig()?.fields.find((f) => f.id === fieldId);
    return field?.type ?? 'text';
  }

  isSelectField(field: FormFieldConfig): boolean {
    return field.type === 'select';
  }

  getSelectOptions(field: FormFieldConfig): { value: string; label: string }[] {
    return (field.options ?? []).map((option: SelectOptionConfig) => ({
      value: option.value,
      label: this.getLocalizedLabel(option.label),
    }));
  }

  getErrorMessage(field: any, errorKey: string): string {
    if (field.errorMessages?.[errorKey]) {
      return getLocalizedText(field.errorMessages[errorKey], this.lang());
    }
    return `Error: ${errorKey}`;
  }

  private getLocalizedLabel(value?: LocalizedText | string): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    return getLocalizedText(value, this.lang());
  }

  getButtonLabel(): string {
    const buttonConfig = this.formConfig()?.submitButton;
    if (buttonConfig?.label) {
      return getLocalizedText(buttonConfig.label, this.lang());
    }
    return 'Submit';
  }

  getButtonClasses(): string[] {
    const buttonConfig = this.formConfig()?.submitButton;
    const classes = ['btn', 'btn-primary'];

    if (buttonConfig?.className) {
      classes.push(buttonConfig.className);
    }

    return classes;
  }

  onFormSubmit(): void {
    const form = this.formGroup();
    if (form?.valid) {
      this.formSubmit.emit(form.value);
    }
  }
}
