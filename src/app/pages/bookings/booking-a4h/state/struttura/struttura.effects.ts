import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, of, tap, withLatestFrom } from 'rxjs';
import { BookingUnifiedService } from 'src/app/pages/bookings/booking-a4h/state/service';
import { SmartHospitalState } from '../../../../../store/reducers';
import * as StrutturaActions from './struttura.actions';
import { clearSelectedStrutturaStorage, saveSelectedStruttura } from './struttura-storage';
import { selectAllStrutture } from './struttura.selectors';

@Injectable()
export class StrutturaEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly bookingUnifiedService = inject(BookingUnifiedService);

  readonly fetchStrutture$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StrutturaActions.fetchStrutture),
      withLatestFrom(this.store.select(selectAllStrutture)),
      concatMap(([, units]) => {
        if (units.length > 0) {
          return of(StrutturaActions.fetchStruttureSuccess({ data: units }));
        }

        return this.bookingUnifiedService.getHealthCareUnit().pipe(
          map(({ healthcareUnits }) =>
            StrutturaActions.fetchStruttureSuccess({ data: healthcareUnits }),
          ),
          catchError((error: unknown) => of(StrutturaActions.fetchStruttureFailure({ error }))),
        );
      }),
    ),
  );

  readonly persistSelectedStruttura$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StrutturaActions.setSelectedStruttura),
        tap(({ struttura }) => saveSelectedStruttura(struttura)),
      ),
    { dispatch: false },
  );

  readonly clearSelectedStruttura$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StrutturaActions.clearSelectedStruttura),
        tap(() => clearSelectedStrutturaStorage()),
      ),
    { dispatch: false },
  );
}
