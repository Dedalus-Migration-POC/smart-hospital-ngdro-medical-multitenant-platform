import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import rawConfig from '../../../../../../assets/json-config/default/pages/credentials-registration.json';
import englishCatalog from '../../../../../../assets/i18n/en.json';
import italianCatalog from '../../../../../../assets/i18n/it.json';
import { LanguageService } from '../../../../../initialize/state/services/language.service';
import { PageConfigService } from '../../../../page-config.service';
import { PageConfig } from '../../../../page.model';
import * as CredentialsActions from '../state/credentials.actions';
import {
  MOCK_REGISTRATION_ATTRIBUTES,
  MOCK_REGISTRATION_CONSENTS,
  MOCK_LOGIN_PROFILE,
} from '../state/credentials.mock';
import {
  selectRegistration,
  selectRegistrationAttributes,
  selectRegistrationConsents,
  selectConfirmLogin,
  selectLoginProfile,
  selectLoginStep,
} from '../state/credentials.selectors';
import { CredentialsRegistration } from './credentials-registration';

const config = rawConfig as unknown as PageConfig;

vi.mock('design-angular-kit', () => {
  class DesignAngularKitModuleStub {}
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
    ItIconComponent: DesignAngularKitModuleStub,
    ItSpinnerComponent: DesignAngularKitModuleStub,
    ItButtonDirective: DesignAngularKitModuleStub,
    ItBreadcrumbComponent: DesignAngularKitModuleStub,
    ItBreadcrumbItemComponent: DesignAngularKitModuleStub,
    ItInputDirective: DesignAngularKitModuleStub,
    ItSelectDirective: DesignAngularKitModuleStub,
  };
});

