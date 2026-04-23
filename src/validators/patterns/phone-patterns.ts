import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class PhonePatterns {
  public MOBILE =
    /^(\+39)?(3[0-9][0-9]|34[7-90]|36[680]|33[3-90]|32[89])\d{6,7}$/ // i numeri di telefono vecchi erano a 6 cifre

  constructor() {}
}
