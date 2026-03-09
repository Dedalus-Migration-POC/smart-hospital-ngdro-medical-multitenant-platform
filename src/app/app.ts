import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItNotificationsComponent } from 'design-angular-kit';
import { SmartHospitalState } from './store/reducers';
import { selectAppConfig } from './initialize/state/selector';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItNotificationsComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private store = inject(Store<SmartHospitalState>);
  protected readonly title = signal('medical-multitenant-platform');

  readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
}
