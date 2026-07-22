import { ATTACHMENT_STATUS, REPORT_PAYMENT_STATUS, REPORT_STATUS } from './model';

export const SESSION_REPORT_RESPONSE = {
  sessionId: 'vZez9W0u3BefHPreAMtBADSQ4vdD58nOXwlRZIzTzEv43A1SHB',
  mode: 'SMS',
  recipient: '*************915',
  code: '123456',
};

export const SINGLE_REPORT = [
  {
    id: 'report1',
    status: REPORT_STATUS.READY,
    metaInfo: {
      object: 'Risposta mockata BE - oggetto referto 1',
    },
    paymentInfo: {
      amount: null,
      status: REPORT_PAYMENT_STATUS.PAYED,
      strAmount: null,
    },
    subject: 'Referto di Laboratorio-1',
    date: '2026-01-27T07:23:37Z',
    conclusion: '',
    attachments: [
      {
        id: 'report1-attachment1',
        title: 'Descr. di Laboratorio',
        relatedId: 'null_3A47DC2DA7AE946C',
        date: '2026-01-11T07:23:37Z',
        length: 85067,
        status: ATTACHMENT_STATUS.READY,
        type: 'PDF',
        extension: '.pdf',
        internalBinaryFormat: 'PDF',
      },
      {
        id: 'report1-attachment1',
        title: 'Descr. di Laboratorio 2',
        relatedId: 'null_3A47DC2DA7AE946C',
        date: '2026-01-11T07:23:37Z',
        length: 85067,
        status: ATTACHMENT_STATUS.READY,
        type: 'PDF',
        extension: '.pdf',
        internalBinaryFormat: 'PDF',
      },
    ],
    patient: {
      id: '4241349',
      fiscalCode: 'PRVPHX20S69L407K',
      firstName: 'PATHOXWEB',
      lastName: 'PROVA  ',
      gender: 'F',
      birthDate: '2020-11-29',
    },
  },
  {
    id: 'report2',
    status: REPORT_STATUS.READY,
    metaInfo: {
      object: 'Risposta mockata BE - oggetto referto 2',
    },
    paymentInfo: {
      amount: null,
      status: REPORT_PAYMENT_STATUS.PAYED,
      strAmount: null,
    },
    subject: 'Referto di Laboratorio-2',
    date: '2026-01-28T07:23:37Z',
    conclusion: '',
    attachments: [
      // {
      //   id: 'report2-attachment1',
      //   title: 'Referto di Laboratorio',
      //   relatedId: 'null_3A47DC2DA7AE946C',
      //   date: '2026-01-12T07:23:37Z',
      //   length: 85067,
      //   status: ATTACHMENT_STATUS.READY,
      //   type: 'PDF',
      //   extension: '.pdf',
      //   internalBinaryFormat: 'PDF',
      // },
      // {
      //   id: 'report2-attachment2',
      //   title: 'Referto di Laboratorio',
      //   relatedId: 'null_3A47DC2DA7AE946C',
      //   date: '2026-01-13T07:23:37Z',
      //   length: 85067,
      //   status: ATTACHMENT_STATUS.READY,
      //   type: 'LINK',
      //   extension: '.pdf',
      //   internalBinaryFormat: 'PDF',
      // },
    ],
    patient: {
      id: '4241349',
      fiscalCode: 'PRVPHX20S69L407K',
      firstName: 'PATHOXWEB',
      lastName: 'PROVA  ',
      gender: 'F',
      birthDate: '2020-11-29',
    },
  },
];

export const SINGL_REPORT_LINK =
  'aHR0cHM6Ly9yYWRpb2xvZ2lhLmFjaXNtb20uaXQvP3RpY2tldD0zNUVrSlktMXU3R0tjWldQUktCLTZB';

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
