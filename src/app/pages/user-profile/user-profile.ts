import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../../store/reducers';
import {
  Alignment,
  Field,
  UserConfig,
  UserConsent,
  UserProfile as UserProfileModel,
  ValidationType,
} from './user-profile.model';
import {
  selectspidConfirmLoading,
  selectUpdateUserConsentsError,
  selectUpdateUserConsentsLoading,
  selectUpdateUserProfileError,
  selectUpdateUserProfileLoading,
  // selectUserConfig,
  selectUserProfile,
  selectUserProfileLoading,
} from './state/user-profile.selectors';
import { sessionExpired, updateUserProfile } from './state/user-profile.actions';
import { NgxFormValidators } from '../../../validators';
import { getLastPartKey } from '../../../utils/string-utils';
import { map, Observable, take } from 'rxjs';
import { selectAppConfig } from '../../initialize/state/selector';
import { Breadcrumb } from '../../components/breadcrumb/breadcrumb';
import { UserProfileRegistrationComponent } from './user-profile-registration/user-profile-registration.component';
import { Spinner } from '../../components/spinner/spinner';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';

type UserProfileState = {
  data: UserProfileModel | null;
  loading?: boolean;
  error?: boolean;
  temporary?: boolean;
};

type UserConfigState = {
  data: UserConfig | null;
  loading?: boolean;
  error?: boolean;
};

type ConsentViewModel = UserConsent & {
  text?: string;
  linkText?: string;
};

