import { LocalizedText } from '../../shared/models/shared_model';

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
  };
}
export interface SpidAuthMethod extends BaseAuthMethod {
  type: 'SPID';
  config: SpidConfig;
}

export interface MyIdAuthMethod extends BaseAuthMethod {
  type: 'MYID';
  config: MyIdConfig;
}

export interface CieAuthMethod extends BaseAuthMethod {
  type: 'CIE';
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
  returnUrl?: string; // se diverso da quello standatd (window.location.origin + '/ui/idp-redirect')
}
export interface LocalConfig {
  loginLabel: LocalizedText;
  passwordLabel: LocalizedText;
}

export type AuthMethod = SpidAuthMethod | MyIdAuthMethod | CieAuthMethod | LocalAuthMethod;
