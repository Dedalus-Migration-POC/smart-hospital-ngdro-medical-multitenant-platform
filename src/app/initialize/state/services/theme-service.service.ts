import { Injectable } from '@angular/core';
import { AppConfig } from '../app-config.model';

type TypographyConfig = AppConfig['theme']['typography'];
type ColorConfig = AppConfig['theme']['colors'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly styleElementId = 'app-runtime-theme';

  apply(config: AppConfig): void {
    if (!config) return;

    const properties = [
      ...this.buildColorProperties(config.theme?.colors),
      ...this.buildTypographyProperties(config.theme?.typography),
    ];

    const css = this.buildRootCss(properties);
    this.upsertStyleElement(css);
    this.applyDocumentMetadata(config);
  }

  private buildColorProperties(colors?: ColorConfig): string[] {
    if (!colors) return [];

    return Object.entries(colors)
      .filter(([, value]) => value != null)
      .map(([key, value]) => this.buildProperty(`--bs-${key}`, value));
  }

  private buildTypographyProperties(typography?: TypographyConfig): string[] {
    if (!typography) return [];

    return [
      ...this.buildPropertyIfValue('--bs-font-sans-serif', typography.fontFamily),

      ...this.buildMappedProperties(typography.fontSize, {
        sm: '--tenant-font-size-sm',
        md: '--tenant-font-size-md',
        lg: '--tenant-font-size-lg',
        xl: '--tenant-font-size-xl',
        xxl: '--tenant-font-size-xxl',
      }),

      ...this.buildMappedProperties(typography.lineHeight, {
        sm: '--tenant-line-height-sm',
        md: '--tenant-line-height-md',
        lg: '--tenant-line-height-lg',
        xl: '--tenant-line-height-xl',
        xxl: '--tenant-line-height-xxl',
      }),

      ...this.buildMappedProperties(typography.fontWeight, {
        semibold: '--tenant-font-weight-semibold',
        normal: '--tenant-font-weight-normal',
        bold: '--tenant-font-weight-bold',
      }),

      ...this.buildPropertyIfValue('--bs-body-font-size', typography.fontSize?.md),
      ...this.buildPropertyIfValue('--bs-body-line-height', typography.lineHeight?.md),
      ...this.buildPropertyIfValue('--bs-body-font-weight', typography.fontWeight?.normal),
    ];
  }

  private buildMappedProperties(
    source: Record<string, string | number>,
    map: Record<string, string>,
  ): string[] {
    if (!source) return [];

    return Object.entries(source)
      .filter(([key, value]) => map[key] && value != null)
      .map(([key, value]) => this.buildProperty(map[key], value));
  }

  private buildProperty(name: string, value: string | number): string {
    return `${name}: ${value};`;
  }

  private buildPropertyIfValue(name: string, value: string | number): string[] {
    return value == null ? [] : [this.buildProperty(name, value)];
  }

  private buildRootCss(properties: string[]): string {
    return `
      :root {
        ${properties.join('\n')}
      }
    `;
  }

  private upsertStyleElement(css: string): void {
    let styleEl = document.getElementById(this.styleElementId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = this.styleElementId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = css;
  }

  private applyDocumentMetadata(config: AppConfig): void {
    if (config.name) {
      document.title = config.name;
    }

    if (config.favicon) {
      let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");

      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }

      favicon.href = config.favicon;
    }
  }
}
