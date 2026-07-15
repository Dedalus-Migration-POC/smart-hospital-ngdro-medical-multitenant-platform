import { Booking, PrivateAvailability, RetrievePrestazioni, Schedule } from './model';

export const GET_RESERVATION_LIST: Booking = {
  schedules: [
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress: '[non presente]',
      // "Contrada Consolida - Agrigento - Tel. 0922/442111 Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2024_764540',
      importoTotale: '16.01',
      notePaziente: null,
      numImpegnativa: 'NON RICHIESTO',
      prescrittoreImpegnativaCodiceFiscale: 'NON RILEVATO',
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '09/12/2025 15:00',
          code: 'AZIENDA',
          description: 'RAD RAD/T87432L Altra Radiografia Di Coste, Sterno E Clavicola - Sinistra',
        },
        {
          date: '09/12/2025 15:00',
          code: 'AZIENDA2',
          description: 'ORL ORL/T897ORL VISITA GENERALE OTORINOLARINGOIATRICA',
        },
      ],
    },
    {
      structure: 'ORL PO AG',
      structureAddress: 'ORL PO',
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2024_773605',
      importoTotale: '20.66',
      notePaziente: null,
      numImpegnativa: '1900A4829744947',
      prescrittoreImpegnativaCodiceFiscale: 'PLMNTN53H19G282V',
      prescrittoreImpegnativaCognome: 'PALMA/ANTONIO',
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '12/12/2025 12:00',
          code: 'AZIENDA',
          description: 'ORL ORL/T897ORL VISITA GENERALE OTORINOLARINGOIATRICA',
        },
      ],
    },
    {
      structure: 'Radiologia - RX PO AG',
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2024_775856-1',
      importoTotale: '21.17',
      notePaziente: null,
      numImpegnativa: 'NON RICHIESTO',
      prescrittoreImpegnativaCodiceFiscale: 'NON RILEVATO',
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '13/12/2024 10:00',
          code: 'AZIENDA',
          description:
            'RAD RAD/T8827AR Radiografia Del Femore, Ginocchio E Gamba - Rx Femore - Destro',
        },
      ],
    },
    {
      structure: 'Radiologia - RX PO AG',
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2024_764412-1',
      importoTotale: '17.82',
      notePaziente: null,
      numImpegnativa: 'NON RICHIESTO',
      prescrittoreImpegnativaCodiceFiscale: 'NON RILEVATO',
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '06/10/2025 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
        {
          date: '06/10/2025 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88213 RX DEL BRACCIO',
        },
      ],
    },
  ],
  userMessage: '',
  hl7Messages:
    '<?xml version="1.0" encoding="UTF-8"?> <SQR_S25 xmlns="urn:hl7-org:v2xml"> ... </SQR_S25>',
};

export const GET_RESERVATION_LIST_EMPTY_LIST: Booking = {
  schedules: [],
  userMessage: '404',
  hl7Messages: '',
};

export const GET_RESERVATION_LIST_ERROR: Booking = {
  schedules: [],
  userMessage:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  hl7Messages: '',
};

export const DELETE_RESERVATION: Schedule = {
  structure: '',
  structureCity: '',
  structureCompany: '',
  scheduleCode: '',
  importoTotale: null,
  notePaziente: null,
  numImpegnativa: null,
  prescrittoreImpegnativaCodiceFiscale: null,
  prescrittoreImpegnativaCognome: null,
  prescrittoreImpegnativaNome: null,
  services: [],
};

export const FIND_FIRST_AVAILABILITY: Booking = {
  schedules: [
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress: '[non presente]',
      // "Contrada Consolida - Agrigento - Tel. 0922/442111 Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2024_764540',
      importoTotale: '16.01',
      notePaziente: null,
      numImpegnativa: 'NON RICHIESTO',
      prescrittoreImpegnativaCodiceFiscale: 'NON RILEVATO',
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '09/12/2024 15:00',
          code: 'AZIENDA',
          description: 'RAD RAD/T87432L Altra Radiografia Di Coste, Sterno E Clavicola - Sinistra',
        },
        {
          date: '09/12/2024 15:00',
          code: 'AZIENDA2',
          description: 'ORL ORL/T897ORL VISITA GENERALE OTORINOLARINGOIATRICA',
        },
      ],
    },
  ],
  userMessage: '',
  hl7Messages:
    '<?xml version="1.0" encoding="UTF-8"?> <SQR_S25 xmlns="urn:hl7-org:v2xml"> ... </SQR_S25>',
};

export const FIND_FIRST_AVAILABILITY_EMPTY: Booking = {
  schedules: [],
  userMessage: '',
  hl7Messages: {},
};

