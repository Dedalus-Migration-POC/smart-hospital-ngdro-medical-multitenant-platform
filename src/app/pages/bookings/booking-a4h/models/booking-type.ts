/**
 * Identifies which of the historical booking flows (booking-with-ssn,
 * booking-no-doctor-select, booking-with-doctor-select, physicians) is being
 * executed inside the unified stepper. The whole module is driven by this
 * single value instead of duplicating one module/state/component tree per flow.
 */
export enum BookingType {
  Ssn = 'booking-with-ssn',
  NoDocSelect = 'booking-no-doctor-select',
  WithDocSelect = 'booking-with-doctor-select',
  Physicians = 'physicians',
  /** Spostamento di un appuntamento già prenotato: non è selezionabile dall'URL `:bookingType`. */
  EditAppointment = 'edit-appointment',
}

export enum BookingStepKey {
  InsertNre = 'insert-nre',
  SelectService = 'select-service',
  SelectDoctor = 'select-doctor',
  SelectMedicalService = 'select-medical-service',
  DateTime = 'date-time',
  Review = 'review',
}

/** Ordered list of steps rendered inside the single stepper, per booking type. */
export const BOOKING_FLOW_STEPS: Record<BookingType, BookingStepKey[]> = {
  [BookingType.Ssn]: [
    BookingStepKey.InsertNre,
    BookingStepKey.SelectService,
    BookingStepKey.DateTime,
    BookingStepKey.Review,
  ],
  [BookingType.NoDocSelect]: [
    BookingStepKey.SelectMedicalService,
    BookingStepKey.DateTime,
    BookingStepKey.Review,
  ],
  [BookingType.WithDocSelect]: [
    BookingStepKey.SelectMedicalService,
    BookingStepKey.SelectDoctor,
    BookingStepKey.DateTime,
    BookingStepKey.Review,
  ],
  [BookingType.Physicians]: [
    BookingStepKey.SelectDoctor,
    BookingStepKey.SelectMedicalService,
    BookingStepKey.DateTime,
    BookingStepKey.Review,
  ],
  [BookingType.EditAppointment]: [BookingStepKey.DateTime, BookingStepKey.Review],
};

export const BOOKING_FLOW_LABELS: Record<BookingType, string> = {
  [BookingType.Ssn]: 'bookingWithSsn',
  [BookingType.NoDocSelect]: 'bookingNoDoctorSelect',
  [BookingType.WithDocSelect]: 'bookingWithDoctorSelect',
  [BookingType.Physicians]: 'physicians',
  [BookingType.EditAppointment]: 'edit-appointment',
};

/** `bookingFlow` code expected by the `/service` and `/find/check-availability` APIs, per flow. */
export const BOOKING_FLOW_CODES: Record<BookingType, string> = {
  [BookingType.Ssn]: 'SSN',
  [BookingType.NoDocSelect]: 'SOLV',
  [BookingType.WithDocSelect]: 'LP',
  [BookingType.Physicians]: 'LP',
  // il contratto reale arriva dall'appuntamento da spostare
  [BookingType.EditAppointment]: '',
};

export function isBookingType(value: string | null): value is BookingType {
  return (
    !!value &&
    value !== BookingType.EditAppointment &&
    Object.values(BookingType).includes(value as BookingType)
  );
}

export function stepsFor(bookingType: BookingType | null): BookingStepKey[] {
  return bookingType ? BOOKING_FLOW_STEPS[bookingType] : [];
}
