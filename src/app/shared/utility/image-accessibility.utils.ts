import { ImageConfig } from '../models/shared_model';

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
export function getImageAltText(
  image?: ImageConfig,
  translate: (key: string) => string = (key) => key,
): string | null {
  if (!image || image.decorative) return null;
  return image.alt ? translate(image.alt) : '';
}

// Set aria-label
export function getImageAriaLabel(
  image?: ImageConfig,
  translate: (key: string) => string = (key) => key,
): string | null {
  if (!image || image.decorative) return null;
  return image.ariaLabel ? translate(image.ariaLabel) : getImageAltText(image, translate);
}

// Set aria-hidden for decorative images
export function getImageAriaHidden(image?: ImageConfig): true | null {
  return image?.decorative ? true : null;
}
