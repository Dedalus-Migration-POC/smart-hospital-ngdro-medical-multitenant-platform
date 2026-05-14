import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as designAngularKit from 'design-angular-kit';
import { vi } from 'vitest';

const { ItNotificationService } = designAngularKit as unknown as {
  ItNotificationService: abstract new (...args: never[]) => unknown;
};

import { UserProfile } from './user-profile';
import {
  Alignment,
  FieldType,
  UserConfig,
  UserProfile as UserProfileModel,
  ValidationType,
} from './user-profile.model';
import {
  selectUpdateUserConsentsError,
  selectUpdateUserConsentsLoading,
  selectUpdateUserProfileError,
  selectUpdateUserProfileLoading,
  selectspidConfirmLoading,
  selectUserProfile,
  selectUserProfileLoading,
} from './state/user-profile.selectors';
import { selectAppConfig } from '../../initialize/state/selector';
import { sessionExpired, updateUserProfile } from './state/user-profile.actions';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;
  let queryParamMap$: BehaviorSubject<ParamMap>;
  let userProfileState$: BehaviorSubject<{
    data: UserProfileModel | null;
    loading?: boolean;
    error?: boolean;
    temporary?: boolean;
  }>;
  let store: {
    select: ReturnType<typeof vi.fn>;
    dispatch: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    error: ReturnType<typeof vi.fn>;
  };

  const userConfig: UserConfig = {
    sections: [
      {
        title: { it: 'Anagrafica', en: 'Registry' },
        fields: [
          {
            key: 'email',
            type: FieldType.TEXT,
            alignment: Alignment.VERTICAL,
            validators: [{ type: ValidationType.Email }],
          },
          {
            key: 'city',
            type: FieldType.TEXT,
            alignment: Alignment.VERTICAL,
            validators: [{ type: ValidationType.Required }],
          },
        ],
      },
    ],
  };

  const baseProfile: UserProfileModel = {
    fiscalCode: 'RSSMRA80A01H501U',
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario@example.com',
    additionalAttributes: [
      {
        key: 'city',
        displayName: 'City',
        value: 'Rome',
        required: true,
      },
    ],
    consents: [
      {
        id: 1,
        summary: 'Consenso privacy <Link Informativa privacy />',
        required: true,
        accepted: false,
        contractCode: 'REQ',
        type: 'privacy',
      },
      {
        id: 2,
        summary: 'Consenso marketing <Link Dettagli marketing />',
        required: false,
        accepted: false,
        contractCode: 'OPT',
        type: 'marketing',
      },
      {
        id: 3,
        summary: 'Non valido senza link',
        required: false,
        accepted: false,
        contractCode: 'IGN',
        type: 'ignored',
      },
    ],
    hasDifferentData: false,
    consentsSigned: false,
    code: null,
  };

  async function createComponent(temporary = false) {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ profilecode: 'ABC123' }));
    userProfileState$ = new BehaviorSubject<{
      data: UserProfileModel | null;
      loading?: boolean;
      error?: boolean;
      temporary?: boolean;
    }>({
      data: structuredClone(baseProfile),
      loading: false,
      error: false,
      temporary,
    });

    store = {
      select: vi.fn(),
      dispatch: vi.fn(),
    };
    notificationService = {
      error: vi.fn(),
    };

    store.select.mockImplementation((selector: unknown): Observable<unknown> => {
      if (selector === selectAppConfig) {
        return of({ pages: [{ id: '/user-profile', page: { userConfig } }] });
      }

      if (selector === selectUserProfile) {
        return userProfileState$.asObservable();
      }

      if (selector === selectUserProfileLoading) {
        return of(false);
      }

      if (selector === selectUpdateUserProfileLoading) {
        return of(false);
      }

      if (selector === selectspidConfirmLoading) {
        return of(false);
      }

      if (selector === selectUpdateUserConsentsLoading) {
        return of(false);
      }

      if (selector === selectUpdateUserProfileError || selector === selectUpdateUserConsentsError) {
        return of(null);
      }

      return of(null);
    });

    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParamMap$.asObservable() },
        },
        {
          provide: TranslateService,
          useValue: { instant: vi.fn() },
        },
        { provide: Store, useValue: store as Partial<Store> },
        {
          provide: ItNotificationService,
          useValue: notificationService,
        },
      ],
    })
      .overrideComponent(UserProfile, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('creates the component and builds the form from store data', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(component.profileCode()).toBe('ABC123');
    expect(component.form()?.get('email')?.value).toBe('mario@example.com');
    expect(component.form()?.get('city')?.value).toBe('Rome');

    const cityControl = component.form()?.get('city');
    cityControl?.setValue('');

    expect(cityControl?.hasError('required')).toBe(true);
  });

  it('maps and filters consents for the view model', async () => {
    await createComponent();

    expect(component.consents()).toEqual([
      expect.objectContaining({
        id: 1,
        text: 'Consenso privacy',
        linkText: 'Informativa privacy',
        accepted: false,
        required: true,
        requireLogin: false,
      }),
      expect.objectContaining({
        id: 2,
        text: 'Consenso marketing',
        linkText: 'Dettagli marketing',
        accepted: false,
        required: false,
        requireLogin: false,
      }),
    ]);
  });

  it('toggles a consent and marks the control as touched and dirty', async () => {
    await createComponent();

    component.toggleConsent(2);

    expect(component.userConsentsForm.controls.consents.dirty).toBe(true);
    expect(component.userConsentsForm.controls.consents.touched).toBe(true);
    expect(
      component.userConsentsForm.controls.consents.value.find((consent) => consent.id === 2)
        ?.accepted,
    ).toBe(true);
  });

  it('shows an error and does not dispatch when the form is invalid or required consents are missing', async () => {
    await createComponent();

    component.form()?.patchValue({ email: 'not-an-email' });
    component.submit();

    expect(notificationService.error).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: updateUserProfile.type }),
    );
  });

  it('dispatches the updated profile when form and consents are valid', async () => {
    await createComponent();

    component.form()?.patchValue({
      email: 'new@example.com',
      city: 'Milan',
    });
    component.toggleConsent(2);
    component.userConsentsForm.controls.consents.setValue([
      {
        ...component.userConsentsForm.controls.consents.value[0],
        accepted: true,
      },
      ...component.userConsentsForm.controls.consents.value.slice(1),
    ]);

    component.submit();

    expect(store.dispatch).toHaveBeenCalledWith(
      updateUserProfile({
        data: expect.objectContaining({
          email: 'new@example.com',
          additionalAttributes: [
            expect.objectContaining({
              key: 'city',
              value: 'Milan',
            }),
          ],
          consents: [
            expect.objectContaining({ id: 1, accepted: true }),
            expect.objectContaining({ id: 2, accepted: true }),
            expect.objectContaining({ id: 3, accepted: false }),
          ],
        }),
      }),
    );
  });

  it('dispatches sessionExpired on destroy when the profile is temporary', async () => {
    await createComponent(true);

    fixture.destroy();

    expect(store.dispatch).toHaveBeenCalledWith(sessionExpired());
  });
});
