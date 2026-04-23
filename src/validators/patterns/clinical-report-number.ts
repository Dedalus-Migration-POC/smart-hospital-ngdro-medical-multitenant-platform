import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class ClinicalReportsNumber {
  public VALID_NUMBER = /^\d{10}$/

  constructor() {}
}
