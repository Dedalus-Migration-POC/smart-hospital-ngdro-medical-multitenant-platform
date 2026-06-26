import { Component, computed, inject, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectDownloadedReportLoading,
  selectTripletReport,
  selectTripletReportError,
  selectTripletReportLoading,
} from './state/selectors';
import { downloadTripletReport, fetchReport, resetTripletReportState } from './state/actions';
import { TranslateModule } from '@ngx-translate/core';
import { JsonPipe } from '@angular/common';
import { Spinner } from '../../../components/spinner/spinner';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { ImageBlock } from '../../../components/image-block/image-block';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { map, take } from 'rxjs';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { ReportTriplet, Structure } from './state/model';
import {
  DesignAngularKitModule,
  ItNotificationService,
  NotificationPosition,
} from 'design-angular-kit';
import { SelectComponent } from '../../../components/select/select.component';
import { InputComponent } from '../../../components/input/input.component';

@Component({
  selector: 'app-reports-by-triplet',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    JsonPipe,
    Spinner,
    ImageBlock,
    Breadcrumb,
    DesignAngularKitModule,
    SelectComponent,
    InputComponent,
  ],
  templateUrl: './reports-by-triplet.html',
  styleUrl: './reports-by-triplet.scss',
})
export class TripletReport {
  private readonly notificationService = inject(ItNotificationService);
  private store = inject(Store);
  private langService = inject(LanguageService);
  lang = this.langService.lang;

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/reports-by-triplet')), //TODO page type
    ),
    { initialValue: null },
  );

  ngOnDestroy(): void {
    this.store.dispatch(resetTripletReportState());
  }

  searchReportForm = new FormGroup({
    asl: new FormControl('', [Validators.required]),
    userCode: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    reportCode: new FormControl('', [Validators.required]),
  });

  reportsLoading = this.store.selectSignal(selectTripletReportLoading);
  downloadReportLoading = this.store.selectSignal(selectDownloadedReportLoading);
  loading = computed(() => this.reportsLoading() || this.downloadReportLoading());
  error = this.store.selectSignal(selectTripletReportError);
  reports: Signal<ReportTriplet[] | null> = this.store.selectSignal(selectTripletReport);
  isInitialSearch = false;

  structures = computed(() =>
    (this.pageConfig()?.page.tripletReportConfig.structures || []).map((structure: Structure) => ({
      value: structure.code,
      label: structure.label,
    })),
  );

  onSubmit() {
    if (this.searchReportForm.invalid) {
      return;
    }
    this.isInitialSearch = true;
    this.store.dispatch(
      fetchReport({
        payload: {
          organizationCode: this.searchReportForm.value.asl!,
          patientId: this.searchReportForm.value.userCode!,
          securityCode:
            this.searchReportForm.value.password! + '|' + this.searchReportForm.value.reportCode!,
        },
      }),
    );
  }

  downloadReport = (id: string, paymentStatus: string, isDownload: boolean) => {
    if (paymentStatus === '0') {
      this.notificationService.info(
        this.pageConfig()?.page.tripletReportConfig.notPaiedReportInformation.title[this.lang()] ||
          '',
        this.pageConfig()?.page.tripletReportConfig.notPaiedReportInformation.info[this.lang()] ||
          '',
        true,
        30000,
        NotificationPosition.Top,
      );

      return;
    }
    const organizationCode = this.searchReportForm.value.asl!;

    this.store.dispatch(
      downloadTripletReport({
        payload: {
          data: {
            organizationCode: organizationCode,
            documentId: id,
          },
          isDownload: isDownload,
        },
      }),
    );
  };
}
