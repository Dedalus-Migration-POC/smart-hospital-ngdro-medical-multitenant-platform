import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbConfig, BreadcrumbItemsContainerStyle } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import {
  getBackgroundPaletteClass,
  getSpacingStyles,
  getTextStyles,
} from '../../shared/utility/style.utils';
import { getTextClasses, mergeTextStyles } from '../../shared/utility/text.utils';
import { TextStyle } from '../../shared/models/shared_model';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  readonly config = input<BreadcrumbConfig | null>(null);
  readonly buttonAction = output<void>();

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  private readonly breadcrumbTheme = computed(() => this.appConfig()?.theme.breadcrumb);
  private langService = inject(LanguageService);
  lang = this.langService.lang;
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getSpacingStyles = getSpacingStyles;

  // Gli stili della pagina sovrascrivono il tema; le proprietà mancanti ereditano dal tema generale.
  getTitleStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.titleStyle, config.titleStyle);
  }

  getSubTitleStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.subTitleStyle, config.subTitleStyle);
  }

  getItemsStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.itemsStyle, config.itemsStyle);
  }

  getItemsContainerStyle(config: BreadcrumbConfig): BreadcrumbItemsContainerStyle | undefined {
    const theme = this.breadcrumbTheme()?.itemsContainerStyle;
    const page = config.itemsContainerStyle;

    if (!theme && !page) return undefined;

    return {
      ...theme,
      ...page,
      background: {
        ...theme?.background,
        ...page?.background,
        fill: { ...theme?.background?.fill, ...page?.background?.fill },
      },
      margin: { ...theme?.margin, ...page?.margin },
      padding: { ...theme?.padding, ...page?.padding },
    };
  }

  getItemsContainerStyles(config: BreadcrumbConfig): Record<string, string> {
    const style = this.getItemsContainerStyle(config);
    const background = style?.background?.gradient ?? style?.background?.fill?.hex;

    return {
      ...this.getSpacingStyles(style?.margin),
      ...this.getSpacingStyles(style?.padding, 'padding'),
      ...(background ? { background } : {}),
    };
  }

  getActiveItemStyle(config: BreadcrumbConfig): TextStyle | undefined {
    return (
      config.activeItemStyle ??
      this.breadcrumbTheme()?.activeItemStyle ??
      this.getItemsStyle(config)
    );
  }

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
