import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignAngularKitModule } from 'design-angular-kit';
import { ButtonConfig, ButtonStyle } from '../../shared/models/shared_model';
import {
  getButtonPaletteClasses,
  getButtonStyles,
  getButtonTextStyle,
} from '../../shared/utility/button.utils';
import { getTextClasses } from '../../shared/utility/text.utils';
import { IconComponent } from '../icon/icon.component';
import { LanguageService } from '../../initialize/state/services/language.service';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, IconComponent],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  readonly config = input.required<ButtonConfig>();
  readonly clicked = output<void>();

  private readonly langService = inject(LanguageService);
  protected readonly lang = this.langService.lang;

  protected getButtonPaletteClasses(): string[] {
    return getButtonPaletteClasses(this.config() as ButtonStyle);
  }

  protected getButtonStyles(): Record<string, string> {
    return getButtonStyles(this.config() as ButtonStyle);
  }

  protected getButtonTextStyle() {
    return {
      ...getButtonTextStyle(this.config() as ButtonStyle),
      ...this.config().text,
    };
  }

  protected readonly getTextClasses = getTextClasses;
}
