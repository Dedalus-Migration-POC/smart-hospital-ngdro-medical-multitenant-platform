import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { InputErrorComponent } from '../input-error/input-error.component';

@Component({
  selector: 'app-input-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputErrorComponent,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() fieldName!: string | number | null;
  @Input() label!: string;
  @Input() type?: string = 'text';
  @Input() minlength?: number;
  @Input() maxlength?: number;

  constructor() {}

  ngOnInit(): void {}
}
