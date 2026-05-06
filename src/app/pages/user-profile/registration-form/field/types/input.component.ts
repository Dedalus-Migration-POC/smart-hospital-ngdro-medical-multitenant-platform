import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Field, ValidationTypeError } from '../../../user-profile.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { LanguageService } from '../../../../../initialize/state/services/language.service';

@Component({
  selector: 'app-field-text',
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
    <ng-container [formGroup]="formGroup">
      <it-input
        #inputField
        [type]="field.type"
        [formControlName]="field.key"
        [ngClass]="field.fieldClasses"
        [label]="field.label ? field.label[lang()] : ''"
        [description]="field.description ? field.description[lang()] : ''"
        [readonly]="field.readOnly"
        autocomplete="off"
      >
        <ng-container error>
          @if (inputField.hasError(ValidationTypeError.Required)) {
            <div [id]="setErrorId(field.key, ValidationTypeError.Required)">
              {{ 'it.errors.required-field' | translate }}
            </div>
          }
          @if (inputField.hasError(ValidationTypeError.Email)) {
            <div [id]="setErrorId(field.key, ValidationTypeError.Email)">
              {{ 'it.errors.email-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidatePhoneNumber)) {
            <div [id]="setErrorId(field.key, ValidationTypeError.ValidatePhoneNumber)">
              {{ 'it.errors.tel-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidateCap)) {
            <div [id]="setErrorId(field.key, ValidationTypeError.ValidateCap)">
              {{ 'it.errors.cap-invalid' | translate }}
            </div>
          }

          @if (inputField.hasError(ValidationTypeError.ValidateText)) {
            <div [id]="setErrorId(field.key, ValidationTypeError.ValidateText)">
              {{ 'it.errors.invalid-field' | translate }}
            </div>
          }
        </ng-container>
      </it-input>
    </ng-container>
  `,
})
export class FieldTextComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() field!: Field;
  @Input() formGroup!: FormGroup;
  @Input() triggerSubmit!: boolean; // to ‘warn’ the child component for inserting/deleting text field attributes before form submit
  @Output() onCompleted = new EventEmitter<void>(); // event to be sent to the parent when the checks for inserting/deleting attributes for the field are finished

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  @ViewChild('inputField', { read: ElementRef }) itInputComponent!: ElementRef;

  ValidationTypeError = ValidationTypeError;

  private statusChangesSub!: Subscription;

  ngAfterViewInit() {
    this.cleanAttributesNotNecessary();
    this.addRequiredAttribute();
    this.subscribeToStatusValidChanges();
  }

  // when I press the confirm button of the form
  ngOnChanges(changes: SimpleChanges) {
    if (changes['triggerSubmit'] && changes['triggerSubmit'].currentValue === true) {
      this.checkAttributeSubmit();
    }
  }

  ngOnDestroy() {
    if (this.statusChangesSub) {
      this.statusChangesSub.unsubscribe();
    }
  }

  setErrorId(fieldKey: string, ValidationTypeError?: string): string | null {
    return ValidationTypeError ? `${fieldKey}-${ValidationTypeError}-error` : null;
  }

  // Control whether to insert or remove error air attributes
  private checkAttributeSubmit() {
    // console.log(`Submit triggered for field: ${this.field.key}`)

    const control = this.formGroup.get(this.field.key) as FormControl;

    if (control) {
      this.setAriaAttributes(control, control.invalid);
    }

    this.onCompleted.emit();
  }

  // ‘triggers’ when field changes its status from invalid => valid or valid => invalid
  private subscribeToStatusValidChanges() {
    const control = this.formGroup.get(this.field.key) as FormControl;

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
        const ValidationTypeError = this.getValidationTypeError(control);
        if (ValidationTypeError) {
          inputElement.setAttribute('aria-invalid', 'true');
          inputElement.setAttribute(
            'aria-describedby',
            this.setErrorId(this.field.key, ValidationTypeError),
          );
        }
      }
    }
  }

  private getValidationTypeError(control: FormControl): ValidationTypeError | null {
    if (control.hasError(ValidationTypeError.Required)) {
      return ValidationTypeError.Required;
    } else if (control.hasError(ValidationTypeError.Email)) {
      return ValidationTypeError.Email;
    } else if (control.hasError(ValidationTypeError.ValidatePhoneNumber)) {
      return ValidationTypeError.ValidatePhoneNumber;
    } else if (control.hasError(ValidationTypeError.ValidateCap)) {
      return ValidationTypeError.ValidateCap;
    } else if (control.hasError(ValidationTypeError.ValidateText)) {
      return ValidationTypeError.ValidateText;
    }
    return null;
  }

  // For accessibility
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

  // For accessibility
  private addRequiredAttribute() {
    const inputElement = this.itInputComponent.nativeElement?.querySelector('input');

    if (inputElement) {
      const control = this.formGroup.get(this.field.key);
      const isRequired = control && control.hasValidator(Validators.required);

      if (isRequired) {
        inputElement.setAttribute('required', '');
      }
    }
  }
}
