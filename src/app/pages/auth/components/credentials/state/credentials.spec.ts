import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { HttpHeadersInterceptor } from '../../../../../interceptors/http-headers-interceptor';
import * as CredentialsActions from './credentials.actions';
import { CredentialsEffects } from './credentials.effects';
import {
  MOCK_LOGIN_OTP_RESPONSE,
  MOCK_LOGIN_PROFILE,
  MOCK_REGISTRATION_ATTRIBUTES,
  MOCK_REGISTRATION_CONSENTS,
  MOCK_REGISTRATION_REQUEST,
} from './credentials.mock';
import {
  CredentialsRegistrationError,
  CredentialsRegistrationRequest,
  REQUIRED_REGISTRATION_FIELDS,
} from './credentials.model';
import { featureKey, initialState, reducer } from './credentials.reducer';
import {
  selectConfirmLogin,
  selectLogin,
  selectLoginOtpCode,
  selectLoginOtpExpiresOn,
  selectLoginOtpRequired,
  selectLoginStep,
  selectRegistration,
  selectRegistrationAttributes,
  selectRegistrationConsents,
  selectRequiredRegistrationAttributes,
  selectRequiredRegistrationConsents,
} from './credentials.selectors';
import { CredentialsService } from './credentials.service';
import * as UserProfileActions from 'src/app/pages/user-profile/state/user-profile.actions';
import { UserProfileService } from 'src/app/pages/user-profile/state/user-profile.service';

vi.mock('design-angular-kit', () => {
  class ItNotificationServiceStub {}
  return {
    ItNotificationService: ItNotificationServiceStub,
    NotificationPosition: { Top: 'top-fix mt-3' },
  };
});

describe('Credentials state', () => {
  it('should start loading and clear previous data and errors', () => {
    const previousState = {
      ...initialState,
      registrationAttributes: MOCK_REGISTRATION_ATTRIBUTES,
      registrationAttributesError: true,
    };

    const state = reducer(previousState, CredentialsActions.fetchRegistrationAttributes());

    expect(state.registrationAttributes).toEqual([]);
    expect(state.registrationAttributesLoading).toBe(true);
    expect(state.registrationAttributesError).toBe(false);
    expect(previousState.registrationAttributes).toEqual(MOCK_REGISTRATION_ATTRIBUTES);
  });

  it('should store the attributes on success and expose the request state', () => {
    const loadingState = reducer(initialState, CredentialsActions.fetchRegistrationAttributes());
    const state = reducer(
      loadingState,
      CredentialsActions.fetchRegistrationAttributesSuccess({ data: MOCK_REGISTRATION_ATTRIBUTES }),
    );

    expect(selectRegistrationAttributes({ [featureKey]: state })).toEqual({
      data: MOCK_REGISTRATION_ATTRIBUTES,
      loading: false,
      error: false,
    });
  });

  it('should stop loading on failure and clear the error on retry', () => {
    const loadingState = reducer(initialState, CredentialsActions.fetchRegistrationAttributes());
    const failedState = reducer(
      loadingState,
      CredentialsActions.fetchRegistrationAttributesFailure({ error: new Error('Request failed') }),
    );

    expect(failedState.registrationAttributesLoading).toBe(false);
    expect(failedState.registrationAttributesError).toBe(true);
    expect(
      reducer(failedState, CredentialsActions.fetchRegistrationAttributes())
        .registrationAttributesError,
    ).toBe(false);
  });

  it('should select only required generic attributes', () => {
    const attributes = [
      ...MOCK_REGISTRATION_ATTRIBUTES,
      { key: 'optional_attribute', value: null, required: false, validation: null },
    ];

    expect(selectRequiredRegistrationAttributes.projector(attributes)).toEqual(
      MOCK_REGISTRATION_ATTRIBUTES.filter((attribute) => attribute.required),
    );
  });

  it('should always define the five fixed registration fields', () => {
    expect(REQUIRED_REGISTRATION_FIELDS).toEqual([
      'firstName',
      'lastName',
      'fiscalCode',
      'email',
      'password',
    ]);
  });

  it('should preserve the validation patterns from the response', () => {
    const samples: Record<string, { valid: string; invalid: string }> = {
      date_of_birth: { valid: '2000-12-31', invalid: '31/12/2000' },
      phone_number: { valid: '+393421234567', invalid: 'invalid' },
      postal_code: { valid: '00100', invalid: '1234' },
    };

    for (const attribute of MOCK_REGISTRATION_ATTRIBUTES) {
      if (attribute.validation) {
        const pattern = new RegExp(attribute.validation);
        expect(pattern.test(samples[attribute.key].valid)).toBe(true);
        expect(pattern.test(samples[attribute.key].invalid)).toBe(false);
      }
    }
  });
});

describe('Credentials consents state', () => {
  it('should start loading consents without changing registration attributes', () => {
    const previousState = {
      ...initialState,
      registrationAttributes: MOCK_REGISTRATION_ATTRIBUTES,
      registrationConsents: MOCK_REGISTRATION_CONSENTS,
      registrationConsentsError: true,
    };
    const state = reducer(previousState, CredentialsActions.fetchRegistrationConsents());

    expect(state.registrationConsents).toEqual([]);
    expect(state.registrationConsentsLoading).toBe(true);
    expect(state.registrationConsentsError).toBe(false);
    expect(state.registrationAttributes).toEqual(MOCK_REGISTRATION_ATTRIBUTES);
    expect(previousState.registrationConsents).toEqual(MOCK_REGISTRATION_CONSENTS);
  });

  it('should store consents including nullable fields on success', () => {
    const loadingState = reducer(initialState, CredentialsActions.fetchRegistrationConsents());
    const state = reducer(
      loadingState,
      CredentialsActions.fetchRegistrationConsentsSuccess({ data: MOCK_REGISTRATION_CONSENTS }),
    );

    expect(selectRegistrationConsents({ [featureKey]: state })).toEqual({
      data: MOCK_REGISTRATION_CONSENTS,
      loading: false,
      error: false,
    });
    expect(state.registrationConsents[0].accepted).toBeNull();
    expect(state.registrationConsents[0].acceptedDate).toBeNull();
  });

  it('should stop loading on failure and clear the error on retry', () => {
    const loadingState = reducer(initialState, CredentialsActions.fetchRegistrationConsents());
    const failedState = reducer(
      loadingState,
      CredentialsActions.fetchRegistrationConsentsFailure({ error: new Error('Request failed') }),
    );

    expect(failedState.registrationConsentsLoading).toBe(false);
    expect(failedState.registrationConsentsError).toBe(true);
    expect(
      reducer(failedState, CredentialsActions.fetchRegistrationConsents())
        .registrationConsentsError,
    ).toBe(false);
  });

  it('should select only required consents', () => {
    expect(selectRequiredRegistrationConsents.projector(MOCK_REGISTRATION_CONSENTS)).toEqual([
      MOCK_REGISTRATION_CONSENTS[0],
    ]);
  });
});

