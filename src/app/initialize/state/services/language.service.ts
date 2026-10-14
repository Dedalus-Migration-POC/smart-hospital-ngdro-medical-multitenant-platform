import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, Language, languages } from './i18n/language.model';
import { BehaviorSubject, tap } from 'rxjs';

export type Lang = string;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly translate = inject(TranslateService);
  readonly http = inject(HttpClient);

  private _lang = signal<Lang>(this.detectInitialLang());
  private readonly _supportedLanguages = signal<string[]>(
    languages.map(({ localeId }) => localeId),
  );
  private defaultLanguageId = defaultLanguage.localeId;

  lang = this._lang.asReadonly();
  supportedLanguages = this._supportedLanguages.asReadonly();

  setLang(lang: Lang) {
    if (!this._supportedLanguages().includes(lang)) return;
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
          pageLanguage: this.defaultLanguageId,
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

  init(config?: { defaultLanguage?: string; supportedLanguages?: string[] }) {
    const supportedLanguages = [...new Set(config?.supportedLanguages?.filter(Boolean) ?? [])];
    const availableLanguages = supportedLanguages.length
      ? supportedLanguages
      : languages.map(({ localeId }) => localeId);
    this._supportedLanguages.set(availableLanguages);

    this.defaultLanguageId = availableLanguages.includes(config?.defaultLanguage ?? '')
      ? config!.defaultLanguage!
      : (availableLanguages[0] ?? defaultLanguage.localeId);

    const storedLocaleId = localStorage.getItem('selectedLanguage');
    const selectedLanguage =
      storedLocaleId && availableLanguages.includes(storedLocaleId)
        ? storedLocaleId
        : this.defaultLanguageId;
    return this.select(selectedLanguage);
  }

  select(updateLocaleId: string) {
    const localeId = this._supportedLanguages().includes(updateLocaleId)
      ? updateLocaleId
      : this.defaultLanguageId;
    this.current = languages.find((lang) => lang.localeId === localeId) ?? {
      ...defaultLanguage,
      name: localeId,
      localeId,
    };
    localStorage.setItem('localeId', localeId);
    this.translate.setDefaultLang(this.defaultLanguageId);
    return this.translate.use(localeId).pipe(
      tap(() => {
        this._lang.set(localeId);
        this.language.next(this.current);
      }),
    );
  }
}
declare var google: any;
