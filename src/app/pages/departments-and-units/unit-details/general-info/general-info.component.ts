import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { Unit } from '../../state/model';
import { SmartHospitalState } from '../../../../store/reducers';

@Component({
  selector: 'app-unit-general-info',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class UnitGeneralInfoCardComponent {
  readonly unitDetails = input<Unit | null>(null);
  readonly department = input('');

  constructor(private store: Store<SmartHospitalState>) {}
}
