import { Component, input } from '@angular/core';
import { AreasConfig, LayoutArea } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { LayoutItem } from '../layout-item/layout-item';
import { getFlexLayoutClasses, getSizeStyles } from '../../../utility/layout.utils';
import { getSpacingStyles } from '../../../utility/style.utils';

@Component({
  selector: 'app-areas-layout',
  imports: [CommonModule, LayoutItem],
  templateUrl: './areas-layout.html',
  styleUrl: './areas-layout.scss',
})
export class AreasLayout {
  readonly areas = input<AreasConfig | undefined>();

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  protected getAreaStyles(area: LayoutArea): Record<string, string | number | null> {
    return {
      ...getSizeStyles(area.size),
      ...getSpacingStyles(area.margin),
      ...getSpacingStyles(area.padding, 'padding'),
    };
  }
}
