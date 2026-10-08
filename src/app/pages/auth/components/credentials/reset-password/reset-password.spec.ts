import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import config from 'src/assets/json-config/default/pages/reset-password.json';
import { LanguageService } from 'src/app/initialize/state/services/language.service';
import { PageConfigService } from 'src/app/pages/page-config.service';
import * as CredentialsActions from '../state/credentials.actions';
import { selectResetPassword } from '../state/credentials.selectors';
import { ResetPassword } from './reset-password';

vi.mock('design-angular-kit', () => {
  class DesignKitStub {}
  return {
    DesignAngularKitModule: DesignKitStub,
    ItIconComponent: DesignKitStub,
    ItSpinnerComponent: DesignKitStub,
    ItButtonDirective: DesignKitStub,
    ItBreadcrumbComponent: DesignKitStub,
    ItBreadcrumbItemComponent: DesignKitStub,
    ItInputDirective: DesignKitStub,
    ItSelectDirective: DesignKitStub,
  };
});

describe('ResetPassword', () => {
  let getConfig: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getConfig = vi.fn(() => of(config));
    TestBed.configureTestingModule({
      imports: [ResetPassword],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({
          selectors: [
            {
              selector: selectResetPassword,
              value: { loading: false, success: false, error: null },
            },
          ],
        }),
        { provide: PageConfigService, useValue: { get: getConfig } },
        { provide: LanguageService, useValue: { lang: signal<'it' | 'en'>('it') } },
      ],
    });
    TestBed.overrideComponent(ResetPassword, { set: { template: '', imports: [] } });
  });

  async function createPage() {
    const store = TestBed.inject(MockStore);
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(ResetPassword);
    await fixture.whenStable();
    return { store, dispatch, fixture, component: fixture.componentInstance };
  }

  it('should load its JSON form and clear only reset-password state on entry', async () => {
    const { component, dispatch } = await createPage();
    expect(getConfig).toHaveBeenCalledWith('/reset-password');
    expect(component.formConfigs()[0].fields[0].id).toBe('fiscalCode');
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(CredentialsActions.clearResetPassword());
    expect(component.canSubmit()).toBe(false);
  });

  it('should reject an empty or invalid fiscal code and submit a valid one', async () => {
    const { component, dispatch, fixture } = await createPage();
    dispatch.mockClear();
    component.submit();
    expect(component.form.controls.fiscalCode.touched).toBe(true);
    expect(dispatch).not.toHaveBeenCalled();
    component.form.controls.fiscalCode.setValue('invalid');
    component.submit();
    expect(dispatch).not.toHaveBeenCalled();
    component.form.controls.fiscalCode.setValue('RSSMRA80A01H501U');
    await fixture.whenStable();
    component.submit();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.resetPassword({
        data: { fiscalCode: 'RSSMRA80A01H501U' },
      }),
    );
  });

  it('should block duplicate requests while loading and after success', async () => {
    const { component, dispatch, fixture, store } = await createPage();
    component.form.controls.fiscalCode.setValue('RSSMRA80A01H501U');
    const request = store.overrideSelector(selectResetPassword, {
      loading: true,
      success: false,
      error: null,
    });
    store.refreshState();
    await fixture.whenStable();
    dispatch.mockClear();
    component.submit();
    expect(dispatch).not.toHaveBeenCalled();
    request.setResult({ loading: false, success: true, error: null });
    store.refreshState();
    await fixture.whenStable();
    component.submit();
    expect(component.canSubmit()).toBe(false);
    expect(dispatch).not.toHaveBeenCalled();
    expect(component.pageConfig()?.messages['success'].it).toContain("Riceverai un'email");
  });

  it('should allow retry after request failure without clearing the entered fiscal code', async () => {
    const { component, dispatch, fixture, store } = await createPage();
    component.form.controls.fiscalCode.setValue('RSSMRA80A01H501U');
    store.overrideSelector(selectResetPassword, {
      loading: false,
      success: false,
      error: new Error('Not found'),
    });
    store.refreshState();
    await fixture.whenStable();
    dispatch.mockClear();
    expect(component.canSubmit()).toBe(true);
    component.submit();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(
      CredentialsActions.resetPassword({
        data: { fiscalCode: 'RSSMRA80A01H501U' },
      }),
    );
  });

  it('should block submission until the page configuration is loaded', async () => {
    const pending = new Subject<typeof config>();
    getConfig.mockReturnValueOnce(pending);
    const { component, fixture } = await createPage();
    component.form.controls.fiscalCode.setValue('RSSMRA80A01H501U');
    expect(component.canSubmit()).toBe(false);
    pending.next(config);
    await fixture.whenStable();
    expect(component.canSubmit()).toBe(true);
    pending.complete();
  });

  it('should expose a configuration error and reload on retry', async () => {
    getConfig.mockReturnValueOnce(throwError(() => new Error('Config unavailable')));
    const { component, fixture } = await createPage();
    expect(component.configError()).toBe(true);
    expect(component.canSubmit()).toBe(false);
    component.retryConfig();
    await fixture.whenStable();
    expect(component.configError()).toBe(false);
    expect(component.pageConfig()?.id).toBe('/reset-password');
    expect(getConfig).toHaveBeenCalledTimes(2);
  });
});
