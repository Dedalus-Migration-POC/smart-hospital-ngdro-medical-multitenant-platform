# Appuntamenti A4H: hint e azioni

Questa pagina descrive il comportamento implementato nella lista e nel dettaglio degli appuntamenti. Le condizioni sono calcolate in `appointment.utils.ts`; la lista passa il codice dell'hint alla `valueMap` del field finale della card, configurata in `booking-a4h-appointments.json`.

## Regole temporali

Il valore `checkInHours` proviene dalla configurazione remota (default: 24 ore).

- Un appuntamento e nella finestra di accettazione se cade nello stesso giorno di calendario e l'ora corrente e successiva a `scheduledOn - checkInHours`. Il confronto con l'inizio finestra e stretto: all'istante esatto non e ancora nella finestra.
- `canCheckIn` e vero solo con `checkInStatus === 'TO_DO'` e appuntamento nella finestra.
- `isEditableOrCancellable` e vero solo se ci sono `serviceIds`, il pagamento non e `PAID` e l'ora corrente precede `scheduledOn - checkInHours`.
- La condizione di modifica/cancellazione e calcolata dal frontend: non usa i campi backend `editable` e `cancellable`.

## Codici hint

La lista chiama `checkInHintCode(appointment, checkInHours)` senza `detailsMode`.

| Codice                       | Condizione nella lista                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `TOO-EARLY`                  | `lockCause === 'too-early'` e appuntamento non `DONE`. Il testo include `checkInHours`.          |
| `TO-PAY`                     | `lockCause === 'to-pay'`, appuntamento non `DONE` e appuntamento nella finestra di accettazione. |
| `PRIVACY`                    | `lockCause === 'privacy'` e appuntamento non `DONE`.                                             |
| `MOBILE-PAYMENT-NOT-ALLOWED` | `lockCause === 'mobile-payment-not-allowed'` e appuntamento non `DONE`.                          |
| `USER-NOT-VERIFIED`          | `lockCause === 'user-not-verified'` e appuntamento non `DONE`.                                   |
| `TOO-LATE`                   | `lockCause === 'too-late'` e appuntamento non `DONE`.                                            |
| `UNKNOWN`                    | `lockCause === 'unknown'`, oppure causa non riconosciuta, e appuntamento non `DONE`.             |
| Nessun codice                | Stato `DONE`, `lockCause` assente, oppure `lockCause === 'to-pay'` fuori dalla finestra.         |

Il codice viene convertito nel messaggio localizzato dalla `valueMap` del field `hint` in `booking-a4h-appointments.json`. Il field e l'ultimo della card e non viene renderizzato quando il codice e `null`/vuoto. I testi sono quindi indipendenti dalle azioni: visualizzare un hint non nasconde da solo un pulsante.

## Azioni nella lista

La lista mostra le schede con stato `TO_DO`, `TO_PAY` e `NOT_ALLOWED`; la scheda `DONE` e nella tab “Accettazione online”. La stessa configurazione delle azioni e applicata a entrambe le tab.

| Azione       | Visibilita                                                                  | Abilitazione                                                                                        |
| ------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Dettagli     | Sempre visibile                                                             | Disabilitata quando `busy === true`.                                                                |
| Accettazione | Nascosta solo quando `lockCause === 'to-pay'`. Negli altri casi e visibile. | Disabilitata quando `busy`, quando `lockCause === 'too-early'`, oppure quando `canCheckIn` e falso. |
| Pagamento    | Visibile solo quando `lockCause === 'to-pay'`.                              | Non ha una condizione `disabledIf` nella configurazione.                                            |

Conseguenze per i casi comuni:

1. **Da pagare, nella finestra** (`to-pay`): hint `TO-PAY`, Accettazione nascosta, Pagamento visibile.
2. **Da pagare, fuori dalla finestra** (`to-pay`): nessun hint, Accettazione nascosta, Pagamento visibile.
3. **Troppo presto** (`too-early`): hint `TOO-EARLY`, Accettazione visibile ma disabilitata, Pagamento nascosto.
4. **Causa diversa da `to-pay`/`too-early`**: hint corrispondente (o `UNKNOWN`); Accettazione e visibile e viene disabilitata secondo la formula sopra; Pagamento nascosto.
5. **`TO_DO`, nella finestra, senza `lockCause`**: nessun hint, Accettazione abilitata se non `busy`, Pagamento nascosto.
6. **`DONE`**: nessun hint e `canCheckIn` falso, quindi Accettazione disabilitata se visibile. Se il backend lascia `lockCause === 'to-pay'`, la configurazione mostra comunque Pagamento e nasconde Accettazione anche nella tab “Accettazione online”.

La formula di `checkInDisabled` non esclude esplicitamente le altre cause. Quindi un appuntamento `TO_DO`, nella finestra e con `lockCause` diverso da `too-early`/`to-pay` puo avere l'Accettazione abilitata anche mentre mostra un hint, purche non sia `busy`. Questo e il comportamento corrente.

## Hint e pulsanti nel dettaglio

Il componente di dettaglio chiama `checkInHint(..., true)` e ha condizioni proprie:

- Stato `DONE` o `lockCause` assente: nessun hint.
- `lockCause === 'to-pay'`: nessun hint nel dettaglio, indipendentemente dalla finestra.
- Qualsiasi altra causa: hint `NOT-EDITABLE` se `isEditableOrCancellable` e falso; nessun hint se e vero.
- Il dettaglio visualizza il testo del hint tramite le traduzioni i18n. `NOT-EDITABLE` e quindi un codice del percorso dettaglio, non prodotto normalmente dal calcolo della lista.

| Controllo nel dettaglio    | Visibilita                               | Abilitazione                                                                 |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| Modifica                   | Nascosta per `DONE`; altrimenti visibile | Disabilitata se `isEditableOrCancellable` e falso o se `busy`.               |
| Cancella                   | Nascosta per `DONE`; altrimenti visibile | Disabilitata se `isEditableOrCancellable` e falso o se `busy`.               |
| Procedi con l'accettazione | Nascosta per `DONE`; altrimenti visibile | Disabilitata se lo stato non e `TO_DO`, se `canCheckIn` e falso o se `busy`. |
| Pagamento                  | Non e presente come azione nel dettaglio | —                                                                            |

Il link “Indietro” resta visibile; durante una richiesta di accettazione riceve la classe CSS `disabled`, ma non un attributo nativo `disabled`.

## Nota sui dati

`paymentStatus` determina l'etichetta Pagata/Da pagare, ma la visibilita dell'azione Pagamento dipende da `lockCause === 'to-pay'`, non direttamente da `paymentStatus`. Le combinazioni incoerenti restituite dal backend (per esempio `DONE` con `lockCause: 'to-pay'`) seguono comunque le condizioni descritte sopra.
