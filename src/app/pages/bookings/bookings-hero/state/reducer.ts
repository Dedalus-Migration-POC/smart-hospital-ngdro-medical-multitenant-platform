import { createReducer, on } from '@ngrx/store';
import * as BookingHeroActions from './actions';
import {
  Availability,
  AvailableDay,
  BookResponse,
  CreateSessionResponse,
  DelegaTypesResp,
  FetchPersonInfoResponse,
  FindBookingsResp,
  FindByFiscalCodeResponse,
  FindPrescriptionResponse,
  HealthcareUnit,
  IConsent,
  INationItem,
  LockResponse,
  Physician,
  Service,
  SummaryBookingHero,
} from './model';

export const featureKey = 'bookingHeroState';

export interface State {
  activeStep: string;
  findByFiscalCodeResp: FindByFiscalCodeResponse | null;
  findByFiscalCodeLoading: boolean;
  findByFiscalCodeError: boolean;
  findPrescriptionResp: FindPrescriptionResponse | null;
  findPrescriptionLoading: boolean;
  findPrescriptionError: boolean;
  provincesList: string[];
  provincesListLoading: boolean;
  provincesListError: boolean;
  citiesList: string[];
  citiesListLoading: boolean;
  citiesListError: boolean;
  healthcareUnits: HealthcareUnit[];
  healthcareUnitsLoading: boolean;
  healthcareUnitsError: boolean;
  initBookingFromMissingDataResp: FindPrescriptionResponse | null;
  initBookingFromMissingDataLoading: boolean;
  initBookingFromMissingDataError: boolean;
  availableDaysResponse: AvailableDay[] | null;
  availableDaysResponseLoading: boolean;
  availableDaysResponseError: boolean;
  availableAppointments: Availability[] | null;
  availableAppointmentsLoading: boolean;
  availableAppointmentsError: boolean;
  lockAppointment: LockResponse | null;
  lockAppointmentLoading: boolean;
  lockAppointmentError: boolean;
  lockDateToExpireResp: number | null;
  lockDateToExpireLoading: boolean;
  lockDateToExpireError: boolean;
  bookAppointment: BookResponse | null;
  bookAppointmentLoading: boolean;
  bookAppointmentError: boolean;
  summary: SummaryBookingHero | null;
  serviceList: Service[] | null;
  serviceListLoading: boolean;
  serviceListError: boolean;
  physicianList: Physician[] | null;
  physicianListLoading: boolean;
  physicianListError: boolean;
  createSessionResp: CreateSessionResponse | null;
  createSessionRespLoading: boolean;
  createSessionRespError: boolean;

  delegaTypes: DelegaTypesResp | null;
  delegaTypesLoading: boolean;
  delegaTypesError: boolean;

  nations: INationItem[] | null;
  nationsLoading: boolean;
  nationsError: boolean;

  consents: IConsent[] | null;
  consentsLoading: boolean;
  consentsError: boolean;

  personInfo: FetchPersonInfoResponse | null;
  personInfoLoading: boolean;
  personInfoError: boolean;

  initThirdBooking: FindPrescriptionResponse | null;
  initThirdBookingLoading: boolean;
  initThirdBookingError: boolean;

  createThirdyPartSessionResp: CreateSessionResponse | null;
  createThirdyPartSessionLoading: boolean;
  createThirdyPartSessionError: boolean;

  restartLpResp: CreateSessionResponse | null;
  restartLpLoading: boolean;
  restartLpError: boolean;
  memo: any; //print, email, calendar
  memoLoading: boolean;
  memoError: boolean;

  //-----list & manage booking
  bookingByNre: FindBookingsResp | null;
  bookingByNreLoading: boolean;
  bookingByNreError: boolean;
  bookingsList: FindBookingsResp | null;
  bookingsListLoading: boolean;
  bookingsListError: boolean;
  cancelAppointmentResp: any;
  cancelAppointmentLoading: boolean;
  cancelAppointmentError: boolean;
}

