import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { firstValueFrom, of, throwError } from 'rxjs';
import { LanguageService } from '../../initialize/state/services/language.service';

import { SelectLanguage } from './select-language';

describe('SelectLanguage', () => {
  let component: SelectLanguage;
  let fixture: ComponentFixture<SelectLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLanguage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('localeId');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the active language after ngx-translate loads it', async () => {
    localStorage.setItem('selectedLanguage', 'it');
    const languageService = TestBed.inject(LanguageService);
    component.switchLanguage('en');
    await fixture.whenStable();

    expect(languageService.lang()).toBe('en');
    expect(TestBed.inject(TranslateService).currentLang).toBe('en');
  });

  it('should accept languages declared in i18n config without adding them to a TypeScript union', async () => {
    localStorage.setItem('selectedLanguage', 'de');
    const languageService = TestBed.inject(LanguageService);
    const initialized = firstValueFrom(
      languageService.init({ defaultLanguage: 'de', supportedLanguages: ['it', 'en', 'de'] }),
    );
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/i18n/it.json').flush({});
    http.expectOne('/api/i18n/en.json').flush({});
    http.expectOne('/api/i18n/de.json').flush({ greeting: 'Hallo' });
    await initialized;

    expect(languageService.supportedLanguages()).toEqual(['it', 'en', 'de']);
    expect(languageService.lang()).toBe('de');
    expect(TestBed.inject(TranslateService).currentLang).toBe('de');
    expect(TestBed.inject(TranslateService).instant('greeting')).toBe('Hallo');
  });

  it('should merge backend translations over local dictionaries and cache all supported languages', async () => {
    localStorage.setItem('selectedLanguage', 'it');
    vi.spyOn(TestBed.inject(TranslateLoader), 'getTranslation').mockReturnValue(
      of({ section: { title: 'Local title', retained: 'Local value' } }),
    );
    const languageService = TestBed.inject(LanguageService);
    const initialized = firstValueFrom(
      languageService.init({
        supportedLanguages: ['it', 'en', 'it'],
        backendPrefix: '/tenant/translations',
      }),
    );
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/tenant/translations/it.json').flush({ section: { title: 'Titolo remoto' } });
    http.expectOne('/tenant/translations/en.json').flush({ section: { title: 'Remote title' } });
    await initialized;

    const translate = TestBed.inject(TranslateService);
    expect(translate.instant('section.title')).toBe('Titolo remoto');
    expect(translate.instant('section.retained')).toBe('Local value');
    await firstValueFrom(languageService.select('en'));
    expect(translate.instant('section.title')).toBe('Remote title');
    expect(translate.instant('section.retained')).toBe('Local value');
  });

  it('should keep local translations when the backend is unavailable', async () => {
    vi.spyOn(TestBed.inject(TranslateLoader), 'getTranslation').mockReturnValue(
      of({ greeting: 'Ciao' }),
    );
    const initialized = firstValueFrom(
      TestBed.inject(LanguageService).init({ supportedLanguages: ['it'] }),
    );
    TestBed.inject(HttpTestingController)
      .expectOne('/api/i18n/it.json')
      .flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await initialized;

    expect(TestBed.inject(TranslateService).instant('greeting')).toBe('Ciao');
  });

  it('should load a backend-only language when its local dictionary is missing', async () => {
    vi.spyOn(TestBed.inject(TranslateLoader), 'getTranslation').mockReturnValue(
      throwError(() => new Error('Local dictionary missing')),
    );
    const initialized = firstValueFrom(
      TestBed.inject(LanguageService).init({
        defaultLanguage: 'de',
        supportedLanguages: ['de'],
      }),
    );
    TestBed.inject(HttpTestingController)
      .expectOne('/api/i18n/de.json')
      .flush({ greeting: 'Hallo' });
    await initialized;

    expect(TestBed.inject(TranslateService).instant('greeting')).toBe('Hallo');
  });
});
