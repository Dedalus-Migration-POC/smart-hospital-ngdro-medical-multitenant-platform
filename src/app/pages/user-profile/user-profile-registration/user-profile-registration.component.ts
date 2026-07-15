import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { UserConfig } from '../user-profile.model';
import { FieldTypesComponent } from '../registration-form/field/types/types.component';
import { ReadOnlySectionComponent } from '../registration-form/readonly-section.component';
import { ConsentsFormComponent } from '../consents-form/consents-form.component';
import { LanguageService } from '../../../initialize/state/services/language.service';

@Component({
  selector: 'app-user-profile-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    FieldTypesComponent,
    ReadOnlySectionComponent,
    ConsentsFormComponent,
  ],
  templateUrl: './user-profile-registration.component.html',
  styleUrls: ['./user-profile-registration.component.scss'],
})
export class UserProfileRegistrationComponent {
  readonly form = input<FormGroup | undefined>(undefined);
  readonly userConfig = input<UserConfig | null>(null);
  readonly userConsentsForm = input<FormGroup | undefined>(undefined);
  readonly submit = output<void>();
  readonly toggleConsent = output<any>();

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  totalFields = 0;
  completedFieldsCount = 0;

  triggerSubmit: boolean = false;

  // For accessibility before submitting
  // I check the text fields whether to insert (in the case of fields with an error) or delete the attributes
  // aria-invalid and aria-describedby
  onSubmit() {
    this.totalFields =
      this.userConfig()?.sections.reduce((count, section) => {
        return count + section.fields.filter((field) => !field.readOnly).length;
      }, 0) || 0;
    // console.log('TotalFields', this.totalFields)

    this.completedFieldsCount = 0;

    this.triggerSubmit = true;
  }

  // After checking the attributes, for accessibility, for all form fields then submit
  onFieldCompleted() {
    this.completedFieldsCount++;
    if (this.completedFieldsCount === this.totalFields) {
      // console.log('All fields have completed their operations.')

      setTimeout(() => {
        this.triggerSubmit = false;
        this.submit.emit();
        this.scrollToFirstError();
      });
    }
  }

  private scrollToFirstError() {
    const firstInvalidControl: HTMLElement = document.querySelector(
      'app-field-types it-input.ng-invalid',
    ) as HTMLElement;

    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstInvalidControl.focus();
    }
  }
}
