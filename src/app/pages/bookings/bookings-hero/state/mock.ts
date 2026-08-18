import { AvailableDaysResponse, HealthcareUnitList, ServiceRequest } from './model';
import { addDays, set } from 'date-fns';

export const PROVINCES: string[] = [
  'AG',
  'AL',
  'AN',
  'AO',
  'AP',
  'AQ',
  'AR',
  'AT',
  'AV',
  'BA',
  'BG',
  'BI',
  'BL',
  'BN',
  'BO',
  'BR',
  'BS',
  'BT',
  'BZ',
  'CA',
  'CB',
  'CE',
  'CH',
  'CI',
  'MI',
];

export const CITIES: string[] = [
  'ACQUAFREDDA',
  'ACQUALUNGA',
  'ADRO',
  'AGNOSINE',
  'ALFIANELLO',
  'ALONE',
  'ANFO',
  'ANFURRO',
  'ANGOLO',
  'ANGOLO TERME',
  'ARMO',
  'ARTOGNE',
  'AVENONE',
  'MILANO',
  'RAFFADALI',
];

export const HEALTHCARE_UNIT_LIST: HealthcareUnitList = {
  healthcareUnits: [
    {
      id: '19092701',
      name: 'OSPEDALE CIVICO',
      description: 'OSPEDALE CIVICO',
    },
    {
      id: '19092702',
      name: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
      description: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
    },
  ],
};
export const AVAILABLE_DAYS_RESPONSE: AvailableDaysResponse = {
  appointments: [
    {
      id: 'appointment-111',
      dateTime: set(addDays(new Date(), 2), {
        hours: 9,
        minutes: 0,
      }).getTime(),
      location: {
        id: '0801*AMB',
        name: 'AMB 0801: CARDIOLOGIA CARDIOLOGIA CARDIOLOGIAaaaa',
        state: 'SICILIA',
        address: 'Via P.Za Leotta Nicola, 4',
      },
      physician: { firstName: 'Mario', lastName: 'Rossi', id: 'physician-111' },
      status: 'AVAILABLE',
      unitDescription: '0801*AMB - CARDIOLOGIA RAGG 2 ALEDEMA',
      billingInfo: [
        {
          status: 'REQUIRED',
          contractName: 'CUR-897CA - VISITA GENERALE CARDIOLOGICA',
          finalPrice: 20.66,
        },
      ],
      descriptionList: ['VISITA GENERALE CARDIOLOGICA'],
      serviceDescriptionList: [
        {
          id: 'CUR-897CA',
          description: 'VISITA GENERALE CARDIOLOGICA',
          notes:
            "INDICAZIONE PER PAZIENTE ADULTO:\\nPresentarsi a digiuno da almeno 6 ore; portare i precedenti esami. \\n\\nINDICAZIONE PER PAZIENTE PEDIATRICO:\\nADDOME INFERIORE:\\nNON NECESSITA DI DIGIUNO. Portare una bottiglietta d'acqua non gasata almeno 33 cc a temperatura ambiente.",
        },
        {
          id: 'CUR-8952',
          description: 'ELETTROCARDIOGRAMMA',
        },
      ],
      additionalProperties: {
        agenda_patient_text: 'NOTE GENERALI AGENDA',
      },
      isThirdPart: true,
      delegateFiscalCode: 'SGKFNS81E10F579K',
    },
    {
      id: 'appointment-222',
      dateTime: set(addDays(new Date(), 1), {
        hours: 10,
        minutes: 30,
      }).toISOString(),
      location: {
        id: '0801*AMB',
        name: 'AMB 0801: Altrove',
        state: 'SICILIA',
        address: 'Via P.Za Leotta Nicola, 4',
      },
      status: 'AVAILABLE',
      unitDescription: '0801*AMB - CARDIOLOGIA AMB. ELETTR. / ELETTROSTIM.',
      billingInfo: [
        {
          status: 'REQUIRED',
          contractName: 'CUR-897CA - VISITA GENERALE CARDIOLOGICA',
          finalPrice: 20.66,
        },
      ],
      descriptionList: ['VISITA GENERALE CARDIOLOGICA', 'ELETTROCARDIOGRAMMA'],
      serviceDescriptionList: [
        {
          id: 'CUR-897CA',
          description: 'VISITA GENERALE CARDIOLOGICA',
          notes:
            "INDICAZIONE PER PAZIENTE ADULTO:\\nPresentarsi a digiuno da almeno 6 ore; portare i precedenti esami. \\n\\nINDICAZIONE PER PAZIENTE PEDIATRICO:\\nADDOME INFERIORE:\\nNON NECESSITA DI DIGIUNO. Portare una bottiglietta d'acqua non gasata almeno 33 cc a temperatura ambiente.",
        },
        {
          id: 'CUR-8952',
          description: 'ELETTROCARDIOGRAMMA',
        },
      ],
      additionalProperties: {
        agenda_patient_text: 'NOTE GENERALI AGENDA',
      },
    },
    {
      id: 'appointment-333',
      dateTime: set(addDays(new Date(), -2), {
        hours: 11,
        minutes: 0,
      }).getTime(),
      location: {
        id: '0801*AMB',
        name: 'AMB 0801: CARDIOLOGIA CARDIOLOGIA CARDIOLOGIA',
        state: 'SICILIA',
        address: 'Via P.Za Leotta Nicola, 4',
      },
      status: 'AVAILABLE',
      unitDescription: '0801*AMB - CARDIOLOGIA RAGG 2 ALEDEMA',
      billingInfo: [
        {
          status: 'REQUIRED',
          contractName: 'CUR-897CA - VISITA GENERALE CARDIOLOGICA',
          finalPrice: 20.66,
        },
      ],
      descriptionList: ['VISITA GENERALE CARDIOLOGICA'],
      additionalProperties: {
        agenda_patient_text: 'NOTE GENERALI AGENDA',
      },
    },
    {
      id: 'appointment-444',
      dateTime: set(addDays(new Date(), 2), {
        hours: 17,
        minutes: 30,
      }).getTime(),
      location: {
        id: '0801*AMB',
        name: 'AMB 0801: Altrove',
        state: 'SICILIA',
        address: 'Via P.Za Leotta Nicola, 4',
      },
      status: 'AVAILABLE',
      unitDescription: '0801*AMB - CARDIOLOGIA AMB. ELETTR. / ELETTROSTIM.',
      billingInfo: [
        {
          status: 'REQUIRED',
          contractName: 'CUR-897CA - VISITA GENERALE CARDIOLOGICA',
          finalPrice: 20.66,
        },
      ],
      descriptionList: ['VISITA GENERALE CARDIOLOGICA'],
      additionalProperties: {
        agenda_patient_text: 'NOTE GENERALI AGENDA',
      },
    },
  ],
  availableDays: [
    {
      id: '1234',
      date: '2024-04-03',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE CIVICO',
    },
    {
      id: '1234',
      date: '2024-04-03',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
    },
    {
      id: '12',
      date: '2024-04-10',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE CIVICO',
    },
    {
      id: '12',
      date: '2024-04-10',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
    },
  ],
  status: 'OK',
};

