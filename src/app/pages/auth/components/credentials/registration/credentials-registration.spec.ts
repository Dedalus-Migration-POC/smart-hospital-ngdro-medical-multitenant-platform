import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import config from '../../../../../../assets/json-config/default/pages/credentials-registration.json';
import { LanguageService } from '../../../../../initialize/state/services/language.service';
import { PageConfigService } from '../../../../page-config.service';
import * as CredentialsActions from '../state/credentials.actions';
import {
  MOCK_REGISTRATION_ATTRIBUTES,
  MOCK_REGISTRATION_CONSENTS,
} from '../state/credentials.mock';
import {
  selectRegistration,
  selectRegistrationAttributes,
  selectRegistrationConsents,
} from '../state/credentials.selectors';
import { CredentialsRegistration } from './credentials-registration';

vi.mock('design-angular-kit', () => {
  class DesignAngularKitModuleStub {}
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
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

  it('should create JSON dynamic forms and enforce required attributes and consents', async () => {
    const fixture = TestBed.createComponent(CredentialsRegistration);
    await fixture.whenStable();
    const component = fixture.componentInstance;

    expect(component.form.contains('firstName')).toBe(true);
    expect(component.form.contains('phone_number')).toBe(true);
    expect(component.canSubmit()).toBe(false);
    expect(component.sections().length).toBe(2);
  });

  it('should submit the registration payload with boolean consents', async () => {
    const fixture = TestBed.createComponent(CredentialsRegistration);
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
                displayName: 'Domicile postal code',
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
});
