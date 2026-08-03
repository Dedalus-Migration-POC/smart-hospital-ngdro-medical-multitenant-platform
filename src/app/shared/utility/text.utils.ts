import { LocalizedText, TextDecoration, TextStyle } from '../models/shared_model';

// Get localized text
export function getLocalizedText(text?: LocalizedText, lang?: keyof LocalizedText): string {
  if (!text || !lang) return '';
  return text[lang] ?? '';
}

// Get all text classes
export function getTextClasses(text?: TextStyle): string[] {
  return [
    text?.fontSize ? `fs-${text.fontSize}` : '',
    text?.fontWeight ? `fw-${text.fontWeight}` : '',
    text?.color ? `text-${text.color}` : '',
    text?.lineHeight ? `lh-${text.lineHeight}` : '',
    text?.isUppercase ? 'text-uppercase' : '',
  ].filter(Boolean);
}

// Get Bootstrap/custom text-decoration class from TextDecoration value
export function getTextDecorationClass(decoration?: TextDecoration): string {
  return decoration === 'none'
    ? 'text-decoration-none'
    : decoration === 'underline'
      ? 'text-decoration-underline'
      : decoration === 'overline'
        ? 'text-decoration-overline'
        : '';
}
