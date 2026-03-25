export type Colors =
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

export type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type Align = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type Wrap = 'wrap' | 'nowrap' | 'reverse';
export type Gap = 'gap-0' | 'gap-1' | 'gap-2' | 'gap-3' | 'gap-4' | 'gap-5';

export type TextDecoration = 'none' | 'underline' | 'overline';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type FontWeight = 'normal' | 'semibold' | 'bold';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';
export type LinkTarget = '_self' | '_blank' | '_parent' | '_top';
export type LineHeight = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type Placement = 'start' | 'end';

export type MarginTop = 'mt-0' | 'mt-1' | 'mt-2' | 'mt-3' | 'mt-4' | 'mt-5';
export type MarginBottom = 'mb-0' | 'mb-1' | 'mb-2' | 'mb-3' | 'mb-4' | 'mb-5';
export type MarginLeft = 'ms-0' | 'ms-1' | 'ms-2' | 'ms-3' | 'ms-4' | 'ms-5';
export type MarginRight = 'me-0' | 'me-1' | 'me-2' | 'me-3' | 'me-4' | 'me-5';

export interface LocalizedText {
  it: string;
  en: string;
}
