import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { UserConfig } from '../user-profile.model';
import { ConsentsFormComponent } from '../consents-form/consents-form.component';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from 'src/app/components/dynamic-form/dynamic-form.model';
import { getFlexLayoutClasses } from 'src/app/shared/utility/layout.utils';

@Component({
  selector: 'app-user-profile-registration',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DesignAngularKitModule,
    ConsentsFormComponent,
    DynamicFormComponent,
  ],
  templateUrl: './user-profile-registration.component.html',
  styleUrls: ['./user-profile-registration.component.scss'],
})
export class UserProfileRegistrationComponent {
  readonly form = input<FormGroup | undefined>(undefined);
  readonly userConfig = input<UserConfig | null>(null);
  readonly userConsentsForm = input<FormGroup | undefined>(undefined);
  readonly isRegistration = input(true);
  readonly submit = output<void>();
  readonly toggleConsent = output<any>();

  private langService = inject(LanguageService);
  lang = this.langService.lang;
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  submitForm() {
    this.submit.emit();
  }

  getDynamicForms(section: UserConfig['sections'][number]): DynamicFormConfig[] {
    return (
      section.areas?.center?.items
        ?.filter((item) => item.type === 'DYNAMIC_FORM' && item.enabled !== false)
        .map((item) => ({
          ...item.props,
          showSubmitButton: false,
          fields: item.props.fields.map((field) => ({
            ...field,
            disabled: section.readOnly || field.disabled,
          })),
        })) ?? []
    );
  }

  getSubmitButtonClasses(): string[] {
    const buttonConfig = this.userConfig()?.submitButton;

    return [
      ...getFlexLayoutClasses(buttonConfig?.layout),
      'btn',
      'btn-primary',
      buttonConfig?.className ?? '',
    ].filter(Boolean);
  }
}