describe('Credentials registration state', () => {
  const error: CredentialsRegistrationError = {
    status: 409,
    errorCode: '409',
    errorMessage: 'Conflict, user already exists in KeyCloak',
  };

  it('should start registration without storing the request or password', () => {
    const state = reducer(
      { ...initialState, registrationSuccess: true, registrationError: error },
      CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }),
    );

    expect(selectRegistration({ [featureKey]: state })).toEqual({
      loading: true,
      success: false,
      error: null,
    });
    expect(state).not.toHaveProperty('password');
    expect(state).not.toHaveProperty('user');
    expect(state).not.toHaveProperty('data');
  });

  it('should mark registration as successful', () => {
    const loadingState = reducer(
      initialState,
      CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }),
    );
    const state = reducer(loadingState, CredentialsActions.registerSuccess());

    expect(selectRegistration({ [featureKey]: state })).toEqual({
      loading: false,
      success: true,
      error: null,
    });
  });

  it('should preserve backend error details and clear them on retry', () => {
    const state = reducer(initialState, CredentialsActions.registerFailure({ error }));

    expect(selectRegistration({ [featureKey]: state })).toEqual({
      loading: false,
      success: false,
      error,
    });
    expect(
      reducer(state, CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }))
        .registrationError,
    ).toBeNull();
  });

  it('should reset registration without clearing attributes and consents', () => {
    const previousState = {
      ...initialState,
      registrationAttributes: MOCK_REGISTRATION_ATTRIBUTES,
      registrationConsents: MOCK_REGISTRATION_CONSENTS,
      registrationSuccess: true,
      registrationError: error,
    };
    const state = reducer(previousState, CredentialsActions.resetRegistration());

    expect(selectRegistration({ [featureKey]: state })).toEqual({
      loading: false,
      success: false,
      error: null,
    });
    expect(state.registrationAttributes).toEqual(MOCK_REGISTRATION_ATTRIBUTES);
    expect(state.registrationConsents).toEqual(MOCK_REGISTRATION_CONSENTS);
  });
});

