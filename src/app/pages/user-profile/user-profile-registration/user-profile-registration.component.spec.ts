import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { vi } from 'vitest';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { UserConfig } from '../user-profile.model';
import { UserProfileRegistrationComponent } from './user-profile-registration.component';

describe('UserProfileRegistrationComponent', () => {
  let component: UserProfileRegistrationComponent;
  let fixture: ComponentFixture<UserProfileRegistrationComponent>;

  const userConfig: UserConfig = {
    sections: [
      {
        title: { it: 'Contatti', en: 'Contacts' },
        areas: {
          center: {
            items: [
              {
                id: 'contacts-form',
                type: 'DYNAMIC_FORM',
                enabled: true,
                props: {
                  fields: [
                    {
                      id: 'email',
                      type: 'email',
                      validators: [{ type: 'required' }],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
      {
        title: { it: 'Dati account', en: 'Account details' },
        readOnly: true,
        areas: {
          center: {
            items: [
              {
                id: 'account-details-form',
                type: 'DYNAMIC_FORM',
                enabled: true,
                props: {
                  fields: [
                    {
                      id: 'firstName',
                      type: 'text',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ],
    submitButton: { label: { it: 'Salva', en: 'Save' } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileRegistrationComponent],
      providers: [
        {
          provide: LanguageService,
          useValue: { lang: signal('it').asReadonly() },
        },
      ],
    })
      .overrideComponent(UserProfileRegistrationComponent, {
        set: {
          template: '',
          imports: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserProfileRegistrationComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('emits submit from the active profile form', () => {
    const sourceForm = new FormGroup({
      email: new FormControl('old@example.com', Validators.required),
    });
    const submit = vi.fn();

    fixture.componentRef.setInput('form', sourceForm);
    fixture.componentRef.setInput('userConfig', userConfig);
    fixture.componentRef.setInput('isRegistration', false);
    component.submit.subscribe(submit);

    component.submitForm();

    expect(submit).toHaveBeenCalledOnce();
  });

  it('emits submit from the registration form', () => {
    const sourceForm = new FormGroup({
      email: new FormControl('old@example.com', Validators.required),
    });
    const submit = vi.fn();

    fixture.componentRef.setInput('form', sourceForm);
    fixture.componentRef.setInput('userConfig', userConfig);
    component.submit.subscribe(submit);

    component.submitForm();

    expect(submit).toHaveBeenCalledOnce();
  });

  it('returns dynamic form configs and disables fields for readonly sections', () => {
    const editableForm = component.getDynamicForms(userConfig.sections[0])[0];
    const readonlyForm = component.getDynamicForms(userConfig.sections[1])[0];

    expect(editableForm.showSubmitButton).toBe(false);
    expect(editableForm.fields[0].disabled).toBeUndefined();
    expect(readonlyForm.showSubmitButton).toBe(false);
    expect(readonlyForm.fields[0].disabled).toBe(true);
  });
});
