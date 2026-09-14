import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ImageBlockConfig } from './model';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LanguageService } from '../../initialize/state/services/language.service';
import {
  getAlignClass,
  getFlexLayoutClasses,
  getJustifyClass,
} from '../../shared/utility/layout.utils';
import {
  getImageAltText,
  getImageAriaHidden,
  getImageAriaLabel,
} from '../../shared/utility/image-accessibility.utils';
import { getTooltipClassName, getTooltipLabel } from '../../shared/utility/tooltip.utils';
import { getLocalizedText, getTextClasses } from '../../shared/utility/text.utils';
import { getSpacingStyles, getTextStyles } from '../../shared/utility/style.utils';
import { ImageStyle } from '../../shared/models/shared_model';

@Component({
  selector: 'app-image-block',
  imports: [CommonModule],
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
})
export class ImageBlock {
  readonly config = input<ImageBlockConfig | null | undefined>(null);

  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private langService = inject(LanguageService);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getAlignClass = getAlignClass;
  protected readonly getJustifyClass = getJustifyClass;

  lang = this.langService.lang;

  altText = computed(() => getImageAltText(this.config()?.image, this.lang()));
  ariaLabel = computed(() => getImageAriaLabel(this.config()?.image, this.lang()));
  ariaHidden = computed(() => getImageAriaHidden(this.config()?.image));

  titleText = computed(() => getLocalizedText(this.config()?.text?.title.text, this.lang()));
  subTitleText = computed(() => getLocalizedText(this.config()?.text?.subTitle?.text, this.lang()));

  tooltipLabel = computed(() => getTooltipLabel(this.config()?.image?.tooltip, this.lang()));
  tooltipClassName = computed(() => getTooltipClassName(this.config()?.image?.tooltip));

  getBlockStyles(config: ImageBlockConfig): Record<string, string> {
    return {
      ...getSpacingStyles(config.margin),
      ...getSpacingStyles(config.padding, 'padding'),
    };
  }

  getImageStyles(image: ImageStyle): Record<string, string> {
    return {
      ...(image.width ? { width: image.width } : {}),
      ...(image.height ? { height: image.height } : {}),
      ...getSpacingStyles(image.margin),
      ...getSpacingStyles(image.padding, 'padding'),
    };
  }

  // ACTION HANDLER
  handleClick(): void {
    const cfg = this.config();
    if (!cfg?.clickable || !cfg.action) return;

    const action = cfg.action;

    if (action.type === 'route') {
      this.router.navigate([action.url]);
    } else {
      window.open(action.url, action.target || '_self');
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    const cfg = this.config();
    if (!cfg?.clickable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  }

  sanitizeSvg(svgString: string) {
    const cfg = this.config();

    if (!cfg) return svgString;

    if (cfg.image?.decorative) {
      return this.sanitizer.bypassSecurityTrustHtml(
        svgString.replace('<svg', '<svg class="img-fluid" aria-hidden="true" focusable="false"'),
      );
    }

    const label = this.ariaLabel();
    return this.sanitizer.bypassSecurityTrustHtml(
      svgString.replace(
        '<svg',
        `<svg role="img" class="img-fluid"  aria-label="${label}" focusable="false"`,
      ),
    );
  }

  detectMimeType(base64String: string): string {
    // Estrai il base64 puro (senza data:...;base64, se presente)
    const base64Pure = base64String.includes(',') ? base64String.split(',')[1] : base64String;

    try {
      const binaryString = atob(base64Pure);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // PNG: magic number 89 50 4E 47
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
        return 'image/png';
      }

      // JPEG: magic number FF D8 FF
      if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
        return 'image/jpeg';
      }

      // SVG: inizia con < (0x3C) seguito da ?xml o svg
      if (bytes[0] === 0x3c) {
        const text = binaryString.substring(0, 100).toLowerCase();
        if (text.includes('<?xml') || text.includes('<svg')) {
          return 'image/svg+xml';
        }
      }

      // GIF: magic number 47 49 46
      if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
        return 'image/gif';
      }

      // WebP: RIFF header
      if (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      ) {
        return 'image/webp';
      }
    } catch (error) {
      console.warn('Error detecting MIME type from base64:', error);
    }

    return 'image/png'; // Default
  }

  getSafeBase64Url(base64String: string): SafeUrl {
    // Se non ha il prefisso data:, aggiungilo
    if (!base64String.includes('data:')) {
      const mimeType = this.detectMimeType(base64String);
      const fullUrl = `data:${mimeType};base64,${base64String}`;
      return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
    }
    // Se ha già il prefisso, usalo come-è
    return this.sanitizer.bypassSecurityTrustUrl(base64String);
  }
}
