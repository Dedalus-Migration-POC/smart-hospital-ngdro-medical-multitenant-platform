import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class UnitGeneralInfoCardComponent implements OnInit {
  @Input() unitDetails: Unit | null = null;
  @Input() department: string = '';

  constructor(private store: Store<SmartHospitalState>) {}

  ngOnInit(): void {}
}
