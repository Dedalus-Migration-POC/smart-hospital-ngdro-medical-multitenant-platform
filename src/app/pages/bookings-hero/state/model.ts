import { Type } from '@angular/core'

export interface HealthcareUnit {
  id: string
  name: string
  description: string
  state?: string
  country?: string
  postCode?: string
  address?: string
  phone?: string
  email?: string
}

export interface HealthcareUnitList {
  healthcareUnits: HealthcareUnit[]
}

export type ScanResult = {
  prescriptionPrimaryCode: string
  prescriptionSecondaryCode: string
  fiscalCode: string
  person: {
    name: string
    lastName: string
    zipCode: string
    address: string
    city: string
    province: string
  }
}

export interface AvailableDaysPayload {
  prescriptionId?: string
  unitId?: string[]
  sessionId: string
  from?: string
  to?: string
  serviceIds?: string[]
  physicianId?: string
  appointmentToMove?: { id: string }
}

export interface AvailableDaysResponse {
  appointments?: Availability[]
  availableDays: AvailableDay[]
  status: CallState | string
}
export interface FindByCheckResponse {
  appointments: Availability[]
  status: CallState
}
export interface Availability {
  id: string
  dateTime: number | string
  location: Partial<Location>
  descriptionList?: string[]
  status: string
  physician?: Physician
  unitDescription: string
  billingInfo: Partial<BillingInfo>[]
  serviceDescriptionList?: {
    id: string
    description: string
    notes?: string
  }[]
  additionalProperties?: {
    agenda_patient_text?: string
    CONTRACT_ID?: string
    AVAILABILITY_TOKEN_ID?: string
    SESSION_ID?: string
  }
  isThirdPart?: boolean
  delegateFiscalCode?: string
}
export interface Physician {
  id: string
  firstName: string
  lastName: string
  fiscalCode?: string
}

export interface BillingInfo {
  status: string
  contractName: string
  finalPrice: number
  totalPrice: number
}

export interface AvailableDay {
  id: string
  date: string
  hospitalId: string
  hospitalName: string
}

export enum CallState {
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  OK = 'OK',
}

export interface Location {
  id: string
  name: string
  description: string
  state: string
  country: string
  postCode: string
  address: string
  phone: string
  email: string
}

export interface LockPayload {
  appointmentId: string
  sessionId: string
}

export interface LockResponse {
  expireOn: number
  appointment: Availability
}

export interface BookResponse {
  appointment: Availability
}

export interface FindByFiscalCodePayload {
  fiscalCode: string
  prescriptionId?: string
}
export interface FindByFiscalCodeResponse {
  sessionId: string
  expireOn: number
  firstName: string
  lastName: string
  fiscalCode: string
  phoneNumber: string
  email: string
}

export interface FetchPersonInfoResponse {
  fiscalCode: string
  name: string
  lastName: string
  zipCode: string
  address: string
  city: string
  province: string
}

export interface FindPrescriptionResponse {
  expireOn: number
  prescription: {
    format: string
    id: string
    number: string
    serviceRequestList: ServiceRequest[]
  }
  sessionId: string
  medicalAppointmentPatient?: Partial<MedicalAppointmentPatient>
  code: string
}

export interface ServiceRequest {
  id: number | string
  service: Service
  authorityCode?: string
}
export interface Service {
  id?: string
  name: string
  authorityCode?: string
  notes?: string
  description?: string
  type?: string
  packageMode?: string
  disciplineId?: string
  enabled?: boolean
}

export interface MedicalAppointmentPatient {
  id?: string
  fiscalCode: string
  firstName: string
  lastName: string
  gender: string
  birthDate: string
  email: string
  phoneNumber: string
  address?: string
}

export interface InitBookingFromMissingDataPayload {
  prescriptionId: string
  medicalAppointmentPatient: {
    fiscalCode: string
  }
  residentialAddress: string
  houseNumber: string
  cityOfResidence: string
  province: string
}

