import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItNotificationsComponent } from "design-angular-kit";
import { SmartHospitalState } from './store/reducers';
import { fetchAppConfig } from './initialize/state/actions';
import { selectAppConfig } from './initialize/state/selector';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItNotificationsComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store<SmartHospitalState>)

  appConfig = toSignal(
    this.store.select(selectAppConfig),
    { initialValue: null }
  );

  ngOnInit(): void {
    this.store.dispatch(fetchAppConfig())
  }
  protected readonly title = signal('medical-multitenant-platform');
}
