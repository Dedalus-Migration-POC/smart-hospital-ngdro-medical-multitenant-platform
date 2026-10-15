import { Injectable } from '@angular/core';
import { BreadcrumbConfig, BreadcrumbItem } from './model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  /**
   * Prepara i parametri di traduzione e interpola i query params del breadcrumb.
   * @param config - La configurazione base del breadcrumb
   * @param variables - Oggetto con variabili da interpolare (es: {department: 'Cardiologia'})
   * @returns Configurazione del breadcrumb con parametri di interpolazione
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
      interpolationParams: variables,
      items: config.items?.map((item: BreadcrumbItem) => ({
        ...item,
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
