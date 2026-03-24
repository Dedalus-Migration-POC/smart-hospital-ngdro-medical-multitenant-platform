import { Component, inject, input } from '@angular/core';
import { TextProps } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';

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
}
