import { Component, input } from '@angular/core';
import { ISocials } from './model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-socials',
  imports: [CommonModule],
  templateUrl: './socials.html',
  styleUrl: './socials.scss',
})
export class Socials {
  readonly socials = input<ISocials | null>(null);

  encodeSvg(svg: string) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
}
