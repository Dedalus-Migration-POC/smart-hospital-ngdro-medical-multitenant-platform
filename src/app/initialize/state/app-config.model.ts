import { FooterConfig } from '../../layout/footer/footer.model';
import { HeaderConfig } from '../../layout/header/header.model';
import { FirebaseOptions } from 'firebase/app';
import { PageConfig } from '../../pages/page.model';
import { BreadcrumbStyle } from '../../components/breadcrumb/model';
import { ModalThemeStyle } from '../../components/modal/model';
import { CookieConsentModalProps } from '../../components/cookie-consent-modal/model';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { LocalizedText } from 'src/app/shared/layout-system/models/localized.model';
import {
  BackgroundConfig,
  BorderConfig,
  ButtonStyle,
  ColorConfig,
  Colors,
  FlexLayoutConfig,
  FontSize,
  FontWeight,
  ImageStyle,
  LineHeight,
  LinkStyle,
  SizeConfig,
  SpacingConfig,
  TextStyle,
} from 'src/app/shared/models/shared_model';

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
    buttonsStyle: ButtonStyle;
    linksStyle: LinkStyle;
    breadcrumb?: BreadcrumbStyle;
    modal?: ModalThemeStyle; // default condiviso da tutte le modali, sovrascrivibile da PageConfig.modals
    card?: {
      // Base theme applicate a TUTTE le card
      // mediaText e data estendono/sovrascrivono il base
      base: {
        // Stile della card
        background?: BackgroundConfig;
        border?: BorderConfig;
        shadow?: string;
        padding?: SpacingConfig;
        size?: SizeConfig;
      };
      // Configurazione layout generica del container delle card e layout interno comune a tutte le card
      container?: {
        header?: {
          titleStyle?: TextStyle;
          subTitleStyle?: TextStyle;
        };
        containerLayout?: FlexLayoutConfig;
        itemsLayout?: FlexLayoutConfig;
        itemColBootstrapClasses?: string;
        actionsLayout?: FlexLayoutConfig;
      };
      // Configurazione theme specifica per card di tipo mediaText
      // Estende le proprietà definite in base
      mediaText?: {
        textStyle?: TextStyle;
        imageStyle?: ImageStyle;
      };
      // Configurazione theme specifica per card di tipo data
      // Estende le proprietà definite in base
      data?: {
        titleStyle?: TextStyle;
        subTitleStyle?: TextStyle;
        fields?: {
          labelStyle?: TextStyle;
          valueStyle?: TextStyle;
        };
        actions?: {
          buttonStyle?: ButtonStyle;
          linkStyle?: LinkStyle;
        };
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
  cookieConsentModal?: CookieConsentModalProps;
  cookieConsentOpenPdf?: {
    url: string;
    method: 'GET' | 'POST';
  };
}
