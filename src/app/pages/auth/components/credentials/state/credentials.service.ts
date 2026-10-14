import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';
import {
  CredentialsChangePasswordRequest,
  CredentialsLoginConfirmRequest,
  CredentialsLoginOtpResponse,
  CredentialsLoginResponse,
  CredentialsLoginRequest,
  CredentialsRegistrationRequest,
  CredentialsResetPasswordRequest,
  RegistrationAttribute,
  RegistrationConsent,
} from './credentials.model';
import {
  MOCK_LOGIN_OTP_RESPONSE,
  MOCK_REGISTRATION_ATTRIBUTES,
  MOCK_REGISTRATION_CONSENTS,
} from './credentials.mock';

@Injectable({ providedIn: 'root' })
export class CredentialsService {
  private http = inject(HttpClient);
  private readonly IS_DEV = false;

  resetPassword(data: CredentialsResetPasswordRequest) {
    if (this.IS_DEV) {
      return of<void>(undefined).pipe(delay(500));
    }
    return this.http.post<void>('/oauth/api/wrapper/reset-password', data);
  }

  changePassword(data: CredentialsChangePasswordRequest) {
    if (this.IS_DEV) {
      return of<void>(undefined).pipe(delay(500));
    }
    return this.http.post<void>('/oauth/api/wrapper/change-password', data);
  }

  login(data: CredentialsLoginRequest) {
    if (this.IS_DEV) {
      return of(MOCK_LOGIN_OTP_RESPONSE).pipe(delay(500));
    }

    return this.http.post<CredentialsLoginResponse>('/oauth/api/wrapper/login', data);
  }

  confirmLogin(data: CredentialsLoginConfirmRequest) {
    if (this.IS_DEV) {
      return of<void>(undefined).pipe(delay(500));
    }

    return this.http.post<CredentialsLoginResponse>('/oauth/api/wrapper/login-confirm', data);
  }

  resendOtp(code: string) {
    return this.http.post<CredentialsLoginOtpResponse>('/oauth/api/wrapper/resend-otp', { code });
  }

  fetchRegistrationAttributes() {
    if (this.IS_DEV) {
      return of(MOCK_REGISTRATION_ATTRIBUTES).pipe(delay(500));
    }

    return this.http.get<RegistrationAttribute[]>('/oauth/api/wrapper/registration-attributes');
  }

  fetchRegistrationConsents() {
    if (this.IS_DEV) {
      return of(MOCK_REGISTRATION_CONSENTS).pipe(delay(500));
    }

    return this.http.get<RegistrationConsent[] | null>('/oauth/api/wrapper/consents');
  }

  register(data: CredentialsRegistrationRequest) {
    if (this.IS_DEV) {
      return of<void>(undefined).pipe(delay(500));
    }

    return this.http.post<void>('/oauth/api/wrapper/register', data);
  }
}
