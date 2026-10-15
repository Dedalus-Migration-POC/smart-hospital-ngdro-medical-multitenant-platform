import { Component, input, output, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import {
  DynamicFormConfig,
  FormFieldConfig,
  SelectOptionConfig,
  ValidatorConfig,
} from './dynamic-form.model';
import { NgxFormValidators } from '../../../validators';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { LocalizedTextLocale } from '../../shared/models/shared_model';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, InputComponent, SelectComponent],
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent {
  private readonly translate = inject(TranslateService);
  formConfig = input<DynamicFormConfig>();
  formGroupInput = input<FormGroup | null>(null);
  formSubmit = output<any>();
  lang = input<LocalizedTextLocale>('it');

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  formGroup = signal<FormGroup | null>(null);

  constructor(private fb: FormBuilder) {
    effect(() => {
      const config = this.formConfig();
      const externalForm = this.formGroupInput();
      if (externalForm) {
        if (config) {
          this.applyDisabledState(config, externalForm);
        }
        this.formGroup.set(externalForm);
        return;
      }

      if (config) {
        this.formGroup.set(this.buildForm(config));
      }
    });
  }

  private buildForm(config: DynamicFormConfig): FormGroup {
    const group: { [key: string]: any } = {};

    config.fields.forEach((field) => {
      const validators = this.buildValidators(field.validators);
      group[field.id] = [{ value: field.value ?? '', disabled: !!field.disabled }, validators];
    });

    return this.fb.group(group);
  }

  private applyDisabledState(config: DynamicFormConfig, formGroup: FormGroup): void {
    config.fields.forEach((field) => {
      const control = formGroup.get(field.id);

      if (!control) {
        return;
      }

      if (field.disabled && control.enabled) {
        control.disable({ emitEvent: false });
      }

      if (!field.disabled && control.disabled) {
        control.enable({ emitEvent: false });
      }
    });
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
          case 'phone_number':
            return NgxFormValidators.mobilePhoneNumber({ validatePhoneNumber: true });
          case 'cap':
            return NgxFormValidators.cap({ validateCap: true });
          case 'text':
            return NgxFormValidators.text({ validateText: true });
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
      return this.getLocalizedLabel(field.errorMessages[errorKey]);
    }
    return `Error: ${errorKey}`;
  }

  getFieldErrorMessages(field: FormFieldConfig): Record<string, string> | undefined {
    if (!field.errorMessages) {
      return undefined;
    }
    const resolved: Record<string, string> = {};
    for (const key of Object.keys(field.errorMessages)) {
      resolved[key] = this.getLocalizedLabel(field.errorMessages[key]);
    }
    return resolved;
  }

  private getLocalizedLabel(value?: string): string {
    if (!value) {
      return '';
    }

    this.lang();
    return this.translate.instant(value);
  }

  getButtonLabel(): string {
    const buttonConfig = this.formConfig()?.submitButton;
    if (buttonConfig?.label) {
      return this.getLocalizedLabel(buttonConfig.label);
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

  showSubmitButton(): boolean {
    return this.formConfig()?.showSubmitButton !== false;
  }

  onFormSubmit(): void {
    const form = this.formGroup();
    if (form?.valid) {
      this.formSubmit.emit(form.value);
    }
  }
}
