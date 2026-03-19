import { Component, inject, input } from '@angular/core';
import { ILink } from './model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../initialize/state/services/language.service';

@Component({
  selector: 'app-link',
  imports: [CommonModule, RouterModule],
  templateUrl: './link.html',
  styleUrl: './link.scss',
})
export class Link {
  readonly link = input<ILink | null>(null);

  private langService = inject(LanguageService);

  lang = this.langService.lang;

  onClick(event: MouseEvent, link: ILink) {
    if (link.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