export const FIND_AVAILABILITY: Booking = {
  schedules: [
    {
      structure: 'U.O. Pediatrica Radiologia Agrigento',
      structureAddress: '[non presente]',
      // "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
      importoTotale: '36.43',
      notePaziente: null,
      numImpegnativa: null,
      prescrittoreImpegnativaCodiceFiscale: null,
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '15/02/2026 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
      ],
    },
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress:
        "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2025_651397_884_193_1',
      importoTotale: '36.43',
      notePaziente: null,
      numImpegnativa: null,
      prescrittoreImpegnativaCodiceFiscale: null,
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '15/02/2026 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
      ],
    },
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress:
        "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
      importoTotale: '36.43',
      notePaziente: null,
      numImpegnativa: null,
      prescrittoreImpegnativaCodiceFiscale: null,
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '15/02/2026 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
      ],
    },
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress:
        "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2025_651397_884_193_1',
      importoTotale: '36.43',
      notePaziente: null,
      numImpegnativa: null,
      prescrittoreImpegnativaCodiceFiscale: null,
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '15/02/2026 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
      ],
    },
    {
      structure: 'U.O. Radiologia Agrigento',
      structureAddress:
        "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
      structureCity: 'AGRIGENTO (AG)',
      structureCompany: 'ASP_Agrigento',
      scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
      importoTotale: '36.43',
      notePaziente: null,
      numImpegnativa: null,
      prescrittoreImpegnativaCodiceFiscale: null,
      prescrittoreImpegnativaCognome: null,
      prescrittoreImpegnativaNome: null,
      services: [
        {
          date: '15/02/2026 09:34',
          code: 'AZIENDA',
          description: 'C24 C24/88272 RX DEL GINOCCHIO',
        },
      ],
    },
  ],
  userMessage: '',
  hl7Messages: '<?xml version="1.0" encoding="UTF-8"?><SQR_S25>...</SQR_S25>',
};

export const RESERVE: Schedule = {
  structure: 'U.O. Radiologia Agrigento',
  structureAddress: '[non presente]',
  // "Contrada Consolida - Agrigento - Tel. 0922/442111 Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
  structureCity: 'AGRIGENTO (AG)',
  structureCompany: 'ASP_Agrigento',
  scheduleCode: 'S201.AZIENDA.2024_764540',
  importoTotale: '16.01',
  notePaziente: null,
  numImpegnativa: 'NON RICHIESTO',
  prescrittoreImpegnativaCodiceFiscale: 'NON RILEVATO',
  prescrittoreImpegnativaCognome: null,
  prescrittoreImpegnativaNome: null,
  services: [
    {
      date: '09/12/2024 15:00',
      code: 'AZIENDA',
      description: 'RAD RAD/T87432L Altra Radiografia Di Coste, Sterno E Clavicola - Sinistra',
    },
    {
      date: '09/12/2024 15:00',
      code: 'AZIENDA2',
      description: 'ORL ORL/T897ORL VISITA GENERALE OTORINOLARINGOIATRICA',
    },
  ],
};

