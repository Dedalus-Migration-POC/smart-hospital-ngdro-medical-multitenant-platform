export type LayoutDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type LayoutAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type LayoutWrap = 'wrap' | 'nowrap' | 'reverse';
export type LayoutGap = 'gap-0' | 'gap-1' | 'gap-2' | 'gap-3' | 'gap-4' | 'gap-5';

export type Background =
  | 'white'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'black';

// TODO: vanno implementati i componenti
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
  minWidth?: string;
  maxWidth?: string;
}

export interface LayoutArea {
  layout: AreaLayout;
  size?: AreaSize;
  items: Item[];
}

export interface AreaLayout {
  direction: LayoutDirection;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  wrap?: LayoutWrap;
  gap?: LayoutGap;
}

export interface AreasConfig {
  layout?: AreaLayout;
  start?: LayoutArea;
  center?: LayoutArea;
  end?: LayoutArea;
}
