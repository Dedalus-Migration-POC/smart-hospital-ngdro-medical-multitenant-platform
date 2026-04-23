import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { delay, map, of, take } from 'rxjs';
import { MOCK_CONSENTS, MOCK_PROFILE, MOCK_PROFILE_CONFIG } from './user-profile.mock';
import { UserConfig, UserConsent, UserProfile } from '../user-profile.model';
import { Store } from '@ngrx/store';

import { selectUserProfile } from './user-profile.selectors';
import { SmartHospitalState } from '../../../store/reducers';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(
    private http: HttpClient,
    private store: Store<SmartHospitalState>,
  ) {}
  private readonly IS_DEV = true;

  updateUserProfile(data: UserProfile) {
    // if (this.IS_DEV) {
    //   return of(true).pipe(delay(500))
    // }

    return this.http.post<UserProfile>(
      `oauth/api/wrapper/change-profile?login=${data.code ? true : false}`,
      data,
    );
  }

  spidConfirm(code: string) {
    return this.http.get(`oauth/token-internal?code=${code}`);
  }

  refreshSession() {
    return this.http.post('oauth/refresh', null);
  }

  updateUserConsents(consents: any) {
    return this.http.post('management-privacy-consent/api/user/consents/WAPP', {
      consents,
    });
  }

  fetchUserProfile(profileCode?: string) {
    if (this.IS_DEV) {
      return of(MOCK_PROFILE).pipe(delay(500));
    }

    if (profileCode) {
      return this.http.post<UserProfile>('oauth/api/wrapper/profile-by-code', {
        code: profileCode,
      });
    }

    return this.http.get<UserProfile>('oauth/api/wrapper/profile');
  }

  fetchUserConfig() {
    // return this.http.get<UserConfig>(this.pathUserconfig);
    return of(MOCK_PROFILE_CONFIG).pipe(delay(500));
  }

  logout() {
    let profilecode;
    this.store
      .select(selectUserProfile)
      .pipe(
        take(1),
        map((user) => (profilecode = user.data?.code)),
      )
      .subscribe();
    const options = profilecode ? { params: new HttpParams().set('code', profilecode) } : undefined;
    return this.http.post('oauth/logout', null, options);
  }

  fetchUserConsents() {
    if (this.IS_DEV) {
      return of(MOCK_CONSENTS).pipe(delay(500));
    }
    return this.http.get<UserConsent[]>('oauth/api/wrapper/consents');
  }
}
