import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule } from 'design-angular-kit'

@Component({
  selector: 'app-input-error-component',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent implements OnInit {
  @Input() formGroup!: FormGroup
  @Input() fieldName!: string | number | null

  constructor() {}

  ngOnInit(): void {}
}