export const initialState: State = {
  activeStep: 'selectBookingType',
  findByFiscalCodeResp: null,
  findByFiscalCodeLoading: false,
  findByFiscalCodeError: false,
  findPrescriptionResp: null,
  findPrescriptionLoading: false,
  findPrescriptionError: false,
  provincesList: [],
  provincesListLoading: false,
  provincesListError: false,
  citiesList: [],
  citiesListLoading: false,
  citiesListError: false,
  healthcareUnits: [],
  healthcareUnitsLoading: false,
  healthcareUnitsError: false,
  initBookingFromMissingDataResp: null,
  initBookingFromMissingDataLoading: false,
  initBookingFromMissingDataError: false,
  availableDaysResponse: null,
  availableDaysResponseLoading: false,
  availableDaysResponseError: false,
  availableAppointments: null,
  availableAppointmentsLoading: false,
  availableAppointmentsError: false,
  lockAppointment: null,
  lockAppointmentLoading: false,
  lockAppointmentError: false,
  lockDateToExpireResp: null,
  lockDateToExpireLoading: false,
  lockDateToExpireError: false,
  bookAppointment: null,
  bookAppointmentLoading: false,
  bookAppointmentError: false,
  summary: null,
  serviceList: null,
  serviceListLoading: false,
  serviceListError: false,
  physicianList: null,
  physicianListLoading: false,
  physicianListError: false,
  createSessionResp: null,
  createSessionRespLoading: false,
  createSessionRespError: false,

  delegaTypes: null,
  delegaTypesLoading: false,
  delegaTypesError: false,

  nations: null,
  nationsLoading: false,
  nationsError: false,

  consents: null,
  consentsLoading: false,
  consentsError: false,

  personInfo: null,
  personInfoLoading: false,
  personInfoError: false,
  initThirdBooking: null,
  initThirdBookingLoading: false,
  initThirdBookingError: false,
  createThirdyPartSessionResp: null,
  createThirdyPartSessionLoading: false,
  createThirdyPartSessionError: false,

  restartLpResp: null,
  restartLpLoading: false,
  restartLpError: false,
  memo: null, //print, email, calendar
  memoLoading: false,
  memoError: false,

  bookingByNre: null,
  bookingByNreLoading: false,
  bookingByNreError: false,
  bookingsList: null,
  bookingsListLoading: false,
  bookingsListError: false,
  cancelAppointmentResp: null,
  cancelAppointmentLoading: false,
  cancelAppointmentError: false,
};

