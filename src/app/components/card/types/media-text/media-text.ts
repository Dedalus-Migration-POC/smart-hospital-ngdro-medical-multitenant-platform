import { Component, computed, inject, input } from '@angular/core';
import { MediaTextCard } from '../../model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionConfig, FlexLayoutConfig } from '../../../../shared/models/shared_model';
import { Router } from '@angular/router';
import {
  DesignAngularKitModule,
  ItNotificationService,
  NotificationPosition,
} from 'design-angular-kit';
import { getFlexLayoutClasses } from '../../../../shared/utility/layout.utils';
import { ImageBlock } from '../../../image-block/image-block';
import { ImageBlockConfig } from '../../../image-block/model';
import { getTextClasses, mergeTextStyles } from '../../../../shared/utility/text.utils';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectAppConfig } from 'src/app/initialize/state/selector';
import { mergeCardBase } from '../../../../shared/utility/cards.utils';
import { getBackgroundPaletteClass, getTextStyles } from '../../../../shared/utility/style.utils';
import { getCardStyles } from '../../../../shared/utility/cards.utils';

@Component({
  selector: 'app-media-text-card',
  imports: [CommonModule, TranslateModule, DesignAngularKitModule, ImageBlock],
  templateUrl: './media-text.html',
  styleUrl: './media-text.scss',
})
export class MediaText {
  readonly card = input.required<MediaTextCard>();
  readonly itemsLayout = input.required<FlexLayoutConfig>();
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  private readonly cardBaseTheme = computed(() => this.appConfig()?.theme.card?.base);
  protected readonly mediaTextTheme = computed(() => this.appConfig()?.theme.card?.mediaText);
  protected readonly effectiveCard = computed(() =>
    mergeCardBase(this.cardBaseTheme(), this.card()),
  );

  private readonly router = inject(Router);
  private readonly notificationService = inject(ItNotificationService);
  private readonly langService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly mergeTextStyles = mergeTextStyles;
  protected readonly getCardBackgroundClass = getBackgroundPaletteClass;
  protected readonly getCardStyles = getCardStyles;

  lang = this.langService.lang;

  toImageBlockConfig(card: MediaTextCard): ImageBlockConfig {
    return {
      id: card.id,
      className: card.className,
      clickable: false,
      image: {
        ...this.mediaTextTheme()?.imageStyle,
        ...card.image,
      },
      // text: {
      //   title: card.text.title,
      //   subTitle: card.text.subTitle,
      // },
      layout: this.itemsLayout(),
    };
  }

  onCardClick(event: Event, action: ActionConfig): void {
    if (!action) {
      return;
    }
    switch (action.type) {
      case 'comingSoon':
        event.preventDefault();
        event.stopImmediatePropagation();
        this.showComingSoon(action);
        break;

      case 'externalLink':
        if (action.url) {
          window.open(action.url, action.target ?? '_blank', 'noopener,noreferrer');
        }
        break;

      case 'route':
        if (action.url) {
          this.router.navigate([action.url]);
        }

        break;

      default:
        break;
    }
  }

  showComingSoon(action: ActionConfig): void {
    const titleKey = action.comingSoonMessage?.title?.text;
    const messageKey = action.comingSoonMessage?.subTitle?.text;
    const title = titleKey ? this.translate.instant(titleKey) : '';
    const message = messageKey ? this.translate.instant(messageKey) : '';

    this.notificationService.info(
      title ?? '',
      message ?? '',
      true,
      30000,
      NotificationPosition.Top,
    );
  }
}
