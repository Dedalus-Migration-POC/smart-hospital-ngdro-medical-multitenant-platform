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
import { CompiledCardsContainer, DataCardAction } from '../../../components/card/model';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { DynamicFormConfig } from '../../../components/dynamic-form/dynamic-form.model';
import { CardActionsService } from '../../../shared/services/card-actions.service';

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
  private cardActionsService = inject(CardActionsService);
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
        const compiledActions = this.cardActionsService.compileActions(
          report,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'sourceAndParams',
          },
        );
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

  downloadSingleReport = (document: IReport, isDownload: boolean) => {
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
            attachmentId: document.attachment?.id || '',
            reportId: document.id,
            decodeSignedBinary: false,
            responseType: document.attachment?.type === 'LINK' ? 'link' : 'pdf',
            isDownload: isDownload,
          },
          reportEndpoint: this.pageConfig()?.singleReportConfig?.reportEndpoint,
        },
      }),
    );
  };
}
