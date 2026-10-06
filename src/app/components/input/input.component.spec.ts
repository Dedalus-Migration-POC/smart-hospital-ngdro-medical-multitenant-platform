import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideTranslateService } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputErrorComponent } from '../input-error/input-error.component';
import { InputComponent } from './input.component';

vi.mock('design-angular-kit', () => {
  class DesignAngularKitModuleStub {}
  return { DesignAngularKitModule: DesignAngularKitModuleStub };
});

describe('InputComponent password visibility', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: [provideTranslateService()],
    });
    TestBed.overrideComponent(InputComponent, {
      remove: { imports: [DesignAngularKitModule] },
    });
    TestBed.overrideComponent(InputErrorComponent, {
      remove: { imports: [DesignAngularKitModule] },
    });
  });

  function createInput(directControl: boolean, type = 'password') {
    const control = new FormControl('test-password', { nonNullable: true });
    const fixture = TestBed.createComponent(InputComponent);
    fixture.componentRef.setInput('fieldName', 'password');
    fixture.componentRef.setInput('type', type);
    fixture.componentRef.setInput('label', 'Password');
    fixture.componentRef.setInput(
      directControl ? 'control' : 'formGroup',
      directControl ? control : new FormGroup({ password: control }),
    );
    fixture.detectChanges();
    return { fixture, control };
  }

  function elements(fixture: ComponentFixture<InputComponent>) {
    const element = fixture.nativeElement as HTMLElement;
    return {
      input: element.querySelector('input')!,
      button: element.querySelector<HTMLButtonElement>('button.password-toggle')!,
    };
  }

  for (const directControl of [true, false]) {
    it(`should toggle visibility without changing the value with ${directControl ? 'FormControl' : 'FormGroup'}`, () => {
      const { fixture, control } = createInput(directControl);
      const { input, button } = elements(fixture);

      expect(input.type).toBe('password');
      expect(button.querySelector('.fa-eye')).not.toBeNull();
      expect(button.type).toBe('button');
      expect(button.getAttribute('aria-controls')).toBe('password');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('text');
      expect(button.querySelector('.fa-eye-slash')).not.toBeNull();
      expect(button.getAttribute('aria-pressed')).toBe('true');
      expect(control.value).toBe('test-password');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('password');
      expect(button.querySelector('.fa-eye')).not.toBeNull();
      expect(control.value).toBe('test-password');
    });

    it(`should disable the toggle for disabled ${directControl ? 'FormControl' : 'FormGroup'}`, () => {
      const { fixture, control } = createInput(directControl);
      control.disable();
      fixture.detectChanges();
      const { input, button } = elements(fixture);

      expect(button.disabled).toBe(true);
      button.click();
      fixture.detectChanges();
      expect(input.type).toBe('password');
    });
  }

  it('should not add a toggle to a text input', () => {
    const { fixture } = createInput(true, 'text');
    expect(fixture.nativeElement.querySelector('button.password-toggle')).toBeNull();
  });

  it('should keep visibility independent between password inputs', () => {
    const first = createInput(true);
    const second = createInput(true);
    elements(first.fixture).button.click();
    first.fixture.detectChanges();
    second.fixture.detectChanges();

    expect(elements(first.fixture).input.type).toBe('text');
    expect(elements(second.fixture).input.type).toBe('password');
  });
});
