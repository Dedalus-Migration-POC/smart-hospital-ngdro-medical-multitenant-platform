import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmartHospitalState } from '../../store/reducers';
import { selectAppConfig } from '../../initialize/state/selector';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { AreasLayout } from '../../shared/layout-system/components/areas-layout/areas-layout';
import { PageConfig } from '../page.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AreasLayout],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private store = inject(Store<SmartHospitalState>);

  readonly pageConfig = toSignal(
    this.store.select(selectAppConfig).pipe(
      take(1),
      map((config) => config.pages.find((page: PageConfig) => page.id === '/')), //TODO page type
    ),
    { initialValue: null },
  );
}
