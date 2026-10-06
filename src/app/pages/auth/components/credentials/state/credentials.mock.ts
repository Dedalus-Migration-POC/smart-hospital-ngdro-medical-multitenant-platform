import {
  CredentialsRegistrationRequest,
  RegistrationAttribute,
  RegistrationConsent,
} from './credentials.model';

export const MOCK_REGISTRATION_ATTRIBUTES: RegistrationAttribute[] = [
  {
    key: 'address',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'province',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'city',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'date_of_birth',
    value: null,
    required: true,
    validation: '^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
  },
  {
    key: 'phone_number',
    value: null,
    required: true,
    validation: '^(\\+39)?(3[0-9][0-9]|34[7-90]|36[680]|33[3-90]|32[89])\\d{6,7}$',
  },
  {
    key: 'postal_code',
    value: null,
    required: true,
    validation: '^\\d{5}$',
  },
  {
    key: 'municipality',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'domicile_province',
    displayName: 'Domicile province',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'domicile_nation',
    displayName: 'Domicile_nation',
    value: null,
    required: true,
    validation: null,
  },
  {
    key: 'county_of_birth',
    displayName: 'County of birth',
    value: null,
    required: false,
    validation: null,
  },
  {
    key: 'place_of_birth',
    displayName: 'Place of birth',
    value: null,
    required: false,
    validation: null,
  },
  {
    key: 'gender',
    displayName: 'Gender',
    value: null,
    required: false,
    validation: null,
  },
];

export const MOCK_REGISTRATION_CONSENTS: RegistrationConsent[] = [
  {
    id: 5,
    accepted: null,
    summary: "Accetto <Link Termini e Condizioni d'uso />",
    description: 'Lorem iptus',
    url: 'https://url',
    required: true,
    lang: 'it',
    requireLogin: false,
    type: 'CONSENT',
    acceptedDate: null,
    contractCode: 'CU',
  },
  {
    id: 3,
    accepted: null,
    summary: 'Acconsento alla <Link Raccolta dei dati per fini statistici />',
    description: 'Lorem iptus',
    url: 'https://url',
    required: false,
    lang: 'it',
    requireLogin: false,
    type: 'CONSENT',
    acceptedDate: null,
    contractCode: '0',
  },
];

export const MOCK_REGISTRATION_REQUEST: CredentialsRegistrationRequest = {
  user: {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    fiscalCode: 'SLVBLL99P29Z605C',
    additionalAttributes: [
      {
        key: 'phone_number',
        displayName: 'Mobile phone',
        value: '3939393939',
        required: true,
      },
      {
        key: 'postal_code',
        displayName: 'Domicile postal code',
        value: '00144',
        required: true,
      },
      {
        key: 'place_of_birth',
        displayName: 'Place of birth',
        value: null,
        required: false,
      },
    ],
    consents: MOCK_REGISTRATION_CONSENTS.map((consent) => ({
      ...consent,
      accepted: consent.required,
    })),
  },
  password: 'test-password',
};
