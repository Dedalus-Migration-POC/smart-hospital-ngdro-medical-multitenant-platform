import { createAction, props } from '@ngrx/store';
import {
  Availability,
  AvailableDay,
  AvailableDaysPayload,
  BookResponse,
  CreateSessionResponse,
  CreateSessionWithAddressPayload,
  CreateThirdyPartSessionPayload,
  DelegaTypesResp,
  FetchPersonInfoResponse,
  FindBookingsResp,
  FindByFiscalCodePayload,
  FindByFiscalCodeResponse,
  FindPrescriptionResponse,
  HealthcareUnit,
  IConsent,
  IConsentsToUpdate,
  INationItem,
  InitBookingFromMissingDataPayload,
  InitThirdBookingPayload,
  LockPayload,
  LockResponse,
  MemoPayload,
  MoveAppointmentPayload,
  Physician,
  RescheduleAppointmentPayload,
  Service,
  SummaryBookingHero,
} from './model';
// import { CardMultiUseConfig } from 'src/app/components/card/card.model'

export const setActiveStep = createAction(
  '[BookingsHero] Set Active Step',
  props<{ step: string }>(),
);

export const findByFiscalCode = createAction(
  '[BookingsHero] Find By FiscalCode',
  props<{ payload: FindByFiscalCodePayload }>(),
);
export const findByFiscalCodeSuccess = createAction(
  '[BookingsHero] Find By FiscalCode Success',
  props<{ data: FindByFiscalCodeResponse | null }>(),
);
export const findByFiscalCodeFailure = createAction(
  '[BookingsHero] Find By FiscalCode Failure',
  props<{ error: any }>(),
);

export const fetchPersonInfo = createAction(
  '[BookingsHero] Fetch PersonInfo',
  props<{ payload: FindByFiscalCodePayload }>(),
);
export const fetchPersonInfoSuccess = createAction(
  '[BookingsHero] Fetch PersonInfo Success',
  props<{ data: FetchPersonInfoResponse | null }>(),
);
export const fetchPersonInfoFailure = createAction(
  '[BookingsHero] Fetch PersonInfo Failure',
  props<{ error: any }>(),
);

export const findPrescription = createAction(
  '[BookingsHero] Find Prescription',
  props<{ payload: FindByFiscalCodePayload }>(),
);
export const findPrescriptionSuccess = createAction(
  '[BookingsHero] Find Prescription Success',
  props<{ data: FindPrescriptionResponse }>(),
);
export const findPrescriptionFailure = createAction(
  '[BookingsHero] Find Prescription Failure',
  props<{ error: any }>(),
);

export const createSession = createAction(
  '[BookingsHero] Create Session',
  props<{ serviceIds: string[] }>(),
);
export const createSessionSuccess = createAction(
  '[BookingsHero] Create Session Success',
  props<{ data: CreateSessionResponse }>(),
);
export const createSessionFailure = createAction(
  '[BookingsHero] Create Session Failure',
  props<{ error: any }>(),
);

export const createSessionWithAddress = createAction(
  '[BookingsHero] Create Session With Address',
  props<{ payload: CreateSessionWithAddressPayload }>(),
);
export const createSessionWithAddressSuccess = createAction(
  '[BookingsHero] Create Session With Address Success',
  props<{ data: CreateSessionResponse }>(),
);
export const createSessionWithAddressFailure = createAction(
  '[BookingsHero] Create Session With Address Failure',
  props<{ error: any }>(),
);

export const fetchProvincesList = createAction('[BookingsHero] Fetch ProvincesList');
export const fetchProvincesListSuccess = createAction(
  '[BookingsHero] Fetch ProvincesList Success',
  props<{ data: string[] }>(),
);
export const fetchProvincesListFailure = createAction(
  '[BookingsHero] Fetch ProvincesList Failure',
  props<{ error: any }>(),
);

