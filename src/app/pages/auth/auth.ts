import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmartHospitalState } from '../../store/reducers';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { Store } from '@ngrx/store';
import { AreasLayout } from '../../shared/layout-system/components/areas-layout/areas-layout';

@Component({
  selector: 'app-auth',
  imports: [AreasLayout],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private pageConfigService = inject(PageConfigService);

  readonly authConfig = toSignal(this.pageConfigService.get('/login'), { initialValue: null });
}
