import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectRemoteConfigByKey } from 'src/app/store/remote-config/remote-config.selectors';
import * as fromAppointments from './reducer';
import { DEFAULT_CHECK_IN_HOURS } from './model';

export const selectAppointmentsState = createFeatureSelector<fromAppointments.State>(
  fromAppointments.featureKey,
);

export const selectAppointments = createSelector(
  selectAppointmentsState,
  (state) => state.appointments,
);
export const selectAppointmentsLoaded = createSelector(
  selectAppointmentsState,
  (state) => state.loaded,
);
export const selectAppointmentsLoading = createSelector(
  selectAppointmentsState,
  (state) => state.loading,
);
export const selectAppointmentsError = createSelector(
  selectAppointmentsState,
  (state) => state.error,
);
export const selectDeletingAppointment = createSelector(
  selectAppointmentsState,
  (state) => state.deleting,
);
export const selectRequestingCheckIn = createSelector(
  selectAppointmentsState,
  (state) => state.requestingCheckIn,
);
export const selectMovingAppointment = createSelector(
  selectAppointmentsState,
  (state) => state.moving,
);

/** Operazione in corso che deve bloccare le azioni sulle card/dettaglio. */
export const selectAppointmentsBusy = createSelector(
  selectDeletingAppointment,
  selectRequestingCheckIn,
  (deleting, requestingCheckIn) => deleting || requestingCheckIn,
);

/** Ore prima dell'appuntamento da cui si apre l'accettazione (remote config `booking.checkInHours`). */
export const selectCheckInHours = createSelector(selectRemoteConfigByKey('booking'), (booking) => {
  const hours = Number(booking?.checkInHours);
  return Number.isFinite(hours) ? hours : DEFAULT_CHECK_IN_HOURS;
});
