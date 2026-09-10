import { BookAppointmentResponse } from './model';

export const BOOK_APPOINTMENT_RESP: BookAppointmentResponse = {
  appointment: {
    id: '36e186b2-15d5-4d98-b3ed-a108b07384e7',
    dateTime: '2024-04-30T11:00:00.000Z',
    location: {
      id: 'e6c5b143-d688-a14a-a280-29180816ac28',
      name: 'MONDINO',
      description: 'RM1.5 - RADIOLOGIA E DIAGNOSTICA PER IMMAGINI',
      postCode: '002058',
    },
    descriptionList: [],
    status: 'BOOKED',
    physician: {
      id: 'bc3a02c0-1047-427e-ae6a-4161593aa5a0',
      firstName: 'MAGNETICA 1,5',
      lastName: 'RISONANZA',
    },
    billingInfo: [
      {
        status: 'REQUIRED',
        contractName: 'a1cf881f-bd02-4711-bdee-e3be238d8f0a',
        finalPrice: 506.0,
      },
    ],
    additionalProperties: {
      idReserve: '1c571db5-298b-490b-90ed-50db8ef122bb',
      contractId: 'a1cf881f-bd02-4711-bdee-e3be238d8f0a',
      a4hAppointmentId: '2024-500460',
      time: '11:00 - 11:30',
      token: '7d86a3f9-1967-e5c9-68c3-99f8365de117',
      preparation: [
        {
          productCode: '6988915PG',
          note: null,
          link: 'https://www.mondino.it/documentazioneprestazioni/notepreparazioneRM.pdf',
        },
        {
          productCode: '6988915AG',
          note: null,
          link: 'https://www.mondino.it/documentazioneprestazioni/notepreparazioneRM.pdf',
        },
      ],
      flowType: 'SOLV',
    },
    serviceDescriptionList: [
      {
        id: '6988915PG',
        description: 'ANGIO-RISONANZA MAGNETICA CIRCOLO CEREBRALE PRIMI STRUMENTALI',
      },
      {
        id: '6988915AG',
        description: 'ANGIO-RISONANZA MAGNETICA CIRCOLO CEREBRALE ',
      },
    ],
  },
  additionalProperties: {},
};
