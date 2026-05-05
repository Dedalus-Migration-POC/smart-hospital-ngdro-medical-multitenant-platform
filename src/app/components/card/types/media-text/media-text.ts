import { Component, inject, input } from '@angular/core';
import { MediaTextCard } from '../../model';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../initialize/state/services/language.service';
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
import { getTextClasses } from '../../../../shared/utility/text.utils';

@Component({
  selector: 'app-media-text-card',
  imports: [CommonModule, DesignAngularKitModule, ImageBlock],
  templateUrl: './media-text.html',
  styleUrl: './media-text.scss',
})
export class MediaText {
  readonly card = input.required<MediaTextCard>();
  readonly layout = input.required<FlexLayoutConfig>();

  private readonly router = inject(Router);
  private readonly notificationService = inject(ItNotificationService);
  private readonly langService = inject(LanguageService);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;

  lang = this.langService.lang;

  toImageBlockConfig(card: MediaTextCard): ImageBlockConfig {
    return {
      id: card.id,
      className: card.className,
      clickable: false,
      image: card.image,
      // text: {
      //   title: card.text.title,
      //   subTitle: card.text.subTitle,
      // },
      layout: this.layout(),
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
    const title = action.comingSoonMessage?.title?.text[this.lang()];
    const message = action.comingSoonMessage?.subTitle?.text[this.lang()];

    this.notificationService.standard(
      title ?? '',
      message ?? '',
      true,
      30000,
      NotificationPosition.Top,
    );
  }
}