describe('Credentials login state', () => {
  const data = { fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' };
  const error = new HttpErrorResponse({ status: 401 });

  it('should start login without storing credentials or modifying registration', () => {
    const state = reducer(
      { ...initialState, loginSuccess: true, loginError: error, registrationSuccess: true },
      CredentialsActions.login({ data }),
    );

    expect(selectLogin({ [featureKey]: state })).toEqual({
      loading: true,
      success: false,
      error: null,
    });
    expect(state.registrationSuccess).toBe(true);
    expect(state).not.toHaveProperty('password');
    expect(state).not.toHaveProperty('fiscalCode');
    expect(state).not.toHaveProperty('data');
    expect(state).not.toHaveProperty('token');
  });

  it('should complete login on success', () => {
    const loadingState = reducer(initialState, CredentialsActions.login({ data }));
    const state = reducer(loadingState, CredentialsActions.loginSuccess());

    expect(selectLogin({ [featureKey]: state })).toEqual({
      loading: false,
      success: true,
      error: null,
    });
  });

  it('should preserve the failure and clear it on retry', () => {
    const loadingState = reducer(initialState, CredentialsActions.login({ data }));
    const failedState = reducer(loadingState, CredentialsActions.loginFailure({ error }));

    expect(selectLogin({ [featureKey]: failedState })).toEqual({
      loading: false,
      success: false,
      error,
    });
    expect(reducer(failedState, CredentialsActions.login({ data })).loginError).toBeNull();
  });

  it('should reset login without changing registration data', () => {
    const state = reducer(
      {
        ...initialState,
        loginLoading: true,
        loginSuccess: true,
        loginError: error,
        registrationAttributes: MOCK_REGISTRATION_ATTRIBUTES,
        registrationConsents: MOCK_REGISTRATION_CONSENTS,
        registrationSuccess: true,
      },
      CredentialsActions.resetLogin(),
    );

    expect(selectLogin({ [featureKey]: state })).toEqual({
      loading: false,
      success: false,
      error: null,
    });
    expect(state.registrationAttributes).toEqual(MOCK_REGISTRATION_ATTRIBUTES);
    expect(state.registrationConsents).toEqual(MOCK_REGISTRATION_CONSENTS);
    expect(state.registrationSuccess).toBe(true);
  });
});

describe('Credentials OTP state', () => {
  const code = 'test-challenge-code';
  const data = { code, otpCode: '012345' };
  const otpState = reducer(initialState, CredentialsActions.loginOtpRequired({ code }));

  it('should retain only the challenge code and request the OTP step', () => {
    const state = { [featureKey]: otpState };
    expect(selectLoginStep(state)).toBe('OTP');
    expect(selectLoginOtpRequired(state)).toBe(true);
    expect(selectLoginOtpCode(state)).toBe(code);
    expect(selectLogin(state)).toEqual({ loading: false, success: false, error: null });
    expect(otpState).not.toHaveProperty('access_token');
    expect(otpState).not.toHaveProperty('password');
  });

  it('should preserve the OTP challenge when the first login step succeeds', () => {
    const state = reducer(otpState, CredentialsActions.loginSuccess());

    expect(selectLogin({ [featureKey]: state })).toEqual({
      loading: false,
      success: true,
      error: null,
    });
    expect(selectLoginStep({ [featureKey]: state })).toBe('OTP');
    expect(selectLoginOtpCode({ [featureKey]: state })).toBe(code);
    expect(selectLoginOtpRequired({ [featureKey]: state })).toBe(true);
  });

  it('should retain the original OTP deadline through success and retries and clear it when leaving OTP', () => {
    const expiresOn = 1900000300;
    const pendingState = reducer(
      initialState,
      CredentialsActions.loginOtpRequired({ code, expiresOn }),
    );
    const successState = reducer(pendingState, CredentialsActions.loginSuccess());
    const confirmingState = reducer(successState, CredentialsActions.confirmLogin({ data }));
    const failedState = reducer(
      confirmingState,
      CredentialsActions.confirmLoginFailure({ error: new Error('Network error') }),
    );
    for (const state of [pendingState, successState, confirmingState, failedState]) {
      expect(selectLoginOtpExpiresOn({ [featureKey]: state })).toBe(expiresOn);
    }
    for (const action of [
      CredentialsActions.confirmLoginSuccess(),
      CredentialsActions.resetLogin(),
      CredentialsActions.loginOtpInvalid({ error: new HttpErrorResponse({ status: 406 }) }),
      CredentialsActions.loginFailure({ error: new Error('Login failed') }),
      CredentialsActions.login({ data: { fiscalCode: 'RSSMRA80A01H501U', password: 'test' } }),
    ]) {
      expect(reducer(successState, action).loginOtpExpiresOn).toBeNull();
    }
  });

  it('should complete confirmation and clear the challenge without storing OTP or tokens', () => {
    const loginState = reducer(otpState, CredentialsActions.loginSuccess());
    const loadingState = reducer(loginState, CredentialsActions.confirmLogin({ data }));
    expect(selectConfirmLogin({ [featureKey]: loadingState })).toEqual({
      loading: true,
      success: false,
      error: null,
    });
    expect(selectLogin({ [featureKey]: loadingState })).toEqual(
      selectLogin({ [featureKey]: loginState }),
    );
    expect(loadingState.loginOtpCode).toBe(code);
    expect(loadingState).not.toHaveProperty('otpCode');
    const state = reducer(loadingState, CredentialsActions.confirmLoginSuccess());
    expect(state.loginStep).toBe('AUTHENTICATED');
    expect(state.loginSuccess).toBe(true);
    expect(state.loginLoading).toBe(false);
    expect(selectConfirmLogin({ [featureKey]: state })).toEqual({
      loading: false,
      success: true,
      error: null,
    });
    expect(state.loginOtpCode).toBeNull();
  });

  it('should return to credentials and discard the challenge on invalid OTP', () => {
    const error = new HttpErrorResponse({ status: 406 });
    const loginState = reducer(otpState, CredentialsActions.loginSuccess());
    const loadingState = reducer(loginState, CredentialsActions.confirmLogin({ data }));
    const state = reducer(loadingState, CredentialsActions.loginOtpInvalid({ error }));
    expect(state.loginStep).toBe('CREDENTIALS');
    expect(state.loginOtpCode).toBeNull();
    expect(state.loginLoading).toBe(false);
    expect(state.loginSuccess).toBe(false);
    expect(state.loginError).toBeNull();
    expect(selectConfirmLogin({ [featureKey]: state })).toEqual({
      loading: false,
      success: false,
      error,
    });
    expect(selectLoginOtpRequired({ [featureKey]: state })).toBe(false);
  });

  it('should keep the challenge for retry on other confirmation errors', () => {
    const error = new HttpErrorResponse({ status: 500 });
    const loginState = reducer(otpState, CredentialsActions.loginSuccess());
    const loadingState = reducer(loginState, CredentialsActions.confirmLogin({ data }));
    const failedState = reducer(loadingState, CredentialsActions.confirmLoginFailure({ error }));
    expect(failedState.loginStep).toBe('OTP');
    expect(failedState.loginOtpCode).toBe(code);
    expect(selectLogin({ [featureKey]: failedState })).toEqual(
      selectLogin({ [featureKey]: loginState }),
    );
    expect(selectConfirmLogin({ [featureKey]: failedState })).toEqual({
      loading: false,
      success: false,
      error,
    });
    const retriedState = reducer(failedState, CredentialsActions.confirmLogin({ data }));
    expect(retriedState.confirmLoginError).toBeNull();
    expect(retriedState.confirmLoginLoading).toBe(true);
    expect(retriedState.loginSuccess).toBe(true);
  });

  it('should discard the previous challenge on reset or a new credentials submission', () => {
    for (const action of [
      CredentialsActions.resetLogin(),
      CredentialsActions.login({ data: { fiscalCode: 'RSSMRA80A01H501U', password: 'test' } }),
    ]) {
      const previousState = {
        ...otpState,
        loginSuccess: true,
        confirmLoginLoading: true,
        confirmLoginSuccess: true,
        confirmLoginError: new Error('Previous OTP error'),
      };
      const state = reducer(previousState, action);
      expect(state.loginStep).toBe('CREDENTIALS');
      expect(state.loginOtpCode).toBeNull();
      expect(state.loginSuccess).toBe(false);
      expect(selectConfirmLogin({ [featureKey]: state })).toEqual({
        loading: false,
        success: false,
        error: null,
      });
    }
  });
});

describe('Credentials HTTP flow', () => {
  let actions$: Subject<Action>;
  let httpTesting: HttpTestingController;
  let service: CredentialsService;
  let effects: CredentialsEffects;
  let previousLocaleId: string | null;

  beforeEach(() => {
    previousLocaleId = localStorage.getItem('localeId');
    actions$ = new Subject<Action>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
        provideMockActions(() => actions$),
        provideMockStore(),
        CredentialsEffects,
        { provide: ItNotificationService, useValue: { error: vi.fn() } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CredentialsService);
    Object.defineProperty(service, 'IS_DEV', { value: false });
    effects = TestBed.inject(CredentialsEffects);
  });

  afterEach(() => {
    httpTesting.verify();
    actions$.complete();
    if (previousLocaleId === null) {
      localStorage.removeItem('localeId');
    } else {
      localStorage.setItem('localeId', previousLocaleId);
    }
  });

  it('should GET registration attributes from the real endpoint', async () => {
    const response = firstValueFrom(service.fetchRegistrationAttributes());
    const request = httpTesting.expectOne('/oauth/api/wrapper/registration-attributes');

    expect(request.request.method).toBe('GET');
    request.flush(MOCK_REGISTRATION_ATTRIBUTES);

    expect(await response).toEqual(MOCK_REGISTRATION_ATTRIBUTES);
  });

  it('should dispatch success with the response attributes', async () => {
    const result = firstValueFrom(effects.fetchRegistrationAttributes$);
    actions$.next(CredentialsActions.fetchRegistrationAttributes());
    httpTesting
      .expectOne('/oauth/api/wrapper/registration-attributes')
      .flush(MOCK_REGISTRATION_ATTRIBUTES);

    expect(await result).toEqual(
      CredentialsActions.fetchRegistrationAttributesSuccess({ data: MOCK_REGISTRATION_ATTRIBUTES }),
    );
  });

  it('should dispatch failure and keep listening for subsequent requests', async () => {
    const results: Action[] = [];
    const subscription = effects.fetchRegistrationAttributes$.subscribe((action) =>
      results.push(action),
    );

    actions$.next(CredentialsActions.fetchRegistrationAttributes());
    httpTesting.expectOne('/oauth/api/wrapper/registration-attributes').flush(null, {
      status: 500,
      statusText: 'Server Error',
    });
    expect(results[0].type).toBe(CredentialsActions.fetchRegistrationAttributesFailure.type);

    actions$.next(CredentialsActions.fetchRegistrationAttributes());
    httpTesting
      .expectOne('/oauth/api/wrapper/registration-attributes')
      .flush(MOCK_REGISTRATION_ATTRIBUTES);
    expect(results[1]).toEqual(
      CredentialsActions.fetchRegistrationAttributesSuccess({ data: MOCK_REGISTRATION_ATTRIBUTES }),
    );

    subscription.unsubscribe();
  });

  it('should GET consents with the current language and default to Italian', async () => {
    localStorage.removeItem('localeId');
    const italianResponse = firstValueFrom(service.fetchRegistrationConsents());
    const italianRequest = httpTesting.expectOne('/oauth/api/wrapper/consents');

    expect(italianRequest.request.method).toBe('GET');
    expect(italianRequest.request.params.keys()).toEqual([]);
    expect(italianRequest.request.headers.get('Accept-Language')).toBe('it');
    italianRequest.flush(MOCK_REGISTRATION_CONSENTS);
    expect(await italianResponse).toEqual(MOCK_REGISTRATION_CONSENTS);

    localStorage.setItem('localeId', 'en');
    const englishResponse = firstValueFrom(service.fetchRegistrationConsents());
    const englishRequest = httpTesting.expectOne('/oauth/api/wrapper/consents');
    const englishConsents = MOCK_REGISTRATION_CONSENTS.map((consent) => ({
      ...consent,
      lang: 'en',
    }));

    expect(englishRequest.request.headers.get('Accept-Language')).toBe('en');
    englishRequest.flush(englishConsents);
    expect(await englishResponse).toEqual(englishConsents);
  });

  it('should dispatch success with the response consents', async () => {
    const result = firstValueFrom(effects.fetchRegistrationConsents$);
    actions$.next(CredentialsActions.fetchRegistrationConsents());
    httpTesting.expectOne('/oauth/api/wrapper/consents').flush(MOCK_REGISTRATION_CONSENTS);

    expect(await result).toEqual(
      CredentialsActions.fetchRegistrationConsentsSuccess({ data: MOCK_REGISTRATION_CONSENTS }),
    );
  });

  it('should dispatch consents failure and keep listening for subsequent requests', () => {
    const results: Action[] = [];
    const subscription = effects.fetchRegistrationConsents$.subscribe((action) =>
      results.push(action),
    );

    actions$.next(CredentialsActions.fetchRegistrationConsents());
    httpTesting.expectOne('/oauth/api/wrapper/consents').flush(null, {
      status: 500,
      statusText: 'Server Error',
    });
    expect(results[0].type).toBe(CredentialsActions.fetchRegistrationConsentsFailure.type);

    actions$.next(CredentialsActions.fetchRegistrationConsents());
    httpTesting.expectOne('/oauth/api/wrapper/consents').flush(MOCK_REGISTRATION_CONSENTS);
    expect(results[1]).toEqual(
      CredentialsActions.fetchRegistrationConsentsSuccess({ data: MOCK_REGISTRATION_CONSENTS }),
    );

    subscription.unsubscribe();
  });

  it('should POST the registration payload with consents inside user and accept empty 201', async () => {
    const response = firstValueFrom(service.register(MOCK_REGISTRATION_REQUEST));
    const request = httpTesting.expectOne('/oauth/api/wrapper/register');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(MOCK_REGISTRATION_REQUEST);
    expect(request.request.body.user).not.toHaveProperty('password');
    expect(
      request.request.body.user.consents.map((consent: { accepted: boolean }) => consent.accepted),
    ).toEqual([true, false]);
    request.flush(null, { status: 201, statusText: 'Created' });
    await response;
  });

  it('should normalize residual null accepted values without mutating the input', async () => {
    const data = {
      ...MOCK_REGISTRATION_REQUEST,
      user: {
        ...MOCK_REGISTRATION_REQUEST.user,
        consents: MOCK_REGISTRATION_CONSENTS,
      },
    } as unknown as CredentialsRegistrationRequest;
    const response = firstValueFrom(service.register(data));
    const request = httpTesting.expectOne('/oauth/api/wrapper/register');

    expect(
      request.request.body.user.consents.map((consent: { accepted: boolean }) => consent.accepted),
    ).toEqual([false, false]);
    expect(data.user.consents[0].accepted).toBeNull();
    request.flush(null, { status: 201, statusText: 'Created' });
    await response;
  });

  it('should dispatch registration success and ignore duplicate in-flight submissions', async () => {
    const result = firstValueFrom(effects.register$);
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    const requests = httpTesting.match('/oauth/api/wrapper/register');

    expect(requests.length).toBe(1);
    requests[0].flush(null, { status: 201, statusText: 'Created' });
    expect(await result).toEqual(CredentialsActions.registerSuccess());
  });

  const registrationErrors = [
    { errorCode: '409', errorMessage: 'Conflict, user already exists in KeyCloak' },
    {
      errorCode: '403',
      errorMessage: 'Verification email can not be sent. Please contact administrator',
    },
    { errorCode: '400', errorMessage: 'All required fields have to be filled in' },
    { errorCode: '400', errorMessage: 'Not all required consents are signed' },
    { errorCode: '400', errorMessage: 'Attribute is not valid', description: 'postal_code' },
  ];

  for (const error of registrationErrors) {
    it(`should preserve registration error: ${error.errorMessage}`, async () => {
      const result = firstValueFrom(effects.register$);
      const body = {
        ...error,
        correlationId: 'test-correlation-id',
        datetime: '2024-07-17 10:01:07',
      };
      const status = Number(error.errorCode);
      actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
      httpTesting.expectOne('/oauth/api/wrapper/register').flush(body, {
        status,
        statusText: 'Registration Error',
      });

      expect(await result).toEqual(
        CredentialsActions.registerFailure({
          error: { ...body, status, description: error.description },
        }),
      );
    });
  }

  it('should handle a network failure and allow registration retry', () => {
    const results: Action[] = [];
    const subscription = effects.register$.subscribe((action) => results.push(action));
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    httpTesting.expectOne('/oauth/api/wrapper/register').error(new ProgressEvent('error'));

    expect(results[0]).toMatchObject({
      type: CredentialsActions.registerFailure.type,
      error: { status: 0, errorCode: '0', errorMessage: expect.any(String) },
    });
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    httpTesting.expectOne('/oauth/api/wrapper/register').flush(null, {
      status: 201,
      statusText: 'Created',
    });
    expect(results[1]).toEqual(CredentialsActions.registerSuccess());
    subscription.unsubscribe();
  });
});

describe('Credentials login mock', () => {
  it('should return an OTP challenge without calling the backend in dev mode', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(CredentialsService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = await firstValueFrom(
      service.login({ fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' }),
    );

    expect(response).toEqual(MOCK_LOGIN_OTP_RESPONSE);
    expect(response?.step).toBe('OTP');
    expect(response?.code).toBeTruthy();
    httpTesting.expectNone('/oauth/api/wrapper/login');
    httpTesting.verify();
  });

  it('should successfully confirm login without calling the backend in dev mode', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(CredentialsService);
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = await firstValueFrom(
      service.confirmLogin({ code: 'test-challenge-code', otpCode: '012345' }),
    );

    expect(response).toBeUndefined();
    httpTesting.expectNone('/oauth/api/wrapper/login-confirm');
    httpTesting.verify();
  });
});

describe('Credentials login HTTP flow', () => {
  let actions$: Subject<Action>;
  let effects: CredentialsEffects;
  let httpTesting: HttpTestingController;
  let service: CredentialsService;
  let previousLocaleId: string | null;
  const data = { fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' };

  beforeEach(() => {
    previousLocaleId = localStorage.getItem('localeId');
    actions$ = new Subject<Action>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
        provideMockActions(() => actions$),
        provideMockStore(),
        CredentialsEffects,
        { provide: ItNotificationService, useValue: { error: vi.fn() } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CredentialsService);
    Object.defineProperty(service, 'IS_DEV', { value: false });
    effects = TestBed.inject(CredentialsEffects);
  });

  afterEach(() => {
    httpTesting.verify();
    actions$.complete();
    if (previousLocaleId === null) {
      localStorage.removeItem('localeId');
    } else {
      localStorage.setItem('localeId', previousLocaleId);
    }
  });

  for (const language of [null, 'it', 'en']) {
    it(`should POST same-origin login with language ${language ?? 'default Italian'}`, async () => {
      if (language === null) {
        localStorage.removeItem('localeId');
      } else {
        localStorage.setItem('localeId', language);
      }
      const response = firstValueFrom(service.login(data));
      const request = httpTesting.expectOne('/oauth/api/wrapper/login');

      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual(data);
      expect(request.request.withCredentials).toBe(false);
      expect(request.request.headers.get('Accept-Language')).toBe(language ?? 'it');
      request.flush(null, { status: 200, statusText: 'OK' });
      await response;
    });
  }

  it('should use the newly selected language on subsequent logins', async () => {
    for (const language of ['it', 'en']) {
      localStorage.setItem('localeId', language);
      const response = firstValueFrom(service.login(data));
      const request = httpTesting.expectOne('/oauth/api/wrapper/login');
      expect(request.request.headers.get('Accept-Language')).toBe(language);
      request.flush(null);
      await response;
    }
  });
  it('should dispatch the OTP challenge and emit loginSuccess without losing the OTP step', async () => {
    const response = {
      code: 'test-challenge-code',
      step: 'OTP',
      access_token: null,
      refresh_token: null,
      id_token: null,
      expires_in: 0,
    };
    let state = initialState;
    const dispatch = vi.spyOn(TestBed.inject(Store), 'dispatch');
    const result = firstValueFrom(effects.login$);
    actions$.next(CredentialsActions.login({ data }));
    httpTesting.expectOne('/oauth/api/wrapper/login').flush(response);

    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.loginOtpRequired({ code: response.code }),
    );
    state = reducer(state, CredentialsActions.loginOtpRequired({ code: response.code }));
    const action = await result;
    expect(action).toEqual(CredentialsActions.loginSuccess());
    state = reducer(state, action);
    expect(state.loginSuccess).toBe(true);
    expect(state.loginStep).toBe('OTP');
    expect(state.loginOtpCode).toBe(response.code);
  });

  it('should convert OTP expires_in seconds to an absolute countdown deadline', async () => {
    const now = Date.now();
    const clock = vi.spyOn(Date, 'now').mockReturnValue(now);
    try {
      const dispatch = vi.spyOn(TestBed.inject(Store), 'dispatch');
      const result = firstValueFrom(effects.login$);
      actions$.next(CredentialsActions.login({ data }));
      httpTesting.expectOne('/oauth/api/wrapper/login').flush({
        code: 'challenge-code',
        step: 'OTP',
        access_token: null,
        refresh_token: null,
        id_token: null,
        expires_in: 300,
      });
      expect(await result).toEqual(CredentialsActions.loginSuccess());
      expect(dispatch).toHaveBeenCalledExactlyOnceWith(
        CredentialsActions.loginOtpRequired({
          code: 'challenge-code',
          expiresOn: now / 1000 + 300,
        }),
      );
    } finally {
      clock.mockRestore();
    }
  });

  it('should fail rather than authenticate an OTP response without a challenge code', async () => {
    const result = firstValueFrom(effects.login$);
    actions$.next(CredentialsActions.login({ data }));
    httpTesting.expectOne('/oauth/api/wrapper/login').flush({ step: 'OTP', code: null });

    expect((await result).type).toBe(CredentialsActions.loginFailure.type);
  });

  it('should dispatch login success and ignore duplicate in-flight submissions', async () => {
    const result = firstValueFrom(effects.login$);
    actions$.next(CredentialsActions.login({ data }));
    actions$.next(CredentialsActions.login({ data }));
    const requests = httpTesting.match('/oauth/api/wrapper/login');

    expect(requests.length).toBe(1);
    requests[0].flush(null, { status: 200, statusText: 'OK' });
    expect(await result).toEqual(CredentialsActions.loginSuccess());
  });

  for (const status of [0, 401, 500]) {
    it(`should dispatch failure for status ${status} and allow retry`, () => {
      const results: Action[] = [];
      const subscription = effects.login$.subscribe((action) => results.push(action));
      actions$.next(CredentialsActions.login({ data }));
      const request = httpTesting.expectOne('/oauth/api/wrapper/login');
      if (status === 0) {
        request.error(new ProgressEvent('error'));
      } else {
        request.flush({ message: 'Login failed' }, { status, statusText: 'Login Error' });
      }

      expect(results[0]).toMatchObject({
        type: CredentialsActions.loginFailure.type,
        error: { status },
      });
      actions$.next(CredentialsActions.login({ data }));
      httpTesting.expectOne('/oauth/api/wrapper/login').flush(null);
      expect(results[1]).toEqual(CredentialsActions.loginSuccess());
      subscription.unsubscribe();
    });
  }
});

describe('Credentials OTP HTTP flow', () => {
  let actions$: Subject<Action>;
  let effects: CredentialsEffects;
  let httpTesting: HttpTestingController;
  let notification: { error: ReturnType<typeof vi.fn> };
  let previousLocaleId: string | null;
  const data = { code: 'test-challenge-code', otpCode: '012345' };

  beforeEach(() => {
    previousLocaleId = localStorage.getItem('localeId');
    actions$ = new Subject<Action>();
    notification = { error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
        provideMockActions(() => actions$),
        provideMockStore(),
        CredentialsEffects,
        { provide: ItNotificationService, useValue: notification },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    Object.defineProperty(TestBed.inject(CredentialsService), 'IS_DEV', { value: false });
    effects = TestBed.inject(CredentialsEffects);
  });

  afterEach(() => {
    httpTesting.verify();
    actions$.complete();
    if (previousLocaleId === null) {
      localStorage.removeItem('localeId');
    } else {
      localStorage.setItem('localeId', previousLocaleId);
    }
  });

  it('should POST same-origin code and OTP with current language and complete on empty 200', async () => {
    localStorage.setItem('localeId', 'en');
    const store = TestBed.inject(Store);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const result = firstValueFrom(effects.confirmLogin$);
    actions$.next(CredentialsActions.confirmLogin({ data }));
    actions$.next(CredentialsActions.confirmLogin({ data }));
    const requests = httpTesting.match('/oauth/api/wrapper/login-confirm');
    expect(requests.length).toBe(1);
    expect(requests[0].request.method).toBe('POST');
    expect(requests[0].request.body).toEqual(data);
    expect(requests[0].request.withCredentials).toBe(false);
    expect(requests[0].request.headers.get('Accept-Language')).toBe('en');
    requests[0].flush(null, { status: 200, statusText: 'OK' });
    expect(await result).toEqual(CredentialsActions.confirmLoginSuccess());
    expect(dispatchSpy).toHaveBeenCalledWith(UserProfileActions.fetchUserProfile());
    expect(notification.error).not.toHaveBeenCalled();
  });

  for (const status of [406, 400]) {
    it(`should return to login for invalid OTP with HTTP ${status} and body code 406`, async () => {
      const body = {
        correlationId: 'test-correlation-id',
        errorCode: '406',
        errorMessage: 'OTP code is not valid',
        datetime: '2026-07-13 09:13:13',
      };
      const result = firstValueFrom(effects.confirmLogin$);
      actions$.next(CredentialsActions.confirmLogin({ data }));
      httpTesting.expectOne('/oauth/api/wrapper/login-confirm').flush(body, {
        status,
        statusText: 'Invalid OTP',
      });
      const action = await result;
      expect(action).toMatchObject({
        type: CredentialsActions.loginOtpInvalid.type,
        error: { status, error: body },
      });
      const otpState = reducer(
        initialState,
        CredentialsActions.loginOtpRequired({ code: data.code }),
      );
      const state = reducer(otpState, action);
      expect(state.loginStep).toBe('CREDENTIALS');
      expect(state.loginOtpCode).toBeNull();
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        'credentials-login.otpErrors.invalidOtp',
        true,
        8000,
        NotificationPosition.Top,
      );
    });
  }

  for (const error of [
    { status: 404, body: { errorCode: '404', errorMessage: 'User not found' } },
    {
      status: 403,
      body: {
        errorCode: '403',
        errorMessage: 'Email is not verified, verification email is sent again',
      },
    },
    {
      status: 500,
      body: {
        errorCode: '500',
        errorMessage: 'Internal error',
        description: 'Invalid user credentials',
      },
    },
  ]) {
    it(`should show an OTP error rather than a credentials error for confirmation ${error.status}`, async () => {
      const result = firstValueFrom(effects.confirmLogin$);
      actions$.next(CredentialsActions.confirmLogin({ data }));
      httpTesting.expectOne('/oauth/api/wrapper/login-confirm').flush(error.body, {
        status: error.status,
        statusText: 'Confirmation Error',
      });

      expect(await result).toMatchObject({
        type: CredentialsActions.confirmLoginFailure.type,
        error: { status: error.status, error: error.body },
      });
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        'credentials-login.otpErrors.generic',
        true,
        8000,
        NotificationPosition.Top,
      );
    });
  }

  for (const status of [0, 500]) {
    it(`should keep listening after confirmation error ${status} and allow retry`, () => {
      const results: Action[] = [];
      const subscription = effects.confirmLogin$.subscribe((action) => results.push(action));
      actions$.next(CredentialsActions.confirmLogin({ data }));
      const request = httpTesting.expectOne('/oauth/api/wrapper/login-confirm');
      if (status === 0) {
        request.error(new ProgressEvent('error'));
      } else {
        request.flush(null, { status, statusText: 'Server Error' });
      }
      expect(results[0]).toMatchObject({
        type: CredentialsActions.confirmLoginFailure.type,
        error: { status },
      });
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        'credentials-login.otpErrors.generic',
        true,
        8000,
        NotificationPosition.Top,
      );
      actions$.next(CredentialsActions.confirmLogin({ data }));
      httpTesting.expectOne('/oauth/api/wrapper/login-confirm').flush(null);
      expect(results[1]).toEqual(CredentialsActions.confirmLoginSuccess());
      expect(notification.error).toHaveBeenCalledTimes(1);
      subscription.unsubscribe();
    });
  }
});

