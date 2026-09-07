import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  fetchStrutture,
  setSelectedStruttura,
} from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.actions';
import {
  selectAllStrutture,
  selectSelectedStruttura,
  selectStruttureLoading,
} from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';

/**
 * every booking flow needs
 * a selected facility to resolve `unitId` in its API calls. Call this from
 * any entry point of booking-a4h in case the user skipped the home page.
 */
export function ensureStrutturaSelected(store: Store<SmartHospitalState>): void {
  store
    .select(selectSelectedStruttura)
    .pipe(take(1))
    .subscribe((selected) => {
      if (selected) return;
      store.dispatch(fetchStrutture());
      combineLatest([store.select(selectAllStrutture), store.select(selectStruttureLoading)])
        .pipe(
          filter(([, loading]) => !loading),
          take(1),
        )
        .subscribe(([units]) => {
          if (units.length) {
            store.dispatch(setSelectedStruttura({ struttura: units[0] }));
          }
        });
    });
}
