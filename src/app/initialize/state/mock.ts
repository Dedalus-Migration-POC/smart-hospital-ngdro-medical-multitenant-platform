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
        sm: '14px',
        md: '16px',
        xl: '18px',
        xxl: '20px',
      },
      lineHeight: {
        sm: 1.2,
        md: 1.5,
        xl: 1.75,
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
