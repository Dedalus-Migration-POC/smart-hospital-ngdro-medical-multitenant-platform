import { Component, input } from '@angular/core';
import { HeaderSection } from '../header.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';


@Component({
  selector: 'app-bottombar',
  imports: [CommonModule, AreasLayout],
  templateUrl: './bottombar.html',
  styleUrl: './bottombar.scss',
})
export class Bottombar {
  readonly bottombar = input<HeaderSection | null>(null);
}
