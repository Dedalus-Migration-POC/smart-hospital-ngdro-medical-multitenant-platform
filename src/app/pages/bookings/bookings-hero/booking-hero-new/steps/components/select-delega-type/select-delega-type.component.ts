import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { distinctUntilChanged } from 'rxjs';
import { fetchDelegaTypesList, setSummaryBooking } from 'src/app/pages/bookings/bookings-hero/state/actions';
import {
  selectBookingHeroSummary,
  selectDelegaTypes,
} from 'src/app/pages/bookings/bookings-hero/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-hero-select-delega-type',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SelectComponent,
  ],
  templateUrl: './select-delega-type.component.html',
  styleUrls: ['./select-delega-type.component.scss'],
})
export class SelectDelegaTypeComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);
  delegaTypeControl = new FormControl('');
  readonly delegaTypesList = this.store.selectSignal(selectDelegaTypes);
  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);

  ngOnInit(): void {
    this.store.dispatch(fetchDelegaTypesList());
    this.delegaTypeControl.valueChanges.pipe(distinctUntilChanged()).subscribe((value) => {
      if (value) {
        this.store.dispatch(
          setSummaryBooking({
            payload: {
              ...this.bookingSummary(),
              delega: {
                delegateType: value,
              },
            },
          }),
        );
      }
    });
  }
}

