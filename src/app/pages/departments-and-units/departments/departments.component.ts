import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, startWith, take } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { SmartHospitalState } from '../../../store/reducers';
import { selectFirebaseObject } from '../../../store/remote-config/remote-config.selectors';
import { Department, Departments } from '../state/model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { Card } from 'src/app/components/card/card';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { InputComponent } from 'src/app/components/input/input.component';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, Breadcrumb, Card, InputComponent],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
  ) {}
  private store = inject(Store<SmartHospitalState>);
  private cardActionsService = inject(CardActionsService);
  private pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/departments'), {
    initialValue: null,
  });

  searchText = new FormControl<string>('');
  private readonly searchTextValue = toSignal(
    this.searchText.valueChanges.pipe(startWith(this.searchText.value ?? '')),
    { initialValue: this.searchText.value ?? '' },
  );

  departmentsList: Signal<Departments> = this.store.selectSignal(
    selectFirebaseObject('department'),
  );

  readonly departmentsFiltered = computed<Department[]>(() => {
    const searchText = this.searchTextValue()?.toLowerCase().trim();
    const departmentsList = this.departmentsList().departments;

    if (!searchText) {
      return departmentsList;
    }

    return departmentsList.filter(
      (department) =>
        department.title?.toLowerCase().includes(searchText) ||
        department.units.some((unit) => unit.title?.toLowerCase().includes(searchText)) ||
        department.units.some((unit) =>
          unit.services?.some((service) => service.toLowerCase().includes(searchText)),
        ),
    );
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
      items: (this.departmentsFiltered() ?? []).map((department: any, index: number) => {
        const compiledActions = this.cardActionsService.compileActions(
          department,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'sourceAndParams',
          },
        );
        return {
          ...department,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  });

  ngOnInit(): void {}

  viewUnits(department: Department) {
    this.router.navigate([`units`], {
      relativeTo: this.activatedRoute,
      queryParams: { department: department.title },
    });
  }
}
