import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { UserProfileService } from '../user-profile/state/user-profile.service';
import { selectUserProfileData } from '../user-profile/state/user-profile.selectors';
import { UserProfile } from '../user-profile/user-profile.model';
import { SmartHospitalState } from '../../store/reducers';
import { IDP_REDIRECT_KEY } from '../../../constants';
import { fetchUserProfile } from '../user-profile/state/user-profile.actions';

@Component({ template: '', standalone: true })
export class IdpRedirectComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store<SmartHospitalState>);
  private translate = inject(TranslateService);
  private userProfileService = inject(UserProfileService);
  private readonly notificationService = inject(ItNotificationService);

  profileCode$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['profilecode'] as string | undefined),
  );

  errorCode$ = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['errorcode'] as string | undefined),
  );

  ngOnInit(): void {
    combineLatest([this.profileCode$, this.errorCode$])
      .pipe(take(1))
      .subscribe(([profileCode, errorCode]) => {
        if (profileCode) {
          this.store.dispatch(fetchUserProfile({ profileCode }));

          this.store
            .select(selectUserProfileData)
            .pipe(
              filter((userProfile): userProfile is UserProfile => userProfile !== null),
              take(1),
            )
            .subscribe(() => {
              this.router.navigate(['/user-profile'], {
                queryParamsHandling: 'preserve',
              });
            });
        } else if (errorCode) {
          this.notificationService.error(
            this.translate.instant('commons.error'),
            this.translate.instant(`access-errors.${errorCode}`),
            true,
            8000,
            NotificationPosition.Top,
          );
          this.router.navigate(['/']);
        } else {
          this.userProfileService.refreshSession().subscribe();
          this.redirect();
        }
      });
  }

  redirect(): void {
    const redirectUrl = window.localStorage.getItem(IDP_REDIRECT_KEY) || '/';
    window.localStorage.removeItem(IDP_REDIRECT_KEY);

    // if the redirect url points to /oauth/* or an external resource, leave the page
    if (redirectUrl.startsWith('/oauth/') || redirectUrl.startsWith('http')) {
      window.location.href = redirectUrl;
    } else {
      this.router.navigateByUrl(redirectUrl, { replaceUrl: true });
    }
  }
}
