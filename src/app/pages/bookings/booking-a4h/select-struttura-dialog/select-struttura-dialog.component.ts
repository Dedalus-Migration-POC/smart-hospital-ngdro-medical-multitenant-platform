import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HealthcareUnit } from '../state/model';

@Component({
  selector: 'app-select-struttura-dialog',
  templateUrl: './select-struttura-dialog.component.html',
  styleUrls: ['./select-struttura-dialog.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class SelectStrutturaDialogComponent {
  readonly units = input.required<HealthcareUnit[]>();
  readonly onSelect = output<HealthcareUnit>();
  readonly onClose = output<void>();
  private readonly modalElement = viewChild.required<ElementRef<HTMLElement>>('modal');

  readonly backdropColor = computed(() => this.getBackdropColor());

  constructor() {
    afterNextRender(() => this.modalElement().nativeElement.focus());
  }

  private getBackdropColor(color = '#000000', opacity = 0.5): string {
    const normalizedOpacity = Math.min(Math.max(opacity, 0), 1);
    const hex = color.replace('#', '');
    if (!/^[\da-f]{6}$/i.test(hex)) return color;

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${normalizedOpacity})`;
  }
}
