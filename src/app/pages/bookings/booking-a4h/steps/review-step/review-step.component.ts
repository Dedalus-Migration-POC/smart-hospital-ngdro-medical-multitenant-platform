import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from 'src/app/store/reducers';
import { selectUserProfileData } from 'src/app/pages/user-profile/state/user-profile.selectors';

import { HealthcareUnit, Appointment } from '../../state/model';

@Component({
  selector: 'app-review-step',
  imports: [TranslateModule, DesignAngularKitModule, DatePipe, TitleCasePipe],
  templateUrl: './review-step.component.html',
  styleUrls: ['./review-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStepComponent {
  private readonly store = inject(Store<SmartHospitalState>);

  readonly bookingSummary = input<Appointment | null | undefined>(null);
  readonly selectedStruttura = input<HealthcareUnit | null>(null);
  readonly user = this.store.selectSignal(selectUserProfileData);
  readonly back = output<void>();
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
