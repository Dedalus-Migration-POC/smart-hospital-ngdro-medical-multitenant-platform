import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CompiledCardsContainer } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import { getFlexLayoutClasses } from '../../shared/utility/layout.utils';
import { MediaText } from './types/media-text/media-text';
import { Data } from './types/data/data';
import { getTextClasses } from 'src/app/shared/utility/text.utils';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { mergeTextStyles } from 'src/app/shared/utility/cards.utils';
import { getTextColorHex } from 'src/app/shared/utility/style.utils';

@Component({
  selector: 'app-card',
  imports: [CommonModule, MediaText, Data],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly config = input<CompiledCardsContainer | null>(null);
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextColorHex = getTextColorHex;
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  private readonly containerTheme = computed(() => this.appConfig()?.theme.card?.container);

  readonly itemsLayout = computed(
    () => this.config()?.itemsLayout ?? this.containerTheme()?.itemsLayout,
  );
  readonly itemColBootstrapClasses = computed(
    () => this.config()?.itemColBootstrapClasses ?? this.containerTheme()?.itemColBootstrapClasses,
  );
  readonly actionsLayout = computed(
    () => this.config()?.actionsLayout ?? this.containerTheme()?.actionsLayout,
  );

  readonly headerTitleStyle = computed(() =>
    mergeTextStyles(this.containerTheme()?.header?.titleStyle, this.config()?.header?.title),
  );
  readonly headerSubtitleStyle = computed(() =>
    mergeTextStyles(this.containerTheme()?.header?.subTitleStyle, this.config()?.header?.subTitle),
  );

  readonly containerClasses = computed(() => [
    this.config()?.className ?? '',
    ...getFlexLayoutClasses(
      this.config()?.containerLayout ?? this.containerTheme()?.containerLayout,
    ),
  ]);
}
