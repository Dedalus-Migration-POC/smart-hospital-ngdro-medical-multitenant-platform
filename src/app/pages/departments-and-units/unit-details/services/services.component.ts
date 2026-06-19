import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Store } from '@ngrx/store';
import { Unit } from '../../state/model';
import { SmartHospitalState } from '../../../../store/reducers';

@Component({
  selector: 'app-unit-services',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class UnitServicesCardComponent implements OnInit {
  @Input() unitDetails: Unit | null = null;
  @Input() department: string = '';

  constructor(private store: Store<SmartHospitalState>) {}

  ngOnInit(): void {}
}
