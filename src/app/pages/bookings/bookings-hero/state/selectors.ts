import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as bookingHeroState from './reducer';

export const selectBookingHeroState = createFeatureSelector<bookingHeroState.State>(
  bookingHeroState.featureKey,
);

export const selectActiveStep = createSelector(selectBookingHeroState, (state) => state.activeStep);

export const selectfindByFiscalCodeResp = createSelector(
  selectBookingHeroState,
  (state) => state.findByFiscalCodeResp,
);
export const selectfindByFiscalCodeLoading = createSelector(
  selectBookingHeroState,
  (state) => state.findByFiscalCodeLoading,
);
export const selectfindByFiscalCodeError = createSelector(
  selectBookingHeroState,
  (state) => state.findByFiscalCodeError,
);

export const selectFindPrescriptionResp = createSelector(
  selectBookingHeroState,
  (state) => state.findPrescriptionResp,
);
export const selectFindPrescriptionLoading = createSelector(
  selectBookingHeroState,
  (state) => state.findPrescriptionLoading,
);
export const selectFindPrescriptionError = createSelector(
  selectBookingHeroState,
  (state) => state.findPrescriptionError,
);

export const selectProvincesList = createSelector(
  selectBookingHeroState,
  (state) => state.provincesList,
);

export const selectProvincesListLoading = createSelector(
  selectBookingHeroState,
  (state) => state.provincesListLoading,
);
export const selectProvincesListError = createSelector(
  selectBookingHeroState,
  (state) => state.provincesListError,
);

export const selectCitiesList = createSelector(selectBookingHeroState, (state) => state.citiesList);

export const selectCitiesListLoading = createSelector(
  selectBookingHeroState,
  (state) => state.citiesListLoading,
);
export const selectCitiesListError = createSelector(
  selectBookingHeroState,
  (state) => state.citiesListError,
);

export const selectHealthcareUnits = createSelector(
  selectBookingHeroState,
  (state) => state.healthcareUnits,
);

export const selectHealthcareUnitsLoading = createSelector(
  selectBookingHeroState,
  (state) => state.healthcareUnitsLoading,
);
export const selectHealthcareUnitsError = createSelector(
  selectBookingHeroState,
  (state) => state.healthcareUnitsError,
);

export const selectAvailableDays = createSelector(
  selectBookingHeroState,
  (state) => state.availableDaysResponse,
);
export const selectAvailableDaysLoading = createSelector(
  selectBookingHeroState,
  (state) => state.availableDaysResponseLoading,
);
export const selectAvailableDaysError = createSelector(
  selectBookingHeroState,
  (state) => state.availableDaysResponseError,
);

export const selectAvailableAppointments = createSelector(
  selectBookingHeroState,
  (state) => state.availableAppointments,
);
export const selectAvailableAppointmentsLoading = createSelector(
  selectBookingHeroState,
  (state) => state.availableAppointmentsLoading,
);
export const selectAvailableAppointmentsError = createSelector(
  selectBookingHeroState,
  (state) => state.availableAppointmentsError,
);

export const selectLockAppointment = createSelector(
  selectBookingHeroState,
  (state) => state.lockAppointment,
);
export const selectLockAppointmentLoading = createSelector(
  selectBookingHeroState,
  (state) => state.lockAppointmentLoading,
);
export const selectLockAppointmentError = createSelector(
  selectBookingHeroState,
  (state) => state.lockAppointmentError,
);

export const selectLockDateToExpire = createSelector(
  selectBookingHeroState,
  (state) => state.lockDateToExpireResp,
);
export const selectLockDateToExpireLoading = createSelector(
  selectBookingHeroState,
  (state) => state.lockDateToExpireLoading,
);
export const selectLockDateToExpireError = createSelector(
  selectBookingHeroState,
  (state) => state.lockDateToExpireError,
);

export const selectBookAppointment = createSelector(
  selectBookingHeroState,
  (state) => state.bookAppointment,
);
export const selectBookAppointmentLoading = createSelector(
  selectBookingHeroState,
  (state) => state.bookAppointmentLoading,
);
export const selectBookAppointmentError = createSelector(
  selectBookingHeroState,
  (state) => state.bookAppointmentError,
);

export const selectBookingHeroSummary = createSelector(
  selectBookingHeroState,
  (state) => state.summary,
);

export const selectServiceList = createSelector(
  selectBookingHeroState,
  (state) => state.serviceList,
);
export const selectServiceListLoading = createSelector(
  selectBookingHeroState,
  (state) => state.serviceListLoading,
);
export const selectServiceListError = createSelector(
  selectBookingHeroState,
  (state) => state.serviceListError,
);

export const selectPhysicianList = createSelector(
  selectBookingHeroState,
  (state) => state.physicianList,
);
export const selectPhysicianListLoading = createSelector(
  selectBookingHeroState,
  (state) => state.physicianListLoading,
);
export const selectPhysicianListError = createSelector(
  selectBookingHeroState,
  (state) => state.physicianListError,
);

