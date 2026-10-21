# Manuale di configurazione delle card

Questa guida spiega come configurare le card nei JSON delle pagine. Nel progetto esistono due tipi: `mediaText`, per contenuti statici cliccabili, e `data`, per mostrare informazioni ricevute dai servizi dell'applicazione.

## Dove si configurano

Le card non sono un file autonomo: si trovano nel JSON della pagina, dentro `sections`, in una delle aree `start`, `center` o `end`, come elemento di tipo `SERVICE_CARDS`.

- La home (`/`) usa `src/assets/json-config/cms/pages/home.json`.
- Le altre pagine usano `src/assets/json-config/default/pages/`; le barre del percorso diventano trattini nel nome del file. Per esempio `/payments-pa` corrisponde a `payments-pa.json`.

Esempio della struttura in cui inserire una card:

```json
{
  "id": "servizi-section",
  "areas": {
    "center": {
      "items": [
        {
          "id": "service-cards",
          "type": "SERVICE_CARDS",
          "enabled": true,
          "props": {
            "items": []
          }
        }
      ]
    }
  }
}
```

Questo è solo un frammento: va inserito nella sezione corrispondente del JSON di pagina, mantenendo le altre proprietà già presenti. L'item `SERVICE_CARDS` deve avere `id`, `type`, `enabled` e `props`.

## Contenitore delle card

Dentro `props` si configurano la raccolta e le impostazioni comuni:

