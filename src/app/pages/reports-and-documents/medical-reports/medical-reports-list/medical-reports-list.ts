import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Spinner } from '../../../../components/spinner/spinner';
import { ImageBlock } from '../../../../components/image-block/image-block';
import { Breadcrumb } from '../../../../components/breadcrumb/breadcrumb';
import { IDocuments } from '../state/model';
import {
  selectdocumentsTypes,
  selectReportsAndDocumentsList,
  selectReportsAndDocumentsListError,
  selectReportsAndDocumentsListLoading,
} from '../state/selectors';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import {
  fetchDocumentsTypes,
  fetchReportsAndDocumentDetails,
  fetchReportsAndDocuments,
} from '../state/actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../../initialize/state/selector';
import { map, take } from 'rxjs';
import { DesignAngularKitModule, SelectControlOption } from 'design-angular-kit';
import { getFlexLayoutClasses, getSizeStyles } from '../../../../shared/utility/layout.utils';

@Component({
  selector: 'app-medical-reports-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    JsonPipe,
    Spinner,
    ImageBlock,
    Breadcrumb,
    DesignAngularKitModule,
    FormsModule,
  ],
  templateUrl: './medical-reports-list.html',
  styleUrl: './medical-reports-list.scss',
})
export class MedicalReportsList implements OnInit {
  private store = inject(Store);
  private langService = inject(LanguageService);
  lang = this.langService.lang;
  protected readonly getSizeStyles = getSizeStyles;
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  private documentsTypes = this.store.selectSignal(selectdocumentsTypes);
  selectOptions = computed<Array<SelectControlOption>>(() => [
    { value: '', text: 'Tutti', selected: true },
    ...(this.documentsTypes() ?? []).map((el) => ({ value: el.code, text: el.label })),
  ]);
  selectedOption: string = '';

  ngOnInit() {
    this.store.dispatch(fetchReportsAndDocuments({ filter: undefined }));
    if (this.pageConfig().page.medicalReportsConfig?.filterDocumentType?.show) {
      this.store.dispatch(fetchDocumentsTypes());
    }
  }

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/medical-reports')), //TODO page type
    ),
    { initialValue: null },
  );

  onSelectChange() {
    this.store.dispatch(fetchReportsAndDocuments({ filter: this.selectedOption }));
  }

  reports: Signal<IDocuments[] | null> = this.store.selectSignal(selectReportsAndDocumentsList);
  reportsError = this.store.selectSignal(selectReportsAndDocumentsListError);
  reportsLoading = this.store.selectSignal(selectReportsAndDocumentsListLoading);

  loading = computed(() => this.reportsLoading());
  error = computed(() => this.reportsError());

  downloadPdf = (documentId: string, repositoryId: string, isDownload: boolean) => {
    this.store.dispatch(
      fetchReportsAndDocumentDetails({
        payload: {
          documentId: documentId,
          repositoryId: repositoryId,
          isDownload: isDownload,
        },
      }),
    );
  };
}