export const AVAILABLE_DAYS_RESPONSE_BY_NRE: AvailableDaysResponse = {
  appointments: [
    {
      id: 'appointment-by-nre-111',
      dateTime: set(addDays(new Date(), 2), {
        hours: 9,
        minutes: 0,
      }).getTime(),
      location: {
        id: '0801*AMB',
        name: 'AMB 0801: CARDIOLOGIA CARDIOLOGIA CARDIOLOGIAaaaa',
        state: 'SICILIA',
        address: 'Via P.Za Leotta Nicola, 4',
      },
      status: 'AVAILABLE',
      unitDescription: '0801*AMB - CARDIOLOGIA RAGG 2 ALEDEMA',
      billingInfo: [
        {
          status: 'REQUIRED',
          contractName: 'CUR-897CA - VISITA GENERALE CARDIOLOGICA',
          finalPrice: 20.66,
        },
      ],
      descriptionList: ['VISITA GENERALE CARDIOLOGICA'],
      serviceDescriptionList: [
        {
          id: 'CUR-897CA',
          description: 'VISITA GENERALE CARDIOLOGICA',
          notes:
            "INDICAZIONE PER PAZIENTE ADULTO:\\nPresentarsi a digiuno da almeno 6 ore; portare i precedenti esami. \\n\\nINDICAZIONE PER PAZIENTE PEDIATRICO:\\nADDOME INFERIORE:\\nNON NECESSITA DI DIGIUNO. Portare una bottiglietta d'acqua non gasata almeno 33 cc a temperatura ambiente.",
        },
        {
          id: 'CUR-8952',
          description: 'ELETTROCARDIOGRAMMA',
        },
      ],
      additionalProperties: {
        agenda_patient_text: 'NOTE GENERALI AGENDA',
      },
      isThirdPart: true,
      delegateFiscalCode: 'SGKFNS81E10F579K',
    },
  ],
  availableDays: [
    {
      id: '1234',
      date: '2024-04-03',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE CIVICO',
    },
    {
      id: '1234',
      date: '2024-04-03',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
    },
    {
      id: '12',
      date: '2024-04-10',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE CIVICO',
    },
    {
      id: '12',
      date: '2024-04-10',
      hospitalId: '19092701',
      hospitalName: 'OSPEDALE DEI BAMBINI G. DI CRISTINA',
    },
  ],
  status: 'OK',
};

