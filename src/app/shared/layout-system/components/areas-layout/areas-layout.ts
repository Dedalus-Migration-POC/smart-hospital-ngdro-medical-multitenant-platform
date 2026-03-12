import { Component, input } from '@angular/core';
import {
  AreaLayout,
  AreasConfig,
  AreaSize,
  LayoutAlign,
  LayoutJustify,
  LayoutWrap,
} from '../../models/layout.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-areas-layout',
  imports: [CommonModule],
  templateUrl: './areas-layout.html',
  styleUrl: './areas-layout.scss',
})
export class AreasLayout {
  readonly areas = input<AreasConfig | undefined>();

  getLayoutClasses(layout?: AreaLayout): string[] {
    return [
      'd-flex',
      layout?.direction === 'column' ? 'flex-column' : 'flex-row',
      this.getWrapClass(layout?.wrap),
      this.getAlignClass(layout?.align),
      this.getJustifyClass(layout?.justify),
      layout?.gap ?? '',
    ].filter(Boolean);
  }

  getAreaStyles(size?: AreaSize): Record<string, string | number | null> {
    if (!size) return {};

    return {
      flexGrow: size.grow ?? null,
      flexShrink: size.shrink ?? null,
      flexBasis: size.basis ?? null,
      width: size.width ?? null,
      minWidth: size.minWidth ?? null,
      maxWidth: size.maxWidth ?? null,
    };
  }

  private getAlignClass(align?: LayoutAlign): string {
    switch (align) {
      case 'start':
        return 'align-items-start';
      case 'center':
        return 'align-items-center';
      case 'end':
        return 'align-items-end';
      case 'baseline':
        return 'align-items-baseline';
      case 'stretch':
        return 'align-items-stretch';
      default:
        return '';
    }
  }

  private getJustifyClass(justify?: LayoutJustify): string {
    switch (justify) {
      case 'start':
        return 'justify-content-start';
      case 'center':
        return 'justify-content-center';
      case 'end':
        return 'justify-content-end';
      case 'between':
        return 'justify-content-between';
      case 'around':
        return 'justify-content-around';
      case 'evenly':
        return 'justify-content-evenly';
      default:
        return '';
    }
  }

  private getWrapClass(wrap?: LayoutWrap): string {
    switch (wrap) {
      case 'wrap':
        return 'flex-wrap';
      case 'nowrap':
        return 'flex-nowrap';
      case 'reverse':
        return 'flex-reverse';
      default:
        return '';
    }
  }
}
