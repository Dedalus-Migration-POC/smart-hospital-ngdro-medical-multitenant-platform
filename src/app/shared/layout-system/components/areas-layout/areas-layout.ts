import { Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AreasConfig, LayoutArea } from '../../models/layout.model';
import { CommonModule } from '@angular/common';
import { LayoutItem } from '../layout-item/layout-item';
import { getFlexLayoutClasses, getSizeStyles } from '../../../utility/layout.utils';
import {
  getBackgroundPaletteClass,
  getBackgroundStyles,
  getSpacingStyles,
} from '../../../utility/style.utils';
import { SmartHospitalState } from '../../../../store/reducers';
import { selectAppConfig } from '../../../../initialize/state/selector';

@Component({
  selector: 'app-areas-layout',
  imports: [CommonModule, LayoutItem],
  templateUrl: './areas-layout.html',
  styleUrl: './areas-layout.scss',
})
export class AreasLayout {
  readonly areas = input<AreasConfig | undefined>();

  private readonly store = inject(Store<SmartHospitalState>);
  protected readonly appConfig = this.store.selectSignal(selectAppConfig);

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;

  protected getAreaStyles(area: LayoutArea): Record<string, string | number | null> {
    return {
      ...getSizeStyles(area.size),
      ...getBackgroundStyles(area),
      ...getSpacingStyles(area.margin),
      ...getSpacingStyles(area.padding, 'padding'),
    };
  }
}
