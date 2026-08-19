// export interface FetchPaymentsResponse {
//   practiceList: Payment[]
// }

// export interface Payment {
//   billingId?: string
//   appointmentId?: string
//   practiceId: string
//   branchCode: string
//   name?: string
//   location?: string
//   date?: number
//   amount: number
//   serviceId?: string
//   appointmentList?: Appointment[]
//   status: string
// }

// export interface Appointment {
//   id: string
//   dateTime: string
//   serviceDescriptionList: string
// }

export interface Location {
  id: string;
  name: string;
  municipality: string;
  postalCode: string;
  address: string;
  gpsCoordinate: string;
  taxCode: string;
}

export interface GpsCoordinate {
  longitude: number;
  latitude: number;
}
export interface LocationDetails {
  id: string;
  building: string;
  floor: string;
  room: string;
  department: string;
}

export interface Appointment {
  id: string;
  location: Location;
  lockCause: string;
  linkNote: string;
  checkInStatus: string;
  scheduledOn: string;
  description: string;
  locationDetails: LocationDetails;
  physician: string;
  ticketId: string;
  amount: number;
}

export interface PaymentSummary {
  id: string;
  amount: number;
  subtitle: string;
  paymentSystem?: string;
  iuv: string;
  taxCode: string;
  state: string;
  authorityId: string;
  authorityName: string;
  appointments: Appointment[];
  causale?: string;
  numeroRichiesta?: string;
}

export interface FetchPaymentsResponse {
  payments: PaymentSummary[];
}

export interface PayRequest {
  amount: number;
  practiceId: string;
  branchCode: string;
}

export interface PayResponse {
  params: { url: string };
}

export interface PagoPaLinkRequest {
  iuv: string;
  amount: string | number;
  reason: string;
  notificationEmail: string;
}
