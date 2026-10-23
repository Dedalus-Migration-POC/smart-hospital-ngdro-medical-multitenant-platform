import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import rawConfig from 'src/assets/json-config/default/pages/change-password.json';
import englishCatalog from 'src/assets/i18n/en.json';
import italianCatalog from 'src/assets/i18n/it.json';
import { LanguageService } from 'src/app/initialize/state/services/language.service';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { PageConfig } from 'src/app/pages/page.model';
import * as CredentialsActions from '../state/credentials.actions';
import { selectChangePassword } from '../state/credentials.selectors';
import { ChangePassword } from './change-password';

const config = rawConfig as unknown as PageConfig;

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

describe('ChangePassword', () => {
  let getConfig: ReturnType<typeof vi.fn>;
  const data = { currentPassword: 'old-password', newPassword: 'new-password' };

  beforeEach(() => {
    getConfig = vi.fn(() => of(config));
    TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideMockStore({
          selectors: [
            {
              selector: selectChangePassword,
              value: { loading: false, success: false, error: null },
            },
          ],
        }),
        { provide: PageConfigService, useValue: { get: getConfig } },
        { provide: LanguageService, useValue: { lang: signal<'it' | 'en'>('it') } },
      ],
    });
    TestBed.overrideComponent(ChangePassword, { set: { template: '', imports: [] } });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('it', italianCatalog);
    translate.setTranslation('en', englishCatalog);
    translate.use('it');
  });

  async function createPage() {
    const store = TestBed.inject(MockStore);
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(ChangePassword);
    await fixture.whenStable();
    return { store, dispatch, fixture, component: fixture.componentInstance };
  }

  function fill(component: ChangePassword, repeat = data.newPassword) {
    component.form.setValue({ ...data, repeatNewPassword: repeat });
  }

  it('should load its JSON form and clear change-password state on entry', async () => {
    const { component, dispatch } = await createPage();
    expect(getConfig).toHaveBeenCalledWith('/change-password');
    expect(component.formConfigs()[0].fields.map((field) => field.id)).toEqual([
      'currentPassword',
      'newPassword',
      'repeatNewPassword',
    ]);
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(CredentialsActions.clearChangePassword());
    expect(component.canSubmit()).toBe(false);
  });

  it('should reject mismatching passwords and submit only current and new password', async () => {
    const { component, dispatch, fixture } = await createPage();
    dispatch.mockClear();
    component.submit();
    expect(dispatch).not.toHaveBeenCalled();
    fill(component, 'different');
    await fixture.whenStable();
    expect(component.form.controls.repeatNewPassword.hasError('validateMatching')).toBe(true);
    component.submit();
    expect(dispatch).not.toHaveBeenCalled();
    component.form.controls.newPassword.setValue('different');
    expect(component.form.controls.repeatNewPassword.valid).toBe(true);
    fill(component);
    await fixture.whenStable();
    component.submit();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(CredentialsActions.changePassword({ data }));
  });

  it('should block duplicate requests while loading and clear passwords on success', async () => {
    const { component, dispatch, fixture, store } = await createPage();
    fill(component);
    const request = store.overrideSelector(selectChangePassword, {
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
    expect(component.form.getRawValue()).toEqual({
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    });
    component.submit();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('should allow retry after failure keeping the entered values', async () => {
    const { component, dispatch, fixture, store } = await createPage();
    fill(component);
    store.overrideSelector(selectChangePassword, {
      loading: false,
      success: false,
      error: new Error('Invalid credentials'),
    });
    store.refreshState();
    await fixture.whenStable();
    dispatch.mockClear();
    component.submit();
    expect(dispatch).toHaveBeenCalledExactlyOnceWith(CredentialsActions.changePassword({ data }));
  });

  it('should expose a configuration error and reload on retry', async () => {
    getConfig.mockReturnValueOnce(throwError(() => new Error('Config unavailable')));
    const { component, fixture } = await createPage();
    expect(component.configError()).toBe(true);
    component.retryConfig();
    await fixture.whenStable();
    expect(component.configError()).toBe(false);
  });
});
