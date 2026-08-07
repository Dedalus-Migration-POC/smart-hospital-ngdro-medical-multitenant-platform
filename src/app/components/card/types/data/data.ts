import { Component, inject, input } from '@angular/core';
import {
  CardField,
  CompiledDataCard,
  DataCardCompiledMessageAction,
  DataCardSubTitleBinding,
  DataCardTitleBinding,
} from '../../model';
import {
  Colors,
  FlexLayoutConfig,
  ImageConfig,
  TextConfig,
} from '../../../../shared/models/shared_model';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { getFlexLayoutClasses } from '../../../../shared/utility/layout.utils';
import { getTextClasses, getTextDecorationClass } from '../../../../shared/utility/text.utils';
import { ImageBlock } from '../../../image-block/image-block';
import { ImageBlockConfig } from '../../../image-block/model';
import { format as formatDateFns } from 'date-fns';
import {
  defaultLocale,
  languages,
} from '../../../../initialize/state/services/i18n/language.model';

@Component({
  selector: 'app-data-card',
  imports: [CommonModule, ImageBlock],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  readonly card = input.required<CompiledDataCard>();
  readonly itemsLayout = input.required<FlexLayoutConfig>();
  readonly actionsLayout = input.required<FlexLayoutConfig>();

  private readonly langService = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  lang = this.langService.lang;

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextDecorationClass = getTextDecorationClass;

  // Fallback unico quando un valore non e disponibile o non e valido.
  private readonly emptyValue = '-';

  getTitleText(): string | undefined {
    return this.getTitleTextFromBinding(this.card().titleSubtitle.title);
  }

  getSubTitleText(): string | undefined {
    const subTitleBinding = this.card().titleSubtitle.subTitle;
    if (!subTitleBinding) {
      return undefined;
    }

    return this.getSubTitleTextFromBinding(subTitleBinding);
  }

  private getTitleTextFromBinding(binding: DataCardTitleBinding): string | undefined {
    return this.getBindingValue(binding);
  }

  private getSubTitleTextFromBinding(binding: DataCardSubTitleBinding): string | undefined {
    const value = this.getBindingValue(binding);

    if (value != null && binding.valueMap) {
      const translationKey = binding.valueMap[String(value)];
      if (translationKey) {
        const translatedValue = this.translate.instant(translationKey);
        return translatedValue !== translationKey ? translatedValue : String(value);
      }
    }

    return value;
  }

  private getBindingValue(binding: DataCardTitleBinding): string | undefined {
    const value = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      binding.key,
    );

    if (Array.isArray(value)) {
      const joinedValue = value
        .map((item) => {
          if (binding.itemKey && item != null && typeof item === 'object') {
            return this.toPlainValue((item as Record<string, unknown>)[binding.itemKey]);
          }

          return this.toPlainValue(item);
        })
        .filter((item) => item !== this.emptyValue)
        .join(binding.joinWith ?? ' / ');

      return joinedValue || undefined;
    }

    return value == null || value === '' ? undefined : String(value);
  }

  getImageBlockConfig(field: CardField): ImageBlockConfig | null {
    if (field.type !== 'image') return null;

    const rawValue = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      field.key,
    );

    const image: ImageConfig | undefined =
      rawValue != null ? field.imageMap?.[String(rawValue)] : undefined;

    const resolved = image ?? field.fallbackImage;
    if (!resolved) return null;

    return {
      id: field.key,
      image: resolved,
      clickable: false,
    };
  }

  getListItemClass(listStyle: string | undefined): string {
    return listStyle ? `list-item--${listStyle}` : '';
  }

  getBadgeConfig(
    field: CardField,
  ): { config: TextConfig; displayText: string; bgColor: Colors } | null {
    if (field.type !== 'badge') return null;

    const rawValue = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      field.key,
    );

    const mapped = rawValue != null ? field.badgeMap?.[String(rawValue)] : undefined;
    const config = mapped ?? field.fallbackBadge;

    if (!config) return null;

    const text = config.text?.[this.lang()] ?? this.toPlainValue(rawValue);

    // Crea un config senza la proprietà color per getTextClasses
    const configWithoutColor = { ...config, color: undefined };

    return {
      config: configWithoutColor,
      displayText: this.withAffixes(text, field.prefix, field.suffix),
      bgColor: config.color || 'info', // fallback a info se non specificato
    };
  }

  getArrayValues(field: CardField): string[] {
    if (field.type !== 'array') return [];

    const rawValue = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      field.key,
    );

    if (!Array.isArray(rawValue) || rawValue.length === 0) return [];

    return rawValue
      .map((item) => {
        if (field.itemKey && item != null && typeof item === 'object') {
          return this.toPlainValue((item as Record<string, unknown>)[field.itemKey]);
        }

        return this.toPlainValue(item);
      })
      .filter((v) => v !== this.emptyValue);
  }

  getFieldRowPartStyles(
    field: CardField,
    part: 'key' | 'value',
    layoutDirection: FlexLayoutConfig['direction'],
  ): Record<string, string> | null {
    if (layoutDirection !== 'row') {
      return null;
    }

    const partSize = field.rowSize?.[part];
    if (!partSize) {
      return null;
    }

    const styles: Record<string, string> = {};

    if (partSize.basis) {
      styles['flex'] = `0 0 ${partSize.basis}`;
      styles['maxWidth'] = partSize.basis;
    }

    if (partSize.width) {
      styles['width'] = partSize.width;
    }

    return Object.keys(styles).length ? styles : null;
  }

  getFieldDisplayValue(field: CardField): string {
    const rawValue = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      field.key,
    );

    switch (field.type) {
      case 'text': {
        const mapped = rawValue != null ? field.valueMap?.[String(rawValue)] : undefined;
        const textValue = mapped?.text?.[this.lang()] ?? this.toPlainValue(rawValue);
        return this.withAffixes(textValue, field.prefix, field.suffix);
      }

      case 'date': {
        if (rawValue == null || rawValue === '') {
          return this.emptyValue;
        }

        const date = rawValue instanceof Date ? rawValue : new Date(String(rawValue));
        if (Number.isNaN(date.getTime())) {
          return this.emptyValue;
        }

        if (field.format) {
          return this.formatDate(date, field.format);
        }

        return this.formatDate(date, 'P');
      }

      case 'array': {
        if (!Array.isArray(rawValue) || rawValue.length === 0) {
          return this.emptyValue;
        }

        const values = rawValue
          .map((item) => {
            if (field.itemKey && item != null && typeof item === 'object') {
              return this.toPlainValue((item as Record<string, unknown>)[field.itemKey]);
            }

            return this.toPlainValue(item);
          })
          .filter((v) => v !== this.emptyValue);

        if (!values.length) {
          return this.emptyValue;
        }

        const separator =
          field.listStyle === 'comma' ? ', ' : field.listStyle === 'bullet' ? ' • ' : ' - '; // default: dash

        return this.withAffixes(values.join(separator), field.prefix, field.suffix);
      }

      case 'badge': {
        const mapped = rawValue != null ? field.badgeMap?.[String(rawValue)] : undefined;
        const badgeValue =
          mapped?.text?.[this.lang()] ??
          field.fallbackBadge?.text?.[this.lang()] ??
          this.toPlainValue(rawValue);
        return this.withAffixes(badgeValue, field.prefix, field.suffix);
      }

      default:
        return this.emptyValue;
    }
  }

  // Converte un valore generico BE in testo renderizzabile.
  private toPlainValue(value: unknown): string {
    if (value == null || value === '') {
      return this.emptyValue;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }

    return this.emptyValue;
  }

  // Applica prefisso/suffisso solo su valori validi.
  private withAffixes(value: string, prefix?: string, suffix?: string): string {
    if (!value || value === this.emptyValue) {
      return this.emptyValue;
    }

    return `${prefix ?? ''}${value}${suffix ?? ''}`;
  }

  // Legge un valore annidato dal payload usando un path tipo "a.b.c". o "a"
  private getValueByPath(source: Record<string, unknown>, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') {
        return undefined;
      }

      return (acc as Record<string, unknown>)[key];
    }, source);
  }

  // Sostituisce i placeholder {{path}} nel testo con i valori corrispondenti della card.
  resolveLabel(text: string | undefined, source: unknown): string {
    if (!text) return '';
    const record = source as Record<string, unknown>;
    return text.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
      const value = this.getValueByPath(record, path.trim());
      return value != null ? String(value) : '';
    });
  }

  // Formatta la data con date-fns usando la locale configurata in app.
  private formatDate(date: Date, format: string): string {
    const locale =
      languages.find((language) => language.localeId === this.lang())?.dateFnsLocale ??
      defaultLocale;

    try {
      return formatDateFns(date, format, {
        locale,
      });
    } catch {
      return formatDateFns(date, 'P', { locale });
    }
  }
}
