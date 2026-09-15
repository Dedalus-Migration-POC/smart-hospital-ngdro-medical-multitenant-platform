import { Component, input } from '@angular/core';
import { HeaderSection } from '../header.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';
import { OverflowDetectorDirective } from '../../../shared/directives/overflow-detector.directive';
import {
  getBackgroundPaletteClass,
  getBackgroundStyles,
  getBorderStyles,
  getSpacingStyles,
} from '../../../shared/utility/style.utils';

@Component({
  selector: 'app-bottombar',
  imports: [CommonModule, AreasLayout, OverflowDetectorDirective],
  templateUrl: './bottombar.html',
  styleUrl: './bottombar.scss',
})
export class Bottombar {
  readonly bottombar = input<HeaderSection | null>(null);
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;

  protected getHeaderStyles(section: HeaderSection): Record<string, string> {
    return {
      ...getBackgroundStyles(section),
      ...getBorderStyles(section),
      ...getSpacingStyles(section.padding, 'padding'),
    };
  }
}
