import { Component, input } from '@angular/core';
import { AreasConfig, AreaSize } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { LayoutItem } from '../layout-item/layout-item';
import { Align, FlexLayoutConfig, Grow, Justify, Shrink, Wrap } from '../../../models/shared_model';

@Component({
  selector: 'app-areas-layout',
  imports: [CommonModule, LayoutItem],
  templateUrl: './areas-layout.html',
  styleUrl: './areas-layout.scss',
})
export class AreasLayout {
  readonly areas = input<AreasConfig | undefined>();

  // All classes for flex layout.
  // Only flex-basis is in style bacause here set percentage
  getFlexLayoutClasses(layout?: FlexLayoutConfig): string[] {
    return [
      'd-flex',
      layout?.direction ? 'flex-' + layout.direction : '',
      this.getWrapClass(layout?.wrap),
      this.getAlignClass(layout?.align),
      this.getJustifyClass(layout?.justify),
      this.getGrowClass(layout?.grow),
      this.getShrinkClass(layout?.shrink),
      layout?.gap ?? '',
    ].filter(Boolean);
  }
  getFlexLayoutStyle() {}

  // flexGrow: size.grow ?? null,
  //   flexShrink: size.shrink ?? null,
  //   ,

  getSizeStyles(size?: AreaSize): Record<string, string | number | null> {
    if (!size) return {};

    return {
      flexBasis: size.basis ?? null,
      width: size.width ?? null,
      minWidth: size.minWidth ?? null,
      maxWidth: size.maxWidth ?? null,
      height: size.height ?? null,
      minHeight: size.minHeight ?? null,
      maxHeight: size.maxHeight ?? null,
    };
  }

  private getAlignClass(align?: Align): string {
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

  private getJustifyClass(justify?: Justify): string {
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

  private getWrapClass(wrap?: Wrap): string {
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

  private getGrowClass(grow?: Grow): string {
    switch (grow) {
      case 'grow-0':
        return 'flex-grow-0';
      case 'grow-1':
        return 'flex-grow-1';
      default:
        return '';
    }
  }

  private getShrinkClass(shrink?: Shrink): string {
    switch (shrink) {
      case 'shrink-0':
        return 'flex-shrink-0';
      case 'shrink-1':
        return 'flex-shrink-1';
      default:
        return '';
    }
  }
}
