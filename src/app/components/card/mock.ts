import { SINGLE_REPORT } from '../../pages/reports-and-documents/single-report/state/mock';
import { CardsContainer } from './model';

export const MediaTextCard_MOCK: CardsContainer = {
  id: 'services-section',
  className: 'services-section',
  ariaLabel: {
    it: 'Sezione servizi',
    en: 'Services section',
  },
  header: {
    title: {
      text: {
        it: 'Servizi',
        en: 'Services',
      },
      fontSize: 'md',
      fontWeight: 'bold',
      color: 'dark',
      lineHeight: 'md',
    },
    subTitle: {
      text: {
        it: 'Accedi rapidamente ai servizi disponibili',
        en: 'Quick access to available services',
      },
      fontSize: 'md',
      fontWeight: 'normal',
      color: 'secondary',
      lineHeight: 'md',
    },
  },
  // itemsContentLayout: {
  //   direction: 'column',
  //   align: 'start',
  //   justify: 'end',
  //   wrap: 'wrap',
  // },
  items: [
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: true,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'route',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
    {
      id: 'vaccination-history',
      type: 'mediaText',
      ariaLabel: {
        it: 'Apri storico vaccinale',
        en: 'Open vaccination history',
      },
      className: 'ciao-class',
      action: {
        type: 'externalLink',
        url: '/storico-vaccinale',
      },
      text: {
        title: {
          text: {
            it: 'Storico vaccinale',
            en: 'Vaccination history',
          },
          fontSize: 'md',
          fontWeight: 'bold',
          color: 'dark',
        },
        subTitle: {
          text: {
            it: 'Sottotitolo',
            en: 'Subtitle',
          },
          fontSize: 'sm',
          fontWeight: 'normal',
          color: 'secondary',
        },
      },
      blocked: false,
      image: {
        type: 'inlineSvg',
        decorative: false,
        value: `
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="16" height="48" rx="8" stroke="#0057B8" stroke-width="2"/>
            <rect x="32" y="18" width="8" height="30" rx="4" stroke="#F9422E" stroke-width="2"/>
            <path d="M56 14V54" stroke="#0057B8" stroke-width="2"/>
            <rect x="52" y="22" width="8" height="24" rx="3" stroke="#0057B8" stroke-width="2"/>
          </svg>
        `,
        width: '72px',
        height: '72px',
      },
    },
  ],
};
