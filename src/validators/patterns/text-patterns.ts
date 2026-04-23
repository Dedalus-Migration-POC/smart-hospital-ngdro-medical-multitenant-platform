import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class TextPatterns {
  //campo di testo
  public TEXT = /[a-z]/i

  constructor() {}
}
