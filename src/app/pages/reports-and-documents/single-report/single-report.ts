import { Component, computed, inject, OnDestroy, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFormValidators } from '../../../../validators';
import { Store } from '@ngrx/store';
import {
  selectSingleReport,
  selectSingleReportError,
  selectSingleReportLoading,
  selectSingleReportSession,
  selectSingleReportSessionError,
  selectSingleReportSessionLoading,
} from './state/selectors';
import {
  downloadSingleReport as downloadSingleReportAction,
  fetchSingleReportSession,
  resetSingleReportState,
} from './state/actions';
import { IReport } from './state/model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { Spinner } from '../../../components/spinner/spinner';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { ImageBlock } from '../../../components/image-block/image-block';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { map, take } from 'rxjs';
import { Router } from '@angular/router';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { Card } from '../../../components/card/card';
import { CardsContainer, CompiledCardsContainer } from '../../../components/card/model';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../components/dynamic-form/dynamic-form.model';

@Component({
  selector: 'app-single-report',
  imports: [
    TranslateModule,
    CommonModule,
    Card,
    ReactiveFormsModule,
    Breadcrumb,
    ImageBlock,
    Spinner,
    DynamicFormComponent,
  ],
  templateUrl: './single-report.html',
  styleUrl: './single-report.scss',
})
export class SingleReport implements OnDestroy {
  private store = inject(Store);
  private langService = inject(LanguageService);
  private router = inject(Router);
  lang = this.langService.lang;

  private singleReportSession = this.store.selectSignal(selectSingleReportSession);
  readonly reports: Signal<IReport[] | null> = this.store.selectSignal(selectSingleReport);

