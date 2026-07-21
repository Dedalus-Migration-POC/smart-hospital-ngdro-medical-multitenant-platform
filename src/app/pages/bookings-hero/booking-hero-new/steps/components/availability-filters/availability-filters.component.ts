import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { HealthcareUnit } from 'src/app/pages/bookings-hero/state/model';
import { InputComponent } from 'src/app/components/input/input.component';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-hero-availability-filters',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    DesignAngularKitModule,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './availability-filters.component.html',
  styleUrls: ['./availability-filters.component.scss'],
})
export class AvailabilityFiltersComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() healthcareUnits: HealthcareUnit[] | null = [];
  @Input() showFilters = false;

  @Output() toggleFilters = new EventEmitter();
  @Output() applyFilters = new EventEmitter();
  @Output() resetFilters = new EventEmitter();

  ngOnInit() {}

  onToggleFilters() {
    this.toggleFilters.emit();
  }

  onApplyFilters() {
    this.applyFilters.emit();
  }

  onResetFilters() {
    this.resetFilters.emit();
    this.onApplyFilters();
  }
}
