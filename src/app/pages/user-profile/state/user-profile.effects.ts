import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserProfileActions from './user-profile.actions';
import { UserProfileService } from './user-profile.service';
import { Store } from '@ngrx/store';
import { ItNotificationService, NotificationPosition } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SmartHospitalState } from '../../../store/reducers';

@Injectable()
export class UserProfileEffects {
  private actions$ = inject(Actions);
  private userProfileService = inject(UserProfileService);
  private store = inject(Store<SmartHospitalState>);
  private readonly notificationService = inject(ItNotificationService);
  private translate = inject(TranslateService);
  private router = inject(Router);

  fetchUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.fetchUserProfile),
      concatMap((action) =>
        this.userProfileService.fetchUserProfile(action.profileCode).pipe(
          map((data) => {
            if (data.code) {
              setTimeout(() => {
                this.store.dispatch(
                  UserProfileActions.fetchUserProfile({
                    profileCode: data.code,
                  }),
                );
              }, 1740000);
            }

            return UserProfileActions.fetchUserProfileSuccess({
              data,
              temporary: !!action.profileCode,
            });
          }),
          catchError((error) => of(UserProfileActions.fetchUserProfileFailure({ error }))),
        ),
      ),
    );
  });

  fetchUserConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.fetchUserConfig),
      concatMap(() =>
        this.userProfileService.fetchUserConfig().pipe(
          map((data) => UserProfileActions.fetchUserConfigSuccess({ data })),
          catchError((error) => of(UserProfileActions.fetchUserConfigFailure({ error }))),
        ),
      ),
    );
  });

  fetchUserConsents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.fetchUserConsents),
      concatMap(() =>
        this.userProfileService.fetchUserConsents().pipe(
          map((data) => UserProfileActions.fetchUserConsentsSuccess({ data })),
          catchError((error) => of(UserProfileActions.fetchUserConsentsFailure({ error }))),
        ),
      ),
    );
  });

  updateUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.updateUserProfile),
      concatMap((action) =>
        this.userProfileService.updateUserProfile(action.data).pipe(
          map((data) => {
            if (data.code) {
              this.store.dispatch(UserProfileActions.spidConfirm({ code: data.code }));
            } else {
              this.notificationService.success(
                this.translate.instant('user-profile-page.edit-profile-success-title'),
                this.translate.instant('user-profile-page.edit-profile-success'),
                true,
                8000,
                NotificationPosition.Top,
              );
            }
            return UserProfileActions.updateUserProfileSuccess({ data });
          }),
          catchError((error) => {
            // Error during update: restore user profile from store
            this.store.dispatch(UserProfileActions.fetchUserProfile());

            this.notificationService.error(
              this.translate.instant('commons.error'),
              error.status === 401
                ? this.translate.instant('access-errors.restart')
                : this.translate.instant('user-profile-page.edit-profile-error'),
              true,
              8000,
              NotificationPosition.Top,
            );
            return of(UserProfileActions.updateUserProfileFailure({ error }));
          }),
        ),
      ),
    );
  });

  updateUserConsents$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.updateUserConsents),
      concatMap((action) =>
        this.userProfileService.updateUserConsents(action.data).pipe(
          map(() => UserProfileActions.updateUserConsentsSuccess()),
          catchError((error) => of(UserProfileActions.updateUserConsentsFailure({ error }))),
        ),
      ),
    );
  });

  spidConfirm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserProfileActions.spidConfirm),
      concatMap((action) =>
        this.userProfileService.spidConfirm(action.code).pipe(
          map(() => {
            return UserProfileActions.spidConfirmSuccess();
          }),
          catchError((error) => {
            if (error.status === 200) {
              this.store.dispatch(UserProfileActions.fetchUserProfile());
              this.router.navigate(['/idp-redirect']);
              this.notificationService.success(
                this.translate.instant('user-profile-page.registration-success-title'),
                this.translate.instant('user-profile-page.registration-success'),
                true,
                8000,
                NotificationPosition.Top,
              );
            } else {
              this.notificationService.error(
                this.translate.instant('commons.error'),
                this.translate.instant('user-profile-page.registration-error'),
                true,
                8000,
                NotificationPosition.Top,
              );
            }

            return of(UserProfileActions.spidConfirmFailure({ error }));
          }),
        ),
      ),
    );
  });
}
