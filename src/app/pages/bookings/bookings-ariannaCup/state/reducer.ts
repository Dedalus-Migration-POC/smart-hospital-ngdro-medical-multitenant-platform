import { createReducer, on } from '@ngrx/store';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'
import {
  setAvailability,
  setBookingType,
  deleteBooking,
  deleteBookingFailure,
  deleteBookingSuccess,
  fetchBookingList,
  fetchBookingListFailure,
  fetchBookingListSuccess,
  // fetchCardMultiUseConfigBookingList,
  // fetchCardMultiUseConfigBookingListFailure,
  // fetchCardMultiUseConfigBookingListSuccess,
  fetchPrivateBookingList,
  fetchPrivateBookingListFailure,
  fetchPrivateBookingListSuccess,
  findOtherAvailability,
  findOtherAvailabilityFailure,
  findOtherAvailabilitySuccess,
  findFirstAvailability,
  findFirstAvailabilityFailure,
  findFirstAvailabilitySuccess,
  reserve,
  reserveFailure,
  reserveSuccess,
  resetStepAvailability,
  resetStepNewBooking,
  setPrivateBooking,
  findPrivateListAvailability,
  findPrivateListAvailabilitySuccess,
  findPrivateListAvailabilityFailure,
  setPrivateDoctor,
} from './actions';
import {
  Booking,
  BookingType,
  Availability,
  Prestazione,
  RetrievePrestazioni,
  Schedule,
  PrivateAvailability,
  MedicoPrestazione,
} from './model';

export const featureKey = 'bookingState';

export interface State {
  // cardMultiUseConfigBookingList: CardMultiUseConfig | null
  bookings: Booking | null;
  bookingLoading: boolean;
  bookingError: boolean;
  deleteBookingLoading: boolean;
  bookingType: BookingType | null;
  firstAvailability: Booking | null;
  firstAvailabilityLoading: boolean;
  firstAvailabilityError: boolean;
  otherAvailability: Booking | null;
  otherAvailabilityLoading: boolean;
  otherAvailabilityError: boolean;
  availability: Availability | null;
  reserve: Schedule | null;
  reserveLoading: boolean;
  reserveError: boolean;
  privateBookings: RetrievePrestazioni | null;
  privateBookingsLoading: boolean;
  privateBookingsError: boolean;
  privateBooking: Prestazione | null;
  privateDoctor: MedicoPrestazione | null;
  privateListAvailability: PrivateAvailability | null;
  privateListAvailabilityLoading: boolean;
  privateListAvailabilityError: boolean;
  privateAvailability: PrivateAvailability | null;
}

export const initialState: State = {
  // cardMultiUseConfigBookingList: null,
  bookings: null,
  bookingLoading: false,
  bookingError: false,
  deleteBookingLoading: false,
  bookingType: null,
  firstAvailability: null,
  firstAvailabilityLoading: false,
  firstAvailabilityError: false,
  otherAvailability: null,
  otherAvailabilityLoading: false,
  otherAvailabilityError: false,
  availability: null,
  reserve: null,
  reserveLoading: false,
  reserveError: false,
  privateBookings: null,
  privateBookingsLoading: false,
  privateBookingsError: false,
  privateBooking: null,
  privateDoctor: null,
  privateListAvailability: null,
  privateListAvailabilityLoading: false,
  privateListAvailabilityError: false,
  privateAvailability: null,
};

export const reducer = createReducer(
  initialState,

  // on(fetchCardMultiUseConfigBookingList, (state) => ({
  //   ...state,
  // })),
  // on(fetchCardMultiUseConfigBookingListSuccess, (state, action) => ({
  //   ...state,
  //   cardMultiUseConfigBookingList: action.data,
  // })),
  // on(fetchCardMultiUseConfigBookingListFailure, (state) => ({
  //   ...state,
  //   cardMultiUseConfigBookingList: null,
  // })),

  on(fetchBookingList, (state) => ({
    ...state,
    bookingLoading: true,
    bookingError: false,
  })),
  on(fetchBookingListSuccess, (state, { data }) => ({
    ...state,
    bookings: data,
    bookingLoading: false,
  })),
  on(fetchBookingListFailure, (state) => ({
    ...state,
    bookingError: true,
    bookingLoading: false,
  })),

  on(deleteBooking, (state) => ({
    ...state,
    deleteBookingLoading: true,
  })),
  on(deleteBookingSuccess, (state, { data }) => ({
    ...state,
    deleteBookingLoading: false,
  })),
  on(deleteBookingFailure, (state) => ({
    ...state,
    deleteBookingLoading: false,
  })),

  on(setBookingType, (state, { request }) => ({
    ...state,
    bookingType: request,
  })),

  on(findFirstAvailability, (state) => ({
    ...state,
    firstAvailabilityLoading: true,
    firstAvailabilityError: false,
  })),
  on(findFirstAvailabilitySuccess, (state, { data }) => ({
    ...state,
    firstAvailability: data,
    firstAvailabilityLoading: false,
  })),
  on(findFirstAvailabilityFailure, (state) => ({
    ...state,
    firstAvailabilityError: true,
    firstAvailabilityLoading: false,
  })),

  on(findOtherAvailability, (state) => ({
    ...state,
    otherAvailabilityLoading: true,
    otherAvailabilityError: false,
  })),
  on(findOtherAvailabilitySuccess, (state, { data }) => ({
    ...state,
    otherAvailability: data,
    otherAvailabilityLoading: false,
  })),
  on(findOtherAvailabilityFailure, (state) => ({
    ...state,
    otherAvailabilityError: true,
    otherAvailabilityLoading: false,
  })),

  on(setAvailability, (state, { request }) => ({
    ...state,
    availability: request,
  })),

  on(reserve, (state) => ({
    ...state,
    reserveLoading: true,
    reserveError: false,
  })),
  on(reserveSuccess, (state, { data }) => ({
    ...state,
    reserve: data,
    reserveLoading: false,
  })),
  on(reserveFailure, (state) => ({
    ...state,
    reserveError: true,
    reserveLoading: false,
  })),

  on(resetStepNewBooking, () => initialState),

  on(resetStepAvailability, (state) => ({
    ...state,
    availability: null,
  })),

  on(fetchPrivateBookingList, (state) => ({
    ...state,
    privateBookingsLoading: true,
    privateBookingsError: false,
  })),
  on(fetchPrivateBookingListSuccess, (state, { data }) => ({
    ...state,
    privateBookings: data,
    privateBookingsLoading: false,
  })),
  on(fetchPrivateBookingListFailure, (state) => ({
    ...state,
    privateBookingsError: true,
    privateBookingsLoading: false,
  })),

  on(setPrivateBooking, (state, { request }) => ({
    ...state,
    privateBooking: request,
  })),

  on(setPrivateDoctor, (state, { request }) => ({
    ...state,
    privateDoctor: request,
  })),

  on(findPrivateListAvailability, (state) => ({
    ...state,
    privateListAvailabilityLoading: true,
    privateListAvailabilityError: false,
  })),
  on(findPrivateListAvailabilitySuccess, (state, { data }) => ({
    ...state,
    privateListAvailability: data,
    privateListAvailabilityLoading: false,
  })),
  on(findPrivateListAvailabilityFailure, (state) => ({
    ...state,
    privateListAvailabilityError: true,
    privateListAvailabilityLoading: false,
  })),
);
