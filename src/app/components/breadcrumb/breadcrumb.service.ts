import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbConfig, BreadcrumbItem } from './model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly translate = inject(TranslateService);
  /**
   * Interpola i placeholder in una BreadcrumbConfig con valori forniti
   * @param config - La configurazione base del breadcrumb
   * @param variables - Oggetto con variabili da interpolare (es: {department: 'Cardiologia'})
   * @returns Configurazione del breadcrumb con valori interpolati
   */
  interpolateConfig(
    config: BreadcrumbConfig | null | undefined,
    variables: Record<string, string>,
  ): BreadcrumbConfig | null {
    if (!config) return null;

    const interpolate = (text: string): string => {
      return Object.entries(variables).reduce(
        (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
        text,
      );
    };

    return {
      ...config,
      title: {
        ...config.title,
        text: this.translate.instant(config.title.text, variables),
      },
      subTitle: config.subTitle
        ? {
            ...config.subTitle,
            text: this.translate.instant(config.subTitle.text, variables),
          }
        : undefined,
      items: config.items?.map((item: BreadcrumbItem) => ({
        ...item,
        name: item.name ? this.translate.instant(item.name, variables) : undefined,
        ...(item.queryParams && {
          queryParams: Object.fromEntries(
            Object.entries(item.queryParams).map(([key, value]) => [
              key,
              interpolate(String(value)),
            ]),
          ),
        }),
      })),
    };
  }
}
