import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { selectBookingHeroSummary } from 'src/app/pages/bookings/bookings-hero/state/selectors';
import { SmartHospitalState } from 'src/app/store/reducers';

@Component({
  selector: 'app-hero-delega-self-declaration',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, DesignAngularKitModule],
  templateUrl: './self-declaration.component.html',
  styleUrls: ['./self-declaration.component.scss'],
})
export class SelfDeclarationComponent implements OnInit {
  private readonly store = inject(Store<SmartHospitalState>);

  ngOnInit(): void {}

  readonly bookingSummary = this.store.selectSignal(selectBookingHeroSummary);
  readonly delega = () => this.bookingSummary()?.delega;
}

