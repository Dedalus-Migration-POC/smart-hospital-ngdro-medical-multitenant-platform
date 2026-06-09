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

  private readonly defaultContainerLayout: FlexLayoutConfig = {
    direction: 'column',
    gap: 'gap-3',
  };
  private readonly defaultItemsLayout: FlexLayoutConfig = {
    direction: 'column',
    gap: 'gap-2',
  };
  private readonly defaultActionsLayout: FlexLayoutConfig = {
    direction: 'row',
    gap: 'gap-2',
    justify: 'end',
  };

  readonly itemsLayout = computed(() => this.config()?.itemsLayout ?? this.defaultItemsLayout);
  readonly itemColBootstrapClasses = computed(
    () => this.config()?.itemColBootstrapClasses ?? 'col-12 col-md-6 col-xl-4',
  );
  readonly actionsLayout = computed(
    () => this.config()?.actionsLayout ?? this.defaultActionsLayout,
  );

  readonly containerClasses = computed(() => [
    this.config()?.className ?? '',
    ...getFlexLayoutClasses(this.config()?.containerLayout ?? this.defaultContainerLayout),
  ]);
}
