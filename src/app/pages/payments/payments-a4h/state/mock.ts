import { Payment, PaymentPending, PrescriptionType } from './model';

export const PENDING_PAYMENTS_A4H: PaymentPending = {
  groupedAppointments: [
    {
      creationDate: 1789722419330,
      appointmentDate: 1794474000000,
      episodeNumber: '2026000292',
      structure: {
        id: 'e6c5b143-d688-a14a-a280-29180816ac28',
        code: 'MNDCEN',
        name: 'MONDINO',
        text: null,
        synonym: null,
      },
      amount: 255.0,
      patientQuote: 255.0,
      orders: [
        {
          orderNumber: '2026-00000893',
          orderId: '7a33a21b-9f6b-40fa-92be-b64f00a2236e',
          scheduledOn: '2026-11-12T10:00:00+01:00',
          activity: {
            id: '92ec560d-00c4-0b4b-bf96-382b1303b792',
            code: '6988918',
            name: 'ANGIO-RMN VASI DEL COLLO',
            text: null,
            synonym: null,
          },
          message: null,
          nre: null,
          contract: PrescriptionType.SOLV,
          creationDate: 1789722419330,
        },
        {
          orderNumber: '2026-00000895',
          orderId: 'b1f2c3d4-e5f6-47a8-9b0c-1d2e3f4a5b6c',
          scheduledOn: '2026-11-13T09:30:00+01:00',
          activity: {
            id: '3c9b6d21-1122-4a3b-8c4d-5e6f7a8b9c0d',
            code: '6988920',
            name: 'RMN COLONNA CERVICALE',
            text: null,
            synonym: null,
          },
          message: null,
          nre: null,
          contract: PrescriptionType.SSN,
          creationDate: 1789722419330,
        },
        {
          orderNumber: '2026-00000896',
          orderId: 'c2d3e4f5-a6b7-48c9-0d1e-2f3a4b5c6d7e',
          scheduledOn: '2026-11-14T15:00:00+01:00',
          activity: {
            id: '4d0c7e32-2233-5b4c-9d5e-6f7a8b9c0d1e',
            code: '6988921',
            name: 'VISITA CARDIOLOGICA',
            text: null,
            synonym: null,
          },
          message: null,
          nre: null,
          contract: PrescriptionType.LP,
          creationDate: 1789722419330,
        },
      ],
    },
    {
      creationDate: 1789722419330,
      appointmentDate: 1794474000000,
      episodeNumber: '2026000293',
      structure: {
        id: 'e6c5b143-d688-a14a-a280-29180816ac28',
        code: 'MNDCEN',
        name: 'MONDINO',
        text: null,
        synonym: null,
      },
      amount: 255.0,
      patientQuote: 255.0,
      orders: [
        {
          orderNumber: '2026-00000894',
          orderId: '7a33a21b-9f6b-40fa-92be-b64f00a2236f',
          scheduledOn: '2026-11-12T10:00:00+01:00',
          activity: {
            id: '92ec560d-00c4-0b4b-bf96-382b1303b792',
            code: '6988918',
            name: 'ANGIO-RMN VASI DEL COLLO',
            text: null,
            synonym: null,
          },
          message: null,
          nre: null,
          contract: PrescriptionType.SOLV,
          creationDate: 1789722419330,
        },
        {
          orderNumber: '2026-00000897',
          orderId: 'd3e4f5a6-b7c8-49d0-1e2f-3a4b5c6d7e8f',
          scheduledOn: '2026-11-15T11:15:00+01:00',
          activity: {
            id: '5e1d8f43-3344-6c5d-0e6f-7a8b9c0d1e2f',
            code: '6988922',
            name: 'ECOGRAFIA ADDOME COMPLETO',
            text: null,
            synonym: null,
          },
          message: null,
          nre: null,
          contract: PrescriptionType.SLP,
          creationDate: 1789722419330,
        },
      ],
    },
  ],
};

export const LIST_PAYMENTS_A4H: Payment[] = [
  {
    id: '4081b6a5-30f8-4b9f-85d4-218dacf523ff',
    amount: 292.0,
    createdOn: '2026-07-13T11:32:59+02:00',
    description: null,
    prescriptions: [
      {
        description: 'RMN ENCEFALO E TRONCO ENCEFALO SENZA CONTRASTO',
        scheduledOn: '2026-07-13T16:45:00+02:00',
      },
      {
        description: 'VISITA NEUROLOGICA DI CONTROLLO',
        scheduledOn: '2026-07-14T09:00:00+02:00',
      },
      {
        description: 'PRELIEVO EMATOCHIMICO',
        scheduledOn: '2026-07-14T08:15:00+02:00',
      },
    ],
  },
  {
    id: '69fc8ee6-58a6-44b0-9f88-624c43267f00',
    amount: 255.0,
    createdOn: '2026-06-03T14:17:55+02:00',
    description: null,
    prescriptions: [
      {
        description: 'ANGIO-RMN VASI DEL COLLO',
        scheduledOn: '2026-07-30T10:30:00+02:00',
      },
    ],
  },
];
