import { Component, inject, input } from '@angular/core';
import { ISocials } from './model';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../initialize/state/services/language.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-socials',
  imports: [CommonModule],
  templateUrl: './socials.html',
  styleUrl: './socials.scss',
})
export class Socials {
  readonly socials = input<ISocials | null>(null);

  private langService = inject(LanguageService);
  private sanitizer = inject(DomSanitizer);

  lang = this.langService.lang;

  sanitizeSvg(social: any) {
    const cfg = this.socials();
    const lang = this.lang();
    if (!cfg) return social.icon.value;

    const label = social.ariaLabel[lang];
    return this.sanitizer.bypassSecurityTrustHtml(
      social.icon.value.replace('<svg', `<svg role="img" aria-alt="${label}" focusable="true"`),
    );
  }
}
