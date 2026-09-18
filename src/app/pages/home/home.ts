import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { AreasLayout } from '../../shared/layout-system/components/areas-layout/areas-layout';
import { CommonModule } from '@angular/common';
import { PageSectionConfig } from '../page.model';
import {
  getBackgroundPaletteClass,
  getBackgroundStyles,
  getSpacingStyles,
} from '../../shared/utility/style.utils';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AreasLayout],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/'), { initialValue: null });

  protected getSectionBackgroundClass(background?: PageSectionConfig['background']): string {
    return typeof background === 'string'
      ? `bg-${background}`
      : getBackgroundPaletteClass({ background });
  }

  protected getSectionBackgroundStyles(
    background?: PageSectionConfig['background'],
  ): Record<string, string> {
    return typeof background === 'object' ? getBackgroundStyles({ background }) : {};
  }

  protected getSectionSpacingStyles(margin?: PageSectionConfig['margin']): Record<string, string> {
    return getSpacingStyles(margin);
  }
}
