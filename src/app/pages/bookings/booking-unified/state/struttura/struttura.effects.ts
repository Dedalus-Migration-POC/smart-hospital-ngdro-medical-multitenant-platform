import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, map, of, withLatestFrom } from 'rxjs';
import { BookingUnifiedService } from 'src/app/pages/bookings/booking-unified/booking-unified.service';
import { SmartHospitalState } from '../../../../../store/reducers';
import * as StrutturaActions from './struttura.actions';
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
}
