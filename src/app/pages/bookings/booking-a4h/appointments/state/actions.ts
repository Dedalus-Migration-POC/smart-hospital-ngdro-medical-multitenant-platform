import { createAction, props } from '@ngrx/store';
import { AppointmentDto, CheckInTicketDto, MoveAppointmentPayload } from './model';

export const fetchAppointments = createAction('[AppointmentsA4h] Fetch Appointments');
export const fetchAppointmentsSuccess = createAction(
  '[AppointmentsA4h] Fetch Appointments Success',
  props<{ appointments: AppointmentDto[] }>(),
);
export const fetchAppointmentsFailure = createAction(
  '[AppointmentsA4h] Fetch Appointments Failure',
  props<{ error: any }>(),
);

export const deleteAppointment = createAction(
  '[AppointmentsA4h] Delete Appointment',
  props<{ appointment: AppointmentDto }>(),
);
export const deleteAppointmentSuccess = createAction(
  '[AppointmentsA4h] Delete Appointment Success',
  props<{ appointmentId: string }>(),
);
export const deleteAppointmentFailure = createAction(
  '[AppointmentsA4h] Delete Appointment Failure',
  props<{ error: any }>(),
);

export const requestCheckIn = createAction(
  '[AppointmentsA4h] Request Check-in',
  props<{ appointment: AppointmentDto }>(),
);
export const requestCheckInSuccess = createAction(
  '[AppointmentsA4h] Request Check-in Success',
  props<{ checkInTicket: CheckInTicketDto }>(),
);
export const requestCheckInFailure = createAction(
  '[AppointmentsA4h] Request Check-in Failure',
  props<{ error: any }>(),
);

export const moveAppointment = createAction(
  '[AppointmentsA4h] Move Appointment',
  props<{ payload: MoveAppointmentPayload }>(),
);
export const moveAppointmentSuccess = createAction('[AppointmentsA4h] Move Appointment Success');
export const moveAppointmentFailure = createAction(
  '[AppointmentsA4h] Move Appointment Failure',
  props<{ payload: MoveAppointmentPayload; error: any }>(),
);
