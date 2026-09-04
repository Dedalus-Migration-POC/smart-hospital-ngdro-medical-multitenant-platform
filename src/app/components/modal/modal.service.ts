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

  // viene passata la config completa, se non c e quella specifica della pagina usa la config di default del tema
  open(viewContainerRef: ViewContainerRef, config: ModalConfig) {
    const componentRef = this.createModal(viewContainerRef);
    componentRef.setInput('config', this.mergeWithTheme(config));
  }

  close() {
    if (this.modalRef && this.viewContainerRef) {
      this.viewContainerRef.clear();
      this.modalRef = null;
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

  private mergePageModalConfig(
    pageConfig: Partial<ModalConfig> | undefined,
    overrides: Partial<ModalConfig> = {},
  ): ModalConfig {
    const mergedHeader = {
      ...pageConfig?.header,
      ...overrides.header,
      title: {
        ...pageConfig?.header?.title,
        ...overrides.header?.title,
      },
    };

    const mergedBody = {
      ...pageConfig?.body,
      ...overrides.body,
      text: {
        ...pageConfig?.body?.text,
        ...overrides.body?.text,
      },
    };

    const mergedFooter = {
      ...pageConfig?.footer,
      ...overrides.footer,
      actions: overrides.footer?.actions ?? pageConfig?.footer?.actions,
    };

    return {
      ...pageConfig,
      ...overrides,
      centered: overrides.centered ?? pageConfig?.centered,
      scrollable: overrides.scrollable ?? pageConfig?.scrollable,
      fullscreen: overrides.fullscreen ?? pageConfig?.fullscreen,
      shadow: overrides.shadow ?? pageConfig?.shadow,
      backdrop: overrides.backdrop ?? pageConfig?.backdrop,
      keyboard: overrides.keyboard ?? pageConfig?.keyboard,
      background: overrides.background ?? pageConfig?.background,
      border: overrides.border ?? pageConfig?.border,
      padding: overrides.padding ?? pageConfig?.padding,
      size: overrides.size ?? pageConfig?.size,
      header: mergedHeader,
      body: mergedBody,
      footer: mergedFooter,
    } as ModalConfig;
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
