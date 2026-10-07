import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormRecord,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, catchError, of, startWith, switchMap } from 'rxjs';
import { Breadcrumb } from '../../../../../components/breadcrumb/breadcrumb';
import { DynamicFormComponent } from '../../../../../components/dynamic-form/dynamic-form.component';
import { FormFieldConfig } from '../../../../../components/dynamic-form/dynamic-form.model';
import { Spinner } from '../../../../../components/spinner/spinner';
import { LanguageService } from '../../../../../initialize/state/services/language.service';
import { PageConfigService } from '../../../../page-config.service';
import { PageConfig } from '../../../../page.model';
import { UserConfig, UserProfile } from '../../../../user-profile/user-profile.model';
import { LocalizedText } from '../../../../../shared/models/shared_model';
import { SmartHospitalState } from '../../../../../store/reducers';
import { NgxFormValidators } from '../../../../../../validators';
import * as CredentialsActions from '../state/credentials.actions';
import {
  CredentialsRegistrationRequest,
  RegistrationConsentSelection,
  REQUIRED_REGISTRATION_FIELDS,
} from '../state/credentials.model';
import {
  selectRegistration,
  selectRegistrationAttributes,
  selectRegistrationConsents,
  selectConfirmLogin,
  selectLoginProfile,
  selectLoginStep,
} from '../state/credentials.selectors';
import { ImageBlock } from 'src/app/components/image-block/image-block';

type RegistrationPageConfig = Omit<PageConfig, 'sections'> &
  UserConfig & {
    messages: Record<string, LocalizedText>;
  };