describe('Credentials profile completion HTTP flow', () => {
  let actions$: Subject<Action>;
  let subscriptions: Subscription;
  let store: MockStore;
  let httpTesting: HttpTestingController;
  let state: typeof initialState;
  let dispatched: Action[];
  let previousLocaleId: string | null;
  const loginData = { fiscalCode: 'RSSMRA80A01H501U', password: 'synthetic-password' };

  beforeEach(() => {
    previousLocaleId = localStorage.getItem('localeId');
    localStorage.setItem('localeId', 'en');
    state = initialState;
    dispatched = [];
    actions$ = new Subject<Action>();
    subscriptions = new Subscription();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true },
        provideMockActions(() => actions$),
        provideMockStore({ initialState: { [featureKey]: initialState } }),
        CredentialsEffects,
        { provide: ItNotificationService, useValue: { error: vi.fn() } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    Object.defineProperty(TestBed.inject(CredentialsService), 'IS_DEV', { value: false });
    Object.defineProperty(TestBed.inject(UserProfileService), 'IS_DEV', { value: false });
    store = TestBed.inject(MockStore);
    httpTesting = TestBed.inject(HttpTestingController);
    const effects = TestBed.inject(CredentialsEffects);
    subscriptions.add(
      store.scannedActions$.subscribe((action) => {
        dispatched.push(action);
        state = reducer(state, action);
        store.setState({ [featureKey]: state });
        actions$.next(action);
      }),
    );
    const effectStreams: Observable<Action>[] = [
      effects.login$,
      effects.confirmLogin$,
      effects.fetchLoginProfile$,
      effects.updateLoginProfile$,
    ];
    for (const effect of effectStreams) {
      subscriptions.add(effect.subscribe((action) => store.dispatch(action)));
    }
  });

  afterEach(() => {
    httpTesting.verify();
    subscriptions.unsubscribe();
    actions$.complete();
    if (previousLocaleId === null) localStorage.removeItem('localeId');
    else localStorage.setItem('localeId', previousLocaleId);
  });

  function startProfileCompletion() {
    store.dispatch(CredentialsActions.login({ data: loginData }));
    httpTesting.expectOne('/oauth/api/wrapper/login').flush({
      step: 'REQUIRE_PROFILE_DOWNLOAD',
      code: 'initial-login-code',
      expires_in: 0,
      access_token: null,
      refresh_token: null,
      id_token: null,
    });
    expect(state.loginStep).toBe('REQUIRE_PROFILE_DOWNLOAD');
    const download = httpTesting.expectOne('oauth/api/wrapper/profile-by-code');
    expect(download.request.method).toBe('POST');
    expect(download.request.body).toEqual({ code: 'initial-login-code' });
    expect(download.request.headers.get('Accept-Language')).toBe('en');
    return download;
  }

  function updateAndConfirm() {
    store.dispatch(CredentialsActions.updateLoginProfile({ data: MOCK_LOGIN_PROFILE }));
    const update = httpTesting.expectOne('oauth/api/wrapper/change-profile?login=true');
    expect(update.request.body).toEqual(MOCK_LOGIN_PROFILE);
    expect(update.request.headers.get('Accept-Language')).toBe('en');
    update.flush({ ...MOCK_LOGIN_PROFILE, code: 'updated-profile-code' });
    const confirmation = httpTesting.expectOne('/oauth/api/wrapper/login-confirm');
    expect(confirmation.request.body).toEqual({ code: 'updated-profile-code' });
    expect(confirmation.request.headers.get('Accept-Language')).toBe('en');
    return confirmation;
  }

  it('should rotate continuation codes and authenticate only after final confirmation', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    expect(state.loginProfileCode).toBe(MOCK_LOGIN_PROFILE.code);
    expect(dispatched).not.toContainEqual(UserProfileActions.fetchUserProfile());
    updateAndConfirm().flush(null, { status: 200, statusText: 'OK' });
    expect(state.loginStep).toBe('AUTHENTICATED');
    expect(state.confirmLoginSuccess).toBe(true);
    expect(state.loginProfile).toBeNull();
    expect(state.loginProfileCode).toBeNull();
    expect(
      dispatched.filter((action) => action.type === UserProfileActions.fetchUserProfile.type),
    ).toHaveLength(1);
    httpTesting.expectNone('oauth/token-internal');
  });

  it('should download the profile again if confirmation requires more missing data', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    updateAndConfirm().flush({
      step: 'REQUIRE_PROFILE_DOWNLOAD',
      code: 'repeat-code',
      expires_in: 0,
    });
    expect(state.loginStep).toBe('REQUIRE_PROFILE_DOWNLOAD');
    expect(state.confirmLoginSuccess).toBe(false);
    const download = httpTesting.expectOne('oauth/api/wrapper/profile-by-code');
    expect(download.request.body).toEqual({ code: 'repeat-code' });
    download.flush({ ...MOCK_LOGIN_PROFILE, code: 'repeat-downloaded-code' });
    expect(state.loginProfileCode).toBe('repeat-downloaded-code');
    expect(dispatched).not.toContainEqual(UserProfileActions.fetchUserProfile());
  });

  it('should continue with OTP after updating the profile and confirm with its new challenge', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    updateAndConfirm().flush({ ...MOCK_LOGIN_OTP_RESPONSE, code: 'next-otp-code' });
    expect(state.loginStep).toBe('OTP');
    expect(state.loginOtpCode).toBe('next-otp-code');
    expect(state.loginOtpExpiresOn).toBeGreaterThan(Date.now() / 1000);
    expect(state.confirmLoginSuccess).toBe(false);
    expect(dispatched).not.toContainEqual(UserProfileActions.fetchUserProfile());
    store.dispatch(
      CredentialsActions.confirmLogin({ data: { code: 'next-otp-code', otpCode: '012345' } }),
    );
    const confirmation = httpTesting.expectOne('/oauth/api/wrapper/login-confirm');
    expect(confirmation.request.body).toEqual({ code: 'next-otp-code', otpCode: '012345' });
    confirmation.flush(null);
    expect(state.loginStep).toBe('AUTHENTICATED');
  });

  it('should retain the download code after failure and allow profile download retry', () => {
    startProfileCompletion().flush(null, { status: 500, statusText: 'Download Error' });
    expect(state.loginProfileLoading).toBe(false);
    expect(state.loginProfileError).toBeTruthy();
    expect(state.loginProfileCode).toBe('initial-login-code');
    store.dispatch(CredentialsActions.loginProfileRequired({ code: state.loginProfileCode! }));
    httpTesting.expectOne('oauth/api/wrapper/profile-by-code').flush(MOCK_LOGIN_PROFILE);
    expect(state.loginProfileError).toBeNull();
    expect(state.loginProfileCode).toBe(MOCK_LOGIN_PROFILE.code);
  });

  it('should keep the original profile when updating fails and not call confirmation', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    store.dispatch(CredentialsActions.updateLoginProfile({ data: MOCK_LOGIN_PROFILE }));
    httpTesting
      .expectOne('oauth/api/wrapper/change-profile?login=true')
      .flush(
        { errorCode: '400', errorMessage: 'All required fields have to be filled in' },
        { status: 400, statusText: 'Invalid Profile' },
      );
    expect(state.loginProfileUpdateLoading).toBe(false);
    expect(state.loginProfileUpdateError?.errorCode).toBe('400');
    expect(state.loginProfile?.code).toBe(MOCK_LOGIN_PROFILE.code);
    httpTesting.expectNone('/oauth/api/wrapper/login-confirm');
  });

  it('should retry code-only confirmation without treating its 406 as invalid OTP', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    updateAndConfirm().flush(
      { errorCode: '406' },
      { status: 406, statusText: 'Confirmation Error' },
    );
    expect(state.loginStep).toBe('REQUIRE_PROFILE_DOWNLOAD');
    expect(state.confirmLoginError).toBeTruthy();
    expect(state.loginProfile?.code).toBe('updated-profile-code');
    store.dispatch(CredentialsActions.confirmLogin({ data: { code: state.loginProfile!.code! } }));
    httpTesting.expectOne('/oauth/api/wrapper/login-confirm').flush(null);
    expect(state.loginStep).toBe('AUTHENTICATED');
  });

  it('should not confirm a profile update that omits the new code', () => {
    startProfileCompletion().flush(MOCK_LOGIN_PROFILE);
    store.dispatch(CredentialsActions.updateLoginProfile({ data: MOCK_LOGIN_PROFILE }));
    httpTesting
      .expectOne('oauth/api/wrapper/change-profile?login=true')
      .flush({ ...MOCK_LOGIN_PROFILE, code: null });
    expect(state.loginProfileUpdateError).toBeTruthy();
    expect(state.loginStep).toBe('REQUIRE_PROFILE_DOWNLOAD');
    httpTesting.expectNone('/oauth/api/wrapper/login-confirm');
  });

  it('should fail unknown login steps rather than authenticate', () => {
    store.dispatch(CredentialsActions.login({ data: loginData }));
    httpTesting
      .expectOne('/oauth/api/wrapper/login')
      .flush({ step: 'UNSUPPORTED', code: 'unknown-code' });
    expect(state.loginStep).toBe('CREDENTIALS');
    expect(state.loginError).toBeTruthy();
    expect(dispatched).not.toContainEqual(UserProfileActions.fetchUserProfile());
  });
});