export const fetchCitiesList = createAction(
  '[BookingsHero] Fetch CitiesList',
  props<{ province: string }>(),
);
export const fetchCitiesListSuccess = createAction(
  '[BookingsHero] Fetch CitiesList Success',
  props<{ data: string[] }>(),
);
export const fetchCitiesListFailure = createAction(
  '[BookingsHero] Fetch CitiesList Failure',
  props<{ error: any }>(),
);

export const fetchHealthcareUnits = createAction('[BookingsHero] Fetch HealthcareUnits');
export const fetchHealthcareUnitsSuccess = createAction(
  '[BookingsHero] Fetch HealthcareUnits Success',
  props<{ data: HealthcareUnit[] }>(),
);
export const fetchHealthcareUnitsFailure = createAction(
  '[BookingsHero] Fetch HealthcareUnits Failure',
  props<{ error: any }>(),
);

export const initBookingFromMissingData = createAction(
  '[BookingsHero] Init Booking From MissingData',
  props<{ payload: InitBookingFromMissingDataPayload }>(),
);
export const initBookingFromMissingDataSuccess = createAction(
  '[BookingsHero] Init Booking From MissingData Success',
  props<{ data: FindPrescriptionResponse }>(),
);
export const initBookingFromMissingDataFailure = createAction(
  '[BookingsHero] Init Booking From MissingData Failure',
  props<{ error: any }>(),
);

export const fetchAvailableDays = createAction(
  '[BookingsHero] Fetch AvailableDays',
  props<{ payload: AvailableDaysPayload }>(),
);
export const fetchAvailableDaysSuccess = createAction(
  '[BookingsHero] Fetch AvailableDays Success',
  props<{ data: AvailableDay[] }>(),
);
export const fetchAvailableDaysFailure = createAction(
  '[BookingsHero] Fetch AvailableDays Failure',
  props<{ error: any }>(),
);

export const fetchAvailableAppointments = createAction(
  '[BookingsHero] Fetch AvailableAppointments',
  props<{ payload: AvailableDaysPayload; useCheck?: boolean }>(),
);
export const fetchAvailableAppointmentsSuccess = createAction(
  '[BookingsHero] Fetch AvailableAppointments Success',
  props<{ data: Availability[] }>(),
);
export const fetchAvailableAppointmentsFailure = createAction(
  '[BookingsHero] Fetch AvailableAppointments Failure',
  props<{ error: any }>(),
);

export const lockAppointment = createAction(
  '[BookingsHero] Lock Appointment',
  props<{ payload: LockPayload }>(),
);
export const lockAppointmentSuccess = createAction(
  '[BookingsHero] Lock Appointment Success',
  props<{ data: LockResponse }>(),
);
export const lockAppointmentFailure = createAction(
  '[BookingsHero] Lock Appointment Failure',
  props<{ error: any }>(),
);

export const lockDateToExpire = createAction(
  '[BookingsHero] Lock DateToExpire',
  props<{ sessionId: string }>(),
);
export const lockDateToExpireSuccess = createAction(
  '[BookingsHero] Lock DateToExpire Success',
  props<{ data: number }>(),
);
export const lockDateToExpireFailure = createAction(
  '[BookingsHero] Lock DateToExpire Failure',
  props<{ error: any }>(),
);

export const bookAppointment = createAction(
  '[BookingsHero] Book Appointment',
  props<{ sessionId: string }>(),
);
export const bookAppointmentSuccess = createAction(
  '[BookingsHero] Book Appointment Success',
  props<{ data: BookResponse }>(),
);
export const bookAppointmentFailure = createAction(
  '[BookingsHero] Book Appointment Failure',
  props<{ error: any }>(),
);

export const setSummaryBooking = createAction(
  '[BookingsHero] Set Summary Booking',
  props<{ payload: SummaryBookingHero | null }>(),
);

export const fetchServiceList = createAction(
  '[BookingsHero] Fetch ServiceList',
  props<{ serviceName: string }>(),
);
export const fetchServiceListSuccess = createAction(
  '[BookingsHero] Fetch ServiceList Success',
  props<{ data: Service[] }>(),
);
export const fetchServiceListFailure = createAction(
  '[BookingsHero] Fetch ServiceList Failure',
  props<{ error: any }>(),
);