export interface SummaryBookingHero {
  bookingType?: BookingType
  fiscalCode?: string | null
  nre?: string | null
  services?: Service[] | null
  physician?: Physician | null
  day?: string | null
  hour?: string | number | null
  sessionId?: string | null
  prescriptionId?: string | null
  expireOn?: number | null
  delega?: IDelega | null
  userEmail?: string
  userPhoneNumber?: string
  userFiscalCode?: string
  appointmentToMove?: string
  newAppointment?: Availability
}
export type BookingType =
  | 'nre'
  | 'nre_delegate'
  | 'free_prof'
  | 'free_prof_delegate'
  | 'nre_to_move'
  | 'free_prof_to_move'

export interface OptionBookingType {
  titleI18n: string
  descriptionI18n: string
  id: string
}

export interface CreateSessionResponse {
  sessionId: string
  expireOn: number
}

export interface CreateSessionWithAddressPayload {
  serviceIds: string[]
  physicianId: string
  patientAddress: {
    residentialAddress: string
    houseNumber: string
    cityOfResidence: string
  }
}

export enum BookingStepId {
  SelectBookingType = 'selectBookingType',
  SelectMedicalService = 'selectMedicalService',
  PrescriptionUpload = 'prescriptionUpload',
  MissingData = 'missingData',
  AvailableDays = 'availableDays',
  AvailableAppointments = 'availableAppointments',
  Confirmation = 'confirmation',
  Delega = 'delega',
  DelegaForms = 'delegaForms',
  ConfirmedAppointment = 'confirmedAppointment',
}
export interface BookingStep {
  id: BookingStepId
  label: string
  component: Type<any>
}

export interface DelegaTypesResp {
  name: string
  description: string
  items: {
    key: string
    label: string
    leaf: boolean
  }[]
}

export interface IDeclarantForm {
  address: string
  birthCountry: string
  birthCity: string
  birthDate: string
  birthProvince: string
  currentCity: string
  currentProvince: string
  currentCityCap: string
}
export interface IBookingPersonForm {
  address: string
  houseNumber: string
  birthCountry: string
  birthDate: string
  birthProvince: string
  birthCity: string
  currentCity: string
  currentCityCap: string
  currentProvince: string
  firstName: string
  informative: boolean
  lastName: string
  taxCode: string
}

export interface IDelega {
  delegateType: string
  selfDeclaration?: boolean
  declarantForm?: IDeclarantForm
  bookingPersonForm?: IBookingPersonForm
  prescriptionId?: string
  appointmentId?: string | number
}

export interface INationsResp {
  name: string
  items: INationItem[]
}

export interface INationItem {
  key: string
  label: string
  leaf: boolean
  childName: string
}

export interface IConsent {
  id: number
  accepted: string | null
  summary: string
  description: string
  url: string
  required: boolean
  lang: string
  requireLogin: boolean
  type: string
  acceptedDate: string | null
  contractCode: string
}
export interface IConsentsToUpdate {
  cfThirdPerson: string
  consents: { id: number; accepted: boolean }[]
}

export interface InitThirdBookingPayload {
  prescriptionId: string // nre
  delegateMedicalAppointmentPatient: {
    fiscalCode: string
    firstName: string
    lastName: string
    phoneNumber: string | number
    email: string
  }
  residentialAddress: string
  houseNumber: string
  cityOfResidence: string
  province: string
  nation: string //Italy
  delegationType: string
  delegatorFiscalCode: string
}

export interface CreateThirdyPartSessionPayload {
  serviceIds: string[]
  physicianId: string
  patientAddress: {
    province: string //paziente  (residenza)
    nation: string //paziente (residenza)
    cap: string //paziente  (residenza)
    residentialAddress: string //paziente (residenza)
    houseNumber: string //paziente (residenza)
    cityOfResidence: string //paziente (residenza)
  }
  delegatePatient: {
    //paziente
    fiscalCode: string
    firstName: string
    lastName: string
    birthDate: string
    email: string //del user
    phoneNumber: string //del user
  }
  delegationType: string
  delegatorFiscalCode: string //user
}

export interface MemoPayload {
  sessionId: string
  email?: string
  appointmentId?: number | string
}

export interface FindBookingsResp {
  sessionId: string
  expireOn: number
  appointments: Availability[]
}

export interface RescheduleAppointmentPayload {
  sessionId: string
  appointmentToMove: { id: string }
  prescriptionId?: string | null
  maxResults?: number
  unitId?: string
  from?: string
  to?: string
}

export interface MoveAppointmentPayload {
  sessionId: string
  newAppointmentId: string
}
