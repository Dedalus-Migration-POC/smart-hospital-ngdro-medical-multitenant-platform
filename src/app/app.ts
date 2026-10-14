import { Component, computed, effect, inject, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from './store/reducers';
import { selectAppConfig } from './initialize/state/selector';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { LanguageService } from './initialize/state/services/language.service';
import { fetchUserProfile } from './pages/user-profile/state/user-profile.actions';
import { ItNotificationsComponent, DesignAngularKitModule } from 'design-angular-kit';
import { AlertFixedComponent } from './components/alert-fixed/alert-fixed.component';
import { RemoteConfigService } from './store/remote-config/remote-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { CookieConsentModal } from './components/cookie-consent-modal/cookie-consent-modal';
import { CookieConsentService } from './initialize/state/services/cookie-consent.service';
import { AppConfig } from './initialize/state/app-config.model';
import { PageConfigService } from './pages/page-config.service';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Header,
    Footer,
    RouterOutlet,
    ItNotificationsComponent,
    AlertFixedComponent,
    DesignAngularKitModule,
    TranslateModule,
    CookieConsentModal,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private store = inject(Store<SmartHospitalState>);
  readonly router = inject(Router);
  private langService = inject(LanguageService);
  private remoteConfigService = inject(RemoteConfigService);
  private cookieConsentService = inject(CookieConsentService);
  private pageConfigService = inject(PageConfigService);

  constructor() {
    effect(() => {
      const name = this.pageName();
      if (!name) return;

      document.title = name;
    });
  }
  ngOnInit(): void {
    this.store.dispatch(fetchUserProfile());

    if (this.appConfig()?.firebaseConfig) {
      this.remoteConfigService.initialize();
    }
    if (this.appConfig()?.cookieConsentConfig?.cookieConsentOpenPdf) {
      document.addEventListener('click', this.cookieConsentService.onDocumentClick);
    }
  }

  lang = this.langService.lang;

  readonly appConfig: Signal<AppConfig | null> = toSignal(this.store.select(selectAppConfig), {
    initialValue: null,
  });
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  readonly backgroundStyle = computed(() => {
    const page = this.currentPageConfig();

    return {
      'background-color': page?.backgroundColor ?? '#ffffff',
      'background-image': page?.backgroundImage ? `url(${page.backgroundImage})` : 'none',
    };
  });

  readonly pageName = computed(() => {
    const config = this.appConfig();
    const url = this.currentUrl();
    const lang = this.lang();

    if (!config) return null;
    if (url === '/') return config.name;

    const pageName = this.currentPageConfig()?.name;
    return pageName ? this.langService.translate.instant(pageName) : config.name;
  });

  readonly pageInfoPopUp = computed(() => this.currentPageConfig()?.infoPopup);

  // ogni cambio di route risolve la config della pagina corrente (undefined se non mappata)
  private readonly currentPageConfig = toSignal(
    toObservable(this.currentUrl).pipe(switchMap((url) => this.pageConfigService.getSafe(url))),
    { initialValue: undefined },
  );

  private widgetInstance: { destroy?: () => void } | null = null;

  ngAfterViewInit(): void {
    // Piccolo defer per sicurezza dopo il render della view
    setTimeout(() => {
      if (!window.initChatbotWidget) {
        console.error('initChatbotWidget non disponibile: controlla scripts in angular.json');
        return;
      }
      const chatbotConfig = this.appConfig()?.chatbot;
      if (!chatbotConfig) {
        console.error('Configurazione chatbot non disponibile');
        return;
      }
      this.widgetInstance = window.initChatbotWidget('chatbot-widget', {
        apiUrl: chatbotConfig.apiUrl,
        language: chatbotConfig.language,
        themeColor: chatbotConfig.themeColor,
        position: chatbotConfig.position,
        botName: chatbotConfig.botName,
        avatarUrl: chatbotConfig.avatarUrl,
      });
    }, 0);
  }
  ngOnDestroy(): void {
    document.removeEventListener('click', this.cookieConsentService.onDocumentClick);
    // Evita listener duplicati se il componente viene distrutto/ricreato
    this.widgetInstance?.destroy?.();
    this.widgetInstance = null;
  }
}
declare global {
  interface Window {
    initChatbotWidget?: (
      elementId: string,
      options?: {
        apiUrl?: string;
        language?: 'it' | 'en' | 'es' | 'fr' | string;
        themeColor?: string;
        position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
        botName?: string;
        avatarUrl?: string;
      },
    ) => { destroy?: () => void } | null;
  }
}
