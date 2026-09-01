import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take } from 'rxjs';
import { SmartHospitalState } from '../store/reducers';
import {
  selectInitialized,
  selectUserProfile,
} from '../pages/user-profile/state/user-profile.selectors';
import { fetchUserProfile } from '../pages/user-profile/state/user-profile.actions';

type Options = { allowTemporary?: boolean };

export const authenticatedGuard = (options?: Options): CanActivateFn => {
  return (route, state) => {
    const store = inject(Store<SmartHospitalState>);
    const router = inject(Router);
    const profileCode = route.queryParamMap.get('profilecode') ?? undefined;

    if (options?.allowTemporary && profileCode) {
      store.dispatch(fetchUserProfile({ profileCode }));
    }

    return store.select(selectInitialized).pipe(
      filter(Boolean),
      take(1),
      switchMap(() => store.select(selectUserProfile)),
      map((user) => {
        if (user.data && (!user.temporary || options?.allowTemporary)) {
          return true;
        }
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: state.url,
          },
        });
        return false;
      }),
    );
  };
};
