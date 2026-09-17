import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Spinner } from 'src/app/components/spinner/spinner';
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
import {
  ConsentsA4H,
  ConsentsA4hAddPayload,
  ConsentsA4hRevokePayload,
  ResponseUserA4HPrivacyConsent,
} from './state/model';
import { Breadcrumb } from 'src/app/components/breadcrumb/breadcrumb';
import { ImageBlock } from 'src/app/components/image-block/image-block';

@Component({
  selector: 'app-a4h-consents',
  imports: [Spinner, Breadcrumb, ItCheckboxComponent, FormsModule, ReactiveFormsModule, ImageBlock],
  templateUrl: './a4h-consents.html',
  styleUrls: ['./a4h-consents.scss'],
})
export class A4hConsents implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  private pageConfigService = inject(PageConfigService);

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
    if (this.userProfile() && this.userProfile()?.sequence) {
      this.store.dispatch(
        fetchUserA4hPrivacyConsent({
          payload: {
            codiceStruttura: '',
            idAnagrafico: this.userProfile()?.sequence!,
            taxCode: this.userProfile()?.identity?.identity!,
          },
        }),
      );
    }
  }
  private readonly userProfile = this.store.selectSignal(selectUserProfileData);
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
  private readonly privacyConsentOverride = signal<boolean | null>(null);

  readonly privacyConsentAccepted = computed(
    () =>
      this.privacyConsentOverride() ??
      this.userA4hPrivacyConsent()?.consentPrivacyAccepted ??
      false,
  );

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
          IdMPIPatient: this.userProfile()?.idMpi || '',
          Agreement: consent.Type.Key,
          IsAgree: true,
        }
      : {
          IdMPIPatient: this.userProfile()?.idMpi || '',
          Agreement: consent.Type.Key,
        };
    this.store.dispatch(updateConsentA4h({ payload }));
  }

  onPrivacyConsentToggleChange(
    privacyConsentA4H: ResponseUserA4HPrivacyConsent,
    isAccepted: boolean,
  ) {
    if (this.privacyConsentAccepted() === isAccepted) return;

    this.privacyConsentOverride.set(isAccepted);
    this.store.dispatch(
      updateUserA4hPrivacyConsent({
        payload: {
          codiceStruttura: '',
          idAnagrafico: this.userProfile()?.sequence ?? '',
          taxCode: this.userProfile()?.identity?.identity ?? '',
        },
      }),
    );
  }
}
