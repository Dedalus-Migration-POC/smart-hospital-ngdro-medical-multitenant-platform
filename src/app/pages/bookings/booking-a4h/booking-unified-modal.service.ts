import { Injectable, ViewContainerRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'src/app/components/modal/modal.service';
import { ModalActionConfig, ModalConfig } from 'src/app/components/modal/model';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { HealthcareUnit } from './booking-unified.service';

@Injectable({ providedIn: 'root' })
export class BookingUnifiedModalService {
  private readonly modalService = inject(ModalService);
  private readonly translate = inject(TranslateService);
  private viewContainerRef: ViewContainerRef | null = null;

  register(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  clear(viewContainerRef: ViewContainerRef): void {
    if (this.viewContainerRef === viewContainerRef) {
      this.viewContainerRef = null;
    }
  }

  openInfo(
    titleKey: string,
    bodyKey: string,
    bodyParams?: Record<string, unknown>,
    onOk?: () => void,
  ): void {
    this.open({
      title: this.translate.instant(titleKey),
      body: this.translate.instant(bodyKey, bodyParams),
      actions: [this.okAction(onOk)],
    });
  }

  openConfirm(config: {
    titleKey: string;
    bodyKey: string;
    bodyParams?: Record<string, unknown>;
    cancelKey?: string;
    confirmKey?: string;
    onCancel?: () => void;
    onConfirm: () => void;
  }): void {
    this.open({
      title: this.translate.instant(config.titleKey),
      body: this.translate.instant(config.bodyKey, config.bodyParams),
      actions: [
        {
          button: {
            outline: true,
            text: { text: toLocalizedText(this.translate.instant(config.cancelKey ?? 'no')) },
          },
          callback: config.onCancel ?? (() => {}),
        },
        {
          button: {
            text: { text: toLocalizedText(this.translate.instant(config.confirmKey ?? 'yes')) },
          },
          callback: config.onConfirm,
        },
      ],
    });
  }

  openConfirmText(config: {
    titleKey: string;
    body: string;
    cancelKey?: string;
    confirmKey?: string;
    onCancel?: () => void;
    onConfirm: () => void;
  }): void {
    this.open({
      title: this.translate.instant(config.titleKey),
      body: config.body,
      actions: [
        {
          button: {
            outline: true,
            text: { text: toLocalizedText(this.translate.instant(config.cancelKey ?? 'no')) },
          },
          callback: config.onCancel ?? (() => {}),
        },
        {
          button: {
            text: { text: toLocalizedText(this.translate.instant(config.confirmKey ?? 'yes')) },
          },
          callback: config.onConfirm,
        },
      ],
    });
  }

  openSelectStruttura(config: {
    units: HealthcareUnit[];
    onSelect: (unit: HealthcareUnit) => void;
  }): void {
    this.open({
      title: this.translate.instant('selectStruttura.title'),
      body: this.translate.instant('selectStruttura.subtitle'),
      actions: config.units.map((unit) => ({
        button: {
          text: { text: toLocalizedText(unit.name) },
          whiteSpace: 'normal',
        },
        callback: () => config.onSelect(unit),
      })),
    });
  }

  private open(config: { title: string; body: string; actions: ModalActionConfig[] }): void {
    if (!this.viewContainerRef) return;

    const modalConfig: ModalConfig = {
      centered: true,
      header: {
        title: { text: toLocalizedText(config.title) },
        closeButton: true,
      },
      body: {
        text: { text: toLocalizedText(config.body) },
      },
      footer: {
        layout: { justify: 'end', gap: 'gap-2', wrap: 'wrap' },
        actions: config.actions,
      },
    };

    this.modalService.open(this.viewContainerRef, modalConfig);
  }

  private okAction(callback: () => void = () => {}): ModalActionConfig {
    return {
      button: {
        text: { text: toLocalizedText('Ok') },
      },
      callback,
    };
  }
}
