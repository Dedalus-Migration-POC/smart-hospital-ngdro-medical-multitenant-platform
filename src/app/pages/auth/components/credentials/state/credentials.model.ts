export interface RegistrationAttribute {
  key: string;
  displayName?: string;
  value: string | null;
  required: boolean;
  validation?: string | null;
}

export interface RegistrationConsent {
  id: number;
  accepted: boolean | null;
  summary: string;
  description: string;
  url: string;
  required: boolean;
  lang: string;
  requireLogin: boolean;
  type: string;
  acceptedDate: string | null;
  contractCode: string;
}

export interface CredentialsRegistrationData {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  email: string;
  password: string;
  additionalAttributes: RegistrationAttribute[];
}

export interface RegistrationConsentSelection extends Omit<RegistrationConsent, 'accepted'> {
  accepted: boolean;
}

export interface CredentialsRegistrationRequest {
  user: Pick<CredentialsRegistrationData, 'firstName' | 'lastName' | 'fiscalCode' | 'email'> & {
    additionalAttributes: RegistrationAttribute[];
    consents: RegistrationConsentSelection[];
  };
  password: string;
}

export interface CredentialsRegistrationError {
  status: number;
  errorCode: string;
  errorMessage: string;
  correlationId?: string;
  datetime?: string;
  description?: string;
}

export const REQUIRED_REGISTRATION_FIELDS = [
  'firstName',
  'lastName',
  'fiscalCode',
  'email',
  'password',
] as const satisfies readonly (keyof CredentialsRegistrationData)[];
