import { Component, inject, Input, OnInit } from '@angular/core';
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
export class PaymentNoticeCardNewComponent implements OnInit {
  @Input() noticeCode?: string | null;
  @Input() id?: string;
  @Input() amount?: number;
  @Input() expiration?: string | null;
  @Input() paymentDate?: string | null;
  @Input() state?: string | null;
  @Input() causal?: string[] | null;
  @Input() service?: string | null;
  @Input() creditors?: string | null;
  @Input() creditorsFiscalCode?: string | null;
  @Input() debtorName?: string | null;
  @Input() debtorLastName?: string | null;
  @Input() debtorEmail?: string | null;
  @Input() fiscalCode?: string | null;
  @Input() status!: string;
  @Input() isSimplePagoPa: boolean = false;

  textCopied: boolean = false;
  errorToCopy: boolean = false;
  textCopiedFiscalCode: boolean = false;
  errorToCopyFiscalCode: boolean = false;

  constructor() {}
  private store = inject(Store<SmartHospitalState>);
  ngOnInit(): void {}
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
    this.isSimplePagoPa
      ? this.store.dispatch(
          getPagoPaLink({
            payment: {
              iuv: this.noticeCode!,
              amount: this.amount! * 100,
              reason: this.causal!.join(' /'),
              notificationEmail: this.debtorEmail!,
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
