import { Component, input } from '@angular/core';
import { FooterSection } from '../footer.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';
import { OverflowDetectorDirective } from '../../../shared/directives/overflow-detector.directive';
import {
  getBackgroundPaletteClass,
  getBackgroundStyles,
} from '../../../shared/utility/style.utils';

@Component({
  selector: 'app-main-footer',
  imports: [CommonModule, AreasLayout, OverflowDetectorDirective],
  templateUrl: './main-footer.html',
  styleUrl: './main-footer.scss',
})
export class MainFooter {
  readonly main = input<FooterSection | null>(null);
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;
  protected readonly getBackgroundStyles = getBackgroundStyles;
}
