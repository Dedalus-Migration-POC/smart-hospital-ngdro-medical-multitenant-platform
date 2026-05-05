import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CardContainer } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { MediaText } from './types/media-text/media-text';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MediaText],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly config = input<CardContainer | null>(null);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  private langService = inject(LanguageService);
  lang = this.langService.lang;
}
