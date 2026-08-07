import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBookingList from './reducer';

export const selectBookingState = createFeatureSelector<fromBookingList.State>(
  fromBookingList.featureKey,
);

export const selectBookingData = createSelector(selectBookingState, (state) => state.bookings);
export const selectBookingLoading = createSelector(
  selectBookingState,
  (state) => state.bookingLoading,
);
export const selectBookingError = createSelector(selectBookingState, (state) => state.bookingError);
export const selectBooking = createSelector(
  selectBookingData,
  selectBookingLoading,
  selectBookingError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectDeleteBookingLoading = createSelector(
  selectBookingState,
  (state) => state.deleteBookingLoading,
);

// ---------- new --------------------
export const selectBookingType = createSelector(selectBookingState, (state) => state.bookingType);

export const selectFirstAvailabilityData = createSelector(
  selectBookingState,
  (state) => state.firstAvailability,
);
export const selectFirstAvailabilityLoading = createSelector(
  selectBookingState,
  (state) => state.firstAvailabilityLoading,
);
export const selectFirstAvailabilityError = createSelector(
  selectBookingState,
  (state) => state.firstAvailabilityError,
);
export const selectFirstAvailability = createSelector(
  selectFirstAvailabilityData,
  selectFirstAvailabilityLoading,
  selectFirstAvailabilityError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectOtherAvailabilityData = createSelector(
  selectBookingState,
  (state) => state.otherAvailability,
);
export const selectOtherAvailabilityLoading = createSelector(
  selectBookingState,
  (state) => state.otherAvailabilityLoading,
);
export const selectOtherAvailabilityError = createSelector(
  selectBookingState,
  (state) => state.otherAvailabilityError,
);
export const selectOtherAvailability = createSelector(
  selectOtherAvailabilityData,
  selectOtherAvailabilityLoading,
  selectOtherAvailabilityError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectAvailability = createSelector(selectBookingState, (state) => state.availability);

export const selectReserveData = createSelector(selectBookingState, (state) => state.reserve);
export const selectReserveLoading = createSelector(
  selectBookingState,
  (state) => state.reserveLoading,
);
export const selectReserveError = createSelector(selectBookingState, (state) => state.reserveError);
export const selectReserve = createSelector(
  selectReserveData,
  selectReserveLoading,
  selectReserveError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectPrivateBookingsData = createSelector(
  selectBookingState,
  (state) => state.privateBookings,
);
export const selectPrivateBookingsLoading = createSelector(
  selectBookingState,
  (state) => state.privateBookingsLoading,
);
export const selectPrivateBookingsError = createSelector(
  selectBookingState,
  (state) => state.privateBookingsError,
);
export const selectPrivateBookings = createSelector(
  selectPrivateBookingsData,
  selectPrivateBookingsLoading,
  selectPrivateBookingsError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectPrivateBooking = createSelector(
  selectBookingState,
  (state) => state.privateBooking,
);

export const selectPrivateDoctor = createSelector(
  selectBookingState,
  (state) => state.privateDoctor,
);

export const selectPrivateAvailabilityData = createSelector(
  selectBookingState,
  (state) => state.privateListAvailability,
);
export const selectPrivateAvailabilityLoading = createSelector(
  selectBookingState,
  (state) => state.privateListAvailabilityLoading,
);
export const selectPrivateAvailabilityError = createSelector(
  selectBookingState,
  (state) => state.privateListAvailabilityError,
);
export const selectPrivateListAvailability = createSelector(
  selectPrivateAvailabilityData,
  selectPrivateAvailabilityLoading,
  selectPrivateAvailabilityError,
  (data, loading, error) => ({ data, loading, error }),
);

export const selectPrivateAvailability = createSelector(
  selectBookingState,
  (state) => state.privateAvailability,
);
