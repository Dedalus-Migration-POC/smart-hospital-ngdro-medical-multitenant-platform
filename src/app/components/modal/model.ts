import {
  BackgroundConfig,
  BorderConfig,
  ButtonConfig,
  ButtonStyle,
  FlexLayoutConfig,
  IconConfig,
  SizeConfig,
  SpacingConfig,
  TextConfig,
} from '../../shared/models/shared_model';
import { SafeResourceUrl } from '@angular/platform-browser';

export type ModalFullscreen = 'all' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface ModalStyle {
  background?: BackgroundConfig;
  border?: BorderConfig;
  padding?: SpacingConfig;
  size?: SizeConfig;
  shadow?: string;
}

export interface ModalThemeStyle extends ModalStyle {
  header?: Omit<ModalStyle, 'size' | 'shadow'> & {
    closeButton?: boolean;
  };
  body?: Omit<ModalStyle, 'size' | 'shadow'>;
  footer?: Omit<ModalStyle, 'size' | 'shadow'> & {
    layout?: FlexLayoutConfig;
    actionsButtonStyle?: ButtonStyle;
  };
  centered?: boolean;
  scrollable?: boolean;
  fullscreen?: ModalFullscreen;
  backdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  keyboard?: boolean;
}

export interface ModalActionConfig {
  button: ButtonConfig;
  callback?: () => void; // assegnata dal componente che apre la modale (PageConfig.modals non puo' contenerla)
}

export interface ModalPdfConfig {
  url: string;
  resourceUrl: SafeResourceUrl;
  title: string;
  fallbackText: string;
  openLabel: string;
  downloadLabel: string;
}

export interface ModalConfig extends ModalStyle {
  header: {
    title: TextConfig;
    icon?: IconConfig;
    background?: BackgroundConfig;
    border?: BorderConfig;
    padding?: SpacingConfig;
    closeButton?: boolean; // mostra/nasconde il bottone di chiusura, default true
  };
  body: {
    text: TextConfig;
    pdf?: ModalPdfConfig;
    background?: BackgroundConfig;
    padding?: SpacingConfig;
    border?: BorderConfig;
  };
  footer?: {
    text?: TextConfig; // testo opzionale accanto/sopra le action, es. nota o messaggio di conferma
    background?: BackgroundConfig;
    border?: BorderConfig;
    padding?: SpacingConfig;
    layout?: FlexLayoutConfig; // disposizione di text e actions, es. affiancati o su righe separate
    actions?: ModalActionConfig[];
  };
  centered?: boolean; // centra verticalmente la modale, allineato in alto di default
  scrollable?: boolean; // rende scrollabile solo il body della modale
  fullscreen?: ModalFullscreen; // sm, md, lg, xl e xxl corrispondono alle classi *-down
  backdrop?: boolean; // true impedisce la chiusura al click esterno (backdrop statico)
  backdropColor?: string; // colore dello sfondo dietro la modale, default nero
  backdropOpacity?: number; // opacita dello sfondo dietro la modale, default 0.5
  keyboard?: boolean; // false impedisce la chiusura con il tasto Esc, default true
}
