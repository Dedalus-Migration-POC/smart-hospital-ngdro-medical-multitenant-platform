import { BreadcrumbConfig } from '../components/breadcrumb/model';
import { ImageBlockConfig } from '../components/image-block/model';
import { ModalConfig } from '../components/modal/model';
import { AreasConfig } from '../shared/layout-system/models/layout.model';
import { Colors, LocalizedText } from '../shared/models/shared_model';

export type RoutePage = '/medical-reports' | '/single-report' | '/login' | '/user-profile';

// TODO: VA SPOSTATO IN UN COMPONENTE SUO
export interface InfoPopupConfig {
  title: LocalizedText;
  text: LocalizedText;
  type: 'warning' | 'success' | 'danger' | 'info';
}

export interface PageConfig {
  id: string;
  name: LocalizedText;
  route: RoutePage | string;
  meta?: PageMetaConfig;
  backgroundColor?: string;
  backgroundImage?: string;

  breadcrumb?: BreadcrumbConfig;
  sections: PageSectionConfig[];

  infoPopup?: InfoPopupConfig;

  // chiave = id semantico (es. 'deleteBooking') e deve combaciare esattamente con quella usata
  // nel componente: this.pageConfig()?.modals?.['deleteBooking']. Le callback delle action
  // vengono assegnate dal componente, non dalla config.
  modals?: Record<string, ModalConfig>;

  message?: {
    notFound?: ImageBlockConfig;
    error?: ImageBlockConfig;
    init?: ImageBlockConfig;
  };
}

// Per l'accessibilità
export interface PageMetaConfig {
  title: LocalizedText;
}

export interface PageSectionConfig {
  id: string;
  background?: Colors;
  className?: string;
  height?: string;
  areas: AreasConfig;
}