@Component({
  selector: 'app-credentials-registration',
  imports: [
    Breadcrumb,
    DynamicFormComponent,
    ReactiveFormsModule,
    RouterLink,
    Spinner,
    TranslateModule,
    ImageBlock,
  ],
  templateUrl: './credentials-registration.html',
  styleUrl: './credentials-registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsRegistration {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly loginStep = this.store.selectSignal(selectLoginStep);
  readonly loginProfile = this.store.selectSignal(selectLoginProfile);
  readonly confirmation = this.store.selectSignal(selectConfirmLogin);
  readonly completingProfile = this.loginStep() === 'REQUIRE_PROFILE_DOWNLOAD';
  private readonly requiredFields = this.completingProfile
    ? REQUIRED_REGISTRATION_FIELDS.filter((field) => field !== 'password')
    : REQUIRED_REGISTRATION_FIELDS;
  private readonly pageConfigService = inject(PageConfigService);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly lang = inject(LanguageService).lang;
  private readonly reloadConfig$ = new Subject<void>();
  readonly configError = signal(false);
  readonly form = new FormRecord<FormControl<string>>({});
  readonly consentSelections = signal<RegistrationConsentSelection[]>([]);
  private readonly successHeading = viewChild<ElementRef<HTMLHeadingElement>>('successHeading');
  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly pageConfig = toSignal(
    this.reloadConfig$.pipe(
      startWith(undefined),
      switchMap(() =>
        (
          this.pageConfigService.get(
            '/credentials-registration',
          ) as unknown as Observable<RegistrationPageConfig>
        ).pipe(
          catchError(() => {
            this.configError.set(true);
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  private readonly registrationAttributes = toSignal(
    this.store.select(selectRegistrationAttributes),
    {
      initialValue: { data: [], loading: true, error: false },
    },
  );
  private readonly registrationConsents = toSignal(this.store.select(selectRegistrationConsents), {
    initialValue: { data: [], loading: true, error: false },
  });
  private readonly registrationRequest = toSignal(this.store.select(selectRegistration), {
    initialValue: { loading: false, success: false, error: null },
  });

  readonly attributes = computed(() =>
    this.completingProfile
      ? {
          data: this.loginProfile().data?.additionalAttributes ?? [],
          loading: this.loginProfile().loading,
          error:
            !!this.loginProfile().error ||
            (!this.loginProfile().loading && !this.loginProfile().data),
        }
      : this.registrationAttributes(),
  );
  readonly consents = computed(() =>
    this.completingProfile
      ? {
          data: (this.loginProfile().data?.consents ?? []).map((consent) => ({
            ...consent,
            accepted: consent.accepted === true,
            summary: consent.summary ?? '',
            description: consent.description ?? '',
            url: consent.url ?? '',
            required: consent.required === true,
            lang: consent.lang ?? this.lang(),
            requireLogin: consent.requireLogin === true,
            acceptedDate: consent.acceptedDate ?? null,
          })),
          loading: this.loginProfile().loading,
          error: !!this.loginProfile().error,
        }
      : this.registrationConsents(),
  );
  readonly registration = computed(() =>
    this.completingProfile
      ? {
          loading: this.loginProfile().updateLoading || this.confirmation().loading,
          success: false,
          error: this.loginProfile().updateError,
        }
      : this.registrationRequest(),
  );

  readonly sections = computed(() => {
    const config = this.pageConfig();
    if (!config) return [];
    const attributes = this.attributes().data;
    const fixedFields: readonly string[] = this.requiredFields;
    return config.sections.map((section) => ({
      title: section.title,
      forms: (section.areas?.center?.items ?? [])
        .filter((item) => item.type === 'DYNAMIC_FORM' && item.enabled !== false)
        .map((item) => ({
          ...item.props,
          showSubmitButton: false,
          fields: item.props.fields
            .filter(
              (field) =>
                fixedFields.includes(field.id) ||
                (!this.completingProfile && field.id === 'repeatPassword') ||
                attributes.some((attribute) => attribute.key === field.id),
            )
            .map((field) => this.configureField(field)),
        })),
    }));
  });

  readonly fields = computed(() =>
    this.sections().flatMap((section) => section.forms.flatMap((form) => form.fields)),
  );
  readonly missingFixedFields = computed(
    () =>
      !!this.pageConfig() &&
      this.requiredFields.some((key) => !this.fields().some((field) => field.id === key)),
  );
  readonly missingRequiredAttributes = computed(
    () =>
      !!this.pageConfig() &&
      this.attributes().data.some(
        (attribute) =>
          attribute.required && !this.fields().some((field) => field.id === attribute.key),
      ),
  );
  readonly loading = computed(
    () =>
      (!this.pageConfig() && !this.configError()) ||
      this.attributes().loading ||
      this.consents().loading,
  );
  readonly loadError = computed(
    () =>
      this.configError() ||
      this.attributes().error ||
      this.consents().error ||
      this.missingFixedFields() ||
      this.missingRequiredAttributes(),
  );
  readonly canSubmit = computed(
    () =>
      !!this.pageConfig() &&
      !this.loading() &&
      !this.loadError() &&
      !this.registration().loading &&
      !this.registration().success &&
      (!this.completingProfile ||
        (this.loginStep() === 'REQUIRE_PROFILE_DOWNLOAD' &&
          !!this.loginProfile().data?.code &&
          !this.confirmation().error)) &&
      this.formStatus() === 'VALID' &&
      this.consentSelections().every((consent) => !consent.required || consent.accepted),
  );

  readonly consentViews = computed(() =>
    this.consentSelections().map((consent) => {
      const parts = consent.summary.match(/^(.*?)<Link\s+(.+?)\s*\/>(.*)$/s);
      return {
        ...consent,
        text: parts?.[1] ?? consent.summary,
        linkText: parts?.[2] ?? '',
        suffix: parts?.[3] ?? '',
      };
    }),
  );

  constructor() {
    this.store.dispatch(CredentialsActions.resetRegistration());
    if (!this.completingProfile) {
      this.store.dispatch(CredentialsActions.fetchRegistrationAttributes());
    }

    effect(() => {
      if (!this.completingProfile) return;
      const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
      const step = this.loginStep();
      if (step === 'AUTHENTICATED') {
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      } else if (step === 'OTP' || step === 'CREDENTIALS') {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl, ...(step === 'OTP' ? { continueLogin: true } : {}) },
          replaceUrl: true,
        });
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.fields()
        .filter((field) =>
          field.validators?.some((validator) => validator.type === 'passwordMatching'),
        )
        .forEach((field) => {
          this.form.controls[field.id]?.updateValueAndValidity({
            onlySelf: true,
            emitEvent: false,
          });
        });
      this.form.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      this.lang();
      if (!this.completingProfile) {
        this.store.dispatch(CredentialsActions.fetchRegistrationConsents());
      }
    });

    let populatedProfile: UserProfile | null = null;
    effect(() => {
      const fields = this.fields();
      if (this.loading() || this.loadError()) return;
      const profile = this.completingProfile ? this.loginProfile().data : null;
      const profileValues: Record<string, string> = profile
        ? {
            firstName: profile.firstName,
            lastName: profile.lastName,
            fiscalCode: profile.fiscalCode,
            email: profile.email,
          }
        : {};
      const keys = new Set(fields.map((field) => field.id));
      Object.keys(this.form.controls)
        .filter((key) => !keys.has(key))
        .forEach((key) => this.form.removeControl(key));
      fields.forEach((field) => {
        const validators = this.validators(field);
        const control = this.form.controls[field.id];
        const attribute = this.attributes().data.find((attribute) => attribute.key === field.id);
        const value = profileValues[field.id] ?? attribute?.value ?? String(field.value ?? '');
        if (control) {
          control.setValidators(validators);
          if (profile && profile !== populatedProfile) control.setValue(value);
          control.updateValueAndValidity();
        } else {
          this.form.addControl(
            field.id,
            new FormControl(value, {
              nonNullable: true,
              validators,
            }),
          );
        }
      });
      populatedProfile = profile;
    });

    let populatedConsents: UserProfile['consents'];
    effect(() => {
      const profile = this.completingProfile ? this.loginProfile().data : null;
      if (profile && profile.consents === populatedConsents) return;
      populatedConsents = profile?.consents;
      this.consentSelections.set(
        this.consents().data.map((consent) => ({
          ...consent,
          accepted: consent.accepted === true,
        })),
      );
    });

    effect(() => {
      const error = this.registration().error;
      if (error?.description) {
        const control = this.form.controls[error.description];
        control?.setErrors({ ...control.errors, backend: true });
        control?.markAsTouched();
      }
      if (this.registration().success) {
        this.form.controls['password']?.reset('');
        this.form.controls['repeatPassword']?.reset('');
        this.successHeading()?.nativeElement.focus();
      }
    });
  }

  private configureField(field: FormFieldConfig): FormFieldConfig {
    const attribute = this.attributes().data.find((attribute) => attribute.key === field.id);
    const fixedFields: readonly string[] = this.requiredFields;
    const required = fixedFields.includes(field.id) || !!attribute?.required || !!field.required;
    const validators = [...(field.validators ?? [])];
    if (required && !validators.some((validator) => validator.type === 'required'))
      validators.push({ type: 'required' });
    if (
      attribute?.validation &&
      !validators.some(
        (validator) => validator.type === 'pattern' && validator.value === attribute.validation,
      )
    ) {
      validators.push({ type: 'pattern', value: attribute.validation });
    }
    return {
      ...field,
      disabled: false,
      required,
      validators,
    };
  }

  private validators(field: FormFieldConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.required)
      validators.push((control) =>
        typeof control.value === 'string' && !control.value.trim() ? { required: true } : null,
      );
    for (const validator of field.validators ?? []) {
      switch (validator.type) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'email':
          validators.push(Validators.email);
          break;
        case 'pattern':
          validators.push(Validators.pattern(String(validator.value)));
          break;
        case 'min':
          validators.push(Validators.min(Number(validator.value)));
          break;
        case 'max':
          validators.push(Validators.max(Number(validator.value)));
          break;
        case 'minLength':
          validators.push(Validators.minLength(Number(validator.value)));
          break;
        case 'maxLength':
          validators.push(Validators.maxLength(Number(validator.value)));
          break;
        case 'taxCode':
          validators.push(NgxFormValidators.taxCodeValidator);
          break;
        case 'phone_number':
          validators.push(NgxFormValidators.mobilePhoneNumber({ validatePhoneNumber: true }));
          break;
        case 'cap':
          validators.push(NgxFormValidators.cap({ validateCap: true }));
          break;
        case 'text':
          validators.push(NgxFormValidators.text({ validateText: true }));
          break;
        case 'passwordMatching': {
          const matchingValidator = NgxFormValidators.passwordMatchingParameterizedValidator(
            String(validator.value),
            field.id,
            true,
          );
          validators.push((control) => (control.parent ? matchingValidator(control.parent) : null));
          break;
        }
      }
    }
    return validators;
  }

  message(key: string): string {
    const text = this.pageConfig()?.messages[key];
    if (text) return text[this.lang()] ?? text['it'];
    if (key === 'loading') return this.translate.instant('commons.loading');
    if (key === 'loadError') return this.translate.instant('commons.generic-error');
    if (key === 'retry') return this.translate.instant('appointments.retry');
    return '';
  }

  toggleConsent(id: number) {
    this.consentSelections.update((consents) =>
      consents.map((consent) =>
        consent.id === id ? { ...consent, accepted: !consent.accepted } : consent,
      ),
    );
  }

  retry() {
    if (this.configError()) {
      this.configError.set(false);
      this.reloadConfig$.next();
    }
    if (this.completingProfile) {
      const code = this.loginProfile().code;
      if (code) this.store.dispatch(CredentialsActions.loginProfileRequired({ code }));
    } else {
      this.store.dispatch(CredentialsActions.fetchRegistrationAttributes());
      this.store.dispatch(CredentialsActions.fetchRegistrationConsents());
    }
  }

  retryConfirmation() {
    const code = this.loginProfile().data?.code;
    if (!this.completingProfile || this.registration().loading || !code) return;
    this.store.dispatch(CredentialsActions.confirmLogin({ data: { code } }));
  }

  submit() {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.getRawValue();
    if (this.completingProfile) {
      const profile = this.loginProfile().data;
      if (!profile?.code) return;
      this.store.dispatch(
        CredentialsActions.updateLoginProfile({
          data: {
            ...profile,
            firstName: values['firstName'].trim(),
            lastName: values['lastName'].trim(),
            fiscalCode: values['fiscalCode'].trim().toUpperCase(),
            email: values['email'].trim(),
            additionalAttributes: profile.additionalAttributes.map((attribute) => ({
              ...attribute,
              value: this.form.controls[attribute.key]
                ? values[attribute.key]?.trim() || null
                : attribute.value,
            })),
            consents: profile.consents?.map((consent) => ({
              ...consent,
              accepted:
                this.consentSelections().find((selection) => selection.id === consent.id)
                  ?.accepted ?? consent.accepted,
            })),
          },
        }),
      );
      return;
    }
    const data: CredentialsRegistrationRequest = {
      user: {
        firstName: values['firstName'].trim(),
        lastName: values['lastName'].trim(),
        fiscalCode: values['fiscalCode'].trim().toUpperCase(),
        email: values['email'].trim(),
        additionalAttributes: this.attributes()
          .data.filter((attribute) => this.fields().some((field) => field.id === attribute.key))
          .map((attribute) => {
            const field = this.fields().find((field) => field.id === attribute.key);
            return {
              key: attribute.key,
              displayName: attribute.displayName ?? field?.label?.[this.lang()] ?? attribute.key,
              value: values[attribute.key]?.trim() || null,
              required: attribute.required,
            };
          }),
        consents: this.consentSelections(),
      },
      password: values['password'],
    };
    this.store.dispatch(CredentialsActions.register({ data }));
  }
}
