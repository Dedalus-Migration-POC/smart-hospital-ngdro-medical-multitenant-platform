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
    const currentLang = this.languageService.lang();
    const customContent = cookieConsentConfig.customContent;

    ccConfig.content = ccConfig.content || {};
    // Override default messages
    if (customContent.header?.[currentLang]) {
      ccConfig.content.header = customContent.header?.[currentLang];
    }
    if (customContent.message?.[currentLang]) {
      ccConfig.content.message = customContent.message?.[currentLang];
    }

    if (customContent.dismiss?.[currentLang]) {
      ccConfig.content.dismiss = customContent.dismiss?.[currentLang];
    }
    if (customContent.allow?.[currentLang]) {
      ccConfig.content.allow = customContent.allow?.[currentLang];
    }
    if (customContent.deny?.[currentLang]) {
      ccConfig.content.deny = customContent.deny?.[currentLang];
    }
    if (customContent.link?.[currentLang]) {
      ccConfig.content.link = customContent.link?.[currentLang];
    }
    if (customContent.policy?.[currentLang]) {
      ccConfig.content.policy = customContent.policy?.[currentLang];
    }
    if (customContent.cookiePolicyLink?.[currentLang]) {
      ccConfig.content['cookiePolicyLink'] = customContent.cookiePolicyLink?.[currentLang];
    }
    if (customContent.privacyPolicyLink?.[currentLang]) {
      ccConfig.content['privacyPolicyLink'] = customContent.privacyPolicyLink?.[currentLang];
    }
    if (customContent.tosLink?.[currentLang]) {
      ccConfig.content['tosLink'] = customContent.tosLink?.[currentLang];
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