export const reducer = createReducer(
  initialState,
  on(BookingHeroActions.setActiveStep, (state, action) => ({
    ...state,
    activeStep: action.step,
  })),

  on(BookingHeroActions.findByFiscalCode, (state) => ({
    ...state,
    findByFiscalCodeLoading: true,
  })),
  on(BookingHeroActions.findByFiscalCodeSuccess, (state, action) => ({
    ...state,
    findByFiscalCodeResp: action.data,
    findByFiscalCodeLoading: false,
  })),
  on(BookingHeroActions.findByFiscalCodeFailure, (state) => ({
    ...state,
    findByFiscalCodeLoading: false,
    findByFiscalCodeError: true,
  })),

  on(BookingHeroActions.findPrescription, (state) => ({
    ...state,
    findPrescriptionLoading: true,
  })),
  on(BookingHeroActions.findPrescriptionSuccess, (state, action) => ({
    ...state,
    findPrescriptionResp: action.data,
    findPrescriptionLoading: false,
  })),
  on(BookingHeroActions.findPrescriptionFailure, (state) => ({
    ...state,
    findPrescriptionLoading: false,
    findPrescriptionError: true,
  })),

  on(BookingHeroActions.createSession, (state) => ({
    ...state,
    createSessionRespLoading: true,
  })),
  on(BookingHeroActions.createSessionSuccess, (state, action) => ({
    ...state,
    createSessionResp: action.data,
    createSessionRespLoading: false,
  })),
  on(BookingHeroActions.createSessionFailure, (state) => ({
    ...state,
    createSessionRespLoading: false,
    createSessionRespError: true,
  })),

  on(BookingHeroActions.fetchProvincesList, (state) => ({
    ...state,
    provincesListLoading: true,
  })),
  on(BookingHeroActions.fetchProvincesListSuccess, (state, action) => ({
    ...state,
    provincesList: action.data,
    provincesListLoading: false,
  })),
  on(BookingHeroActions.fetchProvincesListFailure, (state) => ({
    ...state,
    provincesListLoading: false,
    provincesListError: true,
  })),

  on(BookingHeroActions.fetchCitiesList, (state) => ({
    ...state,
    citiesListLoading: true,
  })),
  on(BookingHeroActions.fetchCitiesListSuccess, (state, action) => ({
    ...state,
    citiesList: action.data,
    citiesListLoading: false,
  })),
  on(BookingHeroActions.fetchCitiesListFailure, (state) => ({
    ...state,
    citiesListLoading: false,
    citiesListError: true,
  })),

  on(BookingHeroActions.fetchHealthcareUnits, (state) => ({
    ...state,
    healthcareUnitsLoading: true,
  })),
  on(BookingHeroActions.fetchHealthcareUnitsSuccess, (state, action) => ({
    ...state,
    healthcareUnits: action.data,
    healthcareUnitsLoading: false,
  })),
  on(BookingHeroActions.fetchHealthcareUnitsFailure, (state) => ({
    ...state,
    healthcareUnitsLoading: false,
    healthcareUnitsError: true,
  })),

  on(BookingHeroActions.initBookingFromMissingData, (state) => ({
    ...state,
    initBookingFromMissingDataLoading: true,
  })),
  on(BookingHeroActions.initBookingFromMissingDataSuccess, (state, action) => ({
    ...state,
    initBookingFromMissingDataResp: action.data,
    initBookingFromMissingDataLoading: false,
  })),
  on(BookingHeroActions.initBookingFromMissingDataFailure, (state) => ({
    ...state,
    initBookingFromMissingDataLoading: false,
    initBookingFromMissingDataError: true,
  })),

  on(BookingHeroActions.fetchAvailableDays, (state) => ({
    ...state,
    availableDaysResponseLoading: true,
  })),
  on(BookingHeroActions.fetchAvailableDaysSuccess, (state, action) => ({
    ...state,
    availableDaysResponse: action.data,
    availableDaysResponseLoading: false,
  })),
  on(BookingHeroActions.fetchAvailableDaysFailure, (state) => ({
    ...state,
    availableDaysResponseLoading: false,
    availableDaysResponseError: true,
  })),

  on(BookingHeroActions.fetchAvailableAppointments, (state) => ({
    ...state,
    availableAppointmentsLoading: true,
  })),
  on(BookingHeroActions.fetchAvailableAppointmentsSuccess, (state, action) => ({
    ...state,
    availableAppointments: action.data,
    availableAppointmentsLoading: false,
  })),
  on(BookingHeroActions.fetchAvailableAppointmentsFailure, (state) => ({
    ...state,
    availableAppointmentsLoading: false,
    availableAppointmentsError: true,
  })),

  on(BookingHeroActions.lockAppointment, (state) => ({
    ...state,
    lockAppointmentLoading: true,
  })),
  on(BookingHeroActions.lockAppointmentSuccess, (state, action) => ({
    ...state,
    lockAppointment: action.data,
    lockAppointmentLoading: false,
  })),
  on(BookingHeroActions.lockAppointmentFailure, (state) => ({
    ...state,
    lockAppointmentLoading: false,
    lockAppointmentError: true,
  })),

  on(BookingHeroActions.lockDateToExpire, (state) => ({
    ...state,
    lockDateToExpireLoading: true,
  })),
  on(BookingHeroActions.lockDateToExpireSuccess, (state, action) => ({
    ...state,
    lockDateToExpireResp: action.data,
    lockDateToExpireLoading: false,
  })),
  on(BookingHeroActions.lockDateToExpireFailure, (state) => ({
    ...state,
    lockDateToExpireLoading: false,
    lockDateToExpireError: true,
  })),

  on(BookingHeroActions.bookAppointment, (state) => ({
    ...state,
    bookAppointmentLoading: true,
  })),
  on(BookingHeroActions.bookAppointmentSuccess, (state, action) => ({
    ...state,
    bookAppointment: action.data,
    bookAppointmentLoading: false,
  })),
  on(BookingHeroActions.bookAppointmentFailure, (state) => ({
    ...state,
    bookAppointmentLoading: false,
    bookAppointmentError: true,
  })),

  on(BookingHeroActions.setSummaryBooking, (state, action) => ({
    ...state,
    summary: action.payload,
  })),

  on(BookingHeroActions.fetchServiceList, (state) => ({
    ...state,
    serviceListLoading: true,
  })),
  on(BookingHeroActions.fetchServiceListSuccess, (state, action) => ({
    ...state,
    serviceList: action.data,
    serviceListLoading: false,
  })),
  on(BookingHeroActions.fetchServiceListFailure, (state) => ({
    ...state,
    serviceListLoading: false,
    serviceListError: true,
  })),

  on(BookingHeroActions.fetchPhysicianByService, (state) => ({
    ...state,
    physicianListLoading: true,
  })),
  on(BookingHeroActions.fetchPhysicianByServiceSuccess, (state, action) => ({
    ...state,
    physicianList: action.data,
    physicianListLoading: false,
  })),
  on(BookingHeroActions.fetchPhysicianByServiceFailure, (state) => ({
    ...state,
    physicianListLoading: false,
    physicianListError: true,
  })),

  on(BookingHeroActions.fetchDelegaTypesList, (state) => ({
    ...state,
    delegaTypesLoading: true,
  })),
  on(BookingHeroActions.fetchDelegaTypesListSuccess, (state, action) => ({
    ...state,
    delegaTypes: action.data,
    delegaTypesLoading: false,
  })),
  on(BookingHeroActions.fetchDelegaTypesListFailure, (state) => ({
    ...state,
    delegaTypesLoading: false,
    delegaTypesError: true,
  })),

  on(BookingHeroActions.fetchNations, (state) => ({
    ...state,
    nationsLoading: true,
  })),
  on(BookingHeroActions.fetchNationsSuccess, (state, action) => ({
    ...state,
    nations: action.data,
    nationsLoading: false,
  })),
  on(BookingHeroActions.fetchNationsFailure, (state) => ({
    ...state,
    nationsLoading: false,
    nationsError: true,
  })),

  on(BookingHeroActions.fetchConsents, (state) => ({
    ...state,
    consentsLoading: true,
  })),
  on(BookingHeroActions.fetchConsentsSuccess, (state, action) => ({
    ...state,
    consents: action.data,
    consentsLoading: false,
  })),
  on(BookingHeroActions.fetchConsentsFailure, (state) => ({
    ...state,
    consentsLoading: false,
    consentsError: true,
  })),

  on(BookingHeroActions.fetchPersonInfo, (state) => ({
    ...state,
    personInfoLoading: true,
  })),
  on(BookingHeroActions.fetchPersonInfoSuccess, (state, action) => ({
    ...state,
    personInfo: action.data,
    personInfoLoading: false,
  })),
  on(BookingHeroActions.fetchPersonInfoFailure, (state) => ({
    ...state,
    personInfoLoading: false,
    personInfoError: true,
  })),

  on(BookingHeroActions.initThirdBooking, (state) => ({
    ...state,
    initThirdBookingLoading: true,
  })),
  on(BookingHeroActions.initThirdBookingSuccess, (state, action) => ({
    ...state,
    initThirdBooking: action.data,
    initThirdBookingLoading: false,
  })),
  on(BookingHeroActions.initThirdBookingFailure, (state) => ({
    ...state,
    initThirdBookingLoading: false,
    initThirdBookingError: true,
  })),

  on(BookingHeroActions.createThirdyPartSession, (state) => ({
    ...state,
    createThirdyPartSessionLoading: true,
  })),
  on(BookingHeroActions.createThirdyPartSessionSuccess, (state, action) => ({
    ...state,
    createThirdyPartSessionResp: action.data,
    createThirdyPartSessionLoading: false,
  })),
  on(BookingHeroActions.createThirdyPartSessionFailure, (state) => ({
    ...state,
    createThirdyPartSessionLoading: false,
    createThirdyPartSessionError: true,
  })),

  on(BookingHeroActions.restartLp, (state) => ({
    ...state,
    restartLpLoading: true,
  })),
  on(BookingHeroActions.restartLpSuccess, (state, action) => ({
    ...state,
    restartLpResp: action.data,
    restartLpLoading: false,
  })),
  on(BookingHeroActions.restartLpFailure, (state) => ({
    ...state,
    restartLpLoading: false,
    restartLpError: true,
  })),

  on(BookingHeroActions.printMemo, (state) => ({
    ...state,
    memoLoading: true,
  })),
  on(BookingHeroActions.printMemoSuccess, (state, action) => ({
    ...state,
    memo: action.data,
    memoLoading: false,
  })),
  on(BookingHeroActions.printMemoFailure, (state) => ({
    ...state,
    memoLoading: false,
    memoError: true,
  })),

  on(BookingHeroActions.sendEmailNotification, (state) => ({
    ...state,
    memoLoading: true,
  })),
  on(BookingHeroActions.sendEmailNotificationSuccess, (state, action) => ({
    ...state,
    memo: action.data,
    memoLoading: false,
  })),
  on(BookingHeroActions.sendEmailNotificationFailure, (state) => ({
    ...state,
    memoLoading: false,
    memoError: true,
  })),

  on(BookingHeroActions.addToCalendar, (state) => ({
    ...state,
    memoLoading: true,
  })),
  on(BookingHeroActions.addToCalendarSuccess, (state, action) => ({
    ...state,
    memo: action.data,
    memoLoading: false,
  })),
  on(BookingHeroActions.addToCalendarFailure, (state) => ({
    ...state,
    memoLoading: false,
    memoError: true,
  })),

  on(BookingHeroActions.fetchBookingByNre, (state) => ({
    ...state,
    bookingByNreLoading: true,
  })),
  on(BookingHeroActions.fetchBookingByNreSuccess, (state, action) => ({
    ...state,
    bookingByNre: action.data,
    bookingByNreLoading: false,
  })),
  on(BookingHeroActions.fetchBookingByNreFailure, (state) => ({
    ...state,
    bookingByNreLoading: false,
    bookingByNreError: true,
  })),

  on(BookingHeroActions.fetchBookingsList, (state) => ({
    ...state,
    bookingsListLoading: true,
  })),
  on(BookingHeroActions.fetchBookingsListSuccess, (state, action) => ({
    ...state,
    bookingsList: action.data,
    bookingsListLoading: false,
  })),
  on(BookingHeroActions.fetchBookingsListFailure, (state) => ({
    ...state,
    bookingsListLoading: false,
    bookingsListError: true,
  })),

  on(BookingHeroActions.cancelAppointment, (state) => ({
    ...state,
    cancelAppointmentLoading: true,
  })),
  on(BookingHeroActions.cancelAppointmentSuccess, (state, action) => ({
    ...state,
    cancelAppointmentResp: action.data,
    cancelAppointmentLoading: false,
  })),
  on(BookingHeroActions.cancelAppointmentFailure, (state) => ({
    ...state,
    cancelAppointmentLoading: false,
    cancelAppointmentError: true,
  })),

  on(BookingHeroActions.fetchAvailableDaysForRescheduleAppointment, (state) => ({
    ...state,
    availableDaysResponseLoading: true,
  })),
  on(BookingHeroActions.fetchAvailableDaysForRescheduleAppointmentSuccess, (state, action) => ({
    ...state,
    availableDaysResponse: action.data,
    availableDaysResponseLoading: false,
  })),
  on(BookingHeroActions.fetchAvailableDaysForRescheduleAppointmentFailure, (state) => ({
    ...state,
    availableDaysResponseLoading: false,
    availableDaysResponseError: true,
  })),
  on(BookingHeroActions.moveAppointment, (state) => ({
    ...state,
    bookAppointmentLoading: true,
  })),
  on(BookingHeroActions.moveAppointmentSuccess, (state, action) => ({
    ...state,
    bookAppointment: action.data,
    bookAppointmentLoading: false,
  })),
  on(BookingHeroActions.moveAppointmentFailure, (state) => ({
    ...state,
    bookAppointmentLoading: false,
    bookAppointmentError: true,
  })),
);
