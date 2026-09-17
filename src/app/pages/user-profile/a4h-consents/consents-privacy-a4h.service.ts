import { DestroyRef, Injectable, ViewContainerRef, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { DownloadUtils } from 'src/utils/download-utils';
import { SmartHospitalState } from 'src/app/store/reducers';
import { ModalService } from 'src/app/components/modal/modal.service';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { selectSelectedStruttura } from 'src/app/pages/bookings/booking-a4h/state/struttura/struttura.selectors';
import { selectUserProfileData } from '../state/user-profile.selectors';
import * as UserProfileActions from '../state/user-profile.actions';
import * as ConsentsA4HActions from './state/actions';
import { UserProfileA4H } from '../user-profile.model';
import { ResponseUserA4HPrivacyConsent } from './state/model';
import { selectUserA4hPrivacyConsentData } from './state/selectors';

@Injectable({
  providedIn: 'root',
})
export class ConsentPdfService {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translate = inject(TranslateService);
  private readonly user = this.store.selectSignal(selectUserProfileData);
  private readonly consent = this.store.selectSignal(selectUserA4hPrivacyConsentData);
  private readonly selectedStruttura = this.store.selectSignal(selectSelectedStruttura);
  private viewContainerRef: ViewContainerRef | null = null;
  private pdfUrl: string | null = null;
  private pdfResourceUrl: SafeResourceUrl | null = null;

  register(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  clear(viewContainerRef: ViewContainerRef): void {
    if (this.viewContainerRef === viewContainerRef) {
      this.viewContainerRef = null;
    }
  }

  /**
   * Richiede il PDF dell'informativa privacy tramite gli action A4H quando il consenso
   * non e' ancora accettato. Il recupero del profilo e la chiamata HTTP sono gestiti dagli effects;
   * l'apertura del PDF e la conferma del consenso restano in questo service.
   */
  openConsent(): void {
    if (this.consent()?.consentPrivacyAccepted === true) return;

    const profile = this.user() as unknown as UserProfileA4H | null;
    if (!profile?.sequence) {
      this.actions$
        .pipe(
          ofType(UserProfileActions.fetchUserProfileSuccess),
          take(1),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(({ data: fetchedProfile }) => {
          const a4hProfile = fetchedProfile as unknown as UserProfileA4H;
          if (a4hProfile.sequence) {
            this.fetchPrivacyConsent(a4hProfile);
          }
        });

      this.store.dispatch(UserProfileActions.fetchUserProfile());
      return;
    }

    this.fetchPrivacyConsent(profile);
  }

  private fetchPrivacyConsent(profile: UserProfileA4H): void {
    if (!profile.sequence) return;

    this.actions$
      .pipe(
        ofType(ConsentsA4HActions.fetchUserA4hPrivacyConsentSuccess),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ data: consent }) => {
        if (consent.consentPrivacyAccepted !== true && consent.PrivacyPDF) {
          this.openPdf(consent, profile);
        }
      });

    this.store.dispatch(
      ConsentsA4HActions.fetchUserA4hPrivacyConsent({
        payload: {
          codiceStruttura: this.selectedStruttura()?.id ?? '',
          idAnagrafico: profile.sequence,
          taxCode: profile.identity.identity,
        },
      }),
    );
  }

  private openPdf(consent: ResponseUserA4HPrivacyConsent, profile: UserProfileA4H): void {
    if (!this.viewContainerRef) return;

    this.revokePdfUrl();
    this.pdfUrl = DownloadUtils.createObjectUrl(consent.PrivacyPDF!);
    this.pdfResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);

    this.modalService.open(
      this.viewContainerRef,
      {
        centered: true,
        header: {
          title: {
            text: toLocalizedText(this.translate.instant('booking-a4h.consent-privacy.title')),
          },
          closeButton: true,
        },
        body: {
          text: {
            text: toLocalizedText(this.translate.instant('booking-a4h.consent-privacy.question')),
          },
          pdf: {
            url: this.pdfUrl,
            resourceUrl: this.pdfResourceUrl,
            title: this.translate.instant('booking-a4h.consent-privacy.pdfTitle'),
            fallbackText: this.translate.instant('booking-a4h.consent-privacy.pdfFallback'),
            openLabel: this.translate.instant('booking-a4h.consent-privacy.openPdf'),
            downloadLabel: this.translate.instant('booking-a4h.consent-privacy.downloadPdf'),
          },
        },
        footer: {
          layout: { justify: 'center', gap: 'gap-2', wrap: 'wrap' },
          actions: [
            {
              button: {
                outline: true,
                text: {
                  text: toLocalizedText(
                    this.translate.instant('booking-a4h.consent-privacy.cancel'),
                  ),
                },
              },
            },
            {
              button: {
                text: {
                  text: toLocalizedText(
                    this.translate.instant('booking-a4h.consent-privacy.confirm'),
                  ),
                },
              },
              callback: () => this.confirmPrivacyConsent(profile),
            },
          ],
        },
      },
      () => this.revokePdfUrl(),
    );
  }

  private revokePdfUrl(): void {
    if (!this.pdfUrl) return;

    DownloadUtils.revokeObjectUrl(this.pdfUrl);
    this.pdfUrl = null;
    this.pdfResourceUrl = null;
  }

  private confirmPrivacyConsent(profile: UserProfileA4H): void {
    this.store.dispatch(
      ConsentsA4HActions.updateUserA4hPrivacyConsent({
        payload: {
          codiceStruttura: this.selectedStruttura()?.id ?? '',
          idAnagrafico: profile.sequence ?? '',
          taxCode: profile.identity.identity,
        },
      }),
    );
  }
}
