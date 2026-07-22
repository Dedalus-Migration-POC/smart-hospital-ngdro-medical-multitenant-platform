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
import { SESSION_REPORT_RESPONSE, SINGLE_REPORT } from './state/mock';
import { Card } from '../../../components/card/card';
import { CardsContainer } from '../../../components/card/model';

@Component({
  selector: 'app-single-report',
  imports: [TranslateModule, CommonModule, Card],
  templateUrl: './single-report.html',
  styleUrl: './single-report.scss',
})
export class SingleReport implements OnDestroy {
  private store = inject(Store);
  private langService = inject(LanguageService);
  private router = inject(Router);
  lang = this.langService.lang;

  private singleReportSession = this.store.selectSignal(selectSingleReportSession);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === 'single-report')), //TODO page type
    ),
    { initialValue: null },
  );

  // TODO: serve per impl. card dinamiche
  readonly mockReports = SINGLE_REPORT;
  readonly documents = computed(() =>
    this.mockReports.flatMap((report) =>
      report.attachments.map((attachment) => ({
        reportId: report.id,
        attachmentId: attachment.id,
        reportStatus: report.status,
        paymentStatus: report.paymentInfo?.status,
        subject: report.subject,
        reportDate: report.date,
        date: attachment.date,
        title: attachment.title,
        type: attachment.type,
        status: attachment.status,
        extension: attachment.extension,
        patientName: `${report.patient.firstName} ${report.patient.lastName}`.trim(),
        fiscalCode: report.patient.fiscalCode,
      })),
    ),
  );
  cardsConfig: any = {
    itemColBootstrapClasses: 'col-12 col-md-6 col-xl-4',
    itemsLayout: {
      direction: 'column',
      gap: 'gap-1',
    },
    actionsLayout: {
      direction: 'row',
      wrap: 'wrap',
      gap: 'gap-2',
    },
    items: [
      {
        id: 'card-1',
        type: 'data',
        background: 'white',
        titleSubtitle: {
          title: {
            key: 'subject',
            fontSize: 'lg',
            fontWeight: 'bold',
            color: 'black',
            lineHeight: 'md',
          },
          subTitle: {
            key: 'metaInfo.object',
            fontSize: 'md',
            fontWeight: 'semibold',
            color: 'secondary',
          },
        },
        fields: [
          {
            key: 'metaInfo.object',
            type: 'text',
            label: {
              text: {
                it: 'Oggetto',
                en: 'Subject',
              },
            },
          },
          {
            key: 'date',
            type: 'date',
            format: 'dd/MM/yyyy',
            label: {
              text: {
                it: 'Data',
                en: 'Date',
              },
            },
          },
          {
            key: 'attachments',
            type: 'array',
            itemKey: 'title',
            listStyle: 'bullet',
            label: { text: { it: 'Servizi', en: 'Services' } },
          },
          {
            key: 'paymentInfo.status',
            type: 'image',
            label: { text: { it: 'Stato pagamento', en: 'Payment' } },
            imageMap: {
              PAYED: {
                type: 'inlineSvg',
                value:
                  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
                decorative: true,
              },
              PENDING: {
                type: 'inlineSvg',
                value:
                  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
                decorative: true,
              },
            },
            fallbackImage: {
              type: 'inlineSvg',
              value:
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
              decorative: true,
            },
          },
        ],
        actions: [
          {
            key: 'download',
            label: { text: { it: 'Scarica', en: 'Download' } },
            type: 'callback',
            renderAs: 'button',
            fullWidth: true,
            callback: {
              nameFunction: 'downloadPDF',
              params: [],
            },
            // TEST hideIf: nasconde "Scarica" se lo stato pagamento è PENDING
            // hideIf: [{ key: 'paymentInfo.status', operator: 'eq', value: 'PAYED' }],
          },
          {
            key: 'details',
            label: { text: { it: 'Dettagli', en: 'Details' } },
            type: 'route',
            renderAs: 'button',
            className: 'btn btn-primary flex-grow-1',
            url: '/medical-reports',
            queryParamsFromData: { id: 'id' },
            // TEST disabledIf: disabilita "Dettagli" se non ci sono allegati
            disabledIf: [{ key: 'attachments', operator: 'empty' }],
          },
          {
            key: 'external',
            label: { text: { it: 'Apri sito', en: 'Open site' } },
            type: 'externalLink',
            renderAs: 'button',
            url: 'https://google.com',
            target: '_blank',
          },
        ],
      },
    ],
  };

  readonly renderedCardsConfig = computed<CardsContainer>(() => {
    const templateCard = this.cardsConfig.items[0];

    return {
      ...this.cardsConfig,
      items: this.mockReports.map((report: any, index: number) => {
        const compiledActions = this.compileActions(report, templateCard.actions);
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

    return (
      actions
        // Filtra le action da nascondere: se le condizioni hideIf sono tutte vere, l'action non viene inclusa
        .filter((action) => !this.evaluateConditions(report, action.hideIf))
        .map((action) => {
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

          return {
            ...action,
            disabled: isDisabled,
            compiledCallback,
          };
        })
    );
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

  private downloadPDF(report: any): void {
    // TODO: rimuovere il fallback mock quando il flusso reale è attivo
    const session = this.singleReportSession() ?? SESSION_REPORT_RESPONSE;
    const attachment = report.attachments?.[0];

    if (!session || !attachment) {
      return;
    }

    this.store.dispatch(
      downloadSingleReportAction({
        payload: {
          data: {
            requestId: session.code,
            sessionId: session.sessionId,
            attachmentId: attachment.id,
            reportId: report.id,
            decodeSignedBinary: false,
            responseType: attachment.type === 'LINK' ? 'link' : 'pdf',
            isDownload: true,
          },
          reportEndpoint: this.pageConfig()?.page.singleReportConfig?.reportEndpoint,
        },
      }),
    );
  }

  private getValueByPath(source: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], source);
  }

  ngOnDestroy(): void {
    this.store.dispatch(resetSingleReportState());
  }

  // searchReportForm = new FormGroup({
  //   cf: new FormControl('', [Validators.required, NgxFormValidators.taxCodeValidator]),
  //   id: new FormControl('', [Validators.required]),
  // });

  // singleReportLoading = this.store.selectSignal(selectSingleReportLoading);
  // singleReportSessionLoading = this.store.selectSignal(selectSingleReportSessionLoading);
  // singleReportSession = this.store.selectSignal(selectSingleReportSession);
  // reports: Signal<IReport[] | null> = this.store.selectSignal(selectSingleReport);
  // singleReportError = this.store.selectSignal(selectSingleReportError);
  // singleReportSessionError = this.store.selectSignal(selectSingleReportSessionError);
  // loading = computed(() => this.singleReportLoading() || this.singleReportSessionLoading());
  // error = computed(() => this.singleReportSessionError() || this.singleReportError());
  // idlength = this.pageConfig()?.page.singleReportConfig?.idInput?.idlength;

  // onSubmit() {
  //   if (this.searchReportForm.invalid) {
  //     return;
  //   }
  //   this.store.dispatch(
  //     fetchSingleReportSession({
  //       payload: {
  //         cf: this.searchReportForm.value.cf!,
  //         id: this.searchReportForm.value.id!,
  //         reportEndpoint: this.pageConfig()?.page.singleReportConfig?.reportEndpoint,
  //       },
  //     }),
  //   );
  // }

  // isInitialSearch = computed(() => !this.singleReportSession() && !this.reports());

  // documents = computed(() =>
  //   (this.reports() ?? []).flatMap((report) =>
  //     report.attachments.map((attachment) => ({
  //       reportId: report.id,
  //       attachmentId: attachment.id,
  //       reportStatus: report.status,
  //       paymentStatus: report.paymentInfo?.status,
  //       subject: report.subject,
  //       date: attachment.date,
  //       title: attachment.title,
  //       type: attachment.type,
  //     })),
  //   ),
  // );

  // downloadSingleReport = (id: string, type: string, isDownload: boolean) => {
  //   const session = this.singleReportSession();
  //   const document = this.documents().find((item) => item.attachmentId === id);

  //   if (!session || !document) {
  //     return;
  //   }

  //   this.store.dispatch(
  //     downloadSingleReportAction({
  //       payload: {
  //         data: {
  //           requestId: session.code,
  //           sessionId: session.sessionId,
  //           attachmentId: id,
  //           reportId: document.reportId,
  //           decodeSignedBinary: false,
  //           responseType: type === 'LINK' ? 'link' : 'pdf',
  //           isDownload: isDownload,
  //         },
  //         reportEndpoint: this.pageConfig()?.page.singleReportConfig?.reportEndpoint,
  //       },
  //     }),
  //   );
  // };
}
