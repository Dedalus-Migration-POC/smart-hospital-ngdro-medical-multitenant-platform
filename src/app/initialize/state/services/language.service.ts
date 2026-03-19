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

  //loadGoogleTranslate
  loadGoogleTranslate(supportedLanguages: string) {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
    (window as any).googleTranslateElementInit = () => {
      new google.translate.TranslateElement(
        {
          pageLanguage: 'it',
          includedLanguages: supportedLanguages,
          layout: google.translate.TranslateElement.InlineLayout.VERTICAL,
        },
        'google_translate_element',
      );
    };
  }
}
declare var google: any;
