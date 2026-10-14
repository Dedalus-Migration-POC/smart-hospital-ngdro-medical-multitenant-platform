import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../../../../components/input/input.component';
import { CountdownTimerComponent } from '../../../../../components/countdown-timer/countdown-timer.component';
import { SmartHospitalState } from '../../../../../store/reducers';
import * as CredentialsActions from '../state/credentials.actions';
import {
  selectConfirmLogin,
  selectLogin,
  selectLoginOtpCode,
  selectLoginOtpExpiresOn,
  selectLoginStep,
} from '../state/credentials.selectors';
import { NgxFormValidators } from 'src/validators';
import { LocalAuthMethod } from 'src/app/pages/auth/model';
import { LanguageService } from 'src/app/initialize/state/services/language.service';
import { Link } from 'src/app/components/link/link';

@Component({
  selector: 'app-credentials-login',
  imports: [InputComponent, CountdownTimerComponent, ReactiveFormsModule, TranslateModule, Link],
  templateUrl: './credentials-login.html',
  styleUrl: './credentials-login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsLogin {
  readonly credentialsConfig = input<LocalAuthMethod | null>(null);
  readonly lang = inject(LanguageService).lang;
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly login = this.store.selectSignal(selectLogin);
  readonly confirmation = this.store.selectSignal(selectConfirmLogin);
  readonly step = this.store.selectSignal(selectLoginStep);
  readonly otpExpiresOn = this.store.selectSignal(selectLoginOtpExpiresOn);
  private readonly code = this.store.selectSignal(selectLoginOtpCode);
  private readonly activeForm = viewChild<ElementRef<HTMLFormElement>>('activeForm');
  private readonly successMessage = viewChild<ElementRef<HTMLElement>>('successMessage');

  readonly loginForm = new FormGroup({
    fiscalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, NgxFormValidators.taxCodeValidator],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  readonly otpForm = new FormGroup({
    otpCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+$/)],
    }),
  });
  private readonly loginStatus = toSignal(this.loginForm.statusChanges, {
    initialValue: this.loginForm.status,
  });
  private readonly otpStatus = toSignal(this.otpForm.statusChanges, {
    initialValue: this.otpForm.status,
  });
  readonly canLogin = computed(
    () => this.step() === 'CREDENTIALS' && !this.login().loading && this.loginStatus() === 'VALID',
  );
  readonly canConfirm = computed(
    () =>
      this.step() === 'OTP' &&
      !!this.code() &&
      !this.confirmation().loading &&
      this.otpStatus() === 'VALID',
  );

  constructor() {
    const continueLogin =
      this.activatedRoute.snapshot.queryParamMap.get('continueLogin') === 'true';
    if (!continueLogin || this.step() !== 'OTP') {
      this.store.dispatch(CredentialsActions.resetLogin());
    }

    effect(() => {
      const returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '/';
      if (this.step() === 'AUTHENTICATED') {
        this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      } else if (this.step() === 'REQUIRE_PROFILE_DOWNLOAD') {
        this.router.navigateByUrl(
          this.router.createUrlTree(['/credentials-registration'], { queryParams: { returnUrl } }),
          { replaceUrl: true },
        );
      }
    });

    effect(() => {
      const step = this.step();
      this.otpForm.reset();
      if (step !== 'CREDENTIALS') {
        this.loginForm.controls.password.reset();
      }
    });

    let previousStep = 'CREDENTIALS';
    afterRenderEffect(() => {
      const step = this.step();
      const form = this.activeForm();
      const successMessage = this.successMessage();
      if (step === previousStep) return;
      previousStep = step;
      (form?.nativeElement.querySelector('input') ?? successMessage?.nativeElement)?.focus();
    });
  }

  submitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (!this.canLogin() || this.loginForm.invalid) return;
    const { fiscalCode, password } = this.loginForm.getRawValue();
    this.store.dispatch(
      CredentialsActions.login({ data: { fiscalCode: fiscalCode.trim().toUpperCase(), password } }),
    );
  }

  submitOtp(): void {
    this.otpForm.markAllAsTouched();
    const code = this.code();
    if (!this.canConfirm() || this.otpForm.invalid || !code) return;
    this.store.dispatch(
      CredentialsActions.confirmLogin({
        data: { code, otpCode: this.otpForm.getRawValue().otpCode },
      }),
    );
  }

  resendOtp(): void {
    const code = this.code();
    if (!code || this.confirmation().loading) return;
    this.store.dispatch(CredentialsActions.resendOtp({ code }));
  }

  backToLogin(): void {
    if (this.confirmation().loading) return;
    this.store.dispatch(CredentialsActions.resetLogin());
  }
}
