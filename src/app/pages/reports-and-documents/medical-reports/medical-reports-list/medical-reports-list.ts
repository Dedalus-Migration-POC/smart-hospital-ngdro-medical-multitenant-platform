import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PageConfigService } from 'src/app/pages/page-config.service';
import { map, take } from 'rxjs';
import { DesignAngularKitModule, SelectControlOption } from 'design-angular-kit';
import { getFlexLayoutClasses, getSizeStyles } from '../../../../shared/utility/layout.utils';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { Card } from 'src/app/components/card/card';
import { DynamicFormConfig } from 'src/app/components/dynamic-form/dynamic-form.model';
import { DynamicFormComponent } from 'src/app/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-medical-reports-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    Spinner,
    ImageBlock,
    Breadcrumb,
    DesignAngularKitModule,
    FormsModule,
    Card,
    DynamicFormComponent,
  ],
  templateUrl: './medical-reports-list.html',
  styleUrl: './medical-reports-list.scss',
})
export class MedicalReportsList implements OnInit {
  private store = inject(Store);
  private langService = inject(LanguageService);
  private cardActionsService = inject(CardActionsService);
  private pageConfigService = inject(PageConfigService);

  lang = this.langService.lang;
  protected readonly getSizeStyles = getSizeStyles;
  protected readonly getFlexLayoutClasses = getFlexLayoutClasses;

  private documentsTypes = this.store.selectSignal(selectdocumentsTypes);
  selectOptions = computed<Array<SelectControlOption>>(() => [
    ...(this.documentsTypes() ?? []).map((el) => ({ value: el.code, label: el.label })),
  ]);
  selectedOption: string = '';

  ngOnInit() {
    this.store.dispatch(fetchReportsAndDocuments({ filter: undefined }));
    if (this.formConfig()) {
      this.store.dispatch(fetchDocumentsTypes());
    }
  }

  readonly pageConfig = toSignal(this.pageConfigService.get('/medical-reports'), {
    initialValue: null,
  });

  readonly formConfig = computed<DynamicFormConfig | undefined>(() => {
    const config = this.pageConfig();
    const sections = config?.sections;
    const formItem = sections?.[0]?.areas?.center?.items?.find(
      (item: any) => item.type === 'DYNAMIC_FORM',
    );
    if (!formItem?.props) return undefined;

    const fields = (formItem.props.fields ?? []).map((field: any) =>
      field.id === 'typeCode' ? { ...field, options: this.selectOptions() } : field,
    );
    return { ...formItem.props, fields } as DynamicFormConfig;
  });
  onSelectChange() {
    this.store.dispatch(fetchReportsAndDocuments({ filter: this.selectedOption }));
  }

  onFormSubmit(formData: any) {
    let payload: any = {};
    this.formConfig()?.fields.forEach((field) => {
      if (field.id === 'typeCode') payload = formData[field.id];
    });

    this.store.dispatch(fetchReportsAndDocuments({ filter: payload }));
  }

  reports: Signal<IDocuments[] | null> = this.store.selectSignal(selectReportsAndDocumentsList);
  reportsError = this.store.selectSignal(selectReportsAndDocumentsListError);
  reportsLoading = this.store.selectSignal(selectReportsAndDocumentsListLoading);

  loading = computed(() => this.reportsLoading());
  error = computed(() => this.reportsError());

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
  downloadPdf = (document: IDocuments, isDownload: boolean) => {
    this.store.dispatch(
      fetchReportsAndDocumentDetails({
        payload: {
          documentId: document.documentId,
          repositoryId: document.repositoryId || '',
          isDownload: isDownload,
        },
      }),
    );
  };
}
