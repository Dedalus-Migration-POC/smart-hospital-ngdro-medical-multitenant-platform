import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DesignAngularKitModule } from 'design-angular-kit';

// component popup (app-alert-fixed) si trova nell'app.html. Non c è bisogno di aggiungerlo nel template di ogni pagina, basta configurare in pageConfig

@Component({
  selector: 'app-alert-fixed',
  standalone: true,
  template: `
    <div class="alert alert-{{ type }} alert-dismissible fade show alert-custom" role="alert">
      <h4 class="alert-heading">
        {{ title }}
      </h4>
      <p>
        {{ text }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Chiudi avviso"
          tabindex="0"
        >
          <svg class="icon" aria-hidden="true">
            <use href="/bootstrap-italia/dist/svg/sprites.svg#it-close"></use>
          </svg>
        </button>
      </p>
    </div>
  `,
  imports: [CommonModule, DesignAngularKitModule],
  styleUrls: ['./alert-fixed.component.scss'],
})
export class AlertFixedComponent implements OnInit {
  @Input() type: 'primary' | 'info' | 'success' | 'warning' | 'danger' = 'warning';
  @Input() title?: string;
  @Input() text?: string;
  constructor() {}

  ngOnInit(): void {}
}
