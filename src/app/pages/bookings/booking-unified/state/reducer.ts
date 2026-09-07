import { createReducer, on } from '@ngrx/store';
import * as BookingUnifiedActions from './actions';
import {
  BookAppointmentResponse,
  CheckAvailabilityResponse,
  CheckAvailableDays,
  CreateSessionResponse,
  IDoctor,
  LockAppointmentResponse,
  MedicalService,
  NreInfo,
  PrescriptionSession,
} from '../booking-unified.service';
import { BookingType } from '../models/booking-type';

export const featureKey = 'bookingUnifiedState';

export interface State {
  bookingType: BookingType | null;

  nreInfo: NreInfo | null;
  findPrescriptionByNreData: PrescriptionSession | null;
  findPrescriptionByNreLoading: boolean;
  findPrescriptionByNreError: boolean;

  doctorsList: IDoctor[];
  doctorsListLoading: boolean;
  doctorsListError: boolean;
  selectedDoctor: IDoctor | null;

  servicesList: MedicalService[];
  servicesListLoading: boolean;
  servicesListError: boolean;
  servicesVisibility: boolean;
  selectedMedicalService: string[];

  createSessionResponse: CreateSessionResponse | null;
  createSessionLoading: boolean;
  createSessionError: boolean;

  findResponse: CreateSessionResponse | null;
  findLoading: boolean;
  findError: boolean;

  checkAvailableDaysResponse: CheckAvailableDays | null;
  checkAvailableDaysLoading: boolean;
  checkAvailableDaysError: boolean;

  activeStep: number;
  isOptimized: boolean;

  lockAppointmentResponse: LockAppointmentResponse | null;
  lockAppointmentLoading: boolean;
  lockAppointmentError: boolean;

  bookAppointmentResponse: BookAppointmentResponse | null;
  bookAppointmentLoading: boolean;
  bookAppointmentError: boolean;

  checkAvailabilityResponse: CheckAvailabilityResponse | null;
  checkAvailabilityLoading: boolean;
  checkAvailabilityError: boolean;

  healthCareUnit: any;
  healthCareUnitLoading: boolean;
  healthCareUnitError: boolean;

  availableListToBook: any | null;

  mergePdfByUrls: any;
  mergePdfByUrlsLoading: boolean;
  mergePdfByUrlsError: boolean;
}

export const initialState: State = {
  bookingType: null,

  nreInfo: null,
  findPrescriptionByNreData: null,
  findPrescriptionByNreLoading: false,
  findPrescriptionByNreError: false,

  doctorsList: [],
  doctorsListLoading: false,
  doctorsListError: false,
  selectedDoctor: null,

  servicesList: [],
  servicesListLoading: false,
  servicesListError: false,
  servicesVisibility: false,
  selectedMedicalService: [],

  createSessionResponse: null,
  createSessionLoading: false,
  createSessionError: false,

  findResponse: null,
  findLoading: false,
  findError: false,

  checkAvailableDaysResponse: null,
  checkAvailableDaysLoading: false,
  checkAvailableDaysError: false,

  activeStep: 0,
  isOptimized: true,

  lockAppointmentResponse: null,
  lockAppointmentLoading: false,
  lockAppointmentError: false,

  bookAppointmentResponse: null,
  bookAppointmentLoading: false,
  bookAppointmentError: false,

  checkAvailabilityResponse: null,
  checkAvailabilityLoading: false,
  checkAvailabilityError: false,

  healthCareUnit: null,
  healthCareUnitLoading: false,
  healthCareUnitError: false,

  availableListToBook: null,

  mergePdfByUrls: null,
  mergePdfByUrlsLoading: false,
  mergePdfByUrlsError: false,
};

