import { Component, inject, input } from '@angular/core';
import { LanguageService } from '../../initialize/state/services/language.service';
import { SelectLanguageProps } from './model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-language',
  imports: [CommonModule],
  templateUrl: './select-language.html',
  styleUrl: './select-language.scss',
})
export class SelectLanguage {
  readonly config = input<SelectLanguageProps | null>(null);
  isOpen = false;

  private langService = inject(LanguageService);

  lang = this.langService.lang;
  supportedLanguages = this.langService.supportedLanguages;

  switchLanguage(lang: string) {
    this.langService.setLang(lang);
    this.langService.select(lang).subscribe();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}
