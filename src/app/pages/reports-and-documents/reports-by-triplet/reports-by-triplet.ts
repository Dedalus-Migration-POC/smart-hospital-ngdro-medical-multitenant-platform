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
import { Spinner } from '../../../components/spinner/spinner';
import { LanguageService } from '../../../initialize/state/services/language.service';
import { ImageBlock } from '../../../components/image-block/image-block';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { map, take } from 'rxjs';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { ReportTriplet, Structure } from './state/model';
import { DesignAngularKitModule } from 'design-angular-kit';
import { DynamicFormConfig } from 'src/app/components/dynamic-form/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';
import { Card } from 'src/app/components/card/card';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';

@Component({
  selector: 'app-reports-by-triplet',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    Spinner,
    ImageBlock,
    Breadcrumb,
    DesignAngularKitModule,
    DynamicFormComponent,
    Card,
  ],
  templateUrl: './reports-by-triplet.html',
  styleUrl: './reports-by-triplet.scss',
})
export class TripletReport {
  private store = inject(Store);
  private langService = inject(LanguageService);
  private cardActionsService = inject(CardActionsService);

  lang = this.langService.lang;
  reportsLoading = this.store.selectSignal(selectTripletReportLoading);
  downloadReportLoading = this.store.selectSignal(selectDownloadedReportLoading);
  loading = computed(() => this.reportsLoading() || this.downloadReportLoading());
  error = this.store.selectSignal(selectTripletReportError);
  reports: Signal<ReportTriplet[] | null> = this.store.selectSignal(selectTripletReport);
  isInitialSearch = false;
  selectedStructure: string | null = null;

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/reports-by-triplet')), //TODO page type
    ),
    { initialValue: null },
  );

  readonly formConfig = computed<DynamicFormConfig | undefined>(() => {
    const config = this.pageConfig();
    const sections = config?.sections;
    const formItem = sections?.[0]?.areas?.center?.items?.find(
      (item: any) => item.type === 'DYNAMIC_FORM',
    );
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

  readonly renderedCardsConfig = computed<CompiledCardsContainer>(() => {
    const cardsConfig = this.cardsConfig();
    if (!cardsConfig) return { items: [] };

    const templateCard = cardsConfig.items?.[0];
    return {
      ...cardsConfig,
      items: (this.reports() ?? []).map((report: any, index: number) => {
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
    this.store.dispatch(resetTripletReportState());
    this.selectedStructure = null;
  }

  onFormSubmit(formData: any) {
    this.isInitialSearch = true;

    const getFormData: any = {};
    this.formConfig()?.fields.forEach((field) => {
      if (field.id === 'asl') getFormData.asl = formData[field.id];
      if (field.id === 'userCode') getFormData.userCode = formData[field.id];
      if (field.id === 'password') getFormData.password = formData[field.id];
      if (field.id === 'reportCode') getFormData.reportCode = formData[field.id];
    });
    this.selectedStructure = getFormData.asl;
    this.store.dispatch(
      fetchReport({
        payload: {
          organizationCode: getFormData.asl!,
          patientId: getFormData.userCode!,
          securityCode: getFormData.password! + '|' + getFormData.reportCode!,
        },
      }),
    );
  }

  downloadReport = (document: ReportTriplet, isDownload: boolean) => {
    const organizationCode = this.selectedStructure;
    if (!organizationCode) {
      console.error('Organization code is not set. Cannot download report.');
      return;
    }
    this.store.dispatch(
      downloadTripletReport({
        payload: {
          data: {
            organizationCode: organizationCode,
            documentId: document.documentId,
          },
          isDownload: isDownload,
        },
      }),
    );
  };
}