| Proprietà                 | Uso                                                                                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`                   | Elenco delle card da mostrare. È obbligatorio e deve contenere almeno una card.                                                                                      |
| `id`                      | Identificativo facoltativo del contenitore.                                                                                                                          |
| `className`               | Classe CSS facoltativa già prevista dagli stili del progetto.                                                                                                        |
| `ariaLabel`               | Testo accessibile o chiave di traduzione del contenitore.                                                                                                            |
| `header`                  | Titolo e sottotitolo facoltativi sopra le card: `title` obbligatorio se si imposta `header`, `subTitle` facoltativo. Entrambi hanno la forma `{ "text": "chiave" }`. |
| `containerLayout`         | Disposizione del titolo e dell'elenco delle card.                                                                                                                    |
| `itemsLayout`             | Disposizione comune del contenuto interno di ogni card. Non è possibile impostare un layout diverso per ciascuna card dello stesso contenitore.                      |
| `itemColBootstrapClasses` | Larghezza responsiva condivisa da tutte le card. Vedere gli esempi sotto.                                                                                            |
| `actionsLayout`           | Disposizione comune delle azioni delle card `data`.                                                                                                                  |
| `margin`, `padding`       | Spazio esterno e interno del contenitore. Usare oggetti di spaziatura, non classi come `mb-3`.                                                                       |

Esempio:

```json
"props": {
  "id": "servizi-home",
  "ariaLabel": "home.services.aria-label",
  "header": {
    "title": { "text": "home.services.title" },
    "subTitle": { "text": "home.services.subtitle" }
  },
  "itemColBootstrapClasses": "col-12 col-md-6 col-xl-4",
  "itemsLayout": {
    "direction": "column",
    "align": "start",
    "gap": "gap-2"
  },
  "items": []
}
```

### Disposizione responsive

`itemColBootstrapClasses` stabilisce quante card appaiono per riga sui diversi schermi. Si possono riutilizzare questi valori senza conoscere le regole Bootstrap:

| Valore                     | Risultato                                                                   |
| -------------------------- | --------------------------------------------------------------------------- |
| `col-12`                   | Una card per riga su tutti gli schermi.                                     |
| `col-12 col-md-6`          | Una card per riga su telefono, due per riga su schermi medi e più grandi.   |
| `col-12 col-md-6 col-xl-4` | Una per riga su telefono, due su schermi medi, tre su schermi molto larghi. |

Se non è specificato, la larghezza può essere ereditata dal tema generale delle card. I valori devono essere stringhe e sono condivisi dall'intero contenitore.

### Proprietà di layout

In `containerLayout`, `itemsLayout` e `actionsLayout` sono disponibili:

| Proprietà        | Valori                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `direction`      | `row`, `column`, `row-reverse`, `column-reverse`.                                         |
| `align`          | `start`, `center`, `end`, `baseline`, `stretch`, `self-start`, `self-end`, `self-center`. |
| `justify`        | `start`, `center`, `end`, `between`, `around`, `evenly`.                                  |
| `wrap`           | `wrap`, `nowrap`, `reverse`.                                                              |
| `gap`            | `gap-0`, `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`.                                     |
| `grow`, `shrink` | `grow-0`/`grow-1` e `shrink-0`/`shrink-1`.                                                |

### Larghezza del contenitore immagine

Solo in `itemsLayout` è disponibile anche `imageContainerWidth`, applicata alle card `mediaText` del contenitore. Non va inserita nelle singole card né dentro `image`, `containerLayout` o `actionsLayout`.

Esempio di frammento da inserire in `props` per affiancare immagine e testo:

```json
{
  "itemsLayout": {
    "direction": "row",
    "align": "center",
    "imageContainerWidth": "auto",
    "gap": "gap-3"
  }
}
```

- `"auto"`: il contenitore segue la larghezza dell'immagine.
- `"80px"`, `"40%"` o altre dimensioni CSS: imposta una larghezza esplicita del contenitore.
- Proprietà assente: mantiene il layout precedente, con il contenitore immagine a larghezza piena prima della distribuzione flex. Non è necessario modificare le card della home.

Con `direction: "row"` e una larghezza configurata, il testo occupa lo spazio restante. Con `direction: "column"`, il testo resta a larghezza piena. La proprietà non modifica le dimensioni dell'immagine: per quelle usare `image.width` e `image.height` sulle singole card.

## Proprietà comuni a ogni card

Ogni card ha `id` e `type`. L'`id` deve essere univoco nel contenitore. Le proprietà comuni sono:

| Proprietà    | Significato                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `background` | Sfondo: oggetto con `fill.palette`, `fill.hex` oppure `gradient`.                                            |
| `border`     | Bordo con `width`, `style`, `color` e `radius`.                                                              |
| `shadow`     | Ombra CSS, per esempio `"0 2px 8px rgba(0, 0, 0, 0.15)"`.                                                    |
| `padding`    | Spaziatura interna con `all`, `x`, `y`, `top`, `right`, `bottom` e `left`. Valori CSS, per esempio `"1rem"`. |
| `size`       | Dimensioni con `basis`, `width`, `height`, `minWidth` e `minHeight`.                                         |
| `className`  | Classe CSS facoltativa prevista dagli stili del progetto.                                                    |
| `ariaLabel`  | Etichetta accessibile o chiave di traduzione.                                                                |

Per `background`, usare per esempio `{ "fill": { "palette": "light" } }` o `{ "fill": { "hex": "#ffffff" } }`. Le palette disponibili sono `white`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark` e `black`.

Per le distanze, non usare stringhe di classi come `"mb-2"`: impostare un oggetto, per esempio `"margin": { "bottom": "0.5rem" }`. Le proprietà `margin` e `color` presenti su alcuni campi di `data` non sono tutte applicate dal renderer; per il colore del valore usare `valueStyle.color`.

Gli stili specifici della card prevalgono sul tema condiviso. Le proprietà mancanti vengono ereditate dal tema generale.

## Card `mediaText`: contenuto statico

Usare `mediaText` quando testo e immagine sono definiti direttamente nel JSON e l'intera card deve portare a una pagina, aprire un link, mostrare un messaggio o eseguire una callback assegnata dal componente.

```json
{
  "id": "servizio-referti",
  "type": "mediaText",
  "ariaLabel": "home.services.reports.aria-label",
  "text": {
    "title": { "text": "home.services.reports.title" },
    "subTitle": { "text": "home.services.reports.subtitle" }
  },
  "image": {
    "type": "url",
    "value": "/assets/images/referti.png",
    "decorative": true
  },
  "action": {
    "type": "route",
    "url": "/medical-reports"
  }
}
```

Campi specifici:

