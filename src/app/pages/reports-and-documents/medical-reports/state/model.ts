export interface IDocumentsType {
  code: string;
  label: string;
}

export interface IDocumentsResponse {
  documents: IDocuments[];
}

export type PaymentStatus = '0' | '1';
export interface IDocuments {
  documentId: string;
  repositoryId?: string;
  name: string;
  mimeType?: string;
  releaseDate: string;
  opaque?: boolean;
  paymentStatus?: PaymentStatus | string;
  classification?: IClassification;
  size?: string;
  patientId?: string;
  state?: string;
  additionalInfo: {
    size?: string;
    expiredDate: string;
  };
}

export interface IClassification {
  classes: {
    label: string;
  };
  practice: {
    label: string;
  };
  type: {
    label: string;
  };
  format: {
    label: string;
  };
  healthcareFacilityType: {
    label: string;
  };
}
