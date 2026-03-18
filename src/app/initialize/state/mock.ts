import { AppConfig } from './app-config.model';

export const APP_CONFIG: AppConfig = {
  name: 'Smart Hospital',
  favicon: '/assets/favicon.ico',

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
        lg: '18px',
        xl: '20px',
        xxl: '22px',
      },
      lineHeight: {
        sm: 1.2,
        md: 1.5,
        lg: 1.6,
        xl: 1.7,
      },
      fontWeight: {
        normal: 400,
        semibold: 500,
        bold: 700,
      },
    },
  },

  header: {
    topbar: {
      height: '35px',
      position: {
        type: 'sticky',
      },
      background: 'primary', //TODO: scegli il tenant da una select con i colori
      className: 'topbar-custom',
      areas: {
        layout: {
          direction: 'row',
          gap: 'gap-2',
          // align: 'center',
          justify: 'between',
          wrap: 'wrap',
        },
        start: {
          //  size: { grow: 1, width: '240px' },
          layout: {
            direction: 'column',
            gap: 'gap-0',
            align: 'start',
          },
          items: [
            {
              id: 'topbar-text-1',
              type: 'TEXT',
              enabled: true,
              props: {
                text: 'Servizio sanitario digitale',
              },
            },
          ],
        },
        center: {
          //    size: { grow: 1, basis: '0' },
          layout: {
            direction: 'row',
            gap: 'gap-2',
            align: 'center',
          },
          items: [],
        },
        end: {
          //   size: { width: '240px' },
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'end',
          },
          items: [
            {
              id: 'topbar-link-1',
              type: 'LINK',
              enabled: true,
              props: {
                label: 'Accedi',
                href: '/login',
              },
            },
            {
              id: 'topbar-link-2',
              type: 'LINK',
              enabled: true,
              props: {
                label: 'Contatti',
                href: '/contatti',
              },
            },
          ],
        },
      },
    },

    main: {
      height: '88px',
      position: {
        type: 'sticky',
      },
      background: 'warning',
      className: 'main-header-custom',
      areas: {
        layout: {
          direction: 'row',
          gap: 'gap-3',
          // align: 'center',
          wrap: 'wrap',
        },
        start: {
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'center',
            wrap: 'nowrap',
          },
          items: [
            {
              id: 'header-logo',
              type: 'IMAGE_BLOCK',
              enabled: true,
              props: {
                src: '/assets/logo.svg',
                alt: 'Logo azienda sanitaria',
              },
            },
            {
              id: 'header-title',
              type: 'TEXT',
              enabled: true,
              props: {
                text: 'Smart Hospital Platform',
              },
            },
          ],
        },
        // center: {
        //   layout: {
        //     direction: 'row',
        //     gap: 'gap-2',
        //     align: 'center',
        //     wrap: 'nowrap',
        //   },
        //   items: [],
        // },
        end: {
          size: {
            grow: 1,
          },
          layout: {
            direction: 'row',
            justify: 'end',
            align: 'start',
            wrap: 'nowrap',
          },
          items: [
            // {
            //   id: 'header-help',
            //   type: 'LINK',
            //   enabled: true,
            //   props: {
            //     label: 'Supporto',
            //     href: '/supporto',
            //   },
            // },
          ],
        },
      },
    },

    bottombar: {
      height: '48px',
      position: {
        type: 'sticky',
      },
      background: 'light',
      className: 'bottombar-custom',
      areas: {
        layout: {
          direction: 'row',
          gap: 'gap-2',
          // align: 'center',
          justify: 'between',
          wrap: 'wrap',
        },
        start: {
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'start',
            wrap: 'nowrap',
          },
          items: [
            {
              id: 'nav-home',
              type: 'LINK',
              enabled: true,
              props: {
                label: 'Home',
                href: '/',
              },
            },
          ],
        },
        center: {
          layout: {
            direction: 'row',
            gap: 'gap-2',
            align: 'center',
            wrap: 'nowrap',
          },
          items: [],
        },
        end: {
          layout: {
            direction: 'row',
            gap: 'gap-2',
            align: 'end',
            wrap: 'nowrap',
          },
          items: [],
        },
      },
    },
  },

  footer: {
    main: {
      height: '100px',
      position: {
        type: 'sticky',
      },
      background: 'warning',
      className: 'main-footer-custom',
      areas: {
        layout: {
          direction: 'row',
          gap: 'gap-3',
          // align: 'center',
          wrap: 'wrap',
          justify: 'between',
        },
        start: {
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'center',
            wrap: 'nowrap',
          },
          items: [
            {
              id: 'header-logo',
              type: 'IMAGE_BLOCK',
              enabled: true,
              props: {
                src: '/assets/logo.svg',
                alt: 'Logo azienda sanitaria',
              },
            },
            {
              id: 'header-title',
              type: 'TEXT',
              enabled: true,
              props: {
                text: 'Smart Hospital Platform',
              },
            },
          ],
        },
        center: {
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'center',
            wrap: 'nowrap',
          },
          items: [],
        },
        end: {
          size: {
            // grow: 1,
          },
          layout: {
            direction: 'row',
            justify: 'end',
            align: 'start',
            wrap: 'nowrap',
          },
          items: [
            // {
            //   id: 'header-help',
            //   type: 'LINK',
            //   enabled: true,
            //   props: {
            //     label: 'Supporto',
            //     href: '/supporto',
            //   },
            // },
          ],
        },
      },
    },

    bottombar: {
      height: '48px',
      position: {
        type: 'sticky',
      },
      background: 'light',
      className: 'bottombar-custom',
      areas: {
        layout: {
          direction: 'row',
          gap: 'gap-2',
          // align: 'center',
          justify: 'between',
          wrap: 'wrap',
        },
        start: {
          layout: {
            direction: 'row',
            gap: 'gap-3',
            align: 'start',
            wrap: 'nowrap',
          },
          items: [
            {
              id: 'nav-home',
              type: 'LINK',
              enabled: true,
              props: {
                label: 'Home',
                href: '/',
              },
            },
          ],
        },
        center: {
          layout: {
            direction: 'row',
            gap: 'gap-2',
            align: 'center',
            wrap: 'nowrap',
          },
          items: [],
        },
        end: {
          layout: {
            direction: 'row',
            gap: 'gap-2',
            align: 'end',
            wrap: 'nowrap',
          },
          items: [],
        },
      },
    },
  } as any,

  pages: [
    {
      id: 'home',
      route: '/',
      page: {},
    },
  ],
};
