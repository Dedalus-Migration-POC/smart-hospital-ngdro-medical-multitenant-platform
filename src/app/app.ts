import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { SmartHospitalState } from './store/reducers';
import { selectAppConfig } from './initialize/state/selector';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Header } from './layout/header/header';
import { Footer } from "./layout/footer/footer";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [CommonModule, Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private store = inject(Store<SmartHospitalState>);
  protected readonly title = signal('medical-multitenant-platform');

  readonly appConfig = toSignal(this.store.select(selectAppConfig), { initialValue: null });
}