export const SERVICE_REQUEST_LIST: ServiceRequest[] = [
  {
    id: 7980152,
    service: {
      id: '86.30.3_0',
      name: 'DIATERMOCOAGULAZIONE',
      authorityCode: '86.30.3',
    },
  },
  {
    id: 7980153,
    service: {
      id: '86.30.1_0',
      name: 'CRIOTERAPIA CON AZOTO LIQUIDO',
      authorityCode: '86.30.1',
    },
  },
];

export const SERVICE_LIST = [
  {
    id: 'PA000781',
    name: 'VISITA CARDIOLOGICA GENERALE',
    description: 'VISITA CARDIOLOGICA GENERALE',
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '2',
    enabled: true,
    authorityCode: '897CA-',
  },
  {
    id: 'PA000665',
    name: 'VISITA CARDIOLOGICA DI CONTROLLO',
    description: 'VISITA CARDIOLOGICA DI CONTROLLO',
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '2',
    enabled: true,
    authorityCode: '8901CA-',
  },
  {
    id: 'PA000401',
    name: "DISABILITA' CONSEGUENTI A PATOLOGIE INTERNISTICHE-CARDIOLOGICO (CICLO DI 10 SEDUTE)- PR8",
    description:
      "DISABILITA' CONSEGUENTI A PATOLOGIE INTERNISTICHE-CARDIOLOGICO (CICLO DI 10 SEDUTE)- PR8",
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '12',
    enabled: true,
    authorityCode: '938001-',
  },
  {
    id: 'PA000736',
    name: 'RIABILITAZIONE CARDIOLOGICA',
    description: 'RIABILITAZIONE CARDIOLOGICA',
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '2',
    enabled: true,
    authorityCode: '9336-',
  },
  {
    id: 'CUR24-89.7A.3',
    name: 'PRIMA VISITA CARDIOLOGICA. INCLUSO: ECG (89.52)',
    description: 'PRMA VISITA CARDIOLOGICA. INCLUSO: ECG (89.52)',
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '8',
    regionalCode: '89.7A.3',
    enabled: true,
    authorityCode: '89.7A.3',
  },
  {
    id: 'PA24000012',
    name: 'PRIMA VISITA CARDIOLOGICA. INCLUSO: ECG (89.52)',
    description: 'PRIMA VISITA CARDIOLOGICA. INCLUSO: ECG (89.52)',
    type: 'Radiologia',
    packageMode: 'PackageMode.1',
    disciplineId: '8',
    enabled: true,
    authorityCode: '89.7A.3-',
  },
  {
    id: 'CUR24-89.01.3',
    name: 'VISITA CARDIOLOGICA DI CONTROLLO. INCLUSO EVENTUALE ECG.',
    description: 'VISITA CARDIOLOGICA DI CONTROLLO. INCLUSO EVENTUALE ECG.',
    type: 'Consulenze',
    packageMode: 'PackageMode.1',
    disciplineId: '8',
    regionalCode: '89.01.3',
    enabled: true,
    authorityCode: '89.01.3',
  },
];

export const PHISICIAN_LIST = [
  {
    id: 'CLLMCH56B04E974J',
    firstName: 'MELCHIORRE GILBERT',
    lastName: 'CELLURA',
    fiscalCode: 'CLLMCH56B04E974J',
  },
  {
    id: 'CRRGLN74T62H792H',
    firstName: 'GIULIANA',
    lastName: 'CERRUTO',
    fiscalCode: 'CRRGLN74T62H792H',
  },
  {
    id: 'CRRGPP71B17G273L',
    firstName: 'GIUSEPPE',
    lastName: 'CIRRINCIONE',
    fiscalCode: 'CRRGPP71B17G273L',
  },
  {
    id: 'FRNMRA68S52G273K',
    firstName: 'MARIA',
    lastName: 'FIORINO',
    fiscalCode: 'FRNMRA68S52G273K',
  },
  {
    id: 'FRTGRG88H26G273U',
    firstName: 'GIORGIO',
    lastName: 'FIRETTO',
    fiscalCode: 'FRTGRG88H26G273U',
  },
];

export const TYPO_DELEGA_LIST = {
  name: 'tipodelega',
  description: 'Elenco tipo di rapporto con persona delegante per prenotazione vaccini',
  items: [
    {
      key: '1',
      label: 'Coniuge',
      leaf: true,
    },
    {
      key: '2',
      label: 'Parente/affine entro il 4° grado',
      leaf: true,
    },
    {
      key: '3',
      label: 'Esercente la responsabilità genitoriale',
      leaf: true,
    },
    {
      key: '4',
      label: 'Amministratore di sostegno',
      leaf: true,
    },
    {
      key: '5',
      label: 'Tutore',
      leaf: true,
    },
    {
      key: '6',
      label: 'Persona unita civilmente',
      leaf: true,
    },
    {
      key: '7',
      label: 'Persona convivente',
      leaf: true,
    },
  ],
};

