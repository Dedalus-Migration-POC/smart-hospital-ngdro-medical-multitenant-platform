import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, Language, languages } from './i18n/language.model';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'it' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly translate = inject(TranslateService);
  readonly http = inject(HttpClient);

  private _lang = signal<Lang>(this.detectInitialLang());

  lang = this._lang.asReadonly();

  setLang(lang: Lang) {
    this._lang.set(lang);
    localStorage.setItem('selectedLanguage', lang);
    localStorage.setItem('localeId', lang);
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

  //i18n
  private current: Language = defaultLanguage;

  private language: BehaviorSubject<Language> = new BehaviorSubject<Language>(this.current);
  selectedLanguage = this.language.asObservable();
  get currentLanguage(): Language {
    return this.current;
  }

  init() {
    const storedLocaleId = localStorage.getItem('selectedLanguage');
    const storedLanguage = languages.find((lang) => lang.localeId === storedLocaleId);
    if (storedLanguage) {
      this.select(storedLanguage.localeId);
    } else {
      this.select(defaultLanguage.localeId);
    }
  }

  select(updateLocaleId: string): void {
    this.current = languages.find((lang) => lang.localeId === updateLocaleId) || languages[0];
    localStorage.setItem('localeId', this.current.localeId);
    this.translate.setDefaultLang(this.current.localeId);
    this.translate.use(this.lang());
    this.language.next(this.current);
  }
}
declare var google: any;
