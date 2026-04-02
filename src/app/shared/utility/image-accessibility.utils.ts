import { ImageConfig, LocalizedText } from '../models/shared_model';

// export interface ImageAccessibility {
//   alt: string | null;
//   ariaLabel: string | null;
//   ariaHidden: true | null;
// }

// Get all accessibility attributes for image
// export function getImageAccessibility(
//   image?: ImageConfig,
//   lang?: keyof LocalizedText,
// ): ImageAccessibility {
//   return {
//     alt: getImageAltText(image, lang),
//     ariaLabel: getImageAriaLabel(image, lang),
//     ariaHidden: getImageAriaHidden(image),
//   };
// }

// Set alt text
export function getImageAltText(image?: ImageConfig, lang?: keyof LocalizedText): string | null {
  if (!image || image.decorative) return null;
  if (!lang) return '';

  return image.alt?.[lang] ?? '';
}

// Set aria-label
export function getImageAriaLabel(image?: ImageConfig, lang?: keyof LocalizedText): string | null {
  if (!image || image.decorative) return null;
  if (!lang) return getImageAltText(image);

  return image.ariaLabel?.[lang] ?? getImageAltText(image, lang);
}

// Set aria-hidden for decorative images
export function getImageAriaHidden(image?: ImageConfig): true | null {
  return image?.decorative ? true : null;
}
