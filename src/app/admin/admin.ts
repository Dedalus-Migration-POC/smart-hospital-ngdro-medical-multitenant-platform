import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ItNotificationsComponent } from 'design-angular-kit';
import { AdminState } from './store/reducers';
import { CommonModule } from '@angular/common';
import { Header } from "./components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItNotificationsComponent, CommonModule, Header],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AppAdmin {
  private store = inject(Store<AdminState>);
  protected readonly title = signal('ADMIN - medical-multitenant-platform');


}
