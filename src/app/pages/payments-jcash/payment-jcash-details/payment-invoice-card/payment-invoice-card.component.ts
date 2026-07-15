import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SmartHospitalState } from '../../../../store/reducers';
import { downloadInvoicePdf, getLinkPagoPa } from '../../state/actions';
import { selectDownloadingInvoicePdf } from '../../state/selectors';

@Component({
  selector: 'app-payment-invoice-card',
  imports: [CommonModule, TranslateModule],
  templateUrl: './payment-invoice-card.component.html',
  styleUrls: ['./payment-invoice-card.component.scss'],
})
export class PaymentInvoiceCardComponent {
  readonly iuv = input.required<string>();
  readonly importo = input.required<number>();
  readonly prestazioni = input.required<string>();
  readonly statoDistinta = input.required<'PAGATA' | 'DA PAGARE'>();
  readonly debtorName = input<string | null>(null);
  readonly debtorLastName = input<string | null>(null);
  readonly debtorFiscalCode = input.required<string>();
  readonly debtorEmail = input.required<string>();

  private store = inject(Store<SmartHospitalState>);

  loadingPdf$ = this.store.select(selectDownloadingInvoicePdf);
  arrPrestazioni = computed(
    () =>
      this.prestazioni()
        ?.split(';')
        .map((s) => s.trim())
        .filter(Boolean) ?? [],
  );
  debtorCodiceFiscale = computed(() => {
    const debtorFiscalCode = this.debtorFiscalCode();
    return debtorFiscalCode.startsWith('TINIT-') ? debtorFiscalCode.slice(6) : debtorFiscalCode;
  });

  // feedback  for field copy (key: 'iuv', 'creditorsFiscalCode')
  copiedField: string | null = null;
  errorField: string | null = null;

  goPayment() {
    this.store.dispatch(
      getLinkPagoPa({
        payment: {
          iuv: this.iuv().length === 17 ? '3' + this.iuv() : this.iuv(),
          amount: Math.round(this.importo() * 100),
          reason: this.arrPrestazioni().join(' /'),
          notificationEmail: this.debtorEmail(),
        },
      }),
    );
  }

  downloadInvoicePdf() {
    if (!this.iuv()) return;

    this.store.dispatch(downloadInvoicePdf({ iuv: this.iuv() }));
  }

  async copy(text: string | null, field: string) {
    if (!text) {
      this.flash(field, false);
      return;
    }

    try {
      const isSecure = window.isSecureContext || location.protocol === 'https:';

      if (navigator.clipboard && isSecure) {
        await navigator.clipboard.writeText(text);
        this.flash(field, true);
        return;
      }

      // Fallback (if necessary for HTTP o  old browser)
      const ok = this.legacyCopyToClipboard(text);
      this.flash(field, ok);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      this.flash(field, false);
    }
  }

  /**
   * @deprecated Fallback for HTTP environments or browsers that do not support navigator.clipboard.
   */
  private legacyCopyToClipboard(text: string): boolean {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }

  private flash(field: string, ok: boolean) {
    if (ok) {
      this.copiedField = field;
      setTimeout(() => {
        if (this.copiedField === field) this.copiedField = null;
      }, 2000);
    } else {
      this.errorField = field;
      setTimeout(() => {
        if (this.errorField === field) this.errorField = null;
      }, 2000);
    }
  }
}
