import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Spinner } from 'src/app/components/spinner/spinner';
import { ModalService } from 'src/app/components/modal/modal.service';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { Store } from '@ngrx/store';
import { ItCheckboxComponent } from 'design-angular-kit';
import { SmartHospitalState } from 'src/app/store/reducers';
import {
  selectConsentsA4hLoading,
  selectConsentsA4hError,
  selectUserA4hPrivacyConsentError,
  selectUserA4hPrivacyConsentLoading,
  selectConsentsA4hData,
  selectUserA4hPrivacyConsentData,
  selectUpdateConsentA4hLoading,
} from './state/selectors';
import {
  fetchConsentsA4h,
  fetchUserA4hPrivacyConsent,
  updateConsentA4h,
  updateUserA4hPrivacyConsent,
} from './state/actions';
import { selectUserProfileData } from '../state/user-profile.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageConfigService } from '../../page-config.service';
import { Observable } from 'rxjs';
import { ConsentsA4H, ConsentsA4hAddPayload, ConsentsA4hRevokePayload } from './state/model';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';
import { ConsentPdfService } from './consents-privacy-a4h.service';
import { UserProfile } from '../user-profile.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-a4h-consents',
  imports: [
    Spinner,
    Breadcrumb,
    ItCheckboxComponent,
    FormsModule,
    ReactiveFormsModule,
    ImageBlock,
    TranslateModule,
  ],
  templateUrl: './a4h-consents.html',
  styleUrls: ['./a4h-consents.scss'],
})
export class A4hConsents implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly modalService = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private pageConfigService = inject(PageConfigService);
  private consentPdfService = inject(ConsentPdfService);
  private readonly translate = inject(TranslateService);

  // il consenso privacy non e' revocabile: una volta accettato (true) resta disabled per sempre
  readonly privacyConsentControl = new FormControl<boolean>(false, { nonNullable: true });

  constructor() {
    this.consentPdfService.register(this.viewContainerRef);
    inject(DestroyRef).onDestroy(() => this.consentPdfService.clear(this.viewContainerRef));

    // sincronizza il control con il dato del backend, senza emettere eventi spuri
    effect(() => {
      const consent = this.userA4hPrivacyConsent();
      if (!consent) return;

      this.privacyConsentControl.setValue(consent.consentPrivacyAccepted, { emitEvent: false });
      if (consent.consentPrivacyAccepted) {
        this.privacyConsentControl.disable({ emitEvent: false });
      } else {
        this.privacyConsentControl.enable({ emitEvent: false });
      }
    });

    // l'utente deve confermare in una modale prima che il consenso venga effettivamente accettato
    this.privacyConsentControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((isAccepted) => {
      if (!isAccepted) return;

      this.openPrivacyConsentConfirmModal();
    });
  }

  private openPrivacyConsentConfirmModal() {
    this.modalService.open(this.viewContainerRef, {
      header: {
        title: {
          text: toLocalizedText(this.translate.instant('consents-a4h.consent-privacy.title')),
        },
        closeButton: false,
      },
      body: {
        text: {
          text: toLocalizedText(this.translate.instant('consents-a4h.consent-privacy.question')),
        },
      },
      footer: {
        actions: [
          {
            button: {
              outline: true,
              text: {
                text: toLocalizedText(
                  this.translate.instant('consents-a4h.consent-privacy.cancel'),
                ),
              },
            },
            callback: () => this.privacyConsentControl.setValue(false, { emitEvent: false }),
          },
          {
            button: {
              text: {
                text: toLocalizedText(
                  this.translate.instant('consents-a4h.consent-privacy.confirm'),
                ),
              },
            },
            callback: () => this.dispatchUpdatePrivacyConsent(),
          },
        ],
      },
      backdrop: true,
      keyboard: false,
    });

    // altri checkbox della pagina precedono la modale nel DOM: sposta il focus manualmente
    setTimeout(() => {
      document.querySelector<HTMLElement>('.modal[tabindex="-1"]')?.focus();
    });
  }

  private dispatchUpdatePrivacyConsent() {
    this.store.dispatch(
      updateUserA4hPrivacyConsent({ payload: this.buildPrivacyConsentPayload() }),
    );
  }

  private buildPrivacyConsentPayload() {
    return {
      codiceStruttura: '',
      idAnagrafico: this.sequence() ?? '',
      taxCode: this.userProfile()?.fiscalCode ?? '',
    };
  }

  readonly pageConfig = toSignal(
    this.pageConfigService.get('/consents-a4h') as unknown as Observable<any>,
    {
      initialValue: null,
    },
  );

  ngOnInit(): void {
    if (this.userProfile()) {
      this.store.dispatch(fetchConsentsA4h());
    }
    if (this.sequence()) {
      this.store.dispatch(
        fetchUserA4hPrivacyConsent({ payload: this.buildPrivacyConsentPayload() }),
      );
    }
  }
  private readonly userProfile = this.store.selectSignal(selectUserProfileData);
  private readonly sequence = computed(
    () =>
      this.userProfile()?.additionalAttributes?.find((attribute) => attribute.key === 'sequence')
        ?.value,
  );
  private readonly idMpi = computed(
    () =>
      this.userProfile()?.additionalAttributes?.find((attribute) => attribute.key === 'idMpi')
        ?.value,
  );
  remoteConsentsA4h = computed(() => this.pageConfig()?.consentsA4h as ConsentsA4H[] | undefined);

  userA4hPrivacyConsent = this.store.selectSignal(selectUserA4hPrivacyConsentData);
  userA4hPrivacyConsentLoading = this.store.selectSignal(selectUserA4hPrivacyConsentLoading);
  userA4hPrivacyConsentError = this.store.selectSignal(selectUserA4hPrivacyConsentError);

  consentsA4h = this.store.selectSignal(selectConsentsA4hData);
  consentsA4hLoading = this.store.selectSignal(selectConsentsA4hLoading);
  consentsA4hError = this.store.selectSignal(selectConsentsA4hError);
  updateConsentsA4hLoading = this.store.selectSignal(selectUpdateConsentA4hLoading);

  readonly loading = computed(
    () =>
      this.consentsA4hLoading() ||
      // this.userA4hPrivacyConsentLoading() ||
      this.updateConsentsA4hLoading(),
  );
  readonly error = computed(() => this.consentsA4hError() || this.userA4hPrivacyConsentError());

  // Il backend non restituisce lo stato aggiornato dopo l'update, quindi lo teniamo in locale
  private readonly consentOverrides = signal<Record<string, boolean>>({});

  listConsents = computed(() => {
    const otherConsents = this.consentsA4h();
    const remoteConsents = this.remoteConsentsA4h();
    const overrides = this.consentOverrides();

    let consentsList: ConsentsA4H[] | null | undefined;
    if (otherConsents && remoteConsents) {
      consentsList = [
        ...otherConsents,
        ...remoteConsents.filter(
          (bEl) => !otherConsents.some((aEl) => aEl.Type.Key === bEl.Type.Key),
        ),
      ];
    } else {
      consentsList = otherConsents;
    }
    return consentsList
      ?.filter((consent) => consent.Type.Key !== '196')
      .map((consent) =>
        consent.Type.Key in overrides
          ? { ...consent, IsAgree: overrides[consent.Type.Key] }
          : consent,
      );
  });

  onToggleChange(consent: ConsentsA4H, isAgree: boolean) {
    this.consentOverrides.update((overrides) => ({ ...overrides, [consent.Type.Key]: isAgree }));

    const payload: ConsentsA4hAddPayload | ConsentsA4hRevokePayload = isAgree
      ? {
          IdMPIPatient: this.idMpi() ?? '',
          Agreement: consent.Type.Key,
          IsAgree: true,
        }
      : {
          IdMPIPatient: this.idMpi() ?? '',
          Agreement: consent.Type.Key,
        };
    this.store.dispatch(updateConsentA4h({ payload }));
  }

  onPrivacyConsentEnter() {
    if (this.privacyConsentControl.disabled) return;
    this.privacyConsentControl.setValue(true);
  }

  openConsent() {
    this.consentPdfService.fetchPrivacyConsent(this.userProfile() as unknown as UserProfile, true);
  }
}