  readonly singleReportLoading = this.store.selectSignal(selectSingleReportLoading);
  readonly singleReportSessionLoading = this.store.selectSignal(selectSingleReportSessionLoading);
  readonly singleReportError = this.store.selectSignal(selectSingleReportError);
  readonly singleReportSessionError = this.store.selectSignal(selectSingleReportSessionError);
  readonly loading = computed(
    () => this.singleReportLoading() || this.singleReportSessionLoading(),
  );
  readonly error = computed(() => this.singleReportSessionError() || this.singleReportError());
  readonly isInitialSearch = computed(() => !this.singleReportSession() && !this.reports());

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      map((config) => {
        const page = config.pages.find((page: any) => page.id === '/single-report');
        return page;
      }),
    ),
    { initialValue: null },
  );

  readonly formConfig = computed<DynamicFormConfig | undefined>(() => {
    const config = this.pageConfig();
    console.log('pageConfig:', config);
    const sections = config?.sections;
    console.log('sections:', sections);
    const formItem = sections?.[0]?.areas?.center?.items?.find(
      (item: any) => item.type === 'DYNAMIC_FORM',
    );
    console.log('formItem:', formItem);
    return formItem?.props as DynamicFormConfig | undefined;
  });

  readonly cardsConfig = computed<any>(() => {
    const config = this.pageConfig();
    const sections = config?.sections;
    const cardsSection = sections?.find((section: any) => section.id === 'cards-section');
    const cardsItem = cardsSection?.areas?.center?.items?.find(
      (item: any) => item.type === 'SERVICE_CARDS',
    );
    return cardsItem?.props;
  });

  readonly documents = computed(() =>
    (this.reports() ?? []).flatMap((report) =>
      report.attachments.map((attachment) => ({
        ...report,
        attachment: attachment,
      })),
    ),
  );

  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.documents() ?? []).map((report: any, index: number) => {
        const compiledActions = this.compileActions(report, templateCard?.actions);
        return {
          ...report,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  });

  // Compila le action per ogni report:
  // - non vengono mostrate le action che soddisfano hideIf (non c'è nel DOM)
  // - disabilita le action che soddisfano disabledIf
  // - costruisce la compiledCallback in base al tipo di action (callback, route, externalLink)
  private compileActions(report: any, actions?: any[]): any[] {
    if (!actions || actions.length === 0) return [];

    return actions.flatMap((action) => {
      // Se le condizioni hideIf sono tutte vere:
      // - se c'è hideMessage, lo aggiunge come voce messaggio al posto dell'action
      // - altrimenti rimuove l'action completamente
      if (this.evaluateConditions(report, action.hideIf)) {
        return action.hideMessage
          ? [{ key: action.key, renderAs: 'message', message: action.hideMessage }]
          : [];
      }

      // Determina se l'action è disabilitata: per config statica oppure per condizioni disabledIf
      const isDisabled = action.disabled || this.evaluateConditions(report, action.disabledIf);
      let compiledCallback: () => void = () => {};

      switch (action.type) {
        case 'route':
          compiledCallback = () => {
            // Sostituisce i parametri dinamici nell'url, es. /documents/:id → /documents/123
            let url = action.url as string;
            if (action.routeParams) {
              Object.entries(action.routeParams).forEach(([paramName, dataPath]) => {
                const value = this.getValueByPath(report, dataPath as string);
                url = url.replace(`:${paramName}`, value ?? paramName);
              });
            }

            // Combina queryParams statici con quelli dinamici dal dato BE
            const queryParams: Record<string, any> = { ...(action.queryParams ?? {}) };
            if (action.queryParamsFromData) {
              Object.entries(action.queryParamsFromData).forEach(([paramName, dataPath]) => {
                queryParams[paramName] = this.getValueByPath(report, dataPath as string);
              });
            }

            this.router.navigate([url], { queryParams });
          };
          break;

        case 'externalLink':
          compiledCallback = () => {
            // Apre il link esterno nel target specificato (default: _blank)
            const target = action.target ?? '_blank';
            window.open(action.url, target);
          };
          break;

        case 'callback':
          compiledCallback = () => {
            const methodName = action.callback.nameFunction;
            // Cerca il metodo nel componente stesso
            if (typeof (this as any)[methodName] === 'function') {
              const params = (action.callback.params || []).map((paramKey: string) =>
                this.getValueByPath(report, paramKey),
              );
              // Passa sempre il report come primo argomento, poi i parametri aggiuntivi
              (this as any)[methodName](report, ...params);
            }
          };
          break;
      }

      return [
        {
          ...action,
          disabled: isDisabled,
          compiledCallback,
        },
      ];
    });
  }

  // Valuta un array di condizioni sul dato report (AND tra tutte le condizioni)
  // Ritorna true se TUTTE le condizioni sono soddisfatte, false se l'array è vuoto o assente
  private evaluateConditions(report: any, conditions?: any[]): boolean {
    if (!conditions || conditions.length === 0) return false;
    return conditions.every((condition) => this.evaluateCondition(report, condition));
  }

  // Valuta una singola condizione confrontando il valore BE con l'operatore specificato
  private evaluateCondition(report: any, condition: any): boolean {
    const value = this.getValueByPath(report, condition.key);
    switch (condition.operator) {
      case 'eq':
        return value === condition.value;
      case 'neq':
        return value !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      case 'exists':
        return value !== undefined && value !== null;
      case 'notExists':
        return value === undefined || value === null;
      case 'empty':
        return (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        );
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

  private getValueByPath(source: any, path: unknown): any {
    if (typeof path !== 'string') {
      return path;
    }

    return path.split('.').reduce((acc, part) => acc?.[part], source);
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetSingleReportState());
  }

  onFormSubmit(formData: any): void {
    const reportEndpoint = this.pageConfig()?.singleReportConfig?.reportEndpoint;

    const payload: any = { reportEndpoint };
    this.formConfig()?.fields.forEach((field) => {
      if (field.id === 'cf') payload.cf = formData[field.id];
      if (field.id === 'id') payload.id = formData[field.id];
    });

    this.store.dispatch(fetchSingleReportSession({ payload }));
  }

  downloadSingleReport = (document: any, isDownload: boolean) => {
    const session = this.singleReportSession();
    if (!session || !document) {
      return;
    }

    this.store.dispatch(
      downloadSingleReportAction({
        payload: {
          data: {
            requestId: session.code,
            sessionId: session.sessionId,
            attachmentId: document.attachment.id,
            reportId: document.id,
            decodeSignedBinary: false,
            responseType: document.attachment.type === 'LINK' ? 'link' : 'pdf',
            isDownload: isDownload,
          },
          reportEndpoint: this.pageConfig()?.singleReportConfig?.reportEndpoint,
        },
      }),
    );
  };
}
