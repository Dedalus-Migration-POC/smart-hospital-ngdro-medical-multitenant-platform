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
import { selectAppConfig } from '../../../initialize/state/selector';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, Breadcrumb],
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

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: any) => page.id === '/departments')), //TODO page type
    ),
    { initialValue: null },
  );

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

  ngOnInit(): void {}

  viewUnits(title: string) {
    this.router.navigate([`units`], {
      relativeTo: this.activatedRoute,
      queryParams: { department: title },
    });
  }
}
