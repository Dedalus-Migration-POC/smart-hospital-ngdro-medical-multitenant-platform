import { Component, input } from '@angular/core';
import { FooterSection } from '../footer.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';
import { OverflowDetectorDirective } from '../../../shared/directives/overflow-detector.directive';

@Component({
  selector: 'app-bottombar-footer',
  imports: [CommonModule, AreasLayout, OverflowDetectorDirective],
  templateUrl: './bottombar-footer.html',
  styleUrl: './bottombar-footer.scss',
})
export class BottombarFooter {
  readonly bottombar = input<FooterSection | null>(null);
}
