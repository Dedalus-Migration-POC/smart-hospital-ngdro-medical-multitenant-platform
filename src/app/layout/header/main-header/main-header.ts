import { Component, input } from '@angular/core';
import { HeaderSection } from '../header.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';

@Component({
  selector: 'app-main-header',
  imports: [CommonModule, AreasLayout],
  templateUrl: './main-header.html',
  styleUrl: './main-header.scss',
})
export class MainHeader {
  readonly main = input<HeaderSection | null>(null);
}
