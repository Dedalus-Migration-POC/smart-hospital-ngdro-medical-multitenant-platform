import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesignAngularKitModule } from 'design-angular-kit';
import { BreadcrumbConfig, BreadcrumbContainerStyle } from './model';
import { LanguageService } from '../../initialize/state/services/language.service';
import {
  getBackgroundPaletteClass,
  getSpacingStyles,
  getTextStyles,
} from '../../shared/utility/style.utils';
import { getTextClasses, mergeTextStyles } from '../../shared/utility/text.utils';
import {
  mergeButtonStyle,
} from '../../shared/utility/button.utils';
import { ButtonConfig, ButtonStyle, TextStyle } from '../../shared/models/shared_model';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, DesignAngularKitModule, ButtonComponent],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  host: { '[style.--breadcrumb-scrollbar-w]': 'scrollbarWidth()' },
})
export class Breadcrumb {
  readonly config = input<BreadcrumbConfig | null>(null);
  readonly buttonAction = output<void>();

  private readonly store = inject(Store<SmartHospitalState>);
  private readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
  private readonly breadcrumbTheme = computed(() => this.appConfig()?.theme.breadcrumb);
  private readonly buttonsTheme = computed(() => this.appConfig()?.theme.buttonsStyle);
  private langService = inject(LanguageService);
  lang = this.langService.lang;
  protected readonly getBackgroundPaletteClass = getBackgroundPaletteClass;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;
  protected readonly getSpacingStyles = getSpacingStyles;

  // Gli stili della pagina sovrascrivono il tema; le proprietà mancanti ereditano dal tema generale.
  getTitleStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.titleStyle, config.title);
  }

  getSubTitleStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.subTitleStyle, config.subTitle);
  }

  getItemsStyle(config: BreadcrumbConfig): TextStyle {
    return mergeTextStyles(this.breadcrumbTheme()?.itemsStyle, config.itemsStyle);
  }

  // Sfondo/margin/padding del contenitore generale: va applicato sul nav.
  getContainerStyle(config: BreadcrumbConfig): BreadcrumbContainerStyle | undefined {
    return this.mergeContainerStyle(this.breadcrumbTheme()?.containerStyle, config.containerStyle);
  }

  getContainerStyles(config: BreadcrumbConfig): Record<string, string> {
    return this.getContainerSpacingStyles(this.getContainerStyle(config));
  }

  // Sfondo/margin/padding della sola riga breadcrumb: va applicato sull'ol.
  getItemsContainerStyle(config: BreadcrumbConfig): BreadcrumbContainerStyle | undefined {
    return this.mergeContainerStyle(
      this.breadcrumbTheme()?.itemsContainerStyle,
      config.itemsContainerStyle,
    );
  }

  // Il bleed edge-to-edge e gestito in CSS (::before full-bleed su .breadcrumb),
  // qui basta impostare il colore di sfondo normale.
  getItemsContainerStyles(config: BreadcrumbConfig): Record<string, string> {
    return this.getContainerSpacingStyles(this.getItemsContainerStyle(config));
  }

  // Merge condiviso da containerStyle/itemsContainerStyle: la config della pagina
  // sovrascrive il tema, le proprieta mancanti ereditano dal tema generale.
  private mergeContainerStyle(
    theme?: BreadcrumbContainerStyle,
    page?: BreadcrumbContainerStyle,
  ): BreadcrumbContainerStyle | undefined {
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

  private getContainerSpacingStyles(style?: BreadcrumbContainerStyle): Record<string, string> {
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

  // Lo stile del bottone segue quello configurato sul componente; le proprieta
  // mancanti ereditano dal tema generale dei bottoni. Il testo viene sempre dalla config.
  getButtonStyle(config: BreadcrumbConfig): ButtonConfig {
    return {
      ...mergeButtonStyle(this.buttonsTheme(), config.button),
      text: config.button!.text,
    } as ButtonConfig;
  }

  // Larghezza della scrollbar verticale (0 se assente): usata dal bleed CSS per
  // calcolare la viewport reale ed evitare lo scroll orizzontale residuo.
  // Signal (non un campo semplice): il ResizeObserver gira fuori da zone.js/CD,
  // solo un signal.set() garantisce l'aggiornamento del DOM in ogni configurazione.
  scrollbarWidth = signal('0px');

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    // Il container scrollabile puo non essere ancora in overflow al primo render:
    // il ResizeObserver ricalcola quando il suo stato cambia davvero.
    const scrollContainer =
      this.findScrollContainer(this.elementRef.nativeElement) ?? document.body;
    this.updateScrollbarWidth();
    this.resizeObserver = new ResizeObserver(() => this.updateScrollbarWidth());
    this.resizeObserver.observe(scrollContainer);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateScrollbarWidth();
  }

  // Lo scroll verticale non e detto che sia su window/body: puo essere su un
  // layout container antenato (es. <main overflow-y:auto>). Va trovato quello vero.
  private updateScrollbarWidth() {
    const container = this.findScrollContainer(this.elementRef.nativeElement);

    const width = container
      ? container.offsetWidth - container.clientWidth
      : window.innerWidth - document.documentElement.clientWidth;

    this.scrollbarWidth.set(`${width}px`);
  }

  // Ritorna il piu vicino antenato con overflow-y auto/scroll, indipendentemente
  // dal fatto che stia gia andando in overflow in questo momento.
  private findScrollContainer(el: HTMLElement): HTMLElement | null {
    let node: HTMLElement | null = el.parentElement;

    while (node) {
      const overflowY = getComputedStyle(node).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node;
      }
      node = node.parentElement;
    }

    return null;
  }
}
