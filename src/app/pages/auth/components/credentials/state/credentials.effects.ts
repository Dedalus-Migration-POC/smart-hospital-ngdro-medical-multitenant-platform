import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import * as CredentialsActions from './credentials.actions';
import { CredentialsService } from './credentials.service';
import { CredentialsLoginResponse, CredentialsRegistrationError } from './credentials.model';
import { UserProfileService } from 'src/app/pages/user-profile/state/user-profile.service';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import * as UserProfileActions from 'src/app/pages/user-profile/state/user-profile.actions';

@Injectable()
export class CredentialsEffects {
  private actions$ = inject(Actions);
  private credentialsService = inject(CredentialsService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly notificationService = inject(ItNotificationService);
  private readonly translate = inject(TranslateService);
  private store = inject(Store<SmartHospitalState>);

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CredentialsActions.resetPassword),
      exhaustMap(({ data }) =>
        this.credentialsService.resetPassword(data).pipe(
          map(() => CredentialsActions.resetPasswordSuccess()),
          catchError((error: unknown) => {
            const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
            const userNotFound =
              error instanceof HttpErrorResponse &&
              ((error.status === 404 && error.error.errorMessage === 'User not found') ||
                (body !== null &&
                  typeof body === 'object' &&
                  'errorCode' in body &&
                  String(body.errorCode) === '404'));
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant(
                `credentials-reset-password.errors.${userNotFound ? 'userNotFound' : 'generic'}`,
              ),
              true,
              8000,
              NotificationPosition.Top,
            );
            return of(CredentialsActions.resetPasswordFailure({ error }));
          }),
        ),
      ),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CredentialsActions.changePassword),
      exhaustMap(({ data }) =>
        this.credentialsService.changePassword(data).pipe(
          map(() => CredentialsActions.changePasswordSuccess()),
          catchError((error: unknown) => {
            const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
            const invalidCurrentPassword =
              body !== null &&
              typeof body === 'object' &&
              'description' in body &&
              typeof body.description === 'string' &&
              body.description.includes('Invalid user credentials');
            this.notificationService.error(
              this.translate.instant('commons.error'),
              this.translate.instant(
                `credentials-change-password.errors.${invalidCurrentPassword ? 'invalidCurrentPassword' : 'generic'}`,
              ),
              true,
              8000,
              NotificationPosition.Top,
            );
            return of(CredentialsActions.changePasswordFailure({ error }));
          }),
        ),
      ),
    ),
  );

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.login),
      exhaustMap((action) =>
        this.credentialsService.login(action.data).pipe(
          map((response) => {
            const nextStep = this.nextLoginStep(response);
            if (nextStep) this.store.dispatch(nextStep);
            else this.store.dispatch(UserProfileActions.fetchUserProfile());
            return CredentialsActions.loginSuccess();
          }),
          catchError((error: unknown) => {
            this.notifyLoginError(error);
            return of(CredentialsActions.loginFailure({ error }));
          }),
        ),
      ),
    );
  });

  confirmLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.confirmLogin),
      exhaustMap((action) =>
        this.credentialsService.confirmLogin(action.data).pipe(
          map((response) => {
            const nextStep = this.nextLoginStep(response);
            if (nextStep) return nextStep;
            this.store.dispatch(UserProfileActions.fetchUserProfile());
            return CredentialsActions.confirmLoginSuccess();
          }),
          catchError((error: unknown) => {
            const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
            const invalidOtp =
              action.data.otpCode !== undefined &&
              error instanceof HttpErrorResponse &&
              (error.status === 406 ||
                (body !== null &&
                  typeof body === 'object' &&
                  'errorCode' in body &&
                  body.errorCode === '406'));
            this.notifyConfirmLoginError(invalidOtp);
            return of(
              invalidOtp
                ? CredentialsActions.loginOtpInvalid({ error })
                : CredentialsActions.confirmLoginFailure({ error }),
            );
          }),
        ),
      ),
    );
  });

  resendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CredentialsActions.resendOtp),
      exhaustMap(({ code }) =>
        this.credentialsService.resendOtp(code).pipe(
          map((response) => {
            this.notificationService.success(
              this.translate.instant('commons.success'),
              this.translate.instant('credentials-login.otpSent'),
              true,
              8000,
              NotificationPosition.Top,
            );
            return CredentialsActions.resendOtpSuccess({
              code: response.code,
              ...(Number.isFinite(response.expires_in) && response.expires_in > 0
                ? { expiresOn: Date.now() / 1000 + response.expires_in }
                : {}),
            });
          }),
          catchError((error: unknown) => {
            this.notifyConfirmLoginError(false);
            return of(CredentialsActions.resendOtpFailure({ error }));
          }),
        ),
      ),
    ),
  );

  fetchLoginProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CredentialsActions.loginProfileRequired),
      exhaustMap(({ code }) =>
        this.userProfileService.fetchUserProfile(code).pipe(
          map((data) => {
            if (!data.code) throw new Error('Missing profile continuation code');
            return CredentialsActions.fetchLoginProfileSuccess({ data });
          }),
          catchError((error: unknown) =>
            of(CredentialsActions.fetchLoginProfileFailure({ error })),
          ),
        ),
      ),
    ),
  );

  updateLoginProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CredentialsActions.updateLoginProfile),
      exhaustMap(({ data }) => {
        if (!data.code) {
          return of(
            CredentialsActions.updateLoginProfileFailure({
              error: this.registrationError(new Error('Missing profile continuation code')),
            }),
          );
        }
        return this.userProfileService.updateUserProfile(data).pipe(
          concatMap((profile) => {
            if (!profile.code) throw new Error('Missing updated profile continuation code');
            return of(
              CredentialsActions.updateLoginProfileSuccess({ data: profile }),
              CredentialsActions.confirmLogin({ data: { code: profile.code } }),
            );
          }),
          catchError((error: unknown) => {
            const registrationError = this.registrationError(error);
            this.notifyRegistrationError(registrationError);
            return of(CredentialsActions.updateLoginProfileFailure({ error: registrationError }));
          }),
        );
      }),
    ),
  );

  fetchRegistrationAttributes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.fetchRegistrationAttributes),
      concatMap(() =>
        this.credentialsService.fetchRegistrationAttributes().pipe(
          map((data) => CredentialsActions.fetchRegistrationAttributesSuccess({ data })),
          catchError((error: unknown) =>
            of(CredentialsActions.fetchRegistrationAttributesFailure({ error })),
          ),
        ),
      ),
    );
  });

  fetchRegistrationConsents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.fetchRegistrationConsents),
      concatMap(() =>
        this.credentialsService.fetchRegistrationConsents().pipe(
          map((data) => CredentialsActions.fetchRegistrationConsentsSuccess({ data: data ?? [] })),
          catchError((error: unknown) =>
            of(CredentialsActions.fetchRegistrationConsentsFailure({ error })),
          ),
        ),
      ),
    );
  });

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CredentialsActions.register),
      exhaustMap((action) =>
        this.credentialsService.register(action.data).pipe(
          map(() => CredentialsActions.registerSuccess()),
          catchError((error: unknown) => {
            const registrationError = this.registrationError(error);
            this.notifyRegistrationError(registrationError);
            return of(CredentialsActions.registerFailure({ error: registrationError }));
          }),
        ),
      ),
    );
  });

  private nextLoginStep(response: CredentialsLoginResponse) {
    if (response == null) return null;
    if (!response.code) throw new Error('Missing login continuation code');
    if (response.step === 'REQUIRE_PROFILE_DOWNLOAD') {
      return CredentialsActions.loginProfileRequired({ code: response.code });
    }
    if (response.step === 'OTP') {
      return CredentialsActions.loginOtpRequired({
        code: response.code,
        ...(Number.isFinite(response.expires_in) && response.expires_in > 0
          ? { expiresOn: Date.now() / 1000 + response.expires_in }
          : {}),
      });
    }
    throw new Error('Unsupported login step');
  }

  private notifyConfirmLoginError(invalidOtp: boolean): void {
    const messageKey = invalidOtp ? 'invalidOtp' : 'generic';
    this.notificationService.error(
      this.translate.instant('commons.error'),
      this.translate.instant(`credentials-login.otpErrors.${messageKey}`),
      true,
      8000,
      NotificationPosition.Top,
    );
  }

  private notifyLoginError(error: unknown): void {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
    const details: Record<string, unknown> =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const errorCode =
      typeof details['errorCode'] === 'string' ? details['errorCode'] : String(status);
    let messageKey = 'generic';

    switch (errorCode) {
      case '404':
        messageKey = 'userNotFound';
        break;
      case '500':
        if (
          typeof details['description'] === 'string' &&
          details['description'].includes('Invalid user credentials')
        ) {
          messageKey = 'invalidCredentials';
        }
        break;
      case '401':
        if (
          typeof details['description'] === 'string' &&
          details['description'].includes('Invalid user credentials')
        ) {
          messageKey = 'invalidCredentials';
        }
        break;
      case '403':
        if (details['errorMessage'] === 'Email is not verified, verification email is sent again') {
          messageKey = 'emailNotVerified';
        } else if (
          details['errorMessage'] ===
          'Verification email can not be sent. Please contact administrator'
        ) {
          messageKey = 'verificationEmail';
        }
        break;
    }

    this.notificationService.error(
      this.translate.instant('commons.error'),
      this.translate.instant(`credentials-login.errors.${messageKey}`),
      true,
      8000,
      NotificationPosition.Top,
    );
  }

  private notifyRegistrationError(error: CredentialsRegistrationError): void {
    let messageKey = 'generic';
    switch (error.errorCode) {
      case '409':
        messageKey = 'conflict';
        break;
      case '403':
        messageKey = 'verificationEmail';
        break;
      case '400':
        if (error.errorMessage === 'All required fields have to be filled in') {
          messageKey = 'requiredFields';
        } else if (error.errorMessage === 'Not all required consents are signed') {
          messageKey = 'requiredConsents';
        } else if (error.errorMessage === 'Attribute is not valid') {
          messageKey = 'invalidAttribute';
        }
        break;
    }

    const message = this.translate.instant(`credentials-registration.errors.${messageKey}`);
    this.notificationService.error(
      this.translate.instant('commons.error'),
      message + (error.description ? ` (${error.description})` : ''),
      true,
      8000,
      NotificationPosition.Top,
    );
  }

  private registrationError(error: unknown): CredentialsRegistrationError {
    const status = error instanceof HttpErrorResponse ? error.status : 0;
    const body: unknown = error instanceof HttpErrorResponse ? error.error : null;
    const details: Record<string, unknown> =
      body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};

    return {
      status,
      errorCode: typeof details['errorCode'] === 'string' ? details['errorCode'] : String(status),
      errorMessage:
        typeof details['errorMessage'] === 'string'
          ? details['errorMessage']
          : error instanceof Error
            ? error.message
            : 'Registration failed',
      correlationId:
        typeof details['correlationId'] === 'string' ? details['correlationId'] : undefined,
      datetime: typeof details['datetime'] === 'string' ? details['datetime'] : undefined,
      description: typeof details['description'] === 'string' ? details['description'] : undefined,
    };
  }
}
