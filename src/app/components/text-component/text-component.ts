import { Component, inject, input } from '@angular/core';
import { TextProps } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import { getTextStyles } from '../../shared/utility/style.utils';
import { getTextClasses } from '../../shared/utility/text.utils';

@Component({
  selector: 'app-text-component',
  imports: [CommonModule],
  templateUrl: './text-component.html',
  styleUrl: './text-component.scss',
})
export class TextComponent {
  readonly config = input<TextProps | null>(null);

  private langService = inject(LanguageService);

  lang = this.langService.lang;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getTextClasses = getTextClasses;

  classes(config: TextProps): string[] {
    return ['cursor-default', ...this.getTextClasses(config)];
  }
}
