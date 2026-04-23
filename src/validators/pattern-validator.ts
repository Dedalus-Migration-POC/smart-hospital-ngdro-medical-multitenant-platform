import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

/**
 * @deprecated  USE NgxFormValidators.patternValidator(regex: RegExp, error: ValidationErrors)  INSTEAD
 * @param regex
 * @param error
 * @constructor
 */
export function PatternValidator(
  regex: RegExp,
  error: ValidationErrors,
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      // se il controllo è vuoto non restituisce alcun errore
      return null
    }
    // verifica il valore del controllo, rispetto l'input fornito
    const valid = regex.test(control.value)
    // se vero, non restituisce alcun (errore), altrimenti restituisce l'errore passato nel secondo parametro
    return valid ? null : error
  }
}