- `text.title`: obbligatorio; oggetto con `text` e, facoltativamente, stile testuale.
- `text.subTitle`: facoltativo, con la stessa forma.
- `image`: obbligatoria; `type` può essere `url`, `file`, `inlineSvg` o `base64`; `value` contiene il percorso, l'URL o il contenuto. `decorative` è obbligatorio. Si possono aggiungere `alt`, `ariaLabel`, `width`, `height`, `tooltip`, `margin` e `padding`.
- `action`: obbligatoria nel modello. `type` può essere `route`, `externalLink`, `comingSoon` o `callback`.
- `blocked`: facoltativo; mostra un'icona a forma di lucchetto, ma **non disabilita il click** né blocca l'azione.

Per `action`:

| Tipo           | Proprietà                          | Comportamento                                                                                   |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `route`        | `url`                              | Naviga a una route interna, per esempio `/medical-reports`.                                     |
| `externalLink` | `url`, `target` facoltativo        | Apre un indirizzo esterno; `target` predefinito è `_blank`.                                     |
| `comingSoon`   | `comingSoonMessage` facoltativo    | Mostra una notifica. Il messaggio può avere `title` e `subTitle`, ciascuno con `text`.          |
| `callback`     | `callback` assegnata in TypeScript | Esegue la funzione al click sulla card. Senza funzione associata, non esegue alcuna operazione. |

Il contenuto `text.title.text` e `text.subTitle.text` viene trattato come chiave di traduzione. Le chiavi devono essere disponibili in italiano e inglese.

### Callback delle card `mediaText`

Nel JSON, impostare `action` così:

```json
{
  "type": "callback"
}
```

Le funzioni non sono serializzabili in JSON: il componente della pagina deve assegnare `action.callback` prima di passare la configurazione ad `app-card`. La firma è `() => void`; eventuali parametri vanno catturati dalla funzione.

Esempio TypeScript, con `card` di tipo `MediaTextCard`, per collegare una card al flusso SSN senza modificare la configurazione originale:

```typescript
const cardConCallback: MediaTextCard = {
  ...card,
  action: {
    ...card.action,
    type: 'callback',
    callback: () => this.onCardClick(BookingType.Ssn),
  },
};
```

La pagina `/booking-a4h` usa questo schema: recupera l'item `SERVICE_CARDS` con ID `booking-type-cards` dal pageConfig e associa il callback usando l'ID di ciascuna card. Gli ID riconosciuti dal selettore sono `booking-with-ssn`, `booking-no-doctor-select`, `booking-with-doctor-select` e `physicians`. Testi, immagini, ordine e `itemsLayout` restano definiti in `src/assets/json-config/default/pages/booking-a4h.json`; la selezione della struttura e l'avvio del flusso restano responsabilità del componente.

## Card `data`: contenuto dai dati dell'applicazione

Usare `data` quando titolo, campi e azioni devono essere riempiti con dati ricevuti da un servizio, per esempio il dettaglio di un appuntamento o di un pagamento. La card legge proprietà dell'oggetto ricevuto: i nomi in `key` devono quindi corrispondere ai dati effettivamente forniti dalla pagina.

Esempio semplificato:

```json
{
  "id": "scheda-appuntamento",
  "type": "data",
  "titleSubtitle": {
    "title": {
      "key": "description",
      "fontSize": "lg",
      "fontWeight": "bold",
      "fallbackText": "appuntamento.senza-descrizione"
    },
    "subTitle": {
      "key": "state",
      "valueMap": {
        "BOOKED": "appuntamento.stato.prenotato",
        "CANCELLED": "appuntamento.stato.annullato"
      }
    }
  },
  "fields": [
    {
      "key": "scheduledOn",
      "type": "date",
      "format": "dd/MM/yyyy HH:mm",
      "label": { "text": "appuntamento.data" }
    },
    {
      "key": "location.name",
      "type": "text",
      "label": { "text": "appuntamento.sede" },
      "valueStyle": { "fontWeight": "semibold" }
    }
  ]
}
```

### Titolo e sottotitolo dinamici

`titleSubtitle.title` è obbligatorio; `subTitle` è facoltativo. Entrambi leggono un valore dal dato della card:

