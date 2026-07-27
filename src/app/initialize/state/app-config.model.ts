import { FooterConfig } from '../../layout/footer/footer.model';
import { HeaderConfig } from '../../layout/header/header.model';
import { FirebaseOptions } from 'firebase/app';
import { PageConfig } from '../../pages/page.model';

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
  header: HeaderConfig;
  footer: FooterConfig;
  pages: PageConfig[] | any;
}

export interface FirebaseConfig extends FirebaseOptions {
  firebaseOptions: FirebaseOptions;
  keys: string[]; // keys in firebase, da cui si vuole leggere la configurazione.
}
