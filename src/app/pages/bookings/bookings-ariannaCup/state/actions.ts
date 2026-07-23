import { createAction, props } from '@ngrx/store';
import {
  Booking,
  BookingRequest,
  BookingType,
  Availability,
  FirstAvailabilityRequest,
  OtherAvailabilityRequest,
  RetrievePrestazioni,
  RetrievePrestazioniRequest,
  Schedule,
  TelefonoRequest,
  Prestazione,
  PrivateAvailability,
  MedicoPrestazione,
} from './model';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

// export const fetchCardMultiUseConfigBookingList = createAction(
//   '[Bookings] Fetch fetchCardMultiUseConfigBookingList',
// )
// export const fetchCardMultiUseConfigBookingListSuccess = createAction(
//   '[Bookings] Fetch fetchCardMultiUseConfigBookingListSuccess ',
//   props<{ data: CardMultiUseConfig }>(),
// )
// export const fetchCardMultiUseConfigBookingListFailure = createAction(
//   '[Bookings] Fetch fetchCardMultiUseConfigBookingListFailure',
//   props<{ error: any }>(),
// )

export const fetchBookingList = createAction(
  '[Bookings] fetchBookingListRequest',
  props<{ request: TelefonoRequest }>(),
);
export const fetchBookingListSuccess = createAction(
  '[Bookings] fetchBookingListRequestSuccess',
  props<{ data: Booking }>(),
);
export const fetchBookingListFailure = createAction(
  '[Bookings] fetchBookingListRequestFailure',
  props<{ error: any }>(),
);

export const deleteBooking = createAction(
  '[Bookings] deleteBooking',
  props<{ request: BookingRequest }>(),
);
export const deleteBookingSuccess = createAction(
  '[Bookings] deleteBookingSuccess',
  props<{ data: Schedule }>(),
);
export const deleteBookingFailure = createAction(
  '[Bookings] deleteBookingFailure',
  props<{ error: any }>(),
);

// ---- new booking ----
export const setBookingType = createAction(
  '[Bookings] setBookingType',
  props<{ request: BookingType }>(),
);

export const findFirstAvailability = createAction(
  '[Bookings] findFirstAvailabilityRequest',
  props<{ request: FirstAvailabilityRequest }>(),
);
export const findFirstAvailabilitySuccess = createAction(
  '[Bookings] findFirstAvailabilityRequestSuccess',
  props<{ data: Booking }>(),
);
export const findFirstAvailabilityFailure = createAction(
  '[Bookings] findFirstAvailabilityRequestFailure',
  props<{ error: any }>(),
);

export const findOtherAvailability = createAction(
  '[Bookings] findOtherAvailabilityRequest',
  props<{ request: OtherAvailabilityRequest }>(),
);
export const findOtherAvailabilitySuccess = createAction(
  '[Bookings] findOtherAvailabilityRequestSuccess',
  props<{ data: Booking }>(),
);
export const findOtherAvailabilityFailure = createAction(
  '[Bookings] findOtherAvailabilityRequestFailure',
  props<{ error: any }>(),
);

export const setAvailability = createAction(
  '[Bookings] setAvailability',
  props<{ request: Availability }>(),
);

export const reserve = createAction('[Bookings] reserve', props<{ request: BookingRequest }>());
export const reserveSuccess = createAction(
  '[Bookings] reserveRequestSuccess',
  props<{ data: Schedule }>(),
);
export const reserveFailure = createAction(
  '[Bookings] reserveRequestFailure',
  props<{ error: any }>(),
);
export const reserveHttp500 = createAction('[Bookings] reserveHttp500');

export const resetStepAvailability = createAction('[Bookings] resetStepAvailability');

export const resetStepNewBooking = createAction('[Bookings] resetStepNewBooking');

export const fetchPrivateBookingList = createAction(
  '[Bookings] fetchPrivateBookingList',
  props<{ request: RetrievePrestazioniRequest }>(),
);
export const fetchPrivateBookingListSuccess = createAction(
  '[Bookings] fetchPrivateBookingListSuccess',
  props<{ data: RetrievePrestazioni }>(),
);
export const fetchPrivateBookingListFailure = createAction(
  '[Bookings] fetchPrivateBookingListFailure',
  props<{ error: any }>(),
);

export const setPrivateBooking = createAction(
  '[Bookings] setPrivateBooking',
  props<{ request: Prestazione }>(),
);
export const setPrivateDoctor = createAction(
  '[Bookings] setPrivateDoctor',
  props<{ request: MedicoPrestazione }>(),
);

export const findPrivateListAvailability = createAction(
  '[Bookings] findPrivateListAAvailabilityRequest',
  props<{
    request: { codRegPrest: string; descPrest: string; idAgenda: number };
  }>(),
);
export const findPrivateListAvailabilitySuccess = createAction(
  '[Bookings] findPrivateListAvailabilityRequestSuccess',
  props<{ data: PrivateAvailability }>(),
);
export const findPrivateListAvailabilityFailure = createAction(
  '[Bookings] findPrivateListAvailabilityRequestFailure',
  props<{ error: any }>(),
);
