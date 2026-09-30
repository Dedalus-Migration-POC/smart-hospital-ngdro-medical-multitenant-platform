export type AppointmentContract = 'SSN' | 'SOLV' | 'LP';

export type CheckInStatus = 'TO_DO' | 'TO_PAY' | 'NOT_ALLOWED' | 'DONE';

export type PaymentStatus = 'PAID' | 'TO_PAY';

export type LockCause =
  | 'too-early'
  | 'too-late'
  | 'to-pay'
  | 'privacy'
  | 'mobile-payment-not-allowed'
  | 'user-not-verified'
  | 'unknown';

export interface AppointmentLocation {
  id?: string;
  name: string;
  municipality?: string | null;
  postalCode?: string | null;
  address?: string | null;
  gpsCoordinate?: string | null;
}

export interface AppointmentLocationDetails {
  id: string;
  department?: string | null;
  waitingRoom?: string | null;
  examinationRoom?: string | null;
  building?: string | null;
  floor?: string | null;
  room?: string | null;
}

export interface AppointmentDto {
  id: string;
  code?: string;
  location: AppointmentLocation;
  lockCause?: LockCause | null;
  linkNote?: string | null;
  checkInStatus: CheckInStatus;
  paymentStatus: PaymentStatus;
  scheduledOn: string;
  scheduledEnd?: string | null;
  description: string;
  locationDetails?: AppointmentLocationDetails;
  physician?: string | null;
  ticketId?: string | null;
  serviceIds?: string[];
  amount?: number | null;
  contract: AppointmentContract;
  orderId?: string | null;
  agenda?: unknown;
  patient?: unknown;
  canceledOn?: string | null;
  cancellableBefore?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  canceledBy?: string | null;
  cancellable?: boolean | null;
  editable?: boolean | null;
}

export interface AppointmentsResponse {
  appointments: AppointmentDto[];
}

/** `sessionId` è la sessione dello stepper in cui è stato bloccato il nuovo slot. */
export interface MoveAppointmentPayload {
  sessionId: string;
  newAppointmentId: string;
}

export interface CheckInTicketDto {
  ticketNumber?: string;
  ticketMessage?: string;
  noTicketMessage?: string;
  peopleQueuing?: number;
  waitingTime?: number;
  scheduleTime?: string;
  base64QrCode?: string;
}

/** Stati che compaiono nella tab "Appuntamenti"; `DONE` finisce in "Accettazione online". */
export const PENDING_CHECK_IN_STATUSES: readonly CheckInStatus[] = [
  'TO_DO',
  'TO_PAY',
  'NOT_ALLOWED',
];

export const DEFAULT_CHECK_IN_HOURS = 5;