- `key`: percorso del valore, anche annidato, per esempio `location.name`.
- `fallbackText`: chiave di traduzione mostrata se il valore è assente o vuoto.
- `fontSize`, `fontWeight`, `color`, `lineHeight`, `className`, `margin`: stile del testo.
- `itemKey`: se `key` indica un array di oggetti, seleziona la proprietà da mostrare in ciascun elemento.
- `itemValue`: in un array, compone il testo leggendo uno o più percorsi da ogni oggetto.
- `joinWith`: separatore tra valori di un array; predefinito `" / "`.
- `valueMap`: disponibile sul sottotitolo; converte un codice ricevuto dal servizio in una chiave di traduzione.
- `imageBlockConfig`: immagine facoltativa visualizzata accanto al titolo.

### Campi informativi

`fields` è un array; ogni campo richiede `type` e `label`. `label` è un oggetto `{ "text": "chiave.di.traduzione" }`.

Proprietà comuni:

| Proprietà             | Significato                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`                 | Percorso nel dato, per esempio `amount` o `location.name`. Può essere omesso se si usa `value` o `itemValue`.                                                |
| `value`               | Compone un valore leggendo più percorsi dall'oggetto della card.                                                                                             |
| `itemValue`           | Compone un valore usando più percorsi da un oggetto individuato da `key`, oppure dall'oggetto della card.                                                    |
| `valueStyle`          | Stile del valore, per esempio `fontSize`, `fontWeight`, `color` e `lineHeight`.                                                                              |
| `prefix`, `suffix`    | Testo da aggiungere prima o dopo il valore, per esempio `"€ "` o `" kg"`.                                                                                    |
| `rowSize`             | Larghezze `key` e `value`, per esempio `{ "key": { "basis": "40%" }, "value": { "basis": "60%" } }`; viene applicato quando `itemsLayout.direction` è `row`. |
| `hideIfEmpty`         | Nasconde il campo se il valore è `null`, assente o stringa vuota.                                                                                            |
| `margin`, `className` | Spaziatura o classe facoltative. Per `margin` usare un oggetto, per esempio `{ "bottom": "8px" }`.                                                           |

`value` e `itemValue` hanno questa forma:

```json
{
  "paths": ["firstName", "lastName"],
  "separator": " ",
  "fallbackText": "utente.sconosciuto"
}
```

Il componente mostra `-` quando non riesce a trovare un valore, salvo un `fallbackText` configurato. `hideIfEmpty` non nasconde gli array vuoti.

Tipi di campo:

| `type`  | Proprietà specifiche                | Risultato                                                                                                                                     |
| ------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`  | `valueMap`                          | Testo; `valueMap` associa un valore ricevuto a un oggetto `{ "text": "chiave.di.traduzione" }`.                                               |
| `date`  | `format`                            | Data formattata con `date-fns`; esempio `dd/MM/yyyy HH:mm`. Se omesso, viene usato il formato breve locale.                                   |
| `array` | `itemKey`, `itemValue`, `listStyle` | Elenco; `listStyle` è `comma`, `dash` o `bullet` (predefinito `dash`).                                                                        |
| `image` | `imageMap`, `fallbackImage`         | Immagine scelta in base al valore ricevuto; `fallbackImage` è usata quando non c'è una corrispondenza.                                        |
| `badge` | `badgeMap`, `fallbackBadge`         | Etichetta colorata scelta in base al valore ricevuto; le voci sono oggetti con `text` e possono includere `color`, `fontSize` e `fontWeight`. |

Esempio di `valueMap` per un campo di testo:

```json
"valueMap": {
  "PAID": { "text": "pagamento.stato.pagato" },
  "TO_PAY": { "text": "pagamento.stato.da-pagare" }
}
```

Esempio di immagini associate a valori:

```json
"imageMap": {
  "PagoPA": {
    "type": "url",
    "value": "/assets/images/logo_pagoPa.png",
    "decorative": true
  }
}
```

## Azioni delle card `data`

`actions` è facoltativo. Ogni azione richiede `key`, `type`, `renderAs` e `label`:

