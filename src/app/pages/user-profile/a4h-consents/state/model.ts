export interface RequestUserA4HPrivacyConsentPayload {
  idAnagrafico: string;
  taxCode: string;
  codiceStruttura: string;
}

export interface ResponseUserA4HPrivacyConsent {
  Esito: string;
  Errore?: string;
  CodiceErrore?: string;
  PrivacyPDF?: string;
  consentPrivacyAccepted: boolean;
}

export type ConsentsA4H = {
  Id: string;
  Type: {
    Key: string;
    Value: string;
    KeyValue: string;
  };
  IdCompanyCode?: string;
  ValidFrom?: string;
  ValidTo?: string;
  WithdrawalDate?: string;
  IsAgree: boolean;
};

export type ConsentsA4hAddPayload = {
  IdMPIPatient: string;
  Agreement: string; //    Key: RIC,
  IsAgree: boolean; // true
};

export type ConsentsA4hRevokePayload = {
  IdMPIPatient: string;
  Agreement: string; //    Key: 'RIC',
};

export type ConsentsA4hAddRevokeResponse = {
  esito: string;
  errore?: string;
  codiceErrore?: string;
};
