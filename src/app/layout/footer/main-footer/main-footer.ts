import { Component, input } from '@angular/core';
import { FooterSection } from '../footer.model';
import { CommonModule } from '@angular/common';
import { AreasLayout } from '../../../shared/layout-system/components/areas-layout/areas-layout';

@Component({
  selector: 'app-main-footer',
  imports: [CommonModule, AreasLayout],
  templateUrl: './main-footer.html',
  styleUrl: './main-footer.scss',
})
export class MainFooter {
  readonly main = input<FooterSection | null>(null);

}
