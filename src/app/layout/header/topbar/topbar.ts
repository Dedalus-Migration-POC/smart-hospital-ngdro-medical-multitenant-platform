import { Component, input } from '@angular/core';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';
import { HeaderSection } from '../header.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, AreasLayout],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  readonly topbar = input<HeaderSection | null>(null);
}
