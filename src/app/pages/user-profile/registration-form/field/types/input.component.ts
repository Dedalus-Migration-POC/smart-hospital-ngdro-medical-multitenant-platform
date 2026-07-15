import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Subscription } from 'rxjs';
import { Field, ValidationTypeError } from '../../../user-profile.model';
import { LanguageService } from '../../../../../initialize/state/services/language.service';

@Component({
  selector: 'app-field-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, DesignAngularKitModule],
  styles: `
    :host ::ng-deep it-input small.form-text {
      display: none;
    }
    ::ng-deep .form-feedback {
      position: absolute;
    }
  `,
  template: `
    @let currentField = field();

    <ng-container [formGroup]="formGroup()">
      <it-input
        #inputField
        [type]="currentField.type"
        [formControlName]="currentField.key"
        [ngClass]="currentField.fieldClasses"
        [label]="currentField.label?.[lang()] ?? ''"
        [description]="currentField.description?.[lang()] ?? ''"
        [readonly]="currentField.readOnly"
        autocomplete="off"
      >
        <ng-container error>
          @if (inputField.hasError(ValidationTypeError.Required)) {
            <div [id]="setErrorId(currentField.key, ValidationTypeError.Required)">
              {{ 'it.errors.required-field' | translate }}
            </div>
          }
          @if (inputField.hasError(ValidationTypeError.Email)) {
            <div [id]="setErrorId(currentField.key, ValidationTypeError.Email)">
              {{ 'it.errors.email-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidatePhoneNumber)) {
            <div [id]="setErrorId(currentField.key, ValidationTypeError.ValidatePhoneNumber)">
              {{ 'it.errors.tel-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidateCap)) {
            <div [id]="setErrorId(currentField.key, ValidationTypeError.ValidateCap)">
              {{ 'it.errors.cap-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidateText)) {
            <div [id]="setErrorId(currentField.key, ValidationTypeError.ValidateText)">
              {{ 'it.errors.invalid-field' | translate }}
            </div>
          }
        </ng-container>
      </it-input>
    </ng-container>
  `,
})
export class FieldTextComponent implements AfterViewInit, OnDestroy {
  readonly field = input.required<Field>();
  readonly formGroup = input.required<FormGroup>();
  readonly triggerSubmit = input.required<boolean>();
  readonly onCompleted = output<void>();

  private langService = inject(LanguageService);
  lang = this.langService.lang;
  private readonly viewInitialized = signal(false);

  @ViewChild('inputField', { read: ElementRef }) itInputComponent!: ElementRef;

  ValidationTypeError = ValidationTypeError;

  private statusChangesSub!: Subscription;

  constructor() {
    effect(() => {
      if (!this.viewInitialized() || !this.triggerSubmit()) {
        return;
      }

      this.checkAttributeSubmit();
    });
  }

  ngAfterViewInit() {
    this.cleanAttributesNotNecessary();
    this.addRequiredAttribute();
    this.subscribeToStatusValidChanges();
    this.viewInitialized.set(true);
  }

  ngOnDestroy() {
    if (this.statusChangesSub) {
      this.statusChangesSub.unsubscribe();
    }
  }

  setErrorId(fieldKey: string, validationTypeError?: string): string | null {
    return validationTypeError ? `${fieldKey}-${validationTypeError}-error` : null;
  }

  private checkAttributeSubmit() {
    const field = this.field();
    const control = this.formGroup().get(field.key) as FormControl;

    if (control) {
      this.setAriaAttributes(control, control.invalid);
    }

    this.onCompleted.emit();
  }

  private subscribeToStatusValidChanges() {
    const field = this.field();
    const control = this.formGroup().get(field.key) as FormControl;

    if (control) {
      this.statusChangesSub = control.statusChanges.subscribe(() => {
        this.setAriaAttributes(control, control.invalid);
      });
    }
  }

  private setAriaAttributes(control: FormControl, isInvalid: boolean) {
    const inputElement = this.itInputComponent.nativeElement?.querySelector('input');

    if (inputElement) {
      if (!isInvalid) {
        inputElement.removeAttribute('aria-invalid');
        inputElement.removeAttribute('aria-describedby');
      } else {
        const validationTypeError = this.getValidationTypeError(control);
        if (validationTypeError) {
          inputElement.setAttribute('aria-invalid', 'true');
          inputElement.setAttribute(
            'aria-describedby',
            this.setErrorId(this.field().key, validationTypeError),
          );
        }
      }
    }
  }

  private getValidationTypeError(control: FormControl): ValidationTypeError | null {
    if (control.hasError(ValidationTypeError.Required)) {
      return ValidationTypeError.Required;
    }
    if (control.hasError(ValidationTypeError.Email)) {
      return ValidationTypeError.Email;
    }
    if (control.hasError(ValidationTypeError.ValidatePhoneNumber)) {
      return ValidationTypeError.ValidatePhoneNumber;
    }
    if (control.hasError(ValidationTypeError.ValidateCap)) {
      return ValidationTypeError.ValidateCap;
    }
    if (control.hasError(ValidationTypeError.ValidateText)) {
      return ValidationTypeError.ValidateText;
    }
    return null;
  }

  private cleanAttributesNotNecessary() {
    const inputElement = this.itInputComponent.nativeElement?.querySelector('input');

    if (inputElement) {
      this.cleanAttribute(inputElement, 'autocomplete');
      this.cleanAttribute(inputElement, 'min');
      this.cleanAttribute(inputElement, 'max');
      inputElement.removeAttribute('aria-describedby');
    }
  }

  private cleanAttribute(inputElement: HTMLElement, attribute: string) {
    const value = inputElement.getAttribute(attribute);
    if (!value || value === 'undefined') {
      inputElement.removeAttribute(attribute);
    }
  }

  private addRequiredAttribute() {
    const inputElement = this.itInputComponent.nativeElement?.querySelector('input');

    if (inputElement) {
      const control = this.formGroup().get(this.field().key);
      const isRequired = control && control.hasValidator(Validators.required);

      if (isRequired) {
        inputElement.setAttribute('required', '');
      }
    }
  }
}
