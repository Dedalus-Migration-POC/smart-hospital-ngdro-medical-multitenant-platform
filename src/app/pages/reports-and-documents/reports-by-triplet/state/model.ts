export interface TripletReportRequest {
  organizationCode?: string;
  securityCode?: string;
  patientId?: string;
}

export interface LaboratoryReportTripletResponse {
  documents: ReportTriplet[];
}

export interface ReportTriplet {
  releaseDate: string;
  documentId: string;
  paymentStatus: '0' | '1';
}

export interface DownloadTripletReportRequest {
  organizationCode: string;
  documentId: string;
}

export interface Structure {
  code: string;
  label: string;
}
