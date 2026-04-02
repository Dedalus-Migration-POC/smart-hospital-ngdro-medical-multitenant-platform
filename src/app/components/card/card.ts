import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { CardContainer } from './model';
import { MediaTextCard_MOCK } from './mock';
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
  // TODO: quando colleghi le page decommenta
  // readonly config = input<Card | null>(null);
  readonly config = signal<CardContainer>(MediaTextCard_MOCK);
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  private langService = inject(LanguageService);
  lang = this.langService.lang;
}
