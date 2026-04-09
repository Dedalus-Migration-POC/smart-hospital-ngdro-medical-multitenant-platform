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
export type Grow = 'grow-0' | 'grow-1';
export type Shrink = 'shrink-0' | 'shrink-1';

export type TextDecoration = 'none' | 'underline' | 'overline';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type FontWeight = 'normal' | 'semibold' | 'bold';
export type TextTransform = 'uppercase' | 'lowercase' | 'capitalize';
export type LinkTarget = '_self' | '_blank' | '_parent' | '_top';
export type LineHeight = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type TextHeader = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type Margin = 'mt-0' | 'mt-1' | 'mt-2' | 'mt-3' | 'mt-4' | 'mt-5';

export type ImageType = 'url' | 'inlineSvg' | 'file';
export interface ImageConfig {
  type: ImageType;
  value: string;
  decorative: boolean;
  alt?: LocalizedText;
  ariaLabel?: LocalizedText;
  width?: string;
  height?: string;
  className?: string;
  tooltip?: {
    enabled: boolean;
    tooltipLabel?: LocalizedText;
    tooltipClassName?: string;
  };
}

export interface TextSection {
  title: TextConfig;
  subTitle?: TextConfig;
}

export interface TextConfig {
  text: LocalizedText;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  color?: Colors;
  lineHeight?: LineHeight;
}

export type ActionType = 'route' | 'externalLink' | 'comingSoon';
export interface ActionConfig {
  type: ActionType;
  url?: string;
  target?: LinkTarget;
  comingSoonMessage?: TextSection;
}

export interface LocalizedText {
  it: string;
  en: string;
}

export interface FlexLayoutConfig {
  direction?: Array<Direction> | Direction;
  align?: Align;
  justify?: Justify;
  wrap?: Wrap;
  gap?: string;
  grow?: Grow;
  shrink?: Shrink;
}
