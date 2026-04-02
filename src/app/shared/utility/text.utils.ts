import { LocalizedText, TextConfig } from '../models/shared_model';

// Get localized text
export function getLocalizedText(text?: LocalizedText, lang?: keyof LocalizedText): string {
  if (!text || !lang) return '';
  return text[lang] ?? '';
}

// Get all text classes
export function getTextClasses(text?: TextConfig): string[] {
  return [
    text?.fontSize ? `fs-${text.fontSize}` : '',
    text?.fontWeight ? `fw-${text.fontWeight}` : '',
    text?.color ? `text-${text.color}` : '',
    text?.lineHeight ? `lh-${text.lineHeight}` : '',
  ].filter(Boolean);
}
