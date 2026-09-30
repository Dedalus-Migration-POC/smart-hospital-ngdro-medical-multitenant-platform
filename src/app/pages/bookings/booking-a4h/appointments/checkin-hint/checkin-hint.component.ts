import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SmartHospitalState } from 'src/app/store/reducers';
import { checkInHint } from '../appointment.utils';
import { AppointmentDto } from '../state/model';
import { selectCheckInHours } from '../state/selectors';

@Component({
  selector: 'app-checkin-hint',
  template: `
    @if (lockCauseMessage(); as message) {
      <div class="checkin-hint p-3" [innerHTML]="message"></div>
    }
  `,
  styles: `
    .checkin-hint {
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #edf7fa;
      color: #508bb0;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinHintComponent {
  private readonly store = inject(Store<SmartHospitalState>);
  private readonly translate = inject(TranslateService);

  readonly appointment = input<AppointmentDto | null>(null);
  /** Nel dettaglio si mostra solo l'eventuale impossibilità di modificare/cancellare. */
  readonly detailsMode = input(false);

  private readonly checkInHours = this.store.selectSignal(selectCheckInHours);

  protected readonly lockCauseMessage = computed<string | undefined>(() => {
    const appointment = this.appointment();
    const hint = appointment && checkInHint(appointment, this.checkInHours(), this.detailsMode());
    return hint ? this.translate.instant(hint.key, hint.params) : undefined;
  });
}
