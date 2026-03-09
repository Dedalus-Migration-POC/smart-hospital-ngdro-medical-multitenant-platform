import { AppConfig } from './model';

export const APP_CONFIG: AppConfig = {
  name: '<string>',
  favicon: '<string>',
  theme: {
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#0dcaf0',
      light: '#f8f9fa',
      dark: '#212529',
    },
    typography: {
      fontFamily: 'Titillium Web, sans-serif',
      fontSize: {
        small: '14px',
        normal: '16px',
        large: '18px',
        extraLarge: '20px',
      },
      lineHeight: {
        title: 1.2,
        base: 1.5,
        paragraphs: 1.75,
      },
      fontWeight: {
        normal: 400,
        semibold: 500,
        bold: 700,
      },
    },
  },
  header: '<object>',
  footer: '<object>',
  pages: [
    {
      id: '<string>',
      route: '<string>',
      page: '<object>',
    },
  ],
};
