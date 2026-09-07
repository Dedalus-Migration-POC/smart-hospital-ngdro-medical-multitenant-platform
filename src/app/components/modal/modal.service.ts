import { Injectable, ComponentRef, ViewContainerRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalComponent } from './modal.component';
import { ModalConfig } from './model';
import { ButtonStyle } from '../../shared/models/shared_model';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { mergeButtonStyle } from '../../shared/utility/button.utils';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = this.store.selectSignal(selectAppConfig);

  private modalRef: ComponentRef<ModalComponent> | null = null;
  private viewContainerRef: ViewContainerRef | null = null;
  private onClose?: () => void;

  // viene passata la config completa, se non c e quella specifica della pagina usa la config di default del tema
  open(viewContainerRef: ViewContainerRef, config: ModalConfig, onClose?: () => void) {
    const componentRef = this.createModal(viewContainerRef);
    this.onClose = onClose;
    componentRef.setInput('config', this.mergeWithTheme(config));
  }

  close() {
    if (this.modalRef && this.viewContainerRef) {
      this.viewContainerRef.clear();
      this.modalRef = null;
      const onClose = this.onClose;
      this.onClose = undefined;
      onClose?.();
    }
  }

  private createModal(viewContainerRef: ViewContainerRef): ComponentRef<ModalComponent> {
    this.viewContainerRef = viewContainerRef;
    if (this.modalRef) {
      this.close();
    }

    const componentRef = this.viewContainerRef.createComponent(ModalComponent);
    this.modalRef = componentRef;
    return componentRef;
  }

  // Applica il default del tema generale (AppConfig.theme.modal) dove la config di pagina/componente
  // non specifica nulla; la config passata a open() vince sempre sul tema.
  private mergeWithTheme(config: ModalConfig): ModalConfig {
    const theme = this.appConfig()?.theme?.modal;
    if (!theme) return config;

    return {
      ...config,
      background: config.background ?? theme.background,
      border: config.border ?? theme.border,
      padding: config.padding ?? theme.padding,
      centered: config.centered ?? theme.centered,
      shadow: config.shadow ?? theme.shadow,
      scrollable: config.scrollable ?? theme.scrollable,
      fullscreen: config.fullscreen ?? theme.fullscreen,
      backdrop: config.backdrop ?? theme.backdrop,
      backdropColor: config.backdropColor ?? theme.backdropColor,
      backdropOpacity: config.backdropOpacity ?? theme.backdropOpacity,
      keyboard: config.keyboard ?? theme.keyboard,
      header: {
        ...config.header,
        background: config.header.background ?? theme.header?.background,
        border: config.header.border ?? theme.header?.border,
        padding: config.header.padding ?? theme.header?.padding,
        closeButton: config.header.closeButton ?? theme.header?.closeButton,
      },
      body: {
        ...config.body,
        background: config.body.background ?? theme.body?.background,
        border: config.body.border ?? theme.body?.border,
        padding: config.body.padding ?? theme.body?.padding,
      },
      footer: config.footer && {
        ...config.footer,
        background: config.footer.background ?? theme.footer?.background,
        border: config.footer.border ?? theme.footer?.border,
        padding: config.footer.padding ?? theme.footer?.padding,
        layout: config.footer.layout ?? theme.footer?.layout,
        actions: config.footer.actions?.map((action) => ({
          ...action,
          button: mergeButtonStyle(
            theme.footer?.actionsButtonStyle,
            action.button as ButtonStyle,
          ) as typeof action.button,
        })),
      },
    };
  }
}