describe('CredentialsRegistration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CredentialsRegistration],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({
          selectors: [
            { selector: selectLoginStep, value: 'CREDENTIALS' },
            {
              selector: selectConfirmLogin,
              value: { loading: false, success: false, error: null },
            },
            {
              selector: selectLoginProfile,
              value: {
                data: null,
                code: null,
                loading: false,
                error: null,
                updateLoading: false,
                updateError: null,
              },
            },
            {
              selector: selectRegistrationAttributes,
              value: { data: MOCK_REGISTRATION_ATTRIBUTES, loading: false, error: false },
            },
            {
              selector: selectRegistrationConsents,
              value: { data: MOCK_REGISTRATION_CONSENTS, loading: false, error: false },
            },
            {
              selector: selectRegistration,
              value: { loading: false, success: false, error: null },
            },
          ],
        }),
        { provide: PageConfigService, useValue: { get: () => of(config) } },
        { provide: LanguageService, useValue: { lang: signal<'it' | 'en'>('it') } },
      ],
    });
    TestBed.overrideComponent(CredentialsRegistration, { set: { template: '', imports: [] } });
  });

  function createRegistration() {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('it', italianCatalog);
    translate.setTranslation('en', englishCatalog);
    translate.use('it');
    return TestBed.createComponent(CredentialsRegistration);
  }

  it('should create JSON dynamic forms and enforce required attributes and consents', async () => {
    const fixture = createRegistration();
    await fixture.whenStable();
    const component = fixture.componentInstance;

    expect(component.form.contains('firstName')).toBe(true);
    expect(component.form.contains('phone_number')).toBe(true);
    expect(component.canSubmit()).toBe(false);
    expect(component.sections().length).toBe(2);
  });

  it('should submit the registration payload with boolean consents', async () => {
    const fixture = createRegistration();
    await fixture.whenStable();
    const component = fixture.componentInstance;
    const store = TestBed.inject(MockStore);
    const dispatch = vi.spyOn(store, 'dispatch');
    component.form.patchValue({
      firstName: 'Mario',
      lastName: 'Rossi',
      fiscalCode: 'RSSMRA80A01H501U',
      email: 'test@example.com',
      password: 'test-password',
      repeatPassword: 'test-password',
      address: 'Via Roma',
      province: 'RM',
      city: 'Roma',
      date_of_birth: '1980-01-01',
      phone_number: '+393421234567',
      postal_code: '00144',
      municipality: 'Roma',
      domicile_province: 'RM',
      domicile_nation: 'IT',
      county_of_birth: 'PI',
      place_of_birth: 'Pisa',
      gender: 'F',
    });
    component.toggleConsent(5);
    await fixture.whenStable();

    expect(component.canSubmit()).toBe(true);
    component.submit();
    expect(dispatch).toHaveBeenCalledWith(
      CredentialsActions.register({
        data: {
          user: {
            firstName: 'Mario',
            lastName: 'Rossi',
            fiscalCode: 'RSSMRA80A01H501U',
            email: 'test@example.com',
            additionalAttributes: expect.arrayContaining([
              expect.objectContaining({
                key: 'postal_code',
                displayName: 'CAP',
                value: '00144',
                required: true,
              }),
            ]),
            consents: [
              expect.objectContaining({ id: 5, accepted: true }),
              expect.objectContaining({ id: 3, accepted: false }),
            ],
          },
          password: 'test-password',
        },
      }),
    );
  });

  async function createProfileCompletion() {
    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectLoginStep, 'REQUIRE_PROFILE_DOWNLOAD');
    const profileSelector = store.overrideSelector(selectLoginProfile, {
      data: MOCK_LOGIN_PROFILE,
      code: MOCK_LOGIN_PROFILE.code!,
      loading: false,
      error: null,
      updateLoading: false,
      updateError: null,
    });
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = createRegistration();
    await fixture.whenStable();
    return { store, fixture, dispatch, profileSelector, component: fixture.componentInstance };
  }

  it('should prefill the existing profile without password or registration requests', async () => {
    const { component, dispatch } = await createProfileCompletion();
    expect(component.completingProfile).toBe(true);
    expect(component.form.controls['firstName'].value).toBe(MOCK_LOGIN_PROFILE.firstName);
    expect(component.form.controls['email'].value).toBe(MOCK_LOGIN_PROFILE.email);
    expect(component.form.contains('password')).toBe(false);
    expect(component.form.contains('repeatPassword')).toBe(false);
    expect(component.canSubmit()).toBe(false);
    expect(dispatch).not.toHaveBeenCalledWith(CredentialsActions.fetchRegistrationAttributes());
    expect(dispatch).not.toHaveBeenCalledWith(CredentialsActions.fetchRegistrationConsents());
  });

  it('should update only entered profile values and preserve code and unconfigured attributes', async () => {
    const { component, dispatch, fixture } = await createProfileCompletion();
    component.form.patchValue({ phone_number: '+393421234567' });
    await fixture.whenStable();
    expect(component.canSubmit()).toBe(false);
    component.toggleConsent(5);
    await fixture.whenStable();
    expect(component.canSubmit()).toBe(true);
    dispatch.mockClear();
    component.submit();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.updateLoginProfile({
        data: {
          ...MOCK_LOGIN_PROFILE,
          additionalAttributes: MOCK_LOGIN_PROFILE.additionalAttributes.map((attribute) => ({
            ...attribute,
            value: attribute.key === 'phone_number' ? '+393421234567' : attribute.value,
          })),
          consents: MOCK_LOGIN_PROFILE.consents?.map((consent) => ({ ...consent, accepted: true })),
        },
      }),
    );
  });

  it('should retry only confirmation with the current profile code', async () => {
    const { store, component, dispatch, fixture, profileSelector } =
      await createProfileCompletion();
    profileSelector.setResult({
      data: { ...MOCK_LOGIN_PROFILE, code: 'updated-profile-code' },
      code: 'updated-profile-code',
      loading: false,
      error: null,
      updateLoading: false,
      updateError: null,
    });
    store.overrideSelector(selectConfirmLogin, {
      loading: false,
      success: false,
      error: new Error('Network'),
    });
    store.refreshState();
    await fixture.whenStable();
    expect(component.canSubmit()).toBe(false);
    dispatch.mockClear();
    component.retryConfirmation();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.confirmLogin({ data: { code: 'updated-profile-code' } }),
    );
  });

  it('should preserve entered values and consent choices when saving fails', async () => {
    const { store, component, fixture, profileSelector } = await createProfileCompletion();
    component.form.patchValue({ phone_number: '+393421234567' });
    component.toggleConsent(5);
    profileSelector.setResult({
      data: MOCK_LOGIN_PROFILE,
      code: MOCK_LOGIN_PROFILE.code!,
      loading: false,
      error: null,
      updateLoading: true,
      updateError: null,
    });
    store.refreshState();
    await fixture.whenStable();
    expect(component.canSubmit()).toBe(false);
    profileSelector.setResult({
      data: MOCK_LOGIN_PROFILE,
      code: MOCK_LOGIN_PROFILE.code!,
      loading: false,
      error: null,
      updateLoading: false,
      updateError: null,
    });
    store.refreshState();
    await fixture.whenStable();
    expect(component.form.controls['phone_number'].value).toBe('+393421234567');
    expect(component.consentSelections().find((consent) => consent.id === 5)?.accepted).toBe(true);
    expect(component.canSubmit()).toBe(true);
  });

  it('should return to login with the continuation flag when OTP is required', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/payments-pa' }) } },
    });
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const { store, fixture } = await createProfileCompletion();
    store.overrideSelector(selectLoginStep, 'OTP');
    store.refreshState();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/login'], {
      queryParams: { returnUrl: '/payments-pa', continueLogin: true },
      replaceUrl: true,
    });
  });

  it('should navigate to returnUrl only after authentication is completed', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/payments-pa' }) } },
    });
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const { store, fixture } = await createProfileCompletion();
    expect(navigate).not.toHaveBeenCalled();
    store.overrideSelector(selectLoginStep, 'AUTHENTICATED');
    store.refreshState();
    await fixture.whenStable();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/payments-pa', { replaceUrl: true });
  });
});
