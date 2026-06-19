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
import { UnitServicesCardComponent } from './services/services.component';
import { UnitGeneralInfoCardComponent } from './general-info/general-info.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectAppConfig } from '../../../initialize/state/selector';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-unit-details',
  imports: [
    CommonModule,
    TranslateModule,
    Breadcrumb,
    UnitGeneralInfoCardComponent,
    UnitServicesCardComponent,
  ],
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss'],
})
export class UnitDetailsComponent {
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store<SmartHospitalState>);
  private breadcrumbService = inject(BreadcrumbService);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/departments/units/details')), //TODO page type
    ),
    { initialValue: null },
  );

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

    if (!config?.page?.breadcrumb) return null;

    return this.breadcrumbService.interpolateConfig(config.page.breadcrumb, {
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

    return departmentsList?.departments
      ?.find((dep) => dep.title === department)
      ?.units.find((el) => el.title === unit);
  });
}
