import { Component, HostListener, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { ModalService } from './modal.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import {
  ModalActionConfig,
  ModalConfig,
  ModalFullscreen,
  ModalStyle,
} from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import {
  getBackgroundPaletteClass,
  getSpacingStyles,
  getTextStyles,
} from '../../shared/utility/style.utils';
import { getTextClasses } from '../../shared/utility/text.utils';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, IconComponent, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  readonly config = input.required<ModalConfig>();

  private readonly modalService = inject(ModalService);
  private readonly langService = inject(LanguageService);
  lang = this.langService.lang;

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getSpacingStyles = getSpacingStyles;
  readonly dialogClasses = computed(() => {
    const config = this.config();
    return [
      'modal-dialog',
      config?.centered ? 'modal-dialog-centered' : '',
      config?.scrollable ? 'modal-dialog-scrollable' : '',
      this.getFullscreenClass(config?.fullscreen),
    ].filter(Boolean);
  });

  readonly containerStyles = computed(() => this.getBoxStyles(this.config() ?? undefined));
  readonly containerBgClass = computed(() =>
    getBackgroundPaletteClass({ background: this.config()?.background }),
  );

  readonly headerStyles = computed(() => this.getBoxStyles(this.config()?.header));
  readonly headerBgClass = computed(() =>
    getBackgroundPaletteClass({ background: this.config()?.header?.background }),
  );

  readonly bodyStyles = computed(() => this.getBoxStyles(this.config()?.body));
  readonly bodyBgClass = computed(() =>
    getBackgroundPaletteClass({ background: this.config()?.body?.background }),
  );

  readonly footerStyles = computed(() => this.getBoxStyles(this.config()?.footer));
  readonly footerBgClass = computed(() =>
    getBackgroundPaletteClass({ background: this.config()?.footer?.background }),
  );

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.config()?.keyboard === false) return;
    this.onClose();
  }

  onClose(): void {
    this.modalService.close();
  }

  onActionClick(action: ModalActionConfig): void {
    action.callback?.();
    this.onClose();
  }

  onBackdropClick(): void {
    // backdrop statico: il click esterno non chiude la modale
    if (this.config()?.backdrop) return;
    this.onClose();
  }

  private getFullscreenClass(fullscreen?: ModalFullscreen): string {
    if (!fullscreen) return '';
    return fullscreen === 'all' ? 'modal-fullscreen' : `modal-fullscreen-${fullscreen}-down`;
  }

  private getBoxStyles(box?: ModalStyle): Record<string, string> {
    const styles: Record<string, string> = {};
    if (!box) return styles;

    const { background, border, padding, size, shadow } = box;

    if (background?.fill?.hex) styles['background'] = background.fill.hex;
    if (background?.gradient) styles['background'] = background.gradient;
    if (border?.width) styles['border-width'] = border.width;
    if (border?.style) styles['border-style'] = border.style;
    if (border?.color?.hex) styles['border-color'] = border.color.hex;
    if (border?.radius) styles['border-radius'] = border.radius;
    if (shadow) styles['box-shadow'] = shadow;

    Object.assign(styles, getSpacingStyles(padding, 'padding'));

    if (size?.width) styles['width'] = size.width;
    if (size?.height) styles['height'] = size.height;
    if (size?.minWidth) styles['min-width'] = size.minWidth;
    if (size?.minHeight) styles['min-height'] = size.minHeight;

    return styles;
  }
}
