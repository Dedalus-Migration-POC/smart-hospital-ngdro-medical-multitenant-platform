import { Align, LinkConfig, LocalizedText } from '../../shared/models/shared_model';

export interface AuthMethodTabsProps {
  id: string;
  isDarkTheme: boolean;
  isCard: boolean;
  isVertical: boolean;
  authMethods: Array<AuthMethod>;
}

export type AuthType = 'SPID' | 'CIE' | 'MYID' | 'LOCAL';

interface BaseAuthMethod {
  title: LocalizedText;
  description: LocalizedText;
  button: {
    text: LocalizedText;
    showIcon: boolean;
    align: Align;
  };
}
export interface SpidAuthMethod extends BaseAuthMethod {
  type: 'SPID';
  title: LocalizedText; // Titolo di Tab
  description: LocalizedText;
  button: {
    text: LocalizedText;
    showIcon: boolean;
    align: Align;
  };
  config: SpidConfig;
}

export interface MyIdAuthMethod extends BaseAuthMethod {
  type: 'MYID';
  title: LocalizedText; // Titolo di Tab
  description: LocalizedText;
  button: {
    text: LocalizedText;
    showIcon: boolean;
    align: Align;
  };
  config: MyIdConfig;
}

export interface CieAuthMethod extends BaseAuthMethod {
  type: 'CIE';
  title: LocalizedText; // Titolo di Tab
  description: LocalizedText;
  button: {
    text: LocalizedText;
    showIcon: boolean;
    align: Align;
  };
  config: CieConfig;
}

export interface LocalAuthMethod extends BaseAuthMethod {
  type: 'LOCAL';
  config: LocalConfig;
}

export interface SpidConfig {
  spidConfigUa: boolean; // dev_2.0 (differenza per Agrigento)
  providers?: ['<teamsystem | tim | namirial>']; //se diverso dalla lista di default
  testProvider?: {
    dev: { enable: boolean; name: string }; //name es: 'spid-messina', 'spid-latina'
    test: { enable: boolean; name: string };
    prod: { enable: boolean; name: string };
  };
  prefixProvider?: {
    dev: string;
    test: string;
    prod: string;
  };
  returnUrl?: string; // se diverso da quello standatd (window.location.origin + '/ui/idp-redirect')
}
export type Env = 'dev' | 'test' | 'prod';

export interface MyIdConfig {
  returnUrl?: string; // se diverso da quello standatd (window.location.origin + '/ui/idp-redirect')
}

export interface CieConfig {
  providerId: { dev: string; test: string; prod: string }; //'cie-rieti'
  returnUrl?: string; // se diverso da quello standatd (window.location.origin + '/ui/idp-redirect')
}
export interface LocalConfig {
  loginLabel: LocalizedText;
  passwordLabel: LocalizedText;
  resetPassword?: {
    text?: LocalizedText;
    link: LinkConfig;
  };
  registration?: {
    text?: LocalizedText;
    link: LinkConfig;
  };
  otp?: {
    buttons?: {
      align?: Align;
      confirm?: { text?: LocalizedText };
      back?: { text?: LocalizedText; showIcon?: boolean };
    };
  };
}

export type AuthMethod = SpidAuthMethod | MyIdAuthMethod | CieAuthMethod | LocalAuthMethod;
