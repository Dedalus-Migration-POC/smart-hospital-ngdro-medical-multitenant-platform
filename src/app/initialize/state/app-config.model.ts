import { FooterConfig } from '../../layout/footer/footer.model';
import { HeaderConfig } from '../../layout/header/header.model';
import { FirebaseOptions } from 'firebase/app';
import { PageConfig } from '../../pages/page.model';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { LocalizedText } from 'src/app/shared/layout-system/models/localized.model';

export interface AppConfig {
  name: string;
  favicon: string;
  firebaseConfig?: FirebaseConfig;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
      light: string;
      dark: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl?: string;
      };
      lineHeight: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl?: number;
      };
      fontWeight: {
        semibold: number;
        normal: number;
        bold: number;
      };
    };
  };
  translate?: {
    googleTranslate?: {
      supportedLanguages: string;
    };
    i18n?: {
      defaultLanguage: string;
      supportedLanguages: string[];
    };
  };
  chatbot: {
    apiUrl: string;
    language: 'it' | 'en' | 'es' | 'fr' | string;
    themeColor: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    botName: string;
    avatarUrl?: string;
  };
  cookieConsentConfig?: CookieConsentConfig;
  header: HeaderConfig;
  footer: FooterConfig;
  pages: PageConfig[] | any;
}

export interface FirebaseConfig extends FirebaseOptions {
  firebaseOptions: FirebaseOptions;
  keys: string[]; // keys in firebase, da cui si vuole leggere la configurazione.
}

export interface CookieConsentConfig extends NgcCookieConsentConfig {
  //https://tinesoft.github.io/ngx-cookieconsent/home
  customContent: {
    header?: LocalizedText | undefined;
    message?: LocalizedText | undefined;
    dismiss?: LocalizedText | undefined;
    allow?: LocalizedText | undefined;
    deny?: LocalizedText | undefined;
    link?: LocalizedText | undefined;
    href?: LocalizedText | undefined;
    close?: LocalizedText | undefined;
    policy?: LocalizedText | undefined;
    target?: LocalizedText | undefined;
    //non ci sono nel content di default, quindi bisogna aggiungere nella configurazione sia nel content (come string), che nel customContent (come LocalizedText)
    cookiePolicyLink?: LocalizedText | undefined;
    privacyPolicyLink?: LocalizedText | undefined;
    tosLink?: LocalizedText | undefined;
  };
  cookieConsentModal?: {
    title: LocalizedText;
    text: LocalizedText;
    closeButtonText: LocalizedText;
  };
  cookieConsentOpenPdf?: {
    url: string;
    method: 'GET' | 'POST';
  };
}
