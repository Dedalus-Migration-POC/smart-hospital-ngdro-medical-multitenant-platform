import { Component, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../initialize/state/services/language.service';
import { getTextClasses } from '../../shared/utility/text.utils';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { toSignal } from '@angular/core/rxjs-interop';
import { LinkConfig, LinkStyle } from '../../shared/models/shared_model';
import { getTextStyles } from '../../shared/utility/style.utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-link',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  readonly link = input<LinkConfig | null>(null);

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  private langService = inject(LanguageService);

  lang = this.langService.lang;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly effectiveStyle = computed(() => {
    const themeStyle = this.appConfig()?.theme.linksStyle;
    const linkStyle = this.link()?.style;

    if (!themeStyle) return linkStyle;
    if (!linkStyle) return themeStyle;

    return {
      ...themeStyle,
      ...linkStyle,
      textStyle: { ...themeStyle.textStyle, ...linkStyle.textStyle },
      hover: { ...themeStyle.hover, ...linkStyle.hover },
    } as LinkStyle;
  });

  getLinkClasses(style: LinkStyle): string[] {
    const paletteClass = style.mode === 'custom' ? '' : `text-${style.palette}`;
    const hoverDecorationClass = style.hover?.textDecoration
      ? `link-hover-${style.hover.textDecoration}`
      : '';

    return [paletteClass, ...this.getTextClasses(style.textStyle), hoverDecorationClass].filter(
      Boolean,
    );
  }

  getLinkStyles(style: LinkStyle): Record<string, string> {
    return {
      ...this.getTextStyles(style.textStyle),
      ...(style.hover?.textDecorationThickness
        ? { '--tenant-link-hover-decoration-thickness': style.hover.textDecorationThickness }
        : {}),
    };
  }

  onClick(event: MouseEvent, link: LinkConfig) {
    if (link.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (link.callback) event.preventDefault();
    link.callback?.();
  }
}
