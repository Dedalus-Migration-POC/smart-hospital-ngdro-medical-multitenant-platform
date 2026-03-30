import { Component, input } from '@angular/core';
import { AreasConfig, AreaSize } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { LayoutItem } from '../layout-item/layout-item';
import { getFlexLayoutClasses, getSizeStyles } from '../../../utility/layout.utils';

@Component({
  selector: 'app-areas-layout',
  imports: [CommonModule, LayoutItem],
  templateUrl: './areas-layout.html',
  styleUrl: './areas-layout.scss',
})
export class AreasLayout {
  readonly areas = input<AreasConfig | undefined>();

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getSizeStyles = getSizeStyles;
}
