import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbConfig } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  readonly config = input<BreadcrumbConfig | null>(null);
  readonly buttonAction = output<void>();

  private langService = inject(LanguageService);
  lang = this.langService.lang;

  @ViewChild('breadcrumbContainer', { static: false })
  breadcrumbContainer: ElementRef | null = null;
  @ViewChild('backgroundDiv', { static: false })
  backgroundDiv: ElementRef | null = null;

  contentHeight: number = 0;

  ngAfterViewInit(): void {
    this.updateHeight();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateHeight();
  }

  updateHeight() {
    if (this.breadcrumbContainer) {
      this.contentHeight = this.breadcrumbContainer.nativeElement.offsetHeight;
      this.setDynamicHeight();
    }
  }

  setDynamicHeight() {
    if (this.backgroundDiv) {
      const element = this.backgroundDiv.nativeElement as HTMLElement;
      element.style.setProperty('height', `${this.contentHeight}px`);
    }
  }
}