export const fetchPhysicianByService = createAction(
  '[BookingsHero] Fetch PhysicianByService',
  props<{ serviceId: string }>(),
);
export const fetchPhysicianByServiceSuccess = createAction(
  '[BookingsHero] Fetch PhysicianByService Success',
  props<{ data: Physician[] }>(),
);
export const fetchPhysicianByServiceFailure = createAction(
  '[BookingsHero] Fetch PhysicianByService Failure',
  props<{ error: any }>(),
);

export const fetchDelegaTypesList = createAction('[BookingsHero] Fetch DelegaTypesList');
export const fetchDelegaTypesListSuccess = createAction(
  '[BookingsHero] Fetch DelegaTypesList Success',
  props<{ data: DelegaTypesResp }>(),
);
export const fetchDelegaTypesListFailure = createAction(
  '[BookingsHero] Fetch DelegaTypesList Failure',
  props<{ error: any }>(),
);

export const fetchNations = createAction('[BookingsHero] Fetch Nations');
export const fetchNationsSuccess = createAction(
  '[BookingsHero] Fetch Nations Success',
  props<{ data: INationItem[] }>(),
);
export const fetchNationsFailure = createAction(
  '[BookingsHero] Fetch Nations Failure',
  props<{ error: any }>(),
);

export const fetchConsents = createAction('[BookingsHero] Fetch Consents');
export const fetchConsentsSuccess = createAction(
  '[BookingsHero] Fetch Consents Success',
  props<{ data: IConsent[] }>(),
);
export const fetchConsentsFailure = createAction(
  '[BookingsHero] Fetch Consents Failure',
  props<{ error: any }>(),
);

export const updateConsents = createAction(
  '[BookingsHero] Update Consents',
  props<{ payload: IConsentsToUpdate }>(),
);
export const updateConsentsSuccess = createAction('[BookingsHero] Update Consents Success');
export const updateConsentsFailure = createAction(
  '[BookingsHero] Update Consents Failure',
  props<{ error: any }>(),
);

export const initThirdBooking = createAction(
  '[BookingsHero] Init ThirdBooking',
  props<{ payload: InitThirdBookingPayload }>(),
);
export const initThirdBookingSuccess = createAction(
  '[BookingsHero] Init ThirdBooking Success',
  props<{ data: FindPrescriptionResponse }>(),
);
export const initThirdBookingFailure = createAction(
  '[BookingsHero] Init ThirdBooking Failure',
  props<{ error: any }>(),
);

export const createThirdyPartSession = createAction(
  '[BookingsHero] Create ThirdyPartSession',
  props<{ payload: CreateThirdyPartSessionPayload }>(),
);
export const createThirdyPartSessionSuccess = createAction(
  '[BookingsHero] Create ThirdyPartSession Success',
  props<{ data: CreateSessionResponse }>(),
);
export const createThirdyPartSessionFailure = createAction(
  '[BookingsHero] Create ThirdyPartSession Failure',
  props<{ error: any }>(),
);

export const restartLp = createAction('[BookingsHero] RestartLp', props<{ sessionId: string }>());
export const restartLpSuccess = createAction(
  '[BookingsHero] RestartLp Success',
  props<{ data: CreateSessionResponse }>(),
);
export const restartLpFailure = createAction(
  '[BookingsHero] RestartLp Failure',
  props<{ error: any }>(),
);

export const unlockSession = createAction(
  '[BookingsHero] Unlock Session',
  props<{ sessionId: string }>(),
);
export const unlockSessionSuccess = createAction('[BookingsHero] Unlock Session Success');
export const unlockSessionFailure = createAction(
  '[BookingsHero] Unlock Session Failure',
  props<{ error: any }>(),
);

export const printMemo = createAction(
  '[BookingsHero] PrintMemo',
  props<{ payload: MemoPayload; isBook?: boolean }>(),
);
export const printMemoSuccess = createAction(
  '[BookingsHero] PrintMemo Success',
  props<{ data: any }>(),
);
export const printMemoFailure = createAction(
  '[BookingsHero] PrintMemo Failure',
  props<{ error: any }>(),
);

