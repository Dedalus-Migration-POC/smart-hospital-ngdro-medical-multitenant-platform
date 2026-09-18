export enum PrescriptionType {
  SSN = 'ssn',
  SOLV = 'solv',
  SLP = 'slp',
  LP = 'lp',
}

export interface Prescription {
  description: string;
  scheduledOn?: string;
}

export interface Payment {
  id: string;
  amount: number;
  createdOn: string;
  description: string | null;
  prescriptions: Prescription[];
}

export interface PaymentPending {
  groupedAppointments: Appointment[];
}

export interface Appointment {
  creationDate: number;
  appointmentDate: number;
  episodeNumber: string;
  structure: Structure;
  amount: number;
  patientQuote: number;
  orders: Order[];
}

export interface Structure {
  id: string;
  code: string;
  name: string;
  text: string | null;
  synonym: string | null;
}

export interface Order {
  orderNumber: string;
  orderId: string;
  scheduledOn: string;
  activity: Structure;
  message: null | string;
  nre: null | string;
  contract: PrescriptionType | null;
  creationDate: number;
}

export interface PayRequest {
  amount: number;
  episodeNumber: Array<string>;
  structureId: string;
}

export interface PayResponseNexiOK {
  amount: number;
  createdOn: string;
  episodes: Array<string>;
  invoiceId: string;
  invoiceNumber: string;
  invoices: string | null;
  result: string;
  structure: Structure;
}

export enum StatusNexiPay {
  OK = 'OK',
  KO = 'KO',
  ANNULLO = 'ANNULLO',
}
