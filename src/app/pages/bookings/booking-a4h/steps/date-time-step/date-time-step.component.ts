import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from 'src/app/components/input/input.component';
import { CheckAvailableDays } from '../../state/model';

export interface DateTimeServiceToBook {
  id: string;
  name?: string;
  status: string;
  hash: string;
}

export interface DateTimeSelectedService {
  id: string;
  name?: string;
  hash?: string;
}

@Component({
  selector: 'app-date-time-step',
  imports: [DatePipe, ReactiveFormsModule, TranslateModule, InputComponent],
  templateUrl: './date-time-step.component.html',
  styleUrls: ['./date-time-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeStepComponent {
  readonly isOptimized = input(false);
  readonly selectedMedicalServices = input<readonly DateTimeSelectedService[]>([]);
  readonly selectedService = input<DateTimeSelectedService | undefined>();
  readonly availableServices = input<readonly DateTimeServiceToBook[] | undefined>();
  readonly availableDays = input<CheckAvailableDays | null>();
  readonly loading = input(false);

  readonly filter = output<{ start: string | null; end: string | null }>();
  readonly appointmentSelected = output<string>();
  readonly back = output<void>();

  readonly currentDate = new Date();
  readonly calendarToggle = signal(false);

  readonly rangeDate = new FormGroup({
    start: new FormControl<string | null>(this.formatDate(new Date())),
    end: new FormControl<string | null>(
      this.formatDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
    ),
  });

  openCalendar(): void {
    this.calendarToggle.set(true);
  }

  applyFilter(): void {
    this.filter.emit(this.rangeDate.getRawValue());
  }

  onAppointmentClick(id: string): void {
    this.appointmentSelected.emit(id);
  }

  private formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}