describe('Credentials login notifications', () => {
  let actions$: Subject<Action>;
  let effects: CredentialsEffects;
  let service: { login: ReturnType<typeof vi.fn> };
  let notification: { error: ReturnType<typeof vi.fn> };
  const data = { fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    service = { login: vi.fn() };
    notification = { error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        CredentialsEffects,
        { provide: CredentialsService, useValue: service },
        { provide: UserProfileService, useValue: {} },
        { provide: ItNotificationService, useValue: notification },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    effects = TestBed.inject(CredentialsEffects);
  });

  afterEach(() => actions$.complete());

  const errors = [
    { status: 404, errorMessage: 'User not found', messageKey: 'userNotFound' },
    {
      status: 500,
      errorMessage: 'Internal error',
      description:
        '401 : "{\"error\":\"invalid_grant\",\"error_description\":\"Invalid user credentials\"}"',
      messageKey: 'invalidCredentials',
    },
    {
      status: 403,
      errorMessage: 'Email is not verified, verification email is sent again',
      messageKey: 'emailNotVerified',
    },
    {
      status: 403,
      errorMessage: 'Verification email can not be sent. Please contact administrator',
      messageKey: 'verificationEmail',
    },
    { status: 500, errorMessage: 'Internal error', messageKey: 'generic' },
    { status: 403, errorMessage: 'Unexpected forbidden response', messageKey: 'generic' },
  ];

  for (const error of errors) {
    it(`should notify ${error.messageKey} for ${error.errorMessage} and preserve backend details`, async () => {
      const response = new HttpErrorResponse({
        status: error.status,
        error: {
          correlationId: 'test-correlation-id',
          errorCode: String(error.status),
          errorMessage: error.errorMessage,
          description: error.description,
          datetime: '2024-07-17 10:16:06',
        },
      });
      service.login.mockReturnValue(throwError(() => response));
      const result = firstValueFrom(effects.login$);
      actions$.next(CredentialsActions.login({ data }));

      expect(await result).toEqual(CredentialsActions.loginFailure({ error: response }));
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        `credentials-login.errors.${error.messageKey}`,
        true,
        8000,
        NotificationPosition.Top,
      );
    });
  }

  for (const body of [null, 'Unexpected error', { description: 401 }]) {
    it(`should use a generic notification for a malformed response ${JSON.stringify(body)}`, async () => {
      service.login.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500, error: body })),
      );
      const result = firstValueFrom(effects.login$);
      actions$.next(CredentialsActions.login({ data }));

      expect((await result).type).toBe(CredentialsActions.loginFailure.type);
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        'credentials-login.errors.generic',
        true,
        8000,
        NotificationPosition.Top,
      );
    });
  }

  it('should notify a network error and allow a successful retry without another notification', () => {
    service.login
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 0 })))
      .mockReturnValueOnce(of(undefined));
    const results: Action[] = [];
    const subscription = effects.login$.subscribe((action) => results.push(action));

    actions$.next(CredentialsActions.login({ data }));
    expect(notification.error).toHaveBeenCalledWith(
      'commons.error',
      'credentials-login.errors.generic',
      true,
      8000,
      NotificationPosition.Top,
    );
    actions$.next(CredentialsActions.login({ data }));
    expect(results[1]).toEqual(CredentialsActions.loginSuccess());
    expect(notification.error).toHaveBeenCalledTimes(1);
    subscription.unsubscribe();
  });

  it('should not notify on successful login', async () => {
    service.login.mockReturnValue(of(undefined));
    const result = firstValueFrom(effects.login$);
    actions$.next(CredentialsActions.login({ data }));

    expect(await result).toEqual(CredentialsActions.loginSuccess());
    expect(notification.error).not.toHaveBeenCalled();
  });
});

