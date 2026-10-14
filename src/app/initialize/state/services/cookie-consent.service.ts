import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { LanguageService } from './language.service';
import { CookieConsentConfig } from '../app-config.model';
import { DownloadUtils } from 'src/utils/download-utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectAppConfig } from '../selector';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  readonly ccService = inject(NgcCookieConsentService);
  readonly languageService = inject(LanguageService);
  private http = inject(HttpClient);
  private store = inject(Store<SmartHospitalState>);

  readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });

  initCookieConsent(cookieConsentConfig: CookieConsentConfig): void {
    this.ccService.init(cookieConsentConfig);

    const ccConfig = this.ccService.getConfig();
    const customContent = cookieConsentConfig.customContent;

    ccConfig.content = ccConfig.content || {};
    for (const [key, translationKey] of Object.entries(customContent)) {
      if (translationKey) {
        (ccConfig.content as Record<string, string>)[key] =
          this.languageService.translate.instant(translationKey);
      }
    }
    this.ccService.destroy(); // remove previous cookie bar (with default messages)
    this.ccService.init(this.ccService.getConfig()); // update config with translated messages
  }

  onDocumentClick = (event: Event): void => {
    this.handleCookiePolicyButtonClick(event);
  };

  private handleCookiePolicyButtonClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    const button = target?.closest('#show_cookie_policy_pdf');

    if (button) {
      this.openCookieConsentPdf();
    }
  }

  private openCookieConsentPdf(): void {
    const cookieConsentOpenPdf = this.appConfig()?.cookieConsentConfig?.cookieConsentOpenPdf;
    if (!cookieConsentOpenPdf?.url) {
      return;
    }

    this.http
      .request(cookieConsentOpenPdf.method, cookieConsentOpenPdf.url, {
        responseType: 'blob',
      })
      .subscribe({
        next: (pdfBlob) => DownloadUtils.openPdf(pdfBlob),
        error: (error) => {
          console.error('Error opening cookie policy PDF', error);
        },
      });
  }
}
