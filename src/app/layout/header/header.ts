import { Component, computed, inject, input } from '@angular/core';
import { Topbar } from './topbar/topbar';
import { MainHeader } from './main-header/main-header';

@Component({
  selector: 'app-header',
  imports: [Topbar, MainHeader],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // TODO mettere il tipo Header
  readonly config = input<any | null>(null);

  header = computed(() => this.config()?.header);
}
