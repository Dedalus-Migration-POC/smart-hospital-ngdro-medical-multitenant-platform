import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ImageBlockConfig } from './model';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-block',
  imports: [CommonModule],
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
})
export class ImageBlock {
  readonly config = input<ImageBlockConfig | null>(null);
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}
  lang: 'it' | 'en' = 'it';
  // ACCESSIBILITY
  altText = computed(() => {
    const cfg = this.config();
    if (!cfg || cfg.decorative) return null;

    return cfg.alt?.[this.lang] ?? '';
  });

  ariaLabel = computed(() => {
    const cfg = this.config();
    if (!cfg || cfg.decorative) return null;

    return cfg.ariaLabel?.[this.lang] ?? this.altText();
  });

  ariaHidden = computed(() => {
    const cfg = this.config();
    return cfg?.decorative ? true : null;
  });

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
  // LAYOUT
  layoutClasses = computed(() => {
    const cfg = this.config();
    const layout = cfg?.text?.layout;

    if (!layout) return '';

    return [
      'd-flex',
      `flex-${layout.direction}`,
      `justify-content-${layout.align}`,
      `align-items-${layout.align}`,
      layout.gap,
    ].join(' ');
  });

  flexOrder = computed(() => {
    const cfg = this.config();
    const placement = cfg?.text?.layout?.placement;

    return placement === 'start' ? 'flex-row-reverse' : '';
  });
  // TOOLTIP

  tooltipLabel = computed(() => {
    const cfg = this.config();
    if (!cfg?.tooltip) return null;

    return cfg.tooltipLabel?.[this.lang] ?? null;
  });

  sanitizeSvg(svgString: string) {
    const cfg = this.config();

    if (!cfg) return svgString;

    if (cfg.decorative) {
      return svgString.replace('<svg', '<svg aria-hidden="true" focusable="false"');
    }

    const label = this.ariaLabel();
    return this.sanitizer.bypassSecurityTrustHtml(
      svgString.replace('<svg', `<svg role="img" aria-label="${label}" focusable="false"`),
    );
  }
}
