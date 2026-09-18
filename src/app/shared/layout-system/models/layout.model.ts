import { BackgroundConfig, FlexLayoutConfig, SpacingConfig } from '../../models/shared_model';

export type ItemType =
  | 'IMAGE_BLOCK'
  | 'SOCIAL'
  | 'LINK'
  | 'LINKS'
  | 'TEXT'
  | 'DIVIDER'
  | 'SPACER'
  | 'SELECT_LANG'
  | 'GOOGLE_TRANSLATE'
  | 'AUTH_METHODS'
  | 'SERVICE_CARDS'
  | 'USER_DROPDOWN_MENU'
  | 'DYNAMIC_FORM'
  | 'FEED_RSS';

export interface Item {
  // IMPORTANTE CHE SIA UNIVOCO PER OGNI ITEM
  // PER LE PAGINE CON LAYOUT STATICO LA CONFIG DELLE CARD VIENE RECUPERATA CON ID E IL TIPO DEL COMPONENTE CARD  type: 'SERVICE_CARDS',
  id: string;
  type: ItemType;
  enabled: boolean;
  className?: string;
  props?: Record<string, unknown> | any;
}

export interface AreaSize {
  basis?: string;
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface LayoutArea {
  layout: FlexLayoutConfig; // tutte le proprietà flex (direction, align, justify, ...)
  size?: AreaSize; // dimensioni fisse non responsive
  background?: BackgroundConfig;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  items: Item[];
}

export interface AreasConfig {
  layout: FlexLayoutConfig;
  start?: LayoutArea;
  center?: LayoutArea;
  end?: LayoutArea;
}
