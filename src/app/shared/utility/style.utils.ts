// Crea proprietà CSS inline, ad esempio color: #333333, margin-bottom: 3px
import {
  BackgroundConfig,
  FontSize,
  LineHeight,
  SpacingConfig,
  TextStyle,
} from '../models/shared_model';

const fontSizeTokens: FontSize[] = ['sm', 'md', 'lg', 'xl', 'xxl'];
const lineHeightTokens: LineHeight[] = ['sm', 'md', 'lg', 'xl', 'xxl'];

function isFontSizeToken(value: string): value is FontSize {
  return fontSizeTokens.includes(value as FontSize);
}

function isLineHeightToken(value: string): value is LineHeight {
  return lineHeightTokens.includes(value as LineHeight);
}

export function getTextColorHex(text?: TextStyle): string | null {
  return typeof text?.color === 'object' ? (text.color.hex ?? null) : null;
}

export function getSpacingStyles(
  spacing?: SpacingConfig,
  property: 'margin' | 'padding' = 'margin',
): Record<string, string> {
  const styles: Record<string, string> = {};
  const all = spacing?.all;
  const horizontal = spacing?.x ?? all;
  const vertical = spacing?.y ?? all;

  if (horizontal) styles[`${property}-left`] = styles[`${property}-right`] = horizontal;
  if (vertical) styles[`${property}-top`] = styles[`${property}-bottom`] = vertical;
  if (spacing?.top) styles[`${property}-top`] = spacing.top;
  if (spacing?.right) styles[`${property}-right`] = spacing.right;
  if (spacing?.bottom) styles[`${property}-bottom`] = spacing.bottom;
  if (spacing?.left) styles[`${property}-left`] = spacing.left;

  return styles;
}

// Converte lo stile testuale configurato in proprietà CSS inline.
// Spaziatura (margin/padding) e colore hex.
export function getTextStyles(text?: TextStyle): Record<string, string> {
  const color = getTextColorHex(text);
  const fontSize = text?.fontSize;
  const lineHeight = text?.lineHeight;

  return {
    ...(fontSize && !isFontSizeToken(fontSize) ? { 'font-size': fontSize } : {}),
    ...(lineHeight && !isLineHeightToken(lineHeight) ? { 'line-height': lineHeight } : {}),
    ...getSpacingStyles(text?.margin),
    ...getSpacingStyles(text?.padding, 'padding'),
    ...(color ? { color } : {}),
  };
}

export function getBackgroundPaletteClass(config: { background?: BackgroundConfig }): string {
  // Le palette usano una classe Bootstrap; hex e gradient sono gestiti da getBackgroundStyles.
  const palette = config.background?.fill?.palette;
  return palette ? `bg-${palette}` : '';
}

export function getBackgroundStyles(config: {
  background?: BackgroundConfig;
}): Record<string, string> {
  const background = config.background;

  if (background?.gradient) return { background: background.gradient };
  if (background?.fill?.hex) return { 'background-color': background.fill.hex };

  return {};
}
