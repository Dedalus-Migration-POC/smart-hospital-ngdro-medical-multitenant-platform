import { isBefore, isSameDay, parseISO, subHours } from 'date-fns';
import { AppointmentDto } from './state/model';

export type AppointmentHintCode =
  | 'TOO-EARLY'
  | 'PRIVACY'
  | 'TO-PAY'
  | 'MOBILE-PAYMENT-NOT-ALLOWED'
  | 'USER-NOT-VERIFIED'
  | 'UNKNOWN'
  | 'TOO-LATE'
  | 'NOT-EDITABLE';

const HINT_CODE_BY_KEY: Record<string, AppointmentHintCode> = {
  'appointments.hint.too-early': 'TOO-EARLY',
  'appointments.hint.privacy': 'PRIVACY',
  'appointments.hint.to-pay': 'TO-PAY',
  'appointments.hint.mobile-payment-not-allowed': 'MOBILE-PAYMENT-NOT-ALLOWED',
  'appointments.hint.user-not-verified': 'USER-NOT-VERIFIED',
  'appointments.hint.unknown': 'UNKNOWN',
  'appointments.hint.too-late': 'TOO-LATE',
  'appointments.hint.not-editable': 'NOT-EDITABLE',
};

// Funzioni pure al posto della classe AppointmentObj di Mondino: nello store restano solo DTO serializzabili.

export function appointmentAddress({ location }: AppointmentDto): string {
  return location.address ? `${location.name}, ${location.address}` : location.name;
}

export function isInCheckInWindow(appointment: AppointmentDto, checkInHours: number): boolean {
  const now = Date.now();
  const scheduledOn = parseISO(appointment.scheduledOn);
  return isSameDay(scheduledOn, now) && isBefore(subHours(scheduledOn, checkInHours), now);
}

export function canCheckIn(appointment: AppointmentDto, checkInHours: number): boolean {
  return appointment.checkInStatus === 'TO_DO' && isInCheckInWindow(appointment, checkInHours);
}

export function isEditableOrCancellable(
  appointment: AppointmentDto,
  checkInHours: number,
): boolean {
  return (
    !!appointment.serviceIds?.length &&
    appointment.paymentStatus !== 'PAID' &&
    isBefore(new Date(), subHours(parseISO(appointment.scheduledOn), checkInHours))
  );
}

/**
 * Chiave i18n del suggerimento sul blocco dell'accettazione.
 * In `detailsMode` segnala solo l'impossibilità di modificare/cancellare.
 */
export function checkInHint(
  appointment: AppointmentDto,
  checkInHours: number,
  detailsMode = false,
): { key: string; params?: Record<string, unknown> } | undefined {
  const { lockCause } = appointment;
  if (appointment.checkInStatus === 'DONE' || !lockCause) return undefined;

  if (detailsMode) {
    return lockCause !== 'to-pay' && !isEditableOrCancellable(appointment, checkInHours)
      ? { key: 'appointments.hint.not-editable' }
      : undefined;
  }
  if (lockCause === 'too-early') {
    return { key: 'appointments.hint.too-early', params: { hours: checkInHours } };
  }
  if (lockCause === 'to-pay' && !isInCheckInWindow(appointment, checkInHours)) {
    return undefined;
  }
  return { key: `appointments.hint.${lockCause}` };
}

export function checkInHintCode(
  appointment: AppointmentDto,
  checkInHours: number,
  detailsMode = false,
): AppointmentHintCode | null {
  const hint = checkInHint(appointment, checkInHours, detailsMode);
  return hint ? (HINT_CODE_BY_KEY[hint.key] ?? 'UNKNOWN') : null;
}
