import { Component, computed, inject, Signal } from '@angular/core';
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
import { JsonPipe } from '@angular/common';
import { Spinner } from '../../../components/spinner/spinner';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { ImageBlock } from '../../../components/image-block/image-block';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { map, take } from 'rxjs';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { InputComponent } from '../../../components/input/input.component';

@Component({
  selector: 'app-single-report',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    JsonPipe,
    Spinner,
    ImageBlock,
    Breadcrumb,
    InputComponent,
  ],
  templateUrl: './single-report.html',
  styleUrl: './single-report.scss',
})
export class SingleReport {
  private store = inject(Store);
  private langService = inject(LanguageService);
  lang = this.langService.lang;

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/single-report')), //TODO page type
    ),
    { initialValue: null },
  );

  ngOnDestroy(): void {
    this.store.dispatch(resetSingleReportState());
  }

  searchReportForm = new FormGroup({
    cf: new FormControl('', [Validators.required, NgxFormValidators.taxCodeValidator]),
    id: new FormControl('', [Validators.required]),
  });

  singleReportLoading = this.store.selectSignal(selectSingleReportLoading);
  singleReportSessionLoading = this.store.selectSignal(selectSingleReportSessionLoading);
  singleReportSession = this.store.selectSignal(selectSingleReportSession);
  reports: Signal<IReport[] | null> = this.store.selectSignal(selectSingleReport);
  singleReportError = this.store.selectSignal(selectSingleReportError);
  singleReportSessionError = this.store.selectSignal(selectSingleReportSessionError);
  loading = computed(() => this.singleReportLoading() || this.singleReportSessionLoading());
  error = computed(() => this.singleReportSessionError() || this.singleReportError());
  idlength = this.pageConfig()?.page.singleReportConfig?.idInput?.idlength;

  onSubmit() {
    if (this.searchReportForm.invalid) {
      return;
    }
    this.store.dispatch(
      fetchSingleReportSession({
        payload: {
          cf: this.searchReportForm.value.cf!,
          id: this.searchReportForm.value.id!,
          reportEndpoint: this.pageConfig()?.page.singleReportConfig?.reportEndpoint,
        },
      }),
    );
  }

  isInitialSearch = computed(() => !this.singleReportSession() && !this.reports());

  documents = computed(() =>
    (this.reports() ?? []).flatMap((report) =>
      report.attachments.map((attachment) => ({
        reportId: report.id,
        attachmentId: attachment.id,
        reportStatus: report.status,
        paymentStatus: report.paymentInfo?.status,
        subject: report.subject,
        date: attachment.date,
        title: attachment.title,
        type: attachment.type,
      })),
    ),
  );

  downloadSingleReport = (id: string, type: string, isDownload: boolean) => {
    const session = this.singleReportSession();
    const document = this.documents().find((item) => item.attachmentId === id);

    if (!session || !document) {
      return;
    }

    this.store.dispatch(
      downloadSingleReportAction({
        payload: {
          data: {
            requestId: session.code,
            sessionId: session.sessionId,
            attachmentId: id,
            reportId: document.reportId,
            decodeSignedBinary: false,
            responseType: type === 'LINK' ? 'link' : 'pdf',
            isDownload: isDownload,
          },
          reportEndpoint: this.pageConfig()?.page.singleReportConfig?.reportEndpoint,
        },
      }),
    );
  };
}