export const FIND_PRIVATE_AVAILABILITY: PrivateAvailability = {
  scheduleList: {
    schedules: [
      {
        structure: 'U.O. Radiologia Agrigento',
        structureAddress: '[non presente]',
        // "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
        structureCity: 'AGRIGENTO (AG)',
        structureCompany: 'ASP_Agrigento',
        scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
        importoTotale: '36.43',
        notePaziente: null,
        numImpegnativa: null,
        prescrittoreImpegnativaCodiceFiscale: null,
        prescrittoreImpegnativaCognome: null,
        prescrittoreImpegnativaNome: null,
        services: [
          {
            date: '15/02/2026 09:34',
            code: 'AZIENDA',
            description: 'C24 C24/88272 RX DEL GINOCCHIO',
          },
        ],
      },
      {
        structure: 'U.O. Radiologia Agrigento',
        structureAddress:
          "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
        structureCity: 'AGRIGENTO (AG)',
        structureCompany: 'ASP_Agrigento',
        scheduleCode: 'S201.AZIENDA.2025_651397_884_193_1',
        importoTotale: '36.43',
        notePaziente: null,
        numImpegnativa: null,
        prescrittoreImpegnativaCodiceFiscale: null,
        prescrittoreImpegnativaCognome: null,
        prescrittoreImpegnativaNome: null,
        services: [
          {
            date: '15/02/2026 09:34',
            code: 'AZIENDA',
            description: 'C24 C24/88272 RX DEL GINOCCHIO',
          },
        ],
      },
      {
        structure: 'U.O.S. DIP CARDIOLOGIA PEDIATRICA ALTRA INFO',
        structureAddress:
          "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
        structureCity: 'AGRIGENTO (AG)',
        structureCompany: 'ASP_Agrigento',
        scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
        importoTotale: '36.43',
        notePaziente: null,
        numImpegnativa: null,
        prescrittoreImpegnativaCodiceFiscale: null,
        prescrittoreImpegnativaCognome: null,
        prescrittoreImpegnativaNome: null,
        services: [
          {
            date: '15/02/2026 09:34',
            code: 'AZIENDA',
            description: 'C24 C24/88272 RX DEL GINOCCHIO',
          },
        ],
      },
      {
        structure: 'U.O. Pediatriche ALTRA INFO Radiologia Agrigento',
        structureAddress:
          "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
        structureCity: 'AGRIGENTO (AG)',
        structureCompany: 'ASP_Agrigento',
        scheduleCode: 'S201.AZIENDA.2025_651397_884_193_1',
        importoTotale: '36.43',
        notePaziente: null,
        numImpegnativa: null,
        prescrittoreImpegnativaCodiceFiscale: null,
        prescrittoreImpegnativaCognome: null,
        prescrittoreImpegnativaNome: null,
        services: [
          {
            date: '15/02/2026 09:34',
            code: 'AZIENDA',
            description: 'C24 C24/88272 RX DEL GINOCCHIO',
          },
        ],
      },
      {
        structure: 'U.O. Radiologia Agrigento',
        structureAddress:
          "Contrada Consolida - Agrigento - Tel. 0922/442111. Importante: l'importo complessivo del ticket deve essere corrisposto prima dell'accesso al servizio/ambulatorio di destinazione.",
        structureCity: 'AGRIGENTO (AG)',
        structureCompany: 'ASP_Agrigento',
        scheduleCode: 'S201.AZIENDA.2025_651397_884_193_0',
        importoTotale: '36.43',
        notePaziente: null,
        numImpegnativa: null,
        prescrittoreImpegnativaCodiceFiscale: null,
        prescrittoreImpegnativaCognome: null,
        prescrittoreImpegnativaNome: null,
        services: [
          {
            date: '15/02/2026 09:34',
            code: 'AZIENDA',
            description: 'C24 C24/88272 RX DEL GINOCCHIO',
          },
        ],
      },
    ],
    userMessage: '',
    hl7Messages: '<?xml version="1.0" encoding="UTF-8"?><SQR_S25>...</SQR_S25>',
  },
};

export const RETRIEVE_PRESTAZIONI: RetrievePrestazioni = {
  documents: [
    {
      groupKey: '889142',
      codRegPrest: '889142',
      descPrest: 'RISONANZA MAGNETICA NUCLEARE (RM) DEL MASSICCIO FACCIALE, SENZA E CON CONTRASTO',
      medici: [],
    },
    {
      groupKey: '889143',
      codRegPrest: '889143',
      descPrest: 'RM DEL MASSICCIO FACCIALE, SENZA CONTRASTO',
      medici: [
        {
          idStrutturaAcc: 818,
          codMemoStrutturaAcc: '6907',
          descStrutturaAcc: 'U.O.C. NEURORADIOLOGIA',
          idAgenda: 1897,
          codMemoAgenda: 'LPNEURAD03',
          descAgenda: 'Dr. Bianchi Luca - U.O.C. Neuroradiologia - ALPI - PAD F PIANO TERRA (RM)',
          cdcAgenda: null,
          idMedico: 2,
          descMedico: 'BIANCHI Luca',
          cognomeMedico: 'Bianchi',
          nomeMedico: 'Luca',
          prezzo: 250.5,
        },
        {
          idStrutturaAcc: 818,
          codMemoStrutturaAcc: '6907',
          descStrutturaAcc: 'U.O.C. NEURORADIOLOGIA',
          idAgenda: 1895,
          codMemoAgenda: 'LPNEURAD01',
          descAgenda:
            'Prof. LONGO Marcello (agenda equipe) - OBSOLETA - U.O.C. Neuroradiologia - ALPI - PAD F PIANO TERRA (RM)',
          cdcAgenda: null,
          idMedico: null,
          descMedico: 'Prof. LONGO Marcello',
          cognomeMedico: 'Longo',
          nomeMedico: 'Marcello',
          prezzo: 278.89,
        },
        {
          idStrutturaAcc: 818,
          codMemoStrutturaAcc: '6907',
          descStrutturaAcc: 'U.O.C. NEURORADIOLOGIA',
          idAgenda: 1896,
          codMemoAgenda: 'LPNEURAD02',
          descAgenda: 'Dr. Rossi Mario - U.O.C. Neuroradiologia - ALPI - PAD F PIANO TERRA (RM)',
          cdcAgenda: null,
          idMedico: 1,
          descMedico: 'ROSSI Mario',
          cognomeMedico: 'Rossi',
          nomeMedico: 'Mario',
          prezzo: 280.0,
        },
      ],
    },
  ],
};