describe('Credentials registration notifications', () => {
  let actions$: Subject<Action>;
  let effects: CredentialsEffects;
  let service: { register: ReturnType<typeof vi.fn> };
  let notification: { error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    service = { register: vi.fn() };
    notification = { error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        CredentialsEffects,
        { provide: CredentialsService, useValue: service },
        { provide: UserProfileService, useValue: {} },
        { provide: ItNotificationService, useValue: notification },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    effects = TestBed.inject(CredentialsEffects);
  });

  afterEach(() => actions$.complete());

  const errors = [
    {
      status: 409,
      errorMessage: 'Conflict, user already exists in KeyCloak',
      messageKey: 'conflict',
    },
    {
      status: 403,
      errorMessage: 'Verification email can not be sent. Please contact administrator',
      messageKey: 'verificationEmail',
    },
    {
      status: 400,
      errorMessage: 'All required fields have to be filled in',
      messageKey: 'requiredFields',
    },
    {
      status: 400,
      errorMessage: 'Not all required consents are signed',
      messageKey: 'requiredConsents',
    },
    {
      status: 400,
      errorMessage: 'Attribute is not valid',
      description: 'postal_code',
      messageKey: 'invalidAttribute',
    },
    { status: 500, errorMessage: 'Unexpected error', messageKey: 'generic' },
  ];

  for (const error of errors) {
    it(`should notify ${error.messageKey} and preserve the failure action`, async () => {
      service.register.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: error.status,
              error: {
                errorCode: String(error.status),
                errorMessage: error.errorMessage,
                description: error.description,
              },
            }),
        ),
      );
      const result = firstValueFrom(effects.register$);
      actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));

      expect(await result).toMatchObject({
        type: CredentialsActions.registerFailure.type,
        error: {
          status: error.status,
          errorCode: String(error.status),
          errorMessage: error.errorMessage,
        },
      });
      expect(notification.error).toHaveBeenCalledExactlyOnceWith(
        'commons.error',
        `credentials-registration.errors.${error.messageKey}` +
          (error.description ? ` (${error.description})` : ''),
        true,
        8000,
        NotificationPosition.Top,
      );
    });
  }

  it('should notify a generic network error and allow a successful retry without another notification', () => {
    service.register
      .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 0 })))
      .mockReturnValueOnce(of(undefined));
    const results: Action[] = [];
    const subscription = effects.register$.subscribe((action) => results.push(action));

    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    expect(notification.error).toHaveBeenCalledWith(
      'commons.error',
      'credentials-registration.errors.generic',
      true,
      8000,
      NotificationPosition.Top,
    );
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));
    expect(results[1]).toEqual(CredentialsActions.registerSuccess());
    expect(notification.error).toHaveBeenCalledTimes(1);
    subscription.unsubscribe();
  });

  it('should not notify an error on successful registration', async () => {
    service.register.mockReturnValue(of(undefined));
    const result = firstValueFrom(effects.register$);
    actions$.next(CredentialsActions.register({ data: MOCK_REGISTRATION_REQUEST }));

    expect(await result).toEqual(CredentialsActions.registerSuccess());
    expect(notification.error).not.toHaveBeenCalled();
  });
});
