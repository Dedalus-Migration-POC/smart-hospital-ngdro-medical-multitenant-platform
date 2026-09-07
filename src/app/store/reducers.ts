import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromInitializeApp from '../initialize/state/reducer';
import * as fromUserProfile from '../pages/user-profile/state/user-profile.reducer';
import * as fromSingleReport from '../pages/reports-and-documents/single-report/state/reducer';
import * as fromReportsAndDocuments from '../pages/reports-and-documents/medical-reports/state/reducer';
import * as fromRemoteConfig from './remote-config/remote-config.reducer';
import * as fromPayments from '../pages/payments/payments-pa/state/payments.reducer';
import * as fromPaymentsJcash from '../pages/payments/payments-jcash/state/reducer';
import * as fromTripletReport from '../pages/reports-and-documents/reports-by-triplet/state/reducer';
import * as fromBookings from '../pages/bookings/bookings-ariannaCup/state/reducer';
import * as fromBookingsHero from '../pages/bookings/bookings-hero/state/reducer';
import * as fromBookingUnified from '../pages/bookings/booking-a4h/state/reducer';
import * as fromStruttura from '../pages/bookings/booking-a4h/state/struttura/struttura.reducer';
export interface SmartHospitalState {
  [fromInitializeApp.featureKey]: fromInitializeApp.State;
  [fromUserProfile.featureKey]: fromUserProfile.State;
  [fromSingleReport.featureKey]: fromSingleReport.State;
  [fromReportsAndDocuments.featureKey]: fromReportsAndDocuments.State;
  [fromRemoteConfig.featureKey]: fromRemoteConfig.RemoteConfigState;
  [fromPayments.featureKey]: fromPayments.State;
  [fromPaymentsJcash.featureKey]: fromPaymentsJcash.State;
  [fromTripletReport.featureKey]: fromTripletReport.State;
  [fromBookings.featureKey]: fromBookings.State;
  [fromBookingsHero.featureKey]: fromBookingsHero.State;
  [fromBookingUnified.featureKey]: fromBookingUnified.State;
  [fromStruttura.featureKey]: fromStruttura.StrutturaState;
}

export const reducers: ActionReducerMap<SmartHospitalState> = {
  [fromInitializeApp.featureKey]: fromInitializeApp.reducer,
  [fromUserProfile.featureKey]: fromUserProfile.reducer,
  [fromSingleReport.featureKey]: fromSingleReport.reducer,
  [fromReportsAndDocuments.featureKey]: fromReportsAndDocuments.reducer,
  [fromRemoteConfig.featureKey]: fromRemoteConfig.reducer,
  [fromPayments.featureKey]: fromPayments.reducer,
  [fromPaymentsJcash.featureKey]: fromPaymentsJcash.reducer,
  [fromTripletReport.featureKey]: fromTripletReport.reducer,
  [fromBookings.featureKey]: fromBookings.reducer,
  [fromBookingsHero.featureKey]: fromBookingsHero.reducer,
  [fromBookingUnified.featureKey]: fromBookingUnified.reducer,
  [fromStruttura.featureKey]: fromStruttura.reducer,
};

export const metaReducers: MetaReducer<SmartHospitalState>[] = [];
