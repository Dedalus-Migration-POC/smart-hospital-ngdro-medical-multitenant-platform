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
  //----------RGB Colors
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const clean = hex.replace('#', '');

    if (clean.length !== 6) return null;

    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  private hexToRgbString(hex: string): string | null {
    const rgb = this.hexToRgb(hex);
    return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : null;
  }
  //------------
  private buildColorProperties(colors?: ColorConfig): string[] {
    if (!colors) return [];

    return Object.entries(colors)
      .filter(([, value]) => value != null)
      .flatMap(([key, value]) => {
        const props: string[] = [];
        const rgb = this.hexToRgbString(value);

        // HEX
        props.push(this.buildProperty(`--bs-${key}`, value));

        // RGB
        if (rgb) props.push(this.buildProperty(`--bs-${key}-rgb`, rgb));

        return props;
      });
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
    source: Record<string, string | number | undefined>,
    map: Record<string, string>,
  ): string[] {
    if (!source) return [];

    return Object.entries(source).flatMap(([key, value]) => {
      const propertyName = map[key];
      if (!propertyName || value == null) return [];
      return [this.buildProperty(propertyName, value)];
    });
  }

  private buildProperty(name: string, value: string | number): string {
    return `${name}: ${value};`;
  }

  private buildPropertyIfValue(name: string, value: string | number | undefined): string[] {
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

      // browsers need an explicit mime type to render data-URI (base64) favicons
      const dataUriMatch = config.favicon.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      if (dataUriMatch) {
        favicon.type = dataUriMatch[1];
      } else {
        favicon.removeAttribute('type');
      }
      favicon.href = config.favicon;
    }
  }
}
