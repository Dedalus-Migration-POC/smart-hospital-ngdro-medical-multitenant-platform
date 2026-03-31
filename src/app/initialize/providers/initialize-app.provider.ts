import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import * as InitializeAppActions from '../state/actions';
import { AppConfig } from '../state/app-config.model';
import { ThemeService } from '../state/services/theme.service';
import { AppConfigApiService } from '../state/services/app-config-api.service';
import { LanguageService } from '../state/services/language.service';

export function provideInitializeApp(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(async () => {
      const api = inject(AppConfigApiService);
      const themeService = inject(ThemeService);
      const store = inject(Store);
      const languageService = inject(LanguageService);

      try {
        const config: AppConfig = await firstValueFrom(api.loadAppConfig());
        themeService.apply(config);
        store.dispatch(InitializeAppActions.setAppConfig({ data: config }));
        languageService.init();
        if (config.translate?.googleTranslate) {
          languageService.loadGoogleTranslate(config.translate.googleTranslate!.supportedLanguages);
        }
      } catch (error) {
        store.dispatch(InitializeAppActions.setAppConfigFailure({ error }));
        console.error('Error loading initial configuration', error);
      }
    }),
  ]);
}
