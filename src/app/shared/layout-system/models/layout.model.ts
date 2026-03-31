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
  | 'GOOGLE_TRASLATE'
  | 'AUTH_METHODS';

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
  layout: FlexLayoutConfig;
  size?: AreaSize;
  items: Item[];
}

export interface AreasConfig {
  layout?: FlexLayoutConfig;
  start?: LayoutArea;
  center?: LayoutArea;
  end?: LayoutArea;
}
