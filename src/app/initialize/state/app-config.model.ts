import { HeaderConfig } from '../../layout/header/header.model';

export interface AppConfig {
  name: string;
  favicon: string;
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
      supportedLanguages: string[];
    };
    i18n?: {
      defaultLanguage: string;
      supportedLanguages: string[];
    };
  };
  header: HeaderConfig;
  footer: unknown;
  pages: Array<{
    id: string;
    route: string;
    page: unknown;
  }>;
}
