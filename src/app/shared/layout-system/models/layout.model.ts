import { Align, Direction, Gap, Justify, Wrap } from '../../models/shared_model';

export type ItemType =
  | 'IMAGE_BLOCK'
  | 'SOCIAL'
  | 'LINK'
  | 'LINKS'
  | 'TEXT'
  | 'DIVIDER'
  | 'SPACER'
  | 'SELECT_LANG'
  | 'GOOGLE_TRASLATE';

export interface Item {
  id: string;
  type: ItemType;
  enabled: boolean;
  props?: Record<string, unknown> | any;
}

export interface AreaSize {
  grow?: number; // flex property
  shrink?: number; // flex property
  basis?: string; // flex property
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface LayoutArea {
  layout: AreaLayout;
  size?: AreaSize;
  items: Item[];
}

export interface AreaLayout {
  direction: Direction;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  gap?: Gap;
}

export interface AreasConfig {
  layout?: AreaLayout;
  start?: LayoutArea;
  center?: LayoutArea;
  end?: LayoutArea;
}
