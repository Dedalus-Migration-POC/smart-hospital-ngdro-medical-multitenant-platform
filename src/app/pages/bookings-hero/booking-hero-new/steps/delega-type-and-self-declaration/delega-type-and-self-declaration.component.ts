import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { take } from 'rxjs';

import { selectBookingHeroSummary } from 'src/app/pages/bookings-hero/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';
import { SelectDelegaTypeComponent } from '../components/select-delega-type/select-delega-type.component';
import { SelfDeclarationComponent } from '../components/self-declaration/self-declaration.component';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { setActiveStep } from '../../../state/actions';
import { BookingStepId } from '../../../state/model';

@Component({
  selector: 'app-hero-delega-type-and-self-declaration',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    SelectDelegaTypeComponent,
    SelfDeclarationComponent,
    SummaryCardComponent,
  ],
  templateUrl: './delega-type-and-self-declaration.component.html',
  styleUrls: ['./delega-type-and-self-declaration.component.scss'],
})
export class DelegaTypeAndSelfDeclarationComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);

  ngOnInit(): void {}

  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  readonly delega = () => this.bookingSummary()?.delega;

  onConfirm() {
    const summary = this.bookingSummary();
    if (summary) {
      summary.bookingType === 'nre_delegate'
        ? this.store.dispatch(setActiveStep({ step: BookingStepId.PrescriptionUpload }))
        : this.store.dispatch(setActiveStep({ step: BookingStepId.DelegaForms }));
    }
  }
}
