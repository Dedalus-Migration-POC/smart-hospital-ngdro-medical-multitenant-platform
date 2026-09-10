export interface MedicalService {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
  isChecked?: boolean;
}

export interface HealthcareUnit {
  id: string;
  name: string;
  description?: string;
  state?: string;
  country?: string;
  city?: string;
  postCode?: string;
  address?: string;
  province?: string;
  region?: string;
  phone?: string[];
  fax?: string;
  email?: string;
  operationUnits?: OperationUnit[];
  image?: string;
}

export interface OperationUnit {
  name: string;
  description?: string;
  phone?: string[];
  email?: string;
  timeSlots?: string;
  location?: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  expireOn: number;
}

export interface FindPayload {
  sessionId: string;
  from: unknown;
  to: unknown;
  serviceIds: string[];
  unitId?: string[];
  physicianId?: string;
  contractId?: string;
  appointmentToMove?: { id: string };
}

export interface CheckAvailableDays {
  appointments: Appointment[];
  availableDays: AvailableDay[];
  status: string;
}

export interface Appointment {
  id: string;
  dateTime: string | number;
  location: Location;
  descriptionList?: string[];
  status: string;
  physician?: Physician;
  billingInfo?: BillingInfo[];
  additionalProperties?: AdditionalProperties;
  serviceDescriptionList?: ServiceDescription[];
}

export interface AvailableDay {
  date: string;
  hospitalId: string;
  hospitalName: string;
}

export interface ServiceDescription {
  id: string;
  description: string;
}

export interface AdditionalProperties {
  contractId?: string;
  time?: string;
  token?: string;
  preparation?: { link?: string }[] | any;
  flowType?: string;
  idReserve?: string;
  a4hAppointmentId?: string;
}

export interface BillingInfo {
  status: string;
  contractName: string;
  finalPrice: number;
}

export interface Physician {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  postCode: string;
}

export interface LockAppointmentPayload {
  sessionId: string;
  appointmentId?: string;
}

export interface LockAppointmentResponse {
  expireOn: number;
  appointment: Appointment;
}

export interface BookAppointmentResponse {
  additionalProperties?: AdditionalProperties;
  appointment: Appointment;
}

export interface CheckAvailabilityPayload {
  bookingFlow: string;
  serviceIds: string[];
  unitId?: string;
  physician?: unknown[];
  nre?: string;
  taxCode?: string;
}

export interface CheckAvailabilityResponse {
  services: AvailabilityService[];
}

export interface AvailabilityService {
  service: string;
  available: boolean;
  name?: string;
}

export interface IDoctor {
  id: string;
  firstName: string;
  lastName: string;
  fiscalCode?: string;
  description?: string;
  type?: string;
}

export interface ScanResult {
  prescriptionPrimaryCode: string;
  prescriptionSecondaryCode: string;
  fiscalCode: string;
}

export interface PrescriptionSession {
  sessionId: string;
  expireOn: number;
  prescription: Prescription;
}

export interface Prescription {
  id: string;
  number: string;
  format: string;
  serviceRequestList: PrescriptionServiceRequest[];
}

export interface NreInfo {
  fiscalCode: string;
  prescriptionId: string;
}

export interface PrescriptionServiceRequest {
  id: number | string;
  service: PrescriptionService;
  selected?: boolean;
}

export interface PrescriptionService {
  id: string;
  name: string;
  subServices: PrescriptionSubService[];
  description?: string;
  enabled?: boolean;
}

export interface PrescriptionSubService {
  id: string;
  name: string;
  enabled?: boolean;
}

export interface FindByNrePayload {
  fiscalCode: string;
  prescriptionId: string;
}
