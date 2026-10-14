import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { LanguageService } from '../../initialize/state/services/language.service';

import { SelectLanguage } from './select-language';

describe('SelectLanguage', () => {
  let component: SelectLanguage;
  let fixture: ComponentFixture<SelectLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguage],
      providers: [provideHttpClient(), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLanguage);
    component = fixture.componentInstance;
    await fixture.whenStable();
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
    await firstValueFrom(
      languageService.init({ defaultLanguage: 'de', supportedLanguages: ['it', 'en', 'de'] }),
    );

    expect(languageService.supportedLanguages()).toEqual(['it', 'en', 'de']);
    expect(languageService.lang()).toBe('de');
    expect(TestBed.inject(TranslateService).currentLang).toBe('de');
  });
});
