import { AfterViewInit, Component, OnDestroy, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CookieConsentModalProps } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import { DesignAngularKitModule } from 'design-angular-kit';

@Component({
  selector: 'app-cookie-consent-modal',
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './cookie-consent-modal.html',
  styleUrl: './cookie-consent-modal.scss',
})
export class CookieConsentModal implements AfterViewInit, OnDestroy {
  readonly config = input<CookieConsentModalProps | null>(null);

  private langService = inject(LanguageService);
  private readonly modalId = 'show_cookie_policy_modal';
  private readonly openerId = 'show_cookie_policy_info';
  private removeHideListener?: () => void;
  private removeHiddenListener?: () => void;

  lang = this.langService.lang;

  ngAfterViewInit(): void {
    const modalElement = document.getElementById(this.modalId);
    if (!modalElement) {
      return;
    }

    const onHide = () => {
      // Run before Bootstrap toggles aria-hidden to avoid focused hidden descendants.
      this.resetFocusInsideModal();
    };

    const onHidden = () => {
      this.resetFocusAfterClose();
    };

    modalElement.addEventListener('hide.bs.modal', onHide as EventListener);
    modalElement.addEventListener('hidden.bs.modal', onHidden as EventListener);
    this.removeHideListener = () => {
      modalElement.removeEventListener('hide.bs.modal', onHide as EventListener);
    };
    this.removeHiddenListener = () => {
      modalElement.removeEventListener('hidden.bs.modal', onHidden as EventListener);
    };
  }

  ngOnDestroy(): void {
    this.removeHideListener?.();
    this.removeHideListener = undefined;
    this.removeHiddenListener?.();
    this.removeHiddenListener = undefined;
  }

  onCloseModal(): void {
    this.resetFocusInsideModal();
  }

  private resetFocusInsideModal(): void {
    const active = document.activeElement as HTMLElement | null;
    const modalElement = document.getElementById(this.modalId);

    if (active && modalElement?.contains(active)) {
      active.blur();
    }
  }

  private resetFocusAfterClose(): void {
    this.resetFocusInsideModal();
    const opener = document.getElementById(this.openerId) as HTMLElement | null;
    if (opener) {
      opener.focus();
      return;
    }

    const body = document.body as HTMLElement | null;
    body?.focus?.();
  }
}
