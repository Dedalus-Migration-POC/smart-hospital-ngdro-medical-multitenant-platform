import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { downloadInvoicePdf, getPagoPaLink } from '../../state/payments.actions';
import {
  selectDownloadingInvoicePdf,
  selectPagoPaLinkLoading,
} from '../../state/payments.selectors';
import { SmartHospitalState } from '../../../../store/reducers';
import { DesignAngularKitModule } from 'design-angular-kit';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-notice-card-new',
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './payment-notice-card-new.component.html',
  styleUrls: ['./payment-notice-card-new.component.scss'],
})
export class PaymentNoticeCardNewComponent {
  readonly noticeCode = input<string | null | undefined>(undefined);
  readonly id = input<string | undefined>(undefined);
  readonly amount = input<number | undefined>(undefined);
  readonly expiration = input<string | null | undefined>(undefined);
  readonly paymentDate = input<string | null | undefined>(undefined);
  readonly state = input<string | null | undefined>(undefined);
  readonly causal = input<string[] | null | undefined>(undefined);
  readonly service = input<string | null | undefined>(undefined);
  readonly creditors = input<string | null | undefined>(undefined);
  readonly creditorsFiscalCode = input<string | null | undefined>(undefined);
  readonly debtorName = input<string | null | undefined>(undefined);
  readonly debtorLastName = input<string | null | undefined>(undefined);
  readonly debtorEmail = input<string | null | undefined>(undefined);
  readonly fiscalCode = input<string | null | undefined>(undefined);
  readonly status = input<string | undefined>(undefined);
  readonly isSimplePagoPa = input(false);

  textCopied: boolean = false;
  errorToCopy: boolean = false;
  textCopiedFiscalCode: boolean = false;
  errorToCopyFiscalCode: boolean = false;

  constructor() {}
  private store = inject(Store<SmartHospitalState>);
  window = window;

  getStatus(status: string) {
    let title;
    let styleClass;
    switch (status) {
      case 'NOT_PAYED':
        title = 'Da pagare';
        styleClass = 'error';
        break;
      case 'PAYED':
        title = 'Pagato';
        styleClass = 'success';
        break;
      case 'VERIFICATION':
        title = 'In attesa di verifica';
        styleClass = 'warning';
        break;
      default:
        title = undefined;
        styleClass = undefined;
    }

    return { title, styleClass };
  }

  loadingPdf$ = this.store.select(selectDownloadingInvoicePdf);
  loadingGetPagoPaLink$ = this.store.select(selectPagoPaLinkLoading);
  downloadPdf(admissionsId: string) {
    this.store.dispatch(downloadInvoicePdf({ admissionsId }));
  }

  pay() {
    this.isSimplePagoPa()
      ? this.store.dispatch(
          getPagoPaLink({
            payment: {
              iuv: this.noticeCode()!,
              amount: this.amount()! * 100,
              reason: this.causal()!.join(' /'),
              notificationEmail: this.debtorEmail()!,
            },
          }),
        )
      : window.open('https://checkout.pagopa.it/inserisci-dati-avviso', '_blank');
  }

  copyCodeText() {
    const contentToCopy = document.getElementById('copy-content');

    if (contentToCopy) {
      const content = contentToCopy.innerText.trim();
      navigator.clipboard
        .writeText(content)
        .then(() => {
          this.textCopied = true;
          setTimeout(() => (this.textCopied = false), 2000);
        })
        .catch(() => {
          this.errorToCopy = true;
          setTimeout(() => (this.errorToCopy = false), 2000);
        });
    }
  }
  copyFiscalCodeText() {
    const contentToCopy = document.getElementById('fiscal-code');
    if (contentToCopy) {
      const content = contentToCopy.innerText.trim();
      navigator.clipboard
        .writeText(content)
        .then(() => {
          this.textCopiedFiscalCode = true;
          setTimeout(() => (this.textCopiedFiscalCode = false), 2000);
        })
        .catch(() => {
          this.errorToCopyFiscalCode = true;
          setTimeout(() => (this.errorToCopyFiscalCode = false), 2000);
        });
    }
  }
}
