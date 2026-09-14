import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { map, take } from 'rxjs';
import { SmartHospitalState } from '../../../store/reducers';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from '../../../components/breadcrumb/breadcrumb';
import { Departments, Unit } from '../state/model';
import { selectFirebaseObject } from '../../../store/remote-config/remote-config.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { CardActionsService } from 'src/app/shared/services/card-actions.service';
import {
  CardsContainer,
  CompiledCardsContainer,
  DataCardAction,
} from 'src/app/components/card/model';
import { AreasLayout } from 'src/app/shared/layout-system/components/areas-layout/areas-layout';
import { AreasConfig, Item, LayoutArea } from 'src/app/shared/layout-system/models/layout.model';

@Component({
  selector: 'app-unit-details',
  imports: [CommonModule, TranslateModule, Breadcrumb, AreasLayout],
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss'],
})
export class UnitDetailsComponent {
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);
  private breadcrumbService = inject(BreadcrumbService);
  private cardActionsService = inject(CardActionsService);
  private pageConfigService = inject(PageConfigService);

  readonly pageConfig = toSignal(this.pageConfigService.get('/departments/units/details'), {
    initialValue: null,
  });

  readonly department = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((queryParamMap) => queryParamMap.get('department') ?? ''),
    ),
    { initialValue: '' },
  );
  readonly unit = toSignal(
    this.activatedRoute.queryParamMap.pipe(map((queryParamMap) => queryParamMap.get('unit') ?? '')),
    { initialValue: '' },
  );

  readonly breadcrumbConfig = computed(() => {
    const config = this.pageConfig();
    const unit = this.unit();
    const department = this.department();

    if (!config?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.breadcrumb, {
      department,
      unit,
    });
  });

  departmentsList: Signal<Departments> = this.store.selectSignal(
    selectFirebaseObject('department'),
  );

  readonly unitDetails = computed<Unit | undefined>(() => {
    const department = this.department();
    const unit = this.unit();
    const departmentsList = this.departmentsList();
    const selectedUnit = departmentsList?.departments
      ?.find((dep) => dep.title === department)
      ?.units.find((el) => el.title === unit);
    const unitWithDepartmentName = selectedUnit
      ? { ...selectedUnit, departmentName: department }
      : undefined;
    return unitWithDepartmentName;
  });

  readonly renderedSections = computed(() => {
    const pageConfig = this.pageConfig();

    if (!pageConfig) {
      return [];
    }

    return pageConfig.sections.map((section: any) => ({
      ...section,
      areas: this.renderSectionAreas(section.id, section.areas),
    }));
  });

  private renderSectionAreas(sectionId: string, areas: AreasConfig): AreasConfig {
    return {
      ...areas,
      start: this.renderArea(sectionId, 'start', areas.start),
      center: this.renderArea(sectionId, 'center', areas.center),
      end: this.renderArea(sectionId, 'end', areas.end),
    };
  }

  private renderArea(
    sectionId: string,
    areaName: 'start' | 'center' | 'end',
    area: LayoutArea | undefined,
  ): LayoutArea | undefined {
    if (!area) {
      return area;
    }

    return {
      ...area,
      items: area.items.map((item) => this.renderItem(sectionId, areaName, item)),
    };
  }

  private renderItem(sectionId: string, areaName: 'start' | 'center' | 'end', item: Item): Item {
    return {
      ...item,
      props: this.renderCardsConfig(item.props as CardsContainer | undefined),
    };
  }

  private renderCardsConfig(cardsConfig: CardsContainer | undefined): CompiledCardsContainer {
    if (!cardsConfig) {
      return { items: [] };
    }

    const templateCard = cardsConfig.items?.[0];
    if (!templateCard || templateCard.type !== 'data') {
      return {
        ...cardsConfig,
        items: [],
      };
    }

    return {
      ...cardsConfig,
      items: (this.unitDetails() ? [this.unitDetails()] : []).map(
        (department: any, index: number) => {
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
        },
      ),
    };
  }
}
