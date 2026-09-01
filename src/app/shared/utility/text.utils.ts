// Crea classi testuali, ad esempio fs-xl e text-decoration-none.
import { LocalizedText, TextStyle } from '../models/shared_model';

// Get localized text
export function getLocalizedText(text?: LocalizedText, lang?: keyof LocalizedText): string {
  if (!text || !lang) return '';
  return text[lang] ?? '';
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
    text?.fontSize ? `fs-${text.fontSize}` : '',
    text?.fontWeight ? `fw-${text.fontWeight}` : '',
    text?.color?.palette ? `text-${text.color.palette}` : '',
    text?.lineHeight ? `lh-${text.lineHeight}` : '',
    text?.textTransform ? `text-${text.textTransform}` : '',
    text?.textDecoration ? `text-decoration-${text.textDecoration}` : '',
  ].filter(Boolean);
}
