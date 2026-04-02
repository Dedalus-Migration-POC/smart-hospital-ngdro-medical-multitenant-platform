import { Component, computed, ElementRef, input, ViewChild } from '@angular/core';
import { Topbar } from './topbar/topbar';
import { MainHeader } from './main-header/main-header';
import { Bottombar } from './bottombar/bottombar';
import { HeaderConfig } from './header.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [Topbar, MainHeader, Bottombar, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly config = input<HeaderConfig | null>(null);

  header = computed(() => this.config());

  @ViewChild('skipper', { static: false }) skipper: ElementRef | undefined;
  public skipToMainContent(): void {
    this.skipper?.nativeElement.focus();
  }
}
