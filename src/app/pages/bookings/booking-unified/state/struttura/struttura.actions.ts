import { createAction, props } from '@ngrx/store';
import { HealthcareUnit } from 'src/app/pages/bookings/booking-unified/booking-unified.service';

export const fetchStrutture = createAction('[Struttura] Fetch Strutture');

export const fetchStruttureSuccess = createAction(
  '[Struttura] Fetch Strutture Success',
  props<{ data: HealthcareUnit[] }>(),
);

export const fetchStruttureFailure = createAction(
  '[Struttura] Fetch Strutture Failure',
  props<{ error: unknown }>(),
);

export const setSelectedStruttura = createAction(
  '[Struttura] Set Selected Struttura',
  props<{ struttura: HealthcareUnit }>(),
);

export const clearSelectedStruttura = createAction('[Struttura] Clear Selected Struttura');
