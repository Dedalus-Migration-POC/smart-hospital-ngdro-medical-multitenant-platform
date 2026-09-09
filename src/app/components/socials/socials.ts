import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../initialize/state/services/language.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getSpacingStyles, getTextStyles } from '../../shared/utility/style.utils';
import { getTextClasses } from '../../shared/utility/text.utils';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { ImageConfig, TextStyle } from '../../shared/models/shared_model';
import { SocialItem, SocialsProps } from './model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-socials',
  imports: [CommonModule, IconComponent],
  templateUrl: './socials.html',
  styleUrl: './socials.scss',
})
export class Socials {
  readonly socials = input<SocialsProps | null>(null);

  private langService = inject(LanguageService);
  private sanitizer = inject(DomSanitizer);

  lang = this.langService.lang;
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getSpacingStyles = getSpacingStyles;

  isInlineSvg(icon: ImageConfig): boolean {
    return icon.type === 'inlineSvg';
  }

  getTextDecorationClass(labelStyle?: TextStyle): string {
    return labelStyle?.textDecoration ? `text-decoration-${labelStyle.textDecoration}` : '';
  }

  getImageSource(image: ImageConfig): string {
    return image.value;
  }

  getImageStyles(image: ImageConfig): Record<string, string> {
    return {
      ...(image.width ? { width: image.width } : {}),
      ...(image.height ? { height: image.height } : {}),
    };
  }

  sanitizeSvg(social: SocialItem, svg: string): SafeHtml {
    const label = social.ariaLabel[this.lang()];
    return this.sanitizer.bypassSecurityTrustHtml(
      svg.replace('<svg', `<svg role="img" aria-label="${label}" focusable="false"`),
    );
  }
}
