import { Injectable } from '@angular/core';
import { BreadcrumbConfig, BreadcrumbItem } from './model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
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
        text: {
          it: interpolate(config.title?.text?.it ?? ''),
          en: interpolate(config.title?.text?.en ?? ''),
        },
      },
      subTitle: config.subTitle
        ? {
            ...config.subTitle,
            text: {
              it: interpolate(config.subTitle?.text?.it ?? ''),
              en: interpolate(config.subTitle?.text?.en ?? ''),
            },
          }
        : undefined,
      items: config.items?.map((item: BreadcrumbItem) => ({
        ...item,
        name: item.name
          ? {
              it: interpolate(item.name?.it ?? ''),
              en: interpolate(item.name?.en ?? ''),
            }
          : undefined,
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
