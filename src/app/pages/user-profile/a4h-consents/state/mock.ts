import { ResponseUserA4HPrivacyConsent } from './model';

export const MOCK_A4H_CONSENTS: ResponseUserA4HPrivacyConsent = {
  Esito: 'OK',
  Errore: '',
  CodiceErrore: '',
  PrivacyPDF:
    'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK',
  consentPrivacyAccepted: false,
};

export const MOCK_OTHER_CONSENTS: any = [
  {
    Id: '2c7e764b-6f4d-4acb-a7a3-c76cd5afa7a0',
    Type: {
      Key: '196',
      Value: 'Consegna Informativa',
      KeyValue: '196-Consegna Informativa',
    },
    IdCompanyCode: 'd5ecf2e2-9261-450c-b2b6-e4e3b16f1648',
    ValidFrom: '2022-12-02T00:00:00+01:00',
    ValidTo: null,
    WithdrawalDate: null,
    IsAgree: true,
  },
  {
    Id: '88b8163d-0172-4250-8480-54decf1f1599',
    Type: {
      Key: 'CLI',
      Value: 'Inserimenti clinici pregressi',
      KeyValue: 'CLI-Inserimenti clinici pregressi',
    },
    IdCompanyCode: 'b66951c2-e9d4-4000-9011-1fb3a46a9ca7',
    ValidFrom: '2025-07-03T00:00:00+02:00',
    ValidTo: null,
    WithdrawalDate: null,
    IsAgree: true,
  },
  {
    Id: '4861f473-1ca0-4272-9734-d137db4ef2d3',
    Type: {
      Key: '196',
      Value: 'Consegna Informativa',
      KeyValue: '196-Consegna Informativa',
    },
    IdCompanyCode: 'b66951c2-e9d4-4000-9011-1fb3a46a9ca7',
    ValidFrom: '2025-07-03T00:00:00+02:00',
    ValidTo: null,
    WithdrawalDate: null,
    IsAgree: true,
  },
  {
    Id: '1df4a2ac-3c8f-4926-b009-9d580c247893',
    Type: {
      Key: 'REF',
      Value: 'Referti on-line',
      KeyValue: 'REF-Referti on-line',
    },
    IdCompanyCode: 'b66951c2-e9d4-4000-9011-1fb3a46a9ca7',
    ValidFrom: '2025-07-03T00:00:00+02:00',
    ValidTo: null,
    WithdrawalDate: null,
    IsAgree: true,
  },
];
