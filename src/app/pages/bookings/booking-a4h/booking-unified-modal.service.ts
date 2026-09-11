import { ComponentRef, Injectable, ViewContainerRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'src/app/components/modal/modal.service';
import { ModalActionConfig, ModalConfig } from 'src/app/components/modal/model';
import { toLocalizedText } from 'src/app/shared/utility/text.utils';
import { HealthcareUnit } from './state/model';
import { SelectStrutturaDialogComponent } from './select-struttura-dialog/select-struttura-dialog.component';

@Injectable({ providedIn: 'root' })
export class BookingUnifiedModalService {
  private readonly modalService = inject(ModalService);
  private readonly translate = inject(TranslateService);
  private viewContainerRef: ViewContainerRef | null = null;
  private selectStrutturaRef: ComponentRef<SelectStrutturaDialogComponent> | null = null;

  register(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  clear(viewContainerRef: ViewContainerRef): void {
    if (this.viewContainerRef === viewContainerRef) {
      this.selectStrutturaRef = null;
      this.viewContainerRef = null;
    }
  }

  openInfo(
    titleKey: string,
    bodyKey: string,
    bodyParams?: Record<string, unknown>,
    onOk?: () => void,
    okKey = 'commons.confirm',
  ): void {
    this.open({
      title: this.translate.instant(titleKey),
      body: this.translate.instant(bodyKey, bodyParams),
      actions: [this.okAction(onOk, okKey)],
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
    if (!this.viewContainerRef) return;

    this.modalService.close();
    this.selectStrutturaRef?.destroy();

    const componentRef = this.viewContainerRef.createComponent(SelectStrutturaDialogComponent);
    this.selectStrutturaRef = componentRef;
    componentRef.setInput('units', config.units);
    componentRef.instance.onSelect.subscribe((unit) => {
      this.closeSelectStruttura();
      config.onSelect(unit);
    });
    componentRef.instance.onClose.subscribe(() => this.closeSelectStruttura());
    componentRef.changeDetectorRef.detectChanges();
  }

  private closeSelectStruttura(): void {
    if (!this.selectStrutturaRef) return;

    this.selectStrutturaRef.destroy();
    this.selectStrutturaRef = null;
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
        layout: { justify: 'center', gap: 'gap-2', wrap: 'wrap' },
        actions: config.actions,
      },
    };

    this.modalService.open(this.viewContainerRef, modalConfig);
  }

  private okAction(
    callback: () => void = () => {},
    textKey = 'commons.confirm',
  ): ModalActionConfig {
    return {
      button: {
        text: { text: toLocalizedText(this.translate.instant(textKey)) },
      },
      callback,
    };
  }
}