export const reducer = createReducer(
  initialState,

  on(BookingUnifiedActions.initBooking, (state, action) => ({
    ...initialState,
    bookingType: action.bookingType,
  })),

  on(BookingUnifiedActions.findPrescriptionByNre, (state) => ({
    ...state,
    findPrescriptionByNreLoading: true,
    findPrescriptionByNreError: false,
  })),
  on(BookingUnifiedActions.findPrescriptionByNreSuccess, (state, action) => ({
    ...state,
    findPrescriptionByNreLoading: false,
    findPrescriptionByNreError: false,
    findPrescriptionByNreData: action.data,
  })),
  on(BookingUnifiedActions.findPrescriptionByNreFailure, (state) => ({
    ...state,
    findPrescriptionByNreLoading: false,
    findPrescriptionByNreError: true,
  })),

  on(BookingUnifiedActions.setNreInfo, (state, action) => ({
    ...state,
    nreInfo: action.nreInfo,
  })),

  on(BookingUnifiedActions.getServicesList, (state) => ({
    ...state,
    servicesListLoading: true,
    servicesListError: false,
  })),
  on(BookingUnifiedActions.getServicesListSuccess, (state, action) => ({
    ...state,
    servicesListLoading: false,
    servicesListError: false,
    servicesList: action.data,
  })),
  on(BookingUnifiedActions.getServicesListFailure, (state) => ({
    ...state,
    servicesListLoading: false,
    servicesListError: true,
  })),

  on(BookingUnifiedActions.setServicesVisibility, (state) => ({
    ...state,
    servicesVisibility: !state.servicesVisibility,
  })),

  on(BookingUnifiedActions.addMedicalService, (state, action) => ({
    ...state,
    selectedMedicalService: state.selectedMedicalService.concat(action.id),
  })),
  on(BookingUnifiedActions.removeMedicalService, (state, action) => ({
    ...state,
    selectedMedicalService: state.selectedMedicalService.filter((id) => id !== action.id),
  })),
  on(BookingUnifiedActions.resetMedicalService, (state) => ({
    ...state,
    selectedMedicalService: [],
  })),

  on(BookingUnifiedActions.getDoctorsList, (state) => ({
    ...state,
    doctorsListLoading: true,
    doctorsListError: false,
  })),
  on(BookingUnifiedActions.getDoctorsListSuccess, (state, action) => ({
    ...state,
    doctorsListLoading: false,
    doctorsListError: false,
    doctorsList: action.data,
  })),
  on(BookingUnifiedActions.getDoctorsListFailure, (state) => ({
    ...state,
    doctorsListLoading: false,
    doctorsListError: true,
  })),

  on(BookingUnifiedActions.setSelectedDoctor, (state, action) => ({
    ...state,
    selectedDoctor: action.physician,
  })),

  on(BookingUnifiedActions.createSession, (state) => ({
    ...state,
    createSessionLoading: true,
    createSessionError: false,
  })),
  on(BookingUnifiedActions.createSessionSuccess, (state, action) => ({
    ...state,
    createSessionLoading: false,
    createSessionError: false,
    createSessionResponse: action.data,
  })),
  on(BookingUnifiedActions.createSessionFailure, (state) => ({
    ...state,
    createSessionLoading: false,
    createSessionError: true,
  })),

  on(BookingUnifiedActions.findForAvailableDays, (state) => ({
    ...state,
    findLoading: true,
    findError: false,
  })),
  on(BookingUnifiedActions.findForAvailableDaysSuccess, (state, action) => ({
    ...state,
    findLoading: false,
    findError: false,
    findResponse: action.data,
  })),
  on(BookingUnifiedActions.findForAvailableDaysFailure, (state) => ({
    ...state,
    findLoading: false,
    findError: true,
  })),

  on(BookingUnifiedActions.checkAvailableDays, (state) => ({
    ...state,
    checkAvailableDaysLoading: true,
    checkAvailableDaysError: false,
  })),
  on(BookingUnifiedActions.checkAvailableDaysSuccess, (state, action) => ({
    ...state,
    checkAvailableDaysLoading: false,
    checkAvailableDaysError: false,
    checkAvailableDaysResponse: action.data,
  })),
  on(BookingUnifiedActions.checkAvailableDaysFailure, (state) => ({
    ...state,
    checkAvailableDaysLoading: false,
    checkAvailableDaysError: true,
  })),

  on(BookingUnifiedActions.setActiveStep, (state, action) => ({
    ...state,
    activeStep: action.step,
  })),
  on(BookingUnifiedActions.setIsOptimized, (state, action) => ({
    ...state,
    isOptimized: action.isOptimized,
  })),

  on(BookingUnifiedActions.lockAppointment, (state) => ({
    ...state,
    lockAppointmentLoading: true,
    lockAppointmentError: false,
  })),
  on(BookingUnifiedActions.lockAppointmentSuccess, (state, action) => ({
    ...state,
    lockAppointmentLoading: false,
    lockAppointmentError: false,
    lockAppointmentResponse: action.data,
  })),
  on(BookingUnifiedActions.lockAppointmentFailure, (state) => ({
    ...state,
    lockAppointmentLoading: false,
    lockAppointmentError: true,
  })),

  on(BookingUnifiedActions.bookAppointment, (state) => ({
    ...state,
    bookAppointmentLoading: true,
    bookAppointmentError: false,
  })),
  on(BookingUnifiedActions.bookAppointmentSuccess, (state, action) => ({
    ...state,
    bookAppointmentLoading: false,
    bookAppointmentError: false,
    bookAppointmentResponse: action.data,
  })),
  on(BookingUnifiedActions.bookAppointmentFailure, (state) => ({
    ...state,
    bookAppointmentLoading: false,
    bookAppointmentError: true,
  })),

  on(BookingUnifiedActions.checkAvailability, (state) => ({
    ...state,
    checkAvailabilityLoading: true,
    checkAvailabilityError: false,
  })),
  on(BookingUnifiedActions.checkAvailabilitySuccess, (state, action) => ({
    ...state,
    checkAvailabilityLoading: false,
    checkAvailabilityError: false,
    checkAvailabilityResponse: action.data,
  })),
  on(BookingUnifiedActions.checkAvailabilityFailure, (state) => ({
    ...state,
    checkAvailabilityLoading: false,
    checkAvailabilityError: true,
  })),

  on(BookingUnifiedActions.getHealthCareUnit, (state) => ({
    ...state,
    healthCareUnitLoading: true,
    healthCareUnitError: false,
  })),
  on(BookingUnifiedActions.getHealthCareUnitSuccess, (state, action) => ({
    ...state,
    healthCareUnitLoading: false,
    healthCareUnitError: false,
    healthCareUnit: action.data,
  })),
  on(BookingUnifiedActions.getHealthCareUnitFailure, (state) => ({
    ...state,
    healthCareUnitLoading: false,
    healthCareUnitError: true,
  })),

  on(BookingUnifiedActions.setAvailableListToBook, (state, action) => ({
    ...state,
    availableListToBook: action.payload,
  })),

  on(BookingUnifiedActions.mergePdfByUrls, (state) => ({
    ...state,
    mergePdfByUrlsLoading: true,
    mergePdfByUrlsError: false,
  })),
  on(BookingUnifiedActions.mergePdfByUrlsSuccess, (state, action) => ({
    ...state,
    mergePdfByUrlsLoading: false,
    mergePdfByUrlsError: false,
    mergePdfByUrls: action.data,
  })),
  on(BookingUnifiedActions.mergePdfByUrlsFailure, (state) => ({
    ...state,
    mergePdfByUrlsLoading: false,
    mergePdfByUrlsError: true,
  })),

  on(BookingUnifiedActions.resetState, (state) => ({
    ...initialState,
    bookingType: state.bookingType,
  })),

  on(BookingUnifiedActions.restoreStateFromLocalStorage, (state, action) => ({
    ...action.state,
  })),
);
