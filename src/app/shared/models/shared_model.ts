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
export type Align =
  | 'start'
  | 'center'
  | 'end'
  | 'baseline'
  | 'stretch'
  | 'self-start'
  | 'self-end'
  | 'self-center';
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

// TODO: da togliere c e SpacingConfig
// appena finisco di fare il default delle card
export type Margin =
  | 'mt-0'
  | 'mt-1'
  | 'mt-2'
  | 'mt-3'
  | 'mt-4'
  | 'mt-5'
  | 'mb-0'
  | 'mb-1'
  | 'mb-2'
  | 'mb-3'
  | 'mb-4'
  | 'mb-5'
  | 'ms-0'
  | 'ms-1'
  | 'ms-2'
  | 'ms-3'
  | 'ms-4'
  | 'ms-5'
  | 'me-0'
  | 'me-1'
  | 'me-2'
  | 'me-3'
  | 'me-4'
  | 'me-5'
  | 'my-0'
  | 'my-1'
  | 'my-2'
  | 'my-3'
  | 'my-4'
  | 'my-5'
  | 'mx-0'
  | 'mx-1'
  | 'mx-2'
  | 'mx-3'
  | 'mx-4'
  | 'mx-5';

export type ImageType = 'url' | 'inlineSvg' | 'file' | 'base64';

export interface ImageStyle {
  width?: string;
  height?: string;
}

export interface ImageConfig extends ImageStyle {
  type: ImageType;
  value: string;
  decorative: boolean;
  className?: string;
  alt?: LocalizedText;
  ariaLabel?: LocalizedText;
  tooltip?: {
    enabled: boolean;
    tooltipLabel?: LocalizedText;
    tooltipClassName?: string;
  };
}

export interface ColorConfig {
  palette?: Colors;
  hex?: string;
}

export interface BackgroundConfig {
  fill?: ColorConfig;
  gradient?: string;
}

export interface BorderConfig {
  width?: string;
  style?: BorderStyle;
  color?: ColorConfig;
  radius?: string;
}

export type BorderStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
  | 'none';

export interface SpacingConfig {
  all?: string; // shorthand per tutti i lati
  x?: string; // left + right (asse orizzontale)
  y?: string; // top + bottom (asse verticale)
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface TextSection {
  title: TextConfig;
  subTitle?: TextConfig;
}

export interface TextConfig extends TextStyle {
  text: LocalizedText;
}

// TODO: valutare se aggiungere margin e padding qui
export interface TextStyle {
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  color?: ColorConfig;
  lineHeight?: LineHeight;
  isUppercase?: boolean; // se true, aggiunge la classe text-uppercase
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
  gap?: Gap;
  grow?: Grow;
  shrink?: Shrink;
}

export interface SizeConfig {
  basis?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  minWidth?: string;
}

export interface ButtonBaseConfig {
  border?: BorderConfig;
  padding?: SpacingConfig;
  size?: SizeConfig;
  radius?: string;
}

// Configurazione dei bottoni Bootstrap Italia. Gli stati interattivi sono
// gestiti dalla classe btn-* generata a partire dalla palette.
export interface BootstrapButtonConfig extends ButtonBaseConfig {
  mode?: 'bootstrap';
  palette: Colors;
  outline?: boolean;
  textStyle?: Omit<TextStyle, 'color'>;
}

// TODO: non ancora supportato. Da implementare con gestione completa degli
// stati custom (base, hover, focus, active e disabled).
export interface CustomButtonConfig extends ButtonBaseConfig {
  mode: 'custom';
  textStyle?: TextStyle;
  backgroundColor?: BackgroundConfig;
}

export type ButtonConfig = BootstrapButtonConfig | CustomButtonConfig;

export interface LinkBaseConfig {
  textDecoration?: TextDecoration;
}

// Configurazione dei link Bootstrap Italia. Il colore e gestito dalla
// classe text-* generata a partire dalla palette.
export interface BootstrapLinkConfig extends LinkBaseConfig {
  mode?: 'bootstrap';
  palette: Colors;
  textStyle?: Omit<TextStyle, 'color'>;
}

// TODO: non ancora supportato. Da implementare con gestione completa degli
// stati custom (base, hover, focus, active e disabled).
export interface CustomLinkConfig extends LinkBaseConfig {
  mode: 'custom';
  textStyle?: TextStyle;
}

export type LinkConfig = BootstrapLinkConfig | CustomLinkConfig;
