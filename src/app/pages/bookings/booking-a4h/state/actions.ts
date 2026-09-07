import { createAction, props } from '@ngrx/store';
import {
  BookAppointmentResponse,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  CheckAvailableDays,
  CreateSessionResponse,
  FindByNrePayload,
  FindPayload,
  IDoctor,
  LockAppointmentPayload,
  LockAppointmentResponse,
  MedicalService,
  NreInfo,
  PrescriptionSession,
} from './model';
import { BookingType } from '../models/booking-type';
import { State } from './reducer';

/** Sets which flow is active and resets the shared state for a fresh run. */
export const initBooking = createAction(
  '[BookingUnified] Init Booking',
  props<{ bookingType: BookingType }>(),
);

export const findPrescriptionByNre = createAction(
  '[BookingUnified] Find Prescription By Nre',
  props<{ payload: FindByNrePayload }>(),
);
export const findPrescriptionByNreSuccess = createAction(
  '[BookingUnified] Find Prescription By Nre Success',
  props<{ data: PrescriptionSession }>(),
);
export const findPrescriptionByNreFailure = createAction(
  '[BookingUnified] Find Prescription By Nre Failure',
  props<{ error: any }>(),
);

export const setNreInfo = createAction(
  '[BookingUnified] Set NreInfo',
  props<{ nreInfo: NreInfo }>(),
);

/** `filter` is either a bookingFlow code (e.g. 'LP') or a physicianId. */
export const getServicesList = createAction(
  '[BookingUnified] Get Services List',
  props<{ filter: string; advanceStepOnLoad?: boolean }>(),
);
export const getServicesListSuccess = createAction(
  '[BookingUnified] Get Services List Success',
  props<{ data: MedicalService[] }>(),
);
export const getServicesListFailure = createAction(
  '[BookingUnified] Get Services List Failure',
  props<{ error: any }>(),
);

export const setServicesVisibility = createAction('[BookingUnified] Set Services Visibility');

export const addMedicalService = createAction(
  '[BookingUnified] Add Medical Service',
  props<{ id: string }>(),
);
export const removeMedicalService = createAction(
  '[BookingUnified] Remove Medical Service',
  props<{ id: string }>(),
);
export const resetMedicalService = createAction('[BookingUnified] Reset Medical Service');

/** No `serviceIds` loads the full directory (physicians flow). */
export const getDoctorsList = createAction(
  '[BookingUnified] Get Doctors List',
  props<{ serviceIds?: string[]; advanceStepOnLoad?: boolean }>(),
);
export const getDoctorsListSuccess = createAction(
  '[BookingUnified] Get Doctors List Success',
  props<{ data: IDoctor[] }>(),
);
export const getDoctorsListFailure = createAction(
  '[BookingUnified] Get Doctors List Failure',
  props<{ error: any }>(),
);

export const setSelectedDoctor = createAction(
  '[BookingUnified] Set Selected Doctor',
  props<{ physician: IDoctor }>(),
);

export const createSession = createAction(
  '[BookingUnified] Create Session',
  props<{ payload: { serviceIds: string[] } }>(),
);
export const createSessionSuccess = createAction(
  '[BookingUnified] Create Session Success',
  props<{ data: CreateSessionResponse }>(),
);
export const createSessionFailure = createAction(
  '[BookingUnified] Create Session Failure',
  props<{ error: any }>(),
);

export const findForAvailableDays = createAction(
  '[BookingUnified] FindForAvailableDays',
  props<{ payload: FindPayload }>(),
);
export const findForAvailableDaysSuccess = createAction(
  '[BookingUnified] FindForAvailableDaysSuccess',
  props<{ data: CreateSessionResponse }>(),
);
export const findForAvailableDaysFailure = createAction(
  '[BookingUnified] FindForAvailableDaysFailure',
  props<{ error: any }>(),
);

export const checkAvailableDays = createAction(
  '[BookingUnified] CheckAvailableDays',
  props<{ sessionId: string }>(),
);
export const checkAvailableDaysSuccess = createAction(
  '[BookingUnified] CheckAvailableDaysSuccess',
  props<{ data: CheckAvailableDays }>(),
);
export const checkAvailableDaysFailure = createAction(
  '[BookingUnified] CheckAvailableDaysFailure',
  props<{ error: any }>(),
);

export const setActiveStep = createAction(
  '[BookingUnified] SetActiveStep',
  props<{ step: number }>(),
);

export const setIsOptimized = createAction(
  '[BookingUnified] SetIsOptimized',
  props<{ isOptimized: boolean }>(),
);

export const lockAppointment = createAction(
  '[BookingUnified] LockAppointment',
  props<{ payload: LockAppointmentPayload }>(),
);
export const lockAppointmentSuccess = createAction(
  '[BookingUnified] LockAppointmentSuccess',
  props<{ data: LockAppointmentResponse }>(),
);
export const lockAppointmentFailure = createAction(
  '[BookingUnified] LockAppointmentFailure',
  props<{ error: any }>(),
);

export const bookAppointment = createAction(
  '[BookingUnified] BookAppointment',
  props<{ payload: LockAppointmentPayload }>(),
);
export const bookAppointmentSuccess = createAction(
  '[BookingUnified] BookAppointmentSuccess',
  props<{ data: BookAppointmentResponse }>(),
);
export const bookAppointmentFailure = createAction(
  '[BookingUnified] BookAppointmentFailure',
  props<{ error: any }>(),
);

export const checkAvailability = createAction(
  '[BookingUnified] CheckAvailability',
  props<{ payload: CheckAvailabilityPayload }>(),
);
export const checkAvailabilitySuccess = createAction(
  '[BookingUnified] CheckAvailabilitySuccess',
  props<{ data: CheckAvailabilityResponse }>(),
);
export const checkAvailabilityFailure = createAction(
  '[BookingUnified] CheckAvailabilityFailure',
  props<{ error: any }>(),
);

export const getHealthCareUnit = createAction('[BookingUnified] GetHealthCareUnit');
export const getHealthCareUnitSuccess = createAction(
  '[BookingUnified] GetHealthCareUnitSuccess',
  props<{ data: any }>(),
);
export const getHealthCareUnitFailure = createAction(
  '[BookingUnified] GetHealthCareUnitFailure',
  props<{ error: any }>(),
);

export const setAvailableListToBook = createAction(
  '[BookingUnified] SetAvailableListToBook',
  props<{ payload: any }>(),
);

export const mergePdfByUrls = createAction(
  '[BookingUnified] MergePdfByUrls',
  props<{ payload: { filename: string; urlList: string[] } }>(),
);
export const mergePdfByUrlsSuccess = createAction(
  '[BookingUnified] MergePdfByUrlsSuccess',
  props<{ data: any }>(),
);
export const mergePdfByUrlsFailure = createAction(
  '[BookingUnified] MergePdfByUrlsFailure',
  props<{ error: any }>(),
);

export const releaseLockBookingSession = createAction(
  '[BookingUnified] ReleaseLockBookingSession',
  props<{ payload: LockAppointmentPayload }>(),
);
export const releaseLockBookingSessionSuccess = createAction(
  '[BookingUnified] ReleaseLockBookingSessionSuccess',
  props<{ data: any }>(),
);
export const releaseLockBookingSessionFailure = createAction(
  '[BookingUnified] ReleaseLockBookingSessionFailure',
  props<{ error: any }>(),
);

export const resetState = createAction('[BookingUnified] ResetState');

export const restoreStateFromLocalStorage = createAction(
  '[BookingUnified] RestoreStateFromLocalStorage',
  props<{ state: State }>(),
);