export const selectCreateSessionLoading = createSelector(
  selectBookingHeroState,
  (state) => state.createSessionRespLoading,
);

export const selectDelegaTypes = createSelector(
  selectBookingHeroState,
  (state) => state.delegaTypes,
);
export const selectDelegaTypesLoading = createSelector(
  selectBookingHeroState,
  (state) => state.delegaTypesLoading,
);
export const selectDelegaTypesError = createSelector(
  selectBookingHeroState,
  (state) => state.delegaTypesError,
);

export const selectNations = createSelector(selectBookingHeroState, (state) => state.nations);
export const selectNationsLoading = createSelector(
  selectBookingHeroState,
  (state) => state.nationsLoading,
);
export const selectNationsError = createSelector(
  selectBookingHeroState,
  (state) => state.nationsError,
);

export const selectConsents = createSelector(selectBookingHeroState, (state) => state.consents);
export const selectConsentsLoading = createSelector(
  selectBookingHeroState,
  (state) => state.nationsLoading,
);
export const selectConsentsError = createSelector(
  selectBookingHeroState,
  (state) => state.consentsError,
);

export const selectPersonInfo = createSelector(selectBookingHeroState, (state) => state.personInfo);
export const selectPersonInfoLoading = createSelector(
  selectBookingHeroState,
  (state) => state.personInfoLoading,
);
export const selectPersonInfoError = createSelector(
  selectBookingHeroState,
  (state) => state.personInfoError,
);

export const selectinitThirdBooking = createSelector(
  selectBookingHeroState,
  (state) => state.initThirdBooking,
);
export const selectinitThirdBookingLoading = createSelector(
  selectBookingHeroState,
  (state) => state.initThirdBookingLoading,
);
export const selectinitThirdBookingError = createSelector(
  selectBookingHeroState,
  (state) => state.initThirdBookingError,
);

export const selectCreateThirdyPartSession = createSelector(
  selectBookingHeroState,
  (state) => state.createThirdyPartSessionResp,
);
export const selectCreateThirdyPartSessionLoading = createSelector(
  selectBookingHeroState,
  (state) => state.createThirdyPartSessionLoading,
);
export const selectCreateThirdyPartSessionError = createSelector(
  selectBookingHeroState,
  (state) => state.createThirdyPartSessionError,
);

export const selectRestartLpResp = createSelector(
  selectBookingHeroState,
  (state) => state.restartLpResp,
);
export const selectRestartLpLoading = createSelector(
  selectBookingHeroState,
  (state) => state.restartLpLoading,
);
export const selectRestartLpError = createSelector(
  selectBookingHeroState,
  (state) => state.restartLpError,
);

export const selectMemoLoading = createSelector(
  selectBookingHeroState,
  (state) => state.memoLoading,
);
export const selectMemoError = createSelector(selectBookingHeroState, (state) => state.memoError);

//selector agregato di loading per new booking
export const selectGlobalLoadingNewBooking = createSelector(
  selectfindByFiscalCodeLoading,
  selectFindPrescriptionLoading,
  selectCreateSessionLoading,
  selectProvincesListLoading,
  selectCitiesListLoading,
  selectHealthcareUnitsLoading,
  selectAvailableDaysLoading,
  selectAvailableAppointmentsLoading,
  selectLockAppointmentLoading,
  selectLockDateToExpireLoading,
  selectBookAppointmentLoading,
  selectServiceListLoading,
  selectPhysicianListLoading,
  selectDelegaTypesLoading,
  selectNationsLoading,
  selectConsentsLoading,
  selectPersonInfoLoading,
  selectinitThirdBookingLoading,
  selectCreateThirdyPartSessionLoading,
  selectRestartLpLoading,
  selectMemoLoading,
  (...loadings) => loadings.some(Boolean),
);

export const selectBookingByNreResp = createSelector(
  selectBookingHeroState,
  (state) => state.bookingByNre,
);
export const selectBookingByNreLoading = createSelector(
  selectBookingHeroState,
  (state) => state.bookingByNreLoading,
);
export const selectBookingByNreError = createSelector(
  selectBookingHeroState,
  (state) => state.bookingByNreError,
);

export const selectBookingsList = createSelector(
  selectBookingHeroState,
  (state) => state.bookingsList,
);
export const selectBookingsListLoading = createSelector(
  selectBookingHeroState,
  (state) => state.bookingsListLoading,
);
export const selectBookingsListError = createSelector(
  selectBookingHeroState,
  (state) => state.bookingsListError,
);

export const selectCancelAppointmentLoading = createSelector(
  selectBookingHeroState,
  (state) => state.cancelAppointmentLoading,
);
export const selectCancelAppointmentError = createSelector(
  selectBookingHeroState,
  (state) => state.cancelAppointmentError,
);
