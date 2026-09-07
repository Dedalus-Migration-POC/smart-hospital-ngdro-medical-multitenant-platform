import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewContainerRef,
  inject,
  input,
} from '@angular/core';
import { CookieConsentModalProps } from './model';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'app-cookie-consent-modal',
  templateUrl: './cookie-consent-modal.html',
  styleUrl: './cookie-consent-modal.scss',
})
export class CookieConsentModal implements AfterViewInit, OnDestroy {
  readonly config = input<CookieConsentModalProps | null>(null);

  private readonly modalService = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly defaultOpenerId = 'show_cookie_policy_info';
  private removeClickListener?: () => void;

  ngAfterViewInit(): void {
    const config = this.config();
    if (!config) {
      return;
    }

    const openerId = config.openerId ?? this.defaultOpenerId;
    const onDocumentClick = (event: Event) => {
      const opener = document.getElementById(openerId);
      const target = event.target as Node | null;

      if (!opener || !target || !opener.contains(target)) {
        return;
      }

      event.preventDefault();
      this.modalService.open(this.viewContainerRef, config, () => {
        requestAnimationFrame(() => {
          const opener = document.getElementById(openerId) as HTMLElement | null;
          opener?.focus({ preventScroll: true });
        });
      });
    };

    document.addEventListener('click', onDocumentClick);
    this.removeClickListener = () => document.removeEventListener('click', onDocumentClick);
  }

  ngOnDestroy(): void {
    this.removeClickListener?.();
  }
}
