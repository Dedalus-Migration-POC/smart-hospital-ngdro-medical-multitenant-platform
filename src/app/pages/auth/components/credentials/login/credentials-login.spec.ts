import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputComponent } from '../../../../../components/input/input.component';
import { InputErrorComponent } from '../../../../../components/input-error/input-error.component';
import { CountdownTimerComponent } from '../../../../../components/countdown-timer/countdown-timer.component';
import * as CredentialsActions from '../state/credentials.actions';
import { featureKey, initialState, reducer, State } from '../state/credentials.reducer';
import { CredentialsLogin } from './credentials-login';
import { Lang, LanguageService } from 'src/app/initialize/state/services/language.service';
import { LocalAuthMethod } from 'src/app/pages/auth/model';
import { IconComponent } from 'src/app/components/icon/icon.component';

vi.mock('design-angular-kit', () => {
  class DesignAngularKitModuleStub {}
  class ItProgressBarComponentStub {}
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
    ItIconComponent: DesignAngularKitModuleStub,
    ItProgressBarComponent: ItProgressBarComponentStub,
  };
});

describe('CredentialsLogin', () => {
  let lang = signal<Lang>('it');
  let translate: TranslateService;

  beforeEach(() => {
    lang = signal<Lang>('it');
    TestBed.configureTestingModule({
      imports: [CredentialsLogin],
      providers: [
        provideTranslateService(),
        provideMockStore({ initialState: { [featureKey]: initialState } }),
        { provide: LanguageService, useValue: { lang } },
        {
          provide: Router,
          useValue: {
            navigateByUrl: vi.fn().mockResolvedValue(true),
            createUrlTree: vi
              .fn()
              .mockReturnValue('/credentials-registration?returnUrl=%2Fpayments-pa'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ],
    });
    TestBed.overrideComponent(InputComponent, { remove: { imports: [DesignAngularKitModule] } });
    TestBed.overrideComponent(InputErrorComponent, {
      remove: { imports: [DesignAngularKitModule] },
    });
    TestBed.overrideComponent(CountdownTimerComponent, { set: { template: '', imports: [] } });
    TestBed.overrideComponent(IconComponent, { set: { template: '', imports: [] } });
  });

  async function createLogin() {
    const store = TestBed.inject(MockStore);
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('it', {
      test: {
        login: {
          title: 'Login',
          description: 'Inserisci <strong>credenziali</strong>',
          submit: 'Accedi',
          fiscalCode: 'Codice fiscale',
          password: 'Password',
          otpDescription: 'Accesso',
        },
        otp: { confirm: 'Verifica', back: 'Torna' },
      },
    });
    translate.setTranslation('en', {
      test: {
        login: {
          title: 'Login',
          description: 'Enter <strong>credentials</strong>',
          submit: 'Log in',
          fiscalCode: 'Fiscal code',
          password: 'Password',
          otpDescription: 'Login',
        },
        otp: { confirm: 'Verify', back: 'Go back' },
      },
    });
    translate.use('it').subscribe();
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(CredentialsLogin);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { store, dispatch, fixture, element, component: fixture.componentInstance };
  }

  function otpState(): State {
    return reducer(
      reducer(initialState, CredentialsActions.loginOtpRequired({ code: 'challenge-code' })),
      CredentialsActions.loginSuccess(),
    );
  }

  function setLanguage(language: Lang): void {
    lang.set(language);
    translate.use(language).subscribe();
  }

  it('should render the configured description and login button in the current language', async () => {
    const config: LocalAuthMethod = {
      type: 'LOCAL',
      title: 'test.login.title',
      description: 'test.login.description',
      button: { text: 'test.login.submit', showIcon: false, align: 'start' },
      config: {
        loginLabel: 'test.login.fiscalCode',
        passwordLabel: 'test.login.password',
      },
    };
    const { fixture, element } = await createLogin();
    fixture.componentRef.setInput('credentialsConfig', config);
    await fixture.whenStable();
    expect(element.querySelector('strong')?.textContent).toBe('credenziali');
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Accedi');

    setLanguage('en');
    await fixture.whenStable();
    expect(element.querySelector('strong')?.textContent).toBe('credentials');
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Log in');
  });

  for (const align of ['start', 'center', 'end'] as const) {
    it(`should apply configured OTP buttons with ${align} alignment`, async () => {
      const config: LocalAuthMethod = {
        type: 'LOCAL',
        title: 'test.login.title',
        description: 'test.login.otpDescription',
        button: { text: 'test.login.submit', showIcon: false, align: 'start' },
        config: {
          loginLabel: 'test.login.fiscalCode',
          passwordLabel: 'test.login.password',
          otp: {
            buttons: {
              align,
              confirm: { text: 'test.otp.confirm' },
              back: { text: 'test.otp.back', showIcon: true },
            },
          },
        },
      };
      const { store, fixture, element } = await createLogin();
      fixture.componentRef.setInput('credentialsConfig', config);
      store.setState({ [featureKey]: otpState() });
      await fixture.whenStable();
      const back = element.querySelector<HTMLButtonElement>('button.btn-outline-primary')!;
      const confirm = element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
      expect(back.parentElement?.classList.contains(`justify-content-${align}`)).toBe(true);
      expect(back.textContent?.trim()).toBe('Torna');
      expect(confirm.textContent?.trim()).toBe('Verifica');
      expect(back.querySelector('.fa-arrow-left')).not.toBeNull();

      setLanguage('en');
      fixture.componentRef.setInput('credentialsConfig', {
        ...config,
        config: {
          ...config.config,
          otp: {
            buttons: {
              ...config.config.otp?.buttons,
              back: { text: 'test.otp.back', showIcon: false },
            },
          },
        },
      });
      await fixture.whenStable();
      expect(back.textContent?.trim()).toBe('Go back');
      expect(confirm.textContent?.trim()).toBe('Verify');
      expect(back.querySelector('.fa-arrow-left')).toBeNull();
    });
  }

  it('should preserve OTP button defaults without configuration', async () => {
    const { store, fixture, element } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    const back = element.querySelector<HTMLButtonElement>('button.btn-outline-primary')!;
    expect(back.parentElement?.classList.contains('justify-content-start')).toBe(true);
    expect(back.textContent?.trim()).toBe('commons.back');
    expect(back.querySelector('.fa-arrow-left')).not.toBeNull();
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe(
      'commons.confirm',
    );
  });

  it('should dispatch resendOtp with the current challenge code', async () => {
    const { component, store, fixture, element, dispatch } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    dispatch.mockClear();

    const resendButton = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('credentials-login.resendOtp'),
    );
    expect(resendButton).toBeDefined();
    resendButton!.click();

    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.resendOtp({ code: 'challenge-code' }),
    );
  });

  it('should pass the stored expiration to the existing countdown and preserve it during confirmation', async () => {
    const { store, fixture, component, element } = await createLogin();
    const expiresOn = Date.now() / 1000 + 300;
    const state = reducer(
      reducer(
        initialState,
        CredentialsActions.loginOtpRequired({ code: 'challenge-code', expiresOn }),
      ),
      CredentialsActions.loginSuccess(),
    );
    store.setState({ [featureKey]: state });
    await fixture.whenStable();
    const countdown = fixture.debugElement.query(By.directive(CountdownTimerComponent))
      .componentInstance as CountdownTimerComponent;
    expect(countdown.expireOn()).toBe(expiresOn);
    expect(component.otpExpiresOn()).toBe(expiresOn);
    store.setState({
      [featureKey]: reducer(
        state,
        CredentialsActions.confirmLoginFailure({ error: new Error('Network error') }),
      ),
    });
    await fixture.whenStable();
    expect(countdown.expireOn()).toBe(expiresOn);
    expect(
      fixture.debugElement.query(By.directive(CountdownTimerComponent)).componentInstance,
    ).toBe(countdown);
    store.setState({ [featureKey]: reducer(state, CredentialsActions.resetLogin()) });
    await fixture.whenStable();
    expect(element.querySelector('app-countdown-timer')).toBeNull();
    expect(component.otpExpiresOn()).toBeNull();
  });

  it('should not show a countdown when the OTP response has no positive expiration', async () => {
    const { store, fixture, element } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    expect(element.querySelector('app-countdown-timer')).toBeNull();
  });

  it('should reset stale state and show the two credentials inputs through InputComponent', async () => {
    const { element, dispatch } = await createLogin();
    expect(dispatch).toHaveBeenCalledWith(CredentialsActions.resetLogin());
    expect(element.querySelectorAll('app-input-component').length).toBe(2);
    expect(element.querySelector<HTMLInputElement>('#fiscalCode')?.autocomplete).toBe('username');
    expect(element.querySelector<HTMLInputElement>('#password')?.type).toBe('password');
    expect(element.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
  });

  it('should validate and dispatch the credentials without altering the password', async () => {
    const { component, dispatch } = await createLogin();
    dispatch.mockClear();
    component.submitLogin();
    expect(dispatch).not.toHaveBeenCalled();
    component.loginForm.setValue({ fiscalCode: ' rssmra80a01h501u ', password: 'test-password' });
    component.submitLogin();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.login({
        data: { fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' },
      }),
    );
  });

  it('should switch to one OTP input, clear the password and send the challenge with leading-zero OTP', async () => {
    const { component, store, fixture, element, dispatch } = await createLogin();
    component.loginForm.setValue({ fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' });
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    expect(element.querySelectorAll('app-input-component').length).toBe(1);
    expect(element.querySelector<HTMLInputElement>('#otpCode')?.autocomplete).toBe('one-time-code');
    expect(element.querySelector('#password')).toBeNull();
    expect(component.loginForm.controls.password.value).toBe('');
    expect(document.activeElement).toBe(element.querySelector('#otpCode'));
    component.otpForm.setValue({ otpCode: '012345' });
    dispatch.mockClear();
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.confirmLogin({ data: { code: 'challenge-code', otpCode: '012345' } }),
    );
  });

  it('should reject nonnumeric OTP and prevent confirmation without a challenge', async () => {
    const { component, store, fixture, dispatch } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    dispatch.mockClear();
    component.otpForm.setValue({ otpCode: 'invalid' });
    component.submitOtp();
    expect(dispatch).not.toHaveBeenCalled();
    store.setState({ [featureKey]: { ...otpState(), loginOtpCode: null } });
    await fixture.whenStable();
    component.otpForm.setValue({ otpCode: '123456' });
    component.submitOtp();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should disable credentials while logging in and block duplicate submissions', async () => {
    const { component, store, fixture, element, dispatch } = await createLogin();
    component.loginForm.setValue({ fiscalCode: 'RSSMRA80A01H501U', password: 'test-password' });
    store.setState({ [featureKey]: { ...initialState, loginLoading: true } });
    await fixture.whenStable();
    dispatch.mockClear();
    component.submitLogin();
    expect(dispatch).not.toHaveBeenCalled();
    expect(element.querySelector<HTMLFieldSetElement>('fieldset')?.disabled).toBe(true);
    expect(element.querySelector('form')?.getAttribute('aria-busy')).toBe('true');
  });

  it('should disable OTP confirmation and back navigation while confirming', async () => {
    const { component, store, fixture, element, dispatch } = await createLogin();
    store.setState({ [featureKey]: { ...otpState(), confirmLoginLoading: true } });
    await fixture.whenStable();
    component.otpForm.setValue({ otpCode: '123456' });
    dispatch.mockClear();
    component.submitOtp();
    component.backToLogin();
    expect(dispatch).not.toHaveBeenCalled();
    expect(element.querySelector<HTMLFieldSetElement>('fieldset')?.disabled).toBe(true);
  });

  it('should return to credentials and clear the OTP after an invalid-code response', async () => {
    const { component, store, fixture, element } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    component.otpForm.setValue({ otpCode: '123456' });
    store.setState({
      [featureKey]: reducer(
        otpState(),
        CredentialsActions.loginOtpInvalid({ error: new HttpErrorResponse({ status: 406 }) }),
      ),
    });
    await fixture.whenStable();
    expect(element.querySelectorAll('app-input-component').length).toBe(2);
    expect(component.otpForm.controls.otpCode.value).toBe('');
    expect(component.loginForm.controls.password.value).toBe('');
    expect(component.canLogin()).toBe(false);
    expect(document.activeElement).toBe(element.querySelector('#fiscalCode'));
  });

  it('should reset the flow when returning from OTP voluntarily', async () => {
    const { component, store, fixture, dispatch } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    dispatch.mockClear();
    component.backToLogin();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(CredentialsActions.resetLogin());
  });

  it('should show completion only for AUTHENTICATED, not first-step loginSuccess', async () => {
    const { store, fixture, element } = await createLogin();
    store.setState({ [featureKey]: otpState() });
    await fixture.whenStable();
    expect(element.querySelector('form')).not.toBeNull();
    store.setState({ [featureKey]: reducer(otpState(), CredentialsActions.confirmLoginSuccess()) });
    await fixture.whenStable();
    expect(element.querySelector('form')).toBeNull();
    expect(element.querySelector('[role="status"]')).not.toBeNull();
  });

  it('should open profile completion without authenticating and preserve returnUrl', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { queryParamMap: convertToParamMap({ returnUrl: '/payments-pa' }) } },
    });
    const { store, fixture } = await createLogin();
    const router = TestBed.inject(Router);
    store.setState({
      [featureKey]: reducer(
        initialState,
        CredentialsActions.loginProfileRequired({ code: 'pending-code' }),
      ),
    });
    await fixture.whenStable();
    expect(router.createUrlTree).toHaveBeenCalledExactlyOnceWith(['/credentials-registration'], {
      queryParams: { returnUrl: '/payments-pa' },
    });
    expect(router.navigateByUrl).toHaveBeenCalledExactlyOnceWith(
      '/credentials-registration?returnUrl=%2Fpayments-pa',
      { replaceUrl: true },
    );
  });

  it('should preserve the OTP challenge when continuing from profile completion', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: {
          queryParamMap: convertToParamMap({ continueLogin: 'true', returnUrl: '/payments-pa' }),
        },
      },
    });
    TestBed.inject(MockStore).setState({ [featureKey]: otpState() });
    const { component, element, dispatch } = await createLogin();
    expect(dispatch).not.toHaveBeenCalledWith(CredentialsActions.resetLogin());
    expect(component.step()).toBe('OTP');
    expect(element.querySelector('#otpCode')).not.toBeNull();
    component.otpForm.setValue({ otpCode: '012345' });
    component.submitOtp();
    expect(dispatch).toHaveBeenCalledWith(
      CredentialsActions.confirmLogin({ data: { code: 'challenge-code', otpCode: '012345' } }),
    );
  });

  for (const returnUrl of [null, '', '/payments-pa', '/payments-pa?filter=pending#list']) {
    it(`should navigate to ${returnUrl || '/'} only after authentication`, async () => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap(returnUrl === null ? {} : { returnUrl }),
          },
        },
      });
      const router = TestBed.inject(Router);
      const { store, fixture } = await createLogin();
      expect(router.navigateByUrl).not.toHaveBeenCalled();

      store.setState({ [featureKey]: otpState() });
      await fixture.whenStable();
      expect(router.navigateByUrl).not.toHaveBeenCalled();

      store.setState({
        [featureKey]: reducer(otpState(), CredentialsActions.confirmLoginSuccess()),
      });
      await fixture.whenStable();
      expect(router.navigateByUrl).toHaveBeenCalledExactlyOnceWith(returnUrl || '/', {
        replaceUrl: true,
      });
    });
  }
});
