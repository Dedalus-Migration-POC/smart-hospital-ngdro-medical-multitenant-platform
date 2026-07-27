import { FlexLayoutConfig } from '../../models/shared_model';

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
  | 'DYNAMIC_FORM';

export interface Item {
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
  items: Item[];
}

export interface AreasConfig {
  layout: FlexLayoutConfig;
  start?: LayoutArea;
  center?: LayoutArea;
  end?: LayoutArea;
}
