import { Component, computed, input } from '@angular/core';
import { FooterConfig } from './footer.model';
import { MainFooter } from "./main-footer/main-footer";
import { BottombarFooter } from "./bottombar-footer/bottombar-footer";

@Component({
  selector: 'app-footer',
  imports: [MainFooter, BottombarFooter],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly config = input<FooterConfig | null>(null);

  footer = computed(() => this.config());
}
