import { Component, input } from '@angular/core';
import { ILink } from './model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link',
  imports: [CommonModule, RouterModule],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  readonly link = input<ILink | null>(null);
  onClick(event: MouseEvent, link: ILink) {
    if (link.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // link: ILink = {
  //   text: {
  //     it: 'External link',
  //   },
  //   // description: {
  //   //   it: 'Apri external link',
  //   // },
  //   url: '/home',
  //   external: false,
  //   target: '_blank',
  //   ariaLabel: {
  //     it: '<string>',
  //   },
  //   disabled: false,
  //   style: {
  //     color: 'primary',
  //     textDecoration: 'none',
  //     font: 'normal',
  //     fontWeight: 'bold',
  //   },
  // };
}
