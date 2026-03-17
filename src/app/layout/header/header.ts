import { Component, computed, inject, input } from '@angular/core';
import { Topbar } from './topbar/topbar';
import { MainHeader } from './main-header/main-header';
import { Bottombar } from "./bottombar/bottombar";
import { HeaderConfig } from './header.model';

@Component({
  selector: 'app-header',
  imports: [Topbar, MainHeader, Bottombar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // TODO mettere il tipo Header. Fatto (EV)
  readonly config = input<HeaderConfig | null>(null);

  header = computed(() => this.config());
}
