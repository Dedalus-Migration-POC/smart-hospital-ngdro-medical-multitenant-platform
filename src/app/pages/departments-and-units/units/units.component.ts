import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, startWith, take } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Departments, Unit } from '../state/model';
import { selectFirebaseObject } from '../../../store/remote-config/remote-config.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { SmartHospitalState } from '../../../store/reducers';
import { selectAppConfig } from '../../../initialize/state/selector';
import { InputComponent } from 'src/app/components/input/input.component';
import { Card } from 'src/app/components/card/card';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import { CompiledCardsContainer, DataCardAction } from 'src/app/components/card/model';

@Component({
  selector: 'app-units',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, Breadcrumb, InputComponent, Card],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss'],
})
export class UnitsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store<SmartHospitalState>);
  private breadcrumbService = inject(BreadcrumbService);
  private cardActionsService = inject(CardActionsService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/departments/units')), //TODO page type
    ),
    { initialValue: null },
  );

  readonly department = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((queryParamMap) => queryParamMap.get('department') ?? ''),
    ),
    { initialValue: '' },
  );

  readonly searchUnitText = new FormControl<string>('');
  private readonly searchUnitTextValue = toSignal(
    this.searchUnitText.valueChanges.pipe(startWith(this.searchUnitText.value ?? '')),
    { initialValue: this.searchUnitText.value ?? '' },
  );

  departmentsList: Signal<Departments> = this.store.selectSignal(
    selectFirebaseObject('department'),
  );

  readonly units = computed<Unit[]>(() => {
    const departmentTitle = this.department();
    const searchUnitText = this.searchUnitTextValue()?.toLowerCase().trim();
    const departmentsList = this.departmentsList();
    const selectedDepartment = departmentsList?.departments?.find(
      (dep) => dep.title === departmentTitle,
    );

    const units = selectedDepartment?.units ?? [];

    if (!searchUnitText) {
      return units;
    }

    return units.filter(
      (unit) =>
        unit.title?.toLowerCase().includes(searchUnitText) ||
        unit.services?.some((service) => service.toLowerCase().includes(searchUnitText)),
    );
  });

  ngOnInit(): void {}

  readonly breadcrumbConfig = computed(() => {
    const config = this.pageConfig();
    const department = this.department();

    if (!config?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.breadcrumb, {
      department,
    });
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
      items: (this.units() ?? []).map((unit: any, index: number) => {
        const compiledActions = this.cardActionsService.compileActions(
          unit,
          templateCard?.actions as DataCardAction[] | undefined,
          {
            callbackContext: this,
            callbackArgsMode: 'sourceAndParams',
          },
        );
        return {
          ...unit,
          ...templateCard,
          id: `card-${index + 1}`,
          type: 'data',
          actions: compiledActions,
        } as any;
      }),
    };
  });

  viewUnit(unit: Unit) {
    this.router.navigate([`details`], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: { unit: unit.title },
    });
  }
}
