export interface IGetReportSessionResponse {
  sessionId: string;
  mode: string;
  recipient: string;
  code: string;
}

export interface IGetReportRequest {
  sessionId: string;
  code: string;
}

export interface IReport {
  id: string;
  subject: string;
  attachments: Array<IAttachment>;
  patient: IPatient;
  paymentInfo?: IPaymentInfo;
  status?: REPORT_STATUS;
  deliveryUnit?: string; // nome ospedale
  date?: string; // "2021-03-25T10:46:29Z"
  conclusion?: string;
  attachment?: IAttachment; //non arriva da BE ma faccio mapping in FE per cards
}

export interface IAttachment {
  id: string;
  title: string;
  status: ATTACHMENT_STATUS;
  date: any;
  type: string; // PDF
  length: string;
  relatedId: string;
  contentType?: string; // "application/pkcs7-mime"
  extension?: string; // ".p7m"
  link?: string;
}
export enum ATTACHMENT_STATUS {
  READY = 'READY',
  PENDING = 'PENDING',
  LOCKED = 'LOCKED',
}
export interface IPatient {
  id: string;
  fiscalCode: string;
  birthDate?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  phoneNumber?: string;
}
export interface IPaymentInfo {
  amount: any;
  status: REPORT_PAYMENT_STATUS;
  strAmount: string; // "euro 12.32"
}
export enum REPORT_PAYMENT_STATUS {
  UNKNOWN = 'UNKNOWN',
  UNSUPPORTED = 'UNSUPPORTED',
  PAYED = 'PAYED',
  PAYMENT_NOT_REQUIRED = 'PAYMENT_NOT_REQUIRED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
}
export enum REPORT_STATUS {
  READY = 'READY',
  PENDING = 'PENDING',
  LOCKED = 'LOCKED',
}
export type ReportEndpoint =
  | 'medical-report/api/single-report'
  | 'medical-report/api/multiple-reports';
