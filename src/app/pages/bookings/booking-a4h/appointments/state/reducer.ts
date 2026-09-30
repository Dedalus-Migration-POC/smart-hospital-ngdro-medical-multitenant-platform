import { createReducer, on } from '@ngrx/store';
import * as AppointmentsActions from './actions';
import { AppointmentDto, CheckInTicketDto } from './model';

export const featureKey = 'appointmentsA4hState';

export interface State {
  appointments: AppointmentDto[];
  /** Distingue "lista vuota" da "lista mai caricata" (es. refresh sulla pagina di dettaglio). */
  loaded: boolean;
  loading: boolean;
  error: boolean;
  deleting: boolean;
  requestingCheckIn: boolean;
  moving: boolean;
  checkInTickets: CheckInTicketDto[];
}

export const initialState: State = {
  appointments: [],
  loaded: false,
  loading: false,
  error: false,
  deleting: false,
  requestingCheckIn: false,
  moving: false,
  checkInTickets: [],
};

export const reducer = createReducer(
  initialState,

  on(AppointmentsActions.fetchAppointments, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(AppointmentsActions.fetchAppointmentsSuccess, (state, { appointments }) => ({
    ...state,
    appointments,
    loaded: true,
    loading: false,
  })),
  on(AppointmentsActions.fetchAppointmentsFailure, (state) => ({
    ...state,
    appointments: [],
    loaded: false,
    loading: false,
    error: true,
  })),

  on(AppointmentsActions.deleteAppointment, (state) => ({ ...state, deleting: true })),
  on(AppointmentsActions.deleteAppointmentSuccess, (state, { appointmentId }) => ({
    ...state,
    deleting: false,
    appointments: state.appointments.filter((a) => a.id !== appointmentId),
  })),
  on(AppointmentsActions.deleteAppointmentFailure, (state) => ({ ...state, deleting: false })),

  on(AppointmentsActions.requestCheckIn, (state) => ({ ...state, requestingCheckIn: true })),
  on(AppointmentsActions.requestCheckInSuccess, (state, { checkInTicket }) => ({
    ...state,
    requestingCheckIn: false,
    checkInTickets: [...state.checkInTickets, checkInTicket],
  })),
  on(AppointmentsActions.requestCheckInFailure, (state) => ({
    ...state,
    requestingCheckIn: false,
  })),

  on(AppointmentsActions.moveAppointment, (state) => ({ ...state, moving: true })),
  // data e slot sono cambiati lato server: chi legge la lista deve ricaricarla
  on(AppointmentsActions.moveAppointmentSuccess, (state) => ({
    ...state,
    moving: false,
    loaded: false,
  })),
  on(AppointmentsActions.moveAppointmentFailure, (state) => ({ ...state, moving: false })),
);