- `key`: identificativo univoco dell'azione nella card.
- `type`: `route`, `externalLink` o `callback`.
- `renderAs`: `button` o `link`.
- `label`: oggetto `{ "text": "chiave.di.traduzione" }`; il testo può contenere segnaposto come `{{id}}` che vengono sostituiti con valori del dato della card.
- `disabled`: disabilita il controllo quando è `true`.
- `disabledIf`: disabilita l'azione se tutte le condizioni indicate sono vere.
- `hideIf`: nasconde l'azione se tutte le condizioni indicate sono vere.
- `hideMessage`: testo facoltativo mostrato al posto dell'azione quando è nascosta.

Esempio di navigazione interna dinamica:

```json
{
  "key": "details",
  "type": "route",
  "url": "/appointments/:appointmentId",
  "routeParams": {
    "appointmentId": "id"
  },
  "renderAs": "link",
  "mode": "bootstrap",
  "palette": "primary",
  "label": { "text": "appuntamento.dettagli" }
}
```

Per il tipo `route` usare `url`; si possono aggiungere `routeParams` (parametri nel percorso), `queryParams` (valori fissi) e `queryParamsFromData` (valori letti dal dato). Per `externalLink`, usare `url` e, facoltativamente, `target`. Per `callback`, usare `callback.nameFunction` e `callback.params`, per esempio:

```json
"callback": {
  "nameFunction": "goDetail",
  "params": ["id"]
}
```

Una callback deve corrispondere a un metodo esposto dalla pagina che prepara le card; il JSON da solo non può creare una nuova funzione.

Le condizioni (`disabledIf` e `hideIf`) sono oggetti con `key`, `operator` e, quando serve, `value`. `key` è un percorso nel dato della card. Gli operatori ammessi sono `eq`, `neq`, `in`, `notIn`, `exists`, `notExists`, `empty` e `notEmpty`.

Per esempio, nascondere l'azione se il pagamento è già saldato:

```json
"hideIf": [
  { "key": "state", "operator": "eq", "value": "PAID" }
]
```

Per uno stile coerente usare `renderAs: "button"` con proprietà del pulsante (`mode`, `palette`, `outline`, `icon`, `padding`, `size`) oppure `renderAs: "link"` con `mode`, `palette`, `icon` e `textStyle`. `mode: "bootstrap"` è la scelta consigliata; la modalità `custom` non è completamente supportata.

**Nota sulle azioni:** le pagine devono preparare i dati e compilare le azioni prima di passare le card al componente. Se si aggiunge un'azione a un JSON di una pagina che non esegue questa preparazione, l'azione potrebbe non funzionare. Per i callback, riutilizzare un esempio della stessa pagina o far verificare il collegamento a chi mantiene il codice.

## Stili e traduzioni

I testi di titoli, sottotitoli, etichette, badge e azioni sono normalmente chiavi di traduzione. Aggiungere ogni nuova chiave sia in `src/assets/i18n/it.json` sia in `src/assets/i18n/en.json`.

Per il testo sono disponibili `fontSize` (`sm`, `md`, `lg`, `xl`, `xxl` oppure misura CSS), `fontWeight` (`normal`, `semibold`, `bold`), `color` (palette o esadecimale), `lineHeight`, `textTransform`, `textDecoration`, `margin` e `padding`.

Per bordi usare `width`, `style`, `color` e `radius`. Gli stili specifici impostati nella card prevalgono sul tema condiviso; quelli non specificati vengono ereditati.

## Attenzioni e controlli

- Non usare `background: "white"`: usare un oggetto come `{ "fill": { "palette": "white" } }`.
- Non usare `margin: "mb-2"`: usare un oggetto come `{ "bottom": "0.5rem" }`.
- `blocked: true` mostra il lucchetto sulle card `mediaText`, ma l'azione resta attiva.
- `disabled` esiste nel modello comune della card, ma il renderer attuale non lo usa per disabilitare la card. Per disabilitare un'azione `data`, usare `disabled` sull'azione o `disabledIf`.
- Per una card statica scegliere `mediaText`; `data` è pensata per record forniti dalla pagina e non per inserire direttamente valori statici nel JSON.
- Verificare che il file sia JSON valido, gli identificativi siano univoci, i percorsi `key` esistano nei dati e le traduzioni siano disponibili in entrambe le lingue.
- Controllare la resa su telefono e desktop, soprattutto se si cambiano larghezze, immagini o quantità di campi.
