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
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { SINGLE_REPORT } from './state/mock';
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
  lang = this.langService.lang;

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
        ],
      },
    ],
  };

  readonly renderedCardsConfig = computed<CardsContainer>(() => {
    const templateCard = this.cardsConfig.items[0];

    return {
      ...this.cardsConfig,
      items: this.mockReports.map((report: any, index: number) => ({
        ...report,
        ...templateCard,
        id: `card-${index + 1}`,
        type: 'data',
      })),
    };
  });

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
