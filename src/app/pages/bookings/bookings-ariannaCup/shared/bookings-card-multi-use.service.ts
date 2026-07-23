import { Injectable } from '@angular/core';

type CardField = {
  key: string;
  callback?: string;
  [key: string]: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class BookingsCardMultiUseService {
  setMultiCardUseFromConfig(
    element: Record<string, unknown>,
    context: unknown,
    fields: CardField[] = [],
    className = '',
  ): Record<string, unknown> {
    const mappedFields = fields.map((field) => {
      const value = element[field.key];
      const callbackName = typeof field.callback === 'string' ? field.callback : null;
      const callback =
        callbackName &&
        context &&
        typeof (context as Record<string, unknown>)[callbackName] === 'function'
          ? (context as Record<string, unknown>)[callbackName]
          : null;

      return {
        ...field,
        value,
        callback,
      };
    });

    return {
      ...element,
      className,
      fields: mappedFields,
    };
  }
}
