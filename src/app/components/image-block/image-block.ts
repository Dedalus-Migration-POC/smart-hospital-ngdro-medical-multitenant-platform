import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ImageBlockConfig } from './model';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
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

@Component({
  selector: 'app-image-block',
  imports: [CommonModule],
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
})
export class ImageBlock {
  readonly config = input<ImageBlockConfig | null>(null);

  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private langService = inject(LanguageService);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
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
      return svgString.replace(
        '<svg',
        '<svg  class="img-fluid" aria-hidden="true" focusable="false"',
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
}
