import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from './store/reducers';
import { selectAppConfig } from './initialize/state/selector';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LanguageService } from './initialize/state/services/language.service';
import { fetchUserProfile } from './pages/user-profile/state/user-profile.actions';
import { ItNotificationsComponent } from 'design-angular-kit';
import { AlertFixedComponent } from './components/alert-fixed/alert-fixed.component';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Header,
    Footer,
    RouterOutlet,
    ItNotificationsComponent,
    AlertFixedComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private store = inject(Store<SmartHospitalState>);
  readonly router = inject(Router);
  private langService = inject(LanguageService);

  constructor() {
    effect(() => {
      const name = this.pageName();
      if (!name) return;

      document.title = name;
    });
  }
  ngOnInit(): void {
    this.store.dispatch(fetchUserProfile());
  }

  lang = this.langService.lang;

  readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects.split('?')[0]),
    ),
    { initialValue: this.router.url.split('?')[0] },
  );

  readonly bgImg = computed(() => {
    const config = this.appConfig();
    const url = this.currentUrl();
    if (!config) return '';
    const page = config.pages.find((p: any) => p.id === url);
    return page?.page?.backgroundImage ?? '';
  });
  readonly bgColor = computed(() => {
    const config = this.appConfig();
    const url = this.currentUrl();
    if (!config) return '';
    const page = config.pages.find((p: any) => p.id === url);

    return page?.page?.backgroundColor;
  });

  readonly pageName = computed(() => {
    const config = this.appConfig();
    const url = this.currentUrl();
    const lang = this.lang();

    if (!config) return null;
    if (url === '/') return config.name;

    const page = config.pages.find((p: any) => p.id === url);
    return page?.name[lang] ?? config.name;
  });

  readonly pageInfoPopUp = computed(() => {
    const config = this.appConfig();
    const url = this.currentUrl();
    if (!config) return '';
    const page = config.pages.find((p: any) => p.id === url);
    return page?.page?.infoPopup ?? '';
  });
}
