// Crea classi testuali, ad esempio fs-xl e text-decoration-none.
import { FontSize, LineHeight, LocalizedText, TextStyle } from '../models/shared_model';

const fontSizeTokens: FontSize[] = ['sm', 'md', 'lg', 'xl', 'xxl'];
const lineHeightTokens: LineHeight[] = ['sm', 'md', 'lg', 'xl', 'xxl'];

function isFontSizeToken(value: string): value is FontSize {
  return fontSizeTokens.includes(value as FontSize);
}

function isLineHeightToken(value: string): value is LineHeight {
  return lineHeightTokens.includes(value as LineHeight);
}

// Get localized text
export function getLocalizedText(text?: LocalizedText, lang?: keyof LocalizedText): string {
  if (!text || !lang) return '';
  return text[lang] ?? '';
}

// Usato per valori già tradotti (es. TranslateService.instant) da adattare a LocalizedText
export function toLocalizedText(value: string): LocalizedText {
  return { it: value, en: value };
}

export function mergeTextStyles(themeStyle?: TextStyle, specificStyle?: TextStyle): TextStyle {
  return {
    fontSize: specificStyle?.fontSize ?? themeStyle?.fontSize,
    fontWeight: specificStyle?.fontWeight ?? themeStyle?.fontWeight,
    color: { ...themeStyle?.color, ...specificStyle?.color },
    lineHeight: specificStyle?.lineHeight ?? themeStyle?.lineHeight,
    textTransform: specificStyle?.textTransform ?? themeStyle?.textTransform,
    textDecoration: specificStyle?.textDecoration ?? themeStyle?.textDecoration,
    margin: { ...themeStyle?.margin, ...specificStyle?.margin },
    padding: { ...themeStyle?.padding, ...specificStyle?.padding },
  };
}

// Get all text classes
export function getTextClasses(text?: TextStyle): string[] {
  return [
    text?.fontSize && isFontSizeToken(text.fontSize) ? `fs-${text.fontSize}` : '',
    text?.fontWeight ? `fw-${text.fontWeight}` : '',
    text?.color?.palette ? `text-${text.color.palette}` : '',
    text?.lineHeight && isLineHeightToken(text.lineHeight) ? `lh-${text.lineHeight}` : '',
    text?.textTransform ? `text-${text.textTransform}` : '',
    text?.textDecoration ? `text-decoration-${text.textDecoration}` : '',
  ].filter(Boolean);
}
