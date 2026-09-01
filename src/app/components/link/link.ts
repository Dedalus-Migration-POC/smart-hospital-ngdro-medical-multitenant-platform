import { Component, computed, inject, input } from '@angular/core';
import { ILink } from './model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../initialize/state/services/language.service';
import { getTextClasses } from '../../shared/utility/text.utils';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { LinkConfig } from '../../shared/models/shared_model';
import { getTextStyles } from '../../shared/utility/style.utils';

@Component({
  selector: 'app-link',
  imports: [CommonModule, RouterModule],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  readonly link = input<ILink | null>(null);

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  private langService = inject(LanguageService);

  lang = this.langService.lang;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly effectiveStyle = computed(
    () => this.link()?.style ?? this.appConfig()?.theme.linksStyle,
  );

  getLinkClasses(style: LinkConfig): string[] {
    const paletteClass = style.mode === 'custom' ? '' : `text-${style.palette}`;

    return [paletteClass, ...this.getTextClasses(style.textStyle)].filter(Boolean);
  }

  onClick(event: MouseEvent, link: ILink) {
    if (link.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
