import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { CardsContainer } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { MediaText } from './types/media-text/media-text';
import { FlexLayoutConfig } from '../../shared/models/shared_model';
import { Data } from './types/data/data';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MediaText, Data],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly config = input<CardsContainer | null>(null);

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  private readonly defaultItemsContentLayout: FlexLayoutConfig = {
    direction: 'column',
  };

  readonly containerClasses = computed(() => [
    this.config()?.className ?? '',
    ...getFlexLayoutClasses(this.config()?.containerLayout),
  ]);

  readonly itemsContentLayout = computed(
    () => this.config()?.itemsContentLayout ?? this.defaultItemsContentLayout,
  );

  // TODO: VEDI SE SERVE SOLO MEDIA TEXT E SE SI PUO' SEMPLIFICARE
  readonly itemsColClass = computed(() =>
    this.itemsContentLayout().direction === 'row' ? 'col-xl-5' : 'col-xl-4',
  );
}
