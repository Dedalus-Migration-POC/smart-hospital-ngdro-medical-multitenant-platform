import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBookingUnified from './reducer';
import { selectStruttureLoading } from './struttura/struttura.selectors';

export const selectBookingUnifiedState = createFeatureSelector<fromBookingUnified.State>(
  fromBookingUnified.featureKey,
);

export const selectBookingType = createSelector(
  selectBookingUnifiedState,
  (state) => state.bookingType,
);

export const selectNreInfo = createSelector(selectBookingUnifiedState, (state) => state.nreInfo);
export const selectFindPrescriptionByNre = createSelector(
  selectBookingUnifiedState,
  (state) => state.findPrescriptionByNreData,
);
export const selectFindPrescriptionByNreLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.findPrescriptionByNreLoading,
);
export const selectFindPrescriptionByNreError = createSelector(
  selectBookingUnifiedState,
  (state) => state.findPrescriptionByNreError,
);

export const selectDoctorsList = createSelector(
  selectBookingUnifiedState,
  (state) => state.doctorsList,
);
export const selectDoctorsListLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.doctorsListLoading,
);
export const selectDoctorsListError = createSelector(
  selectBookingUnifiedState,
  (state) => state.doctorsListError,
);
export const selectSelectedDoctor = createSelector(
  selectBookingUnifiedState,
  (state) => state.selectedDoctor,
);

export const selectServicesList = createSelector(
  selectBookingUnifiedState,
  (state) => state.servicesList,
);
export const selectServicesListLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.servicesListLoading,
);
export const selectServicesListError = createSelector(
  selectBookingUnifiedState,
  (state) => state.servicesListError,
);
export const selectServicesVisibility = createSelector(
  selectBookingUnifiedState,
  (state) => state.servicesVisibility,
);
export const selectSelectedMedicalService = createSelector(
  selectBookingUnifiedState,
  (state) => state.selectedMedicalService,
);

export const selectCreateSessionResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.createSessionResponse,
);
export const selectCreateSessionLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.createSessionLoading,
);
export const selectCreateSessionError = createSelector(
  selectBookingUnifiedState,
  (state) => state.createSessionError,
);

export const selectFindResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.findResponse,
);
export const selectFindLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.findLoading,
);
export const selectFindError = createSelector(
  selectBookingUnifiedState,
  (state) => state.findError,
);

export const selectCheckAvailableDaysResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailableDaysResponse,
);
export const selectCheckAvailableDaysLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailableDaysLoading,
);
export const selectCheckAvailableDaysError = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailableDaysError,
);

export const selectActiveStep = createSelector(
  selectBookingUnifiedState,
  (state) => state.activeStep,
);
export const selectIsOptimized = createSelector(
  selectBookingUnifiedState,
  (state) => state.isOptimized,
);

export const selectLockAppointmentResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.lockAppointmentResponse,
);
export const selectLockAppointmentLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.lockAppointmentLoading,
);
export const selectLockAppointmentError = createSelector(
  selectBookingUnifiedState,
  (state) => state.lockAppointmentError,
);
export const selectExpireOnLockAppointmentResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.lockAppointmentResponse?.expireOn,
);

export const selectBookAppointmentResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.bookAppointmentResponse,
);
export const selectBookAppointmentLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.bookAppointmentLoading,
);
export const selectBookAppointmentError = createSelector(
  selectBookingUnifiedState,
  (state) => state.bookAppointmentError,
);

export const selectCheckAvailabilityResponse = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailabilityResponse,
);
export const selectCheckAvailabilityLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailabilityLoading,
);
export const selectCheckAvailabilityError = createSelector(
  selectBookingUnifiedState,
  (state) => state.checkAvailabilityError,
);

export const selectHealthCareUnit = createSelector(
  selectBookingUnifiedState,
  (state) => state.healthCareUnit,
);
export const selectHealthCareUnitLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.healthCareUnitLoading,
);
export const selectHealthCareUnitError = createSelector(
  selectBookingUnifiedState,
  (state) => state.healthCareUnitError,
);

export const selectAvailableListToBook = createSelector(
  selectBookingUnifiedState,
  (state) => state.availableListToBook,
);

export const selectMergePdfByUrls = createSelector(
  selectBookingUnifiedState,
  (state) => state.mergePdfByUrls,
);
export const selectMergePdfByUrlsLoading = createSelector(
  selectBookingUnifiedState,
  (state) => state.mergePdfByUrlsLoading,
);
export const selectMergePdfByUrlsError = createSelector(
  selectBookingUnifiedState,
  (state) => state.mergePdfByUrlsError,
);

export const selectAppointmentToMove = createSelector(
  selectBookingUnifiedState,
  (state) => state.appointmentToMove,
);

/** True while any of the network calls the stepper depends on is in flight. */
export const selectAnyLoading = createSelector(
  selectStruttureLoading,
  selectDoctorsListLoading,
  selectCreateSessionLoading,
  selectFindLoading,
  selectCheckAvailableDaysLoading,
  selectBookAppointmentLoading,
  selectLockAppointmentLoading,
  selectCheckAvailabilityLoading,
  selectFindPrescriptionByNreLoading,
  (
    struttureLoading,
    doctorsListLoading,
    createSessionLoading,
    findLoading,
    checkAvailableDaysLoading,
    bookAppointmentLoading,
    lockAppointmentLoading,
    checkAvailabilityLoading,
    findPrescriptionByNreLoading,
  ) =>
    struttureLoading ||
    doctorsListLoading ||
    createSessionLoading ||
    findLoading ||
    checkAvailableDaysLoading ||
    bookAppointmentLoading ||
    lockAppointmentLoading ||
    checkAvailabilityLoading ||
    findPrescriptionByNreLoading,
);
