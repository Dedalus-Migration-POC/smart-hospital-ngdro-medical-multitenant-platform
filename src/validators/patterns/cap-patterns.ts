import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class CapPatterns {
  //il cap italiano è un numero composta da 5 cifre
  public CAP = /^\d{5}$/

  constructor() {}
}
