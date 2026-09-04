import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignAngularKitModule } from 'design-angular-kit';
import { IconConfig } from '../../shared/models/shared_model';
import { getSpacingStyles } from '../../shared/utility/style.utils';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule],
  templateUrl: './icon.component.html',
})
export class IconComponent {
  readonly config = input.required<IconConfig>();
  readonly defaultMarginClass = input<string>('');

  protected readonly getSpacingStyles = getSpacingStyles;

  protected getIconClasses(icon: IconConfig): string[] {
    const color = icon['color'];
    return color?.['palette'] ? [`text-${color['palette']}`] : [];
  }

  protected getIconStyles(icon: IconConfig): Record<string, string> {
    const styles: Record<string, string> = {
      ...getSpacingStyles(icon.margin),
      ...getSpacingStyles(icon.padding, 'padding'),
    };
    const color = icon['color'];
    const size = icon['size'];

    if (color?.['hex']) styles['color'] = color['hex'];
    if (icon.fontSize) styles['font-size'] = icon.fontSize;
    if (size?.['width']) styles['width'] = size['width'];
    if (size?.['height']) styles['height'] = size['height'];

    return styles;
  }
}
