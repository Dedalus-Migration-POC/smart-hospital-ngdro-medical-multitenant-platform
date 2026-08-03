import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DataCardAction,
  DataCardCompiledAction,
  DataCardCompiledMessageAction,
  DataCardCondition,
} from 'src/app/components/card/model';

export interface CompileCardActionsOptions {
  // Istanza del componente che espone i metodi callback richiamabili dalle action.
  callbackContext?: unknown;
  // paramsOnly: passa solo i parametri definiti in config (action.callback.params)
  // sourceAndParams:passa prima tutto l’oggetto sorgente (source), poi i parametri
  // Esempio. paramsOnly per payments-pa, sourceAndParams per single-report
  callbackArgsMode?: 'paramsOnly' | 'sourceAndParams';
}

@Injectable({ providedIn: 'root' })
export class CardActionsService {
  private router = inject(Router);

  // Compila le action della card a runtime:
  // - applica hideIf/disabledIf
  // - costruisce la compiledCallback per route/externalLink/callback
  compileActions(
    source: Record<string, unknown>,
    actions?: DataCardAction[],
    options: CompileCardActionsOptions = {},
  ): DataCardCompiledAction[] {
    if (!actions || actions.length === 0) {
      return [];
    }

    const { callbackContext, callbackArgsMode = 'paramsOnly' } = options;

    return actions.flatMap((action) => {
      // Se hideIf è vera, sostituisce con un messaggio (se presente) oppure rimuove l'action.
      if (this.evaluateConditions(source, action.hideIf)) {
        return action.hideMessage
          ? ([
              {
                key: action.key,
                renderAs: 'message',
                message: action.hideMessage,
              } as DataCardCompiledMessageAction,
            ] as DataCardCompiledAction[])
          : [];
      }

      const isDisabled = action.disabled || this.evaluateConditions(source, action.disabledIf);
      let compiledCallback: () => void = () => {};

      switch (action.type) {
        case 'route':
          compiledCallback = () => {
            // Risolve route params e query params dinamici leggendo i valori dal source.
            let url = action.url;

            if (action.routeParams) {
              Object.entries(action.routeParams).forEach(([paramName, dataPath]) => {
                const value = this.getValueByPath(source, dataPath);
                url = url.replace(`:${paramName}`, String(value ?? paramName));
              });
            }

            const queryParams: Record<string, unknown> = { ...(action.queryParams ?? {}) };
            if (action.queryParamsFromData) {
              Object.entries(action.queryParamsFromData).forEach(([paramName, dataPath]) => {
                queryParams[paramName] = this.getValueByPath(source, dataPath);
              });
            }

            this.router.navigate([url], { queryParams });
          };
          break;

        case 'externalLink':
          compiledCallback = () => {
            window.open(action.url, action.target ?? '_blank');
          };
          break;

        case 'callback':
          compiledCallback = () => {
            // Esegue un metodo del callbackContext usando i parametri configurati.
            const methodName = action.callback.nameFunction;
            const contextAsRecord = callbackContext as Record<string, unknown>;
            const method = contextAsRecord?.[methodName];

            if (typeof method === 'function') {
              const params = (action.callback.params || []).map((paramPath) =>
                this.getValueByPath(source, paramPath),
              );

              if (callbackArgsMode === 'sourceAndParams') {
                (method as (...args: unknown[]) => void).apply(callbackContext, [
                  source,
                  ...params,
                ]);
                return;
              }

              (method as (...args: unknown[]) => void).apply(callbackContext, params);
            }
          };
          break;
      }

      return [{ ...action, disabled: isDisabled, compiledCallback } as DataCardCompiledAction];
    });
  }

  private evaluateConditions(
    source: Record<string, unknown>,
    conditions?: DataCardCondition[],
  ): boolean {
    // Nessuna condizione => non applicare regole di hide/disable.
    if (!conditions || conditions.length === 0) {
      return false;
    }

    return conditions.every((condition) => this.evaluateCondition(source, condition));
  }

  private evaluateCondition(
    source: Record<string, unknown>,
    condition: DataCardCondition,
  ): boolean {
    // Valuta una singola condizione sul valore risolto dal path.
    const value = this.getValueByPath(source, condition.key);

    switch (condition.operator) {
      // Uguale
      case 'eq':
        return value === condition.value;
      // Diverso
      case 'neq':
        return value !== condition.value;
      // Il valore e incluso nell'array condition.value
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      // Il valore NON e incluso nell'array condition.value
      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      // Il valore esiste (non undefined e non null)
      case 'exists':
        return value !== undefined && value !== null;
      // Il valore non esiste (undefined o null)
      case 'notExists':
        return value === undefined || value === null;
      // Il valore e vuoto: undefined, null, stringa vuota o array vuoto
      case 'empty':
        return (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        );
      // Il valore NON e vuoto
      case 'notEmpty':
        return (
          value !== undefined &&
          value !== null &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
        );
      default:
        return false;
    }
  }

  // Risolve un valore da un oggetto usando una chiave semplice (es. "a")
  // o un path annidato (es. "a.b.c"). Valori non-stringa vengono restituiti direttamente.
  private getValueByPath(source: Record<string, unknown>, path: unknown): unknown {
    if (typeof path !== 'string') return path;
    return path.split('.').reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') {
        return undefined;
      }

      return (acc as Record<string, unknown>)[key];
    }, source);
  }
}
