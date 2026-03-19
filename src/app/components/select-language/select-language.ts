import { Component, inject, input } from '@angular/core';
import { Lang, LanguageService } from '../../initialize/state/services/language.service';
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

  switchLanguage(lang: Lang) {
    this.langService.setLang(lang);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
}