@Component({
  selector: 'app-user-profile',
  imports: [Breadcrumb, ReactiveFormsModule, UserProfileRegistrationComponent, Spinner],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(ItNotificationService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/user-profile')), //TODO page type
    ),
    { initialValue: null },
  );

  readonly Alignment = Alignment;

  private readonly queryParamMap = toSignal(this.activatedRoute.queryParamMap, {
    initialValue: convertToParamMap({}),
  });

  readonly profileCode = computed<string | undefined>(
    () => this.queryParamMap().get('profilecode') ?? undefined,
  );

  readonly userProfileState = toSignal(
    this.store.select(selectUserProfile) as Observable<UserProfileState>,
    {
      initialValue: { data: null, loading: false, error: false, temporary: false },
    },
  );

  // readonly userConfigState = toSignal(
  //   this.store.select(selectUserConfig) as Observable<UserConfigState>,
  //   {
  //     initialValue: { data: null, loading: false, error: false } as UserConfigState,
  //   },
  // );

  readonly userProfile = computed(() => this.userProfileState()?.data);
  readonly userConfig = computed(() => this.pageConfig()?.page.userConfig);
  readonly rawUserConsents = computed(() => this.userProfile()?.consents ?? []);

  readonly consents = computed<ConsentViewModel[]>(() => {
    return this.rawUserConsents()
      .map((userConsent) => {
        let normalText: string | undefined;
        let linkableText = userConsent.summary;

        const textList = userConsent.summary?.split('<Link');
        if (textList && textList.length > 1) {
          normalText = textList[0]?.trim();
          linkableText = textList[1]?.replace(/\/\>/g, '')?.trim();
        }

        return {
          ...userConsent,
          text: normalText,
          linkText: linkableText,
          accepted: !!userConsent.accepted,
          required: !!userConsent.required,
          requireLogin: !!userConsent.requireLogin,
        };
      })
      .filter((consent) => !!consent.text && !!consent.linkText);
  });

  readonly userProfileLoading = toSignal(this.store.select(selectUserProfileLoading), {
    initialValue: false,
  });

  readonly updateUserProfileLoading = toSignal(this.store.select(selectUpdateUserProfileLoading), {
    initialValue: false,
  });

  readonly spidConfirmLoading = toSignal(this.store.select(selectspidConfirmLoading), {
    initialValue: false,
  });

  readonly loading = computed(() => {
    return (
      this.userProfileLoading() || this.updateUserProfileLoading() || this.spidConfirmLoading()
    );
  });

  readonly updatingUserConsents = toSignal(this.store.select(selectUpdateUserConsentsLoading), {
    initialValue: false,
  });

  readonly updateUserProfileError = toSignal(this.store.select(selectUpdateUserProfileError), {
    initialValue: null,
  });

  readonly updateUserConsentsError = toSignal(this.store.select(selectUpdateUserConsentsError), {
    initialValue: null,
  });

  readonly uploadedBadge = signal<string | null>(null);
  readonly resubmit = signal(false);
  readonly form = signal<FormGroup<{ [x: string]: FormControl<any> }> | undefined>(undefined);

  readonly userConsentsForm = new FormGroup({
    consents: new FormControl<ConsentViewModel[]>([], { nonNullable: true }),
  });

  constructor() {
    // effect(() => {
    //   document.title = this.profileCode()
    //     ? this.translate.instant('commons.registration-breadcrumb-title')
    //     : this.translate.instant('commons.profile-breadcrumb-title');
    // });

    effect(() => {
      const userProfile = this.userProfile();
      const userConfig = this.userConfig();

      if (!userProfile || !userConfig) {
        return;
      }

      this.form.set(this.createForm(userProfile, userConfig));
    });

    effect(() => {
      this.userConsentsForm.controls.consents.setValue(this.consents());
    });

    // this.store.dispatch(fetchUserConfig());

    this.destroyRef.onDestroy(() => {
      if (this.userProfileState()?.temporary) {
        this.store.dispatch(sessionExpired());
      }
    });
  }

  createForm(userProfile: UserProfileModel, userConfig: UserConfig) {
    const group: { [key: string]: FormControl } = {};

    const additionalAttributesMap =
      userProfile.additionalAttributes?.reduce(
        (acc, attr) => ({ ...acc, [attr.key]: attr.value || '' }),
        {} as Record<string, string>,
      ) || {};

    userConfig.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const additionalAttribute = userProfile.additionalAttributes?.find(
          (el) => el.key === field.key,
        );

        const required = additionalAttribute?.required || false;
        const key = getLastPartKey(field.key);
        const value =
          (userProfile as Record<string, any>)?.[key] ?? additionalAttributesMap[key] ?? '';

        const validators = field.readOnly ? [] : this.getValidators(field, required);

        group[key] = new FormControl(value, validators);
      });
    });

    return this.fb.group(group);
  }

  getValidators(field: Field, required: boolean): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (required) {
      validators.push(Validators.required);
    }

    field.validators?.forEach((el) => {
      switch (el.type) {
        case ValidationType.Email:
          validators.push(Validators.email);
          break;
        case ValidationType.Phone_number:
          validators.push(NgxFormValidators.mobilePhoneNumber({ validatePhoneNumber: true }));
          break;
        case ValidationType.Cap:
          validators.push(NgxFormValidators.cap({ validateCap: true }));
          break;
        case ValidationType.Text:
          validators.push(NgxFormValidators.text({ validateText: true }));
          break;
        case ValidationType.Required:
          validators.push(Validators.required);
          break;
      }
    });

    return validators;
  }

  toggleConsent(id: number) {
    this.userConsentsForm.controls.consents.setValue(
      this.userConsentsForm.controls.consents.value.map((consent) => {
        if (consent.id === id) {
          return { ...consent, accepted: !consent.accepted };
        }

        return consent;
      }),
    );

    this.userConsentsForm.controls.consents.markAsTouched();
    this.userConsentsForm.controls.consents.markAsDirty();
  }

  submit() {
    const isRequiredConsentNonAccetted = this.userConsentsForm.value.consents?.filter(
      (consent) => consent.required && consent.accepted !== true,
    );
    const form = this.form();

    if (!form?.valid || isRequiredConsentNonAccetted?.length) {
      form?.markAllAsTouched();
      this.userConsentsForm.controls.consents.markAsTouched();
      this.notificationService.error(
        'Attenzione',
        isRequiredConsentNonAccetted?.length
          ? 'Per procedere è necessario accettare tutti i consensi obbligatori'
          : 'Per procedere è necessario compilare correttamente tutti i campi evidenziati',
        true,
        5000,
        NotificationPosition.Top,
      );
      return;
    }

    const currentProfile = this.userProfile();
    const formValue = form.getRawValue();

    if (!currentProfile) {
      return;
    }

    const userProfile = {
      ...currentProfile,
      additionalAttributes: (currentProfile.additionalAttributes ?? []).map(
        (additionalAttribute) => ({
          ...additionalAttribute,
          value: formValue[additionalAttribute.key],
        }),
      ),
      consents: (currentProfile.consents ?? []).map((consent) => ({
        ...consent,
        accepted: consent.required
          ? true
          : this.userConsentsForm.controls.consents.value.find((el) => el.id === consent.id)
              ?.accepted,
      })),
    };

    Object.keys(formValue).forEach((key) => {
      if (Object.hasOwn(userProfile, key)) {
        (userProfile as Record<string, any>)[key] = formValue[key];
      }
    });

    this.store.dispatch(updateUserProfile({ data: userProfile }));
  }
}