export const NATIONS = {
  name: 'nations',
  items: [
    {
      key: 'Afghanistan',
      label: 'Afghanistan',
      leaf: false,
      childName: 'Afghanistan-cities',
    },
    {
      key: 'Albania',
      label: 'Albania',
      leaf: false,
      childName: 'Albania-cities',
    },
    {
      key: 'Algeria',
      label: 'Algeria',
      leaf: false,
      childName: 'Algeria-cities',
    },
    {
      key: 'Andorra',
      label: 'Andorra',
      leaf: false,
      childName: 'Andorra-cities',
    },
    {
      key: 'Angola',
      label: 'Angola',
      leaf: false,
      childName: 'Angola-cities',
    },
    {
      key: 'Italy',
      label: 'Italy',
      leaf: false,
      childName: 'Italy-cities',
    },
  ],
};

export const CONSENTS = [
  {
    id: 2,
    accepted: null,
    summary: "Ho preso visione dell' <Link Informativa sulla privacy />",
    description: 'Lorem iptus',
    url: 'https://www.regione.sicilia.it/istituzioni/regione/strutture-regionali/assessorato-autonomie-locali-funzione-pubblica/dipartimento-funzione-pubblica-personale/altri-contenuti/privacy-e-trattamento-dati-personal#:~:text=L%27organizzazione%20privacy%20regionale&text=La%20Regione%20Siciliana%20%C3%A8%20impegnata,a%20tutela%20delle%20persone%20fisiche.',
    required: true,
    lang: 'it',
    requireLogin: false,
    type: 'VISION',
    acceptedDate: null,
    contractCode: 'IP',
  },
  {
    id: 3,
    accepted: null,
    summary: 'Acconsento alla <Link Raccolta dei dati per fini statistici />',
    description: 'Lorem iptus',
    url: 'https://www.regione.sicilia.it/istituzioni/regione/strutture-regionali/assessorato-autonomie-locali-funzione-pubblica/dipartimento-funzione-pubblica-personale/altri-contenuti/privacy-e-trattamento-dati-personal#:~:text=L%27organizzazione%20privacy%20regionale&text=La%20Regione%20Siciliana%20%C3%A8%20impegnata,a%20tutela%20delle%20persone%20fisiche.',
    required: false,
    lang: 'it',
    requireLogin: false,
    type: 'CONSENT',
    acceptedDate: null,
    contractCode: '0',
  },
  {
    id: 5,
    accepted: null,
    summary: "Accetto <Link Termini e Condizioni d'uso />",
    description: 'Lorem iptus',
    url: 'https://www.regione.sicilia.it/istituzioni/regione/strutture-regionali/assessorato-autonomie-locali-funzione-pubblica/dipartimento-funzione-pubblica-personale/altri-contenuti/privacy-e-trattamento-dati-personal#:~:text=L%27organizzazione%20privacy%20regionale&text=La%20Regione%20Siciliana%20%C3%A8%20impegnata,a%20tutela%20delle%20persone%20fisiche.',
    required: true,
    lang: 'it',
    requireLogin: false,
    type: 'VISION',
    acceptedDate: null,
    contractCode: 'CU',
  },
  {
    id: 7,
    accepted: null,
    summary: "Accetto <Link Termini e Condizioni d'uso />",
    description: 'Lorem iptus',
    url: 'https://www.regione.sicilia.it/istituzioni/regione/strutture-regionali/assessorato-autonomie-locali-funzione-pubblica/dipartimento-funzione-pubblica-personale/altri-contenuti/privacy-e-trattamento-dati-personal#:~:text=L%27organizzazione%20privacy%20regionale&text=La%20Regione%20Siciliana%20%C3%A8%20impegnata,a%20tutela%20delle%20persone%20fisiche.',
    required: true,
    lang: 'it',
    requireLogin: true,
    type: 'CONSENT',
    acceptedDate: null,
    contractCode: 'AD',
  },
  {
    id: 8,
    accepted: null,
    summary: "Accetto <Link Termini e Condizioni d'uso />",
    description: 'Lorem iptus',
    url: 'https://www.regione.sicilia.it/istituzioni/regione/strutture-regionali/assessorato-autonomie-locali-funzione-pubblica/dipartimento-funzione-pubblica-personale/altri-contenuti/privacy-e-trattamento-dati-personal#:~:text=L%27organizzazione%20privacy%20regionale&text=La%20Regione%20Siciliana%20%C3%A8%20impegnata,a%20tutela%20delle%20persone%20fisiche.',
    required: true,
    lang: 'it',
    requireLogin: true,
    type: 'CONSENT',
    acceptedDate: null,
    contractCode: 'PCT',
  },
];
