import { Injectable, signal } from '@angular/core';

export type Lang = 'it' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang = signal<Lang>(this.detectInitialLang());

  lang = this._lang.asReadonly();

  setLang(lang: Lang) {
    this._lang.set(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  private detectInitialLang(): Lang {
    const saved = localStorage.getItem('selectedLanguage') as Lang;
    if (saved) return saved;
    return 'it';
  }
}
