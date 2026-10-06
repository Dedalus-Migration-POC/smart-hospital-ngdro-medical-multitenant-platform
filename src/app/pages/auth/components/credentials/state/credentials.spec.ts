import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { firstValueFrom, of, Subject, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { HttpHeadersInterceptor } from '../../../../../interceptors/http-headers-interceptor';
import * as CredentialsActions from './credentials.actions';
import { CredentialsEffects } from './credentials.effects';
import {
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
  selectRegistration,
  selectRegistrationAttributes,
  selectRegistrationConsents,
  selectRequiredRegistrationAttributes,
  selectRequiredRegistrationConsents,
} from './credentials.selectors';
import { CredentialsService } from './credentials.service';

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
        CredentialsEffects,
        { provide: ItNotificationService, useValue: { error: vi.fn() } },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CredentialsService);
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
        CredentialsEffects,
        { provide: CredentialsService, useValue: service },
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
