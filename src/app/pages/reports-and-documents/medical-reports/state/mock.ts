import { PaymentStatus } from './model';

export const LAB_DOCUMENT = {
  header: {
    documentId: 'ASL2_2-09123006-20230912080500',
    creationDate: '2023-09-14T14:00:22.000+00:00',
    paymentStatus: '1',
  },
  body: {
    mimeType: 'application/pdf',
    fileName: 'referto-22522850.pdf',
    content:
      'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK',
  },
};

export const LAB_DOCUMENT_TWO = {
  body: {
    content:
      'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoK MiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoz IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQy XQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9u dCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5 cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1Jv bWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAov RjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhy ZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAw MDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAw MDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVF T0YK',
    encodedBase64: true,
  },
};

export const SINGL_REPORT_LINK =
  'aHR0cHM6Ly9yYWRpb2xvZ2lhLmFjaXNtb20uaXQvP3RpY2tldD0zNUVrSlktMXU3R0tjWldQUktCLTZB';

export const DOCS_TYPE = [
  {
    code: '59258-4',
    label: 'Verbale di pronto soccorso',
  },
  {
    code: '11502-2',
    label: 'Referto di Laboratorio',
  },
  {
    code: '34105-7',
    label: 'Lettera di dimissione ospedaliera',
  },
];

export const MOCK_DOCS_PADOVA = {
  documents: [
    {
      documentId: '5918521',
      patientId: '12213239128',
      name: 'CARD_AO_2020100000170',
      releaseDate: '2024-10-28T13:14:42.000+00:00',
      opaque: false,
      state: 'NORMAL', //'LOCKED'
      additionalInfo: {
        expiredDate: '2024-12-12',
      },
      paymentStatus: '0',
      size: '43 kb',
    },
    {
      documentId: '5918522',
      patientId: '12213239128',
      name: 'CARD_AO_2020100000170',
      releaseDate: '2024-10-28T13:14:42.000+00:00',
      opaque: false,
      state: 'NORMAL', //'LOCKED'
      additionalInfo: {
        expiredDate: '2024-12-12',
      },
      paymentStatus: '0',
      size: '43 kb',
    },
    {
      documentId: '5918483',
      patientId: '12213239128',
      name: 'AMB_GASTRO_AO_20185438180',
      releaseDate: '2024-10-24T14:04:24.000+00:00',
      opaque: false,
      state: 'NORMAL',
      additionalInfo: {
        expiredDate: '2024-12-08',
      },
      paymentStatus: '1',
      size: '100 kb',
    },
  ],
};
export const MOCK_DOCS = {
  documents: [
    {
      documentId: '2.16.840.1.113883.2.9.2.0.0.0^70520240606130036',
      repositoryId: '2.16.840.1.113883.2.9.2.190.925.3.1',
      name: 'Consulenza',
      mimeType: 'application/pdf',
      releaseDate: '2024-06-06T12:51:16.000+00:00',
      opaque: false,
      paymentStatus: '1' as PaymentStatus,
      classification: {
        classes: {
          label: 'Referto (report)',
        },
        practice: {
          label: 'CONSULENZA (U.O.C. OTORINOLARINGOIATRIA)',
        },
        type: {
          label: 'Consulenza',
        },
        format: {
          label: 'PDF',
        },
        healthcareFacilityType: {
          label: 'Ospedale',
        },
      },
      additionalInfo: {
        size: '456 kb',
        expiredDate: '2026-07-20',
      },
    },
    {
      documentId: '2.16.840.1.113883.2.9.2.0.0.0^70520240606130037',
      repositoryId: '2.16.840.1.113883.2.9.2.190.925.3.1',
      name: 'Consulenza1',
      mimeType: 'application/pdf',
      releaseDate: '2024-06-28T12:51:16.000+00:00',
      opaque: false,
      paymentStatus: '0' as PaymentStatus,
      classification: {
        classes: {
          label: 'Referto-11 (report)',
        },
        practice: {
          label: 'CONSULENZA-1 (U.O.C. OTORINOLARINGOIATRIA)',
        },
        type: {
          label: 'Consulenza',
        },
        format: {
          label: 'PDF',
        },
        healthcareFacilityType: {
          label: 'Ospedale-1',
        },
      },
      additionalInfo: {
        size: '456 kb',
        expiredDate: '2026-07-21',
      },
    },
    {
      documentId: '2.16.840.1.113883.2.9.2.0.0.0^70520240606130038',
      repositoryId: '2.16.840.1.113883.2.9.2.190.925.3.1',
      name: 'Consulenza2',
      mimeType: 'application/pdf',
      releaseDate: '2024-06-14T12:51:16.000+00:00',
      opaque: false,
      paymentStatus: '1' as PaymentStatus,
      classification: {
        classes: {
          label: 'Referto-22 (report)',
        },
        practice: {
          label: 'CONSULENZA-2 (U.O.C. OTORINOLARINGOIATRIA)',
        },
        type: {
          label: 'Consulenza',
        },
        format: {
          label: 'PDF',
        },
        healthcareFacilityType: {
          label: 'Ospedale-2',
        },
      },
      additionalInfo: {
        size: '456 kb',
        expiredDate: '2026-07-22',
      },
    },
  ],
};
