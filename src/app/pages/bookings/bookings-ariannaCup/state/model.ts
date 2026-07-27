export interface FirstAvailabilityRequest {
  telefonoIntestatario: string;
  numImpegnativa: String;
  company: string;
}

export interface OtherAvailabilityRequest extends FirstAvailabilityRequest {
  hl7Messages: any;
}

export interface BookingRequest {
  telefonoIntestatario: string;
  numImpegnativa?: String;
  schedule: Schedule;
  hl7Messages?: any;
}

export interface TelefonoRequest {
  telefonoIntestatario: string;
}

export interface Service {
  date: string;
  code: string;
  description: string;
}

export interface Availability {
  schedule: Schedule;
  hl7Messages: any;
}

export interface Schedule {
  structure: string;
  structureAddress?: string;
  structureCity: string;
  structureCompany: string;
  scheduleCode: string;
  importoTotale: string | null;
  notePaziente: string | null;
  numImpegnativa: string | null;
  prescrittoreImpegnativaCodiceFiscale: string | null;
  prescrittoreImpegnativaCognome: string | null;
  prescrittoreImpegnativaNome: string | null;
  placerAppointmentId?: string;
  services: Service[];
}
export interface Booking {
  schedules: Schedule[];
  hl7Messages: any;
  userMessage: string;
}

export interface BookingType {
  titleI18n: string;
  descriptionI18n: string;
  id: string;
}

export interface BookingsVm {
  loading: boolean;
  error: any;
  bookings: any[];
  // bookings: CardMultiUse[];
  isEmptyList: boolean;
  msgError?: string;
}

export interface RetrievePrestazioniRequest {
  filter?: string;
}

export interface RetrievePrestazioni {
  documents: Array<Prestazione>;
}

export interface Prestazione {
  groupKey: string;
  codRegPrest: string;
  descPrest: string;
  medici: MedicoPrestazione[];
}

export interface MedicoPrestazione {
  idStrutturaAcc: number;
  codMemoStrutturaAcc: string;
  descStrutturaAcc: string;
  idAgenda: number;
  codMemoAgenda: string;
  descAgenda: string;
  cdcAgenda: string | null;
  idMedico: number | null;
  descMedico: string;
  cognomeMedico: string | null;
  nomeMedico: string | null;
  prezzo: number;
}

export interface PrivateAvailabilityRequest {
  serviceCode: string;
  serviceDescription: string;
  structures: string[];
  doctorFiscalCode: string | null;
  doctorTypeCode: string | null;
  regimeErogazione: string;
  maxResults: number;
  ais11: Ais11Item[];
}

export interface Ais11Item {
  key: 'MODIMP' | 'QUESITO';
  value1: string | null;
}

export interface PrivateAvailability {
  scheduleList: Booking;
}

export interface PrivateBookingRequest extends BookingRequest {
  regimeErogazione: string;
  maxResults: number;
  ais11: Ais11Item[];
}
