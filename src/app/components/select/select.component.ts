import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-select-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputErrorComponent,
  ],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() fieldName: string = '';
  @Input() label!: string;
  @Input() options: { value: string; label: string }[] = [];
  @Input() type?: string = 'text';

  constructor() {}

  ngOnInit(): void {}
  focusNext() {
    // @ts-ignore
    document.querySelector('#label-focus')!.setAttribute('class', 'active');
  }
}
