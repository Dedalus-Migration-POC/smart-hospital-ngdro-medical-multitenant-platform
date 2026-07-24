import { Component, inject, input } from '@angular/core';
import { CardField, CompiledDataCard, DataCardCompiledMessageAction } from '../../model';
import { FlexLayoutConfig, ImageConfig } from '../../../../shared/models/shared_model';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../initialize/state/services/language.service';
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
  lang = this.langService.lang;

  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextDecorationClass = getTextDecorationClass;

  // Fallback unico quando un valore non e disponibile o non e valido.
  private readonly emptyValue = '-';

  getTitleText(): string | undefined {
    const value = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      this.card().titleSubtitle.title.key,
    );
    return value == null || value === '' ? undefined : String(value);
  }

  getSubTitleText(): string | undefined {
    const subTitleKey = this.card().titleSubtitle.subTitle?.key;
    if (!subTitleKey) {
      return undefined;
    }

    const value = this.getValueByPath(
      this.card() as unknown as Record<string, unknown>,
      subTitleKey,
    );
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

      // // Step 1: image fields are not rendered yet.
      // case 'image':
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

    // if (typeof value === 'number' || typeof value === 'boolean') {
    //   return String(value);
    // }

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