export const addToCalendar = createAction(
  '[BookingsHero] AddToCalendar',
  props<{ payload: MemoPayload }>(),
);
export const addToCalendarSuccess = createAction(
  '[BookingsHero] AddToCalendar Success',
  props<{ data: any }>(),
);
export const addToCalendarFailure = createAction(
  '[BookingsHero] AddToCalendar Failure',
  props<{ error: any }>(),
);

export const sendEmailNotification = createAction(
  '[BookingsHero] SendEmailNotification',
  props<{ payload: MemoPayload; isBook?: boolean }>(),
);
export const sendEmailNotificationSuccess = createAction(
  '[BookingsHero] SendEmailNotification Success',
  props<{ data: any }>(),
);
export const sendEmailNotificationFailure = createAction(
  '[BookingsHero] SendEmailNotification Failure',
  props<{ error: any }>(),
);

//---------list & manage booking------------

export const fetchBookingByNre = createAction(
  '[BookingsHero] Fetch BookingByNre',
  props<{ payload: FindByFiscalCodePayload }>(),
);
export const fetchBookingByNreSuccess = createAction(
  '[BookingsHero] Fetch BookingByNre Success',
  props<{ data: FindBookingsResp }>(),
);
export const fetchBookingByNreFailure = createAction(
  '[BookingsHero] Fetch BookingByNre Failure',
  props<{ error: any }>(),
);

export const fetchBookingsList = createAction('[BookingsHero] Fetch BookingsList');
export const fetchBookingsListSuccess = createAction(
  '[BookingsHero] Fetch BookingsList Success',
  props<{ data: FindBookingsResp }>(), //TODO da definire interfaccia
);
export const fetchBookingsListFailure = createAction(
  '[BookingsHero] Fetch BookingsList Failure',
  props<{ error: any }>(),
);

export const fetchCardMultiUseConfigBookingList = createAction(
  '[BookingsHero] Fetch fetchCardMultiUseConfigBookingList',
);
// export const fetchCardMultiUseConfigBookingListSuccess = createAction(
//   '[BookingsHero] Fetch fetchCardMultiUseConfigBookingListSuccess ',
//   props<{ data: CardMultiUseConfig }>(),
// )
export const fetchCardMultiUseConfigBookingListFailure = createAction(
  '[BookingsHero] Fetch fetchCardMultiUseConfigBookingListFailure',
  props<{ error: any }>(),
);

export const cancelAppointment = createAction(
  '[BookingsHero] Cancel Appointment',
  props<{ payload: MemoPayload }>(),
);
export const cancelAppointmentSuccess = createAction(
  '[BookingsHero] Cancel Appointment Success ',
  props<{ data: any }>(),
);
export const cancelAppointmentFailure = createAction(
  '[BookingsHero] Cancel Appointment Failure',
  props<{ error: any }>(),
);

export const fetchAvailableDaysForRescheduleAppointment = createAction(
  '[BookingsHero] FetchAvailableDays For RescheduleAppointment',
  props<{ payload: RescheduleAppointmentPayload }>(),
);
export const fetchAvailableDaysForRescheduleAppointmentSuccess = createAction(
  '[BookingsHero] FetchAvailableDays For RescheduleAppointment Success ',
  props<{ data: AvailableDay[] }>(),
);
export const fetchAvailableDaysForRescheduleAppointmentFailure = createAction(
  '[BookingsHero] FetchAvailableDays For RescheduleAppointment Failure',
  props<{ error: any }>(),
);

export const moveAppointment = createAction(
  '[BookingsHero] Move Appointment',
  props<{ payload: MoveAppointmentPayload }>(),
);
export const moveAppointmentSuccess = createAction(
  '[BookingsHero] Move Appointment Success ',
  props<{ data: BookResponse }>(),
);
export const moveAppointmentFailure = createAction(
  '[BookingsHero] Move Appointment Failure',
  props<{ error: any }>(),
);
