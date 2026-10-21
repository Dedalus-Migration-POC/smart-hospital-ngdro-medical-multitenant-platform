# Manuale di configurazione del breadcrumb

Il breadcrumb è la barra che mostra il percorso della pagina, per esempio `Home / Prenotazioni`, insieme al titolo e, facoltativamente, a un sottotitolo e a un pulsante. Si configura nel JSON della pagina: non è necessario scrivere HTML o classi Bootstrap.

## Quale file modificare

La configurazione del breadcrumb si trova dentro la proprietà `breadcrumb` del JSON della pagina.

- Per la home (`/`), il progetto carica `src/assets/json-config/cms/pages/home.json`.
- Per le altre pagine, carica `src/assets/json-config/default/pages/`. Le barre del percorso diventano trattini nel nome del file: per esempio, `/booking-a4h/appointments` corrisponde a `booking-a4h-appointments.json`.

Quando si modifica il breadcrumb di una pagina, controllare che si stia intervenendo sul file effettivamente caricato per quella route.

## Esempio completo

Questo esempio mostra un breadcrumb semplice, senza pulsante:

```json
{
  "breadcrumb": {
    "title": {
      "text": "prenotazioni.breadcrumb.title"
    },
    "subTitle": {
      "text": "prenotazioni.breadcrumb.subtitle"
    },
    "items": [
      {
        "name": "common.home",
        "routerLink": "/"
      },
      {
        "name": "prenotazioni.breadcrumb.current"
      }
    ]
  }
}
```

Le chiavi come `prenotazioni.breadcrumb.title` sono esempi: vanno aggiunte ai file di traduzione italiani e inglesi, oppure sostituite con chiavi già esistenti. Il `breadcrumb` è solo una parte del JSON di pagina; nel file reale rimangono anche le altre proprietà, per esempio `id`, `name`, `route` e `sections`.

## Proprietà principali

| Proprietà             | Obbligatoria | Significato                                                                                          |
| --------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `title`               | Sì           | Titolo principale, mostrato come intestazione della pagina. È un oggetto con `text`.                 |
| `subTitle`            | No           | Testo sotto al titolo; anche questo è un oggetto con `text`.                                         |
| `items`               | Sì           | Elenco delle voci del percorso. L'ultima voce rappresenta la pagina corrente.                        |
| `interpolationParams` | No           | Valori da inserire nei testi tradotti quando contengono segnaposto.                                  |
| `button`              | No           | Configurazione di un pulsante accanto al titolo. La sua azione va collegata dalla pagina nel codice. |
| `itemsStyle`          | No           | Stile delle voci cliccabili del percorso.                                                            |
| `activeItemStyle`     | No           | Stile della voce finale, cioè la pagina corrente.                                                    |
| `titleStyle`          | No           | Stile del titolo.                                                                                    |
| `subTitleStyle`       | No           | Stile del sottotitolo.                                                                               |
| `containerStyle`      | No           | Sfondo e spaziatura dell'intero breadcrumb, inclusi titolo e pulsante.                               |
| `itemsContainerStyle` | No           | Sfondo e spaziatura della sola riga con le voci del percorso.                                        |

## Voci del percorso

Ogni elemento di `items` può avere:

| Proprietà     | Significato                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `name`        | Testo o chiave di traduzione da mostrare. Inserirlo sempre.                                        |
| `routerLink`  | Percorso interno dell'applicazione, per esempio `/` o `/bookings`.                                 |
| `queryParams` | Parametri facoltativi da aggiungere al link, come `{"id":"123"}`. I valori devono essere stringhe. |

Tutte le voci tranne l'ultima sono link cliccabili. L'ultima è mostrata come testo della pagina corrente: `routerLink` e `queryParams` dell'ultima voce non vengono usati. Il separatore `/` è inserito automaticamente e non è configurabile.

Esempio con tre livelli:

```json
"items": [
  { "name": "common.home", "routerLink": "/" },
  { "name": "prenotazioni.breadcrumb.list", "routerLink": "/bookings" },
  { "name": "prenotazioni.breadcrumb.current" }
]
```

I nomi devono essere distinti per le voci dello stesso breadcrumb: il componente li usa per identificare le righe durante l'aggiornamento della pagina.

## Titolo, sottotitolo e traduzioni

`title` e `subTitle` hanno la forma `{ "text": "chiave.di.traduzione" }`. Il componente traduce questi valori, come fa con i nomi delle voci. Aggiungere le chiavi ai file `src/assets/i18n/it.json` e `src/assets/i18n/en.json` se si desidera visualizzare il testo in entrambe le lingue.

Per inserire valori variabili, usare un segnaposto nel testo tradotto e dichiararlo in `interpolationParams`:

```json
"title": {
  "text": "prenotazione.breadcrumb.title"
},
"interpolationParams": {
  "nome": "prenotazione.paziente.nome"
}
```

La traduzione `prenotazione.breadcrumb.title` può contenere `{{nome}}`, per esempio `Prenotazione di {{nome}}`. Il valore indicato in `interpolationParams` viene a sua volta cercato come chiave di traduzione.

## Stili senza scrivere CSS

Se uno stile non è indicato nella pagina, il breadcrumb eredita quello generale configurato in `src/assets/json-config/cms/config/theme.json`, nella sezione `breadcrumb`. Le proprietà specificate nel JSON della pagina sovrascrivono quelle del tema; si possono quindi cambiare solo i dettagli necessari.

Esempio: rendere blu e semibold le voci cliccabili e impostare uno sfondo chiaro sull'intera area:

```json
"itemsStyle": {
  "color": { "palette": "primary" },
  "fontWeight": "semibold",
  "fontSize": "md"
},
"containerStyle": {
  "background": { "fill": { "hex": "#f2f4f6" } },
  "padding": { "y": "24px" }
}
```

Le proprietà disponibili per `itemsStyle`, `activeItemStyle`, `titleStyle` e `subTitleStyle` sono:

| Proprietà           | Valori ed esempi                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `fontSize`          | `sm`, `md`, `lg`, `xl`, `xxl`, oppure una misura CSS come `18px`.                               |
| `fontWeight`        | `normal`, `semibold`, `bold`.                                                                   |
| `color`             | Oggetto con `palette` o `hex`, per esempio `{ "palette": "primary" }` o `{ "hex": "#333333" }`. |
| `lineHeight`        | `sm`, `md`, `lg`, `xl`, `xxl`, oppure una misura CSS.                                           |
| `textTransform`     | `uppercase`, `lowercase`, `capitalize`.                                                         |
| `textDecoration`    | `none`, `underline`, `overline`.                                                                |
| `margin`, `padding` | Spaziatura descritta sotto.                                                                     |

Le palette disponibili sono `white`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark` e `black`.

Le proprietà di `containerStyle` e `itemsContainerStyle` sono:

- `background`: `fill` con `palette` o `hex`, oppure `gradient` con una stringa CSS.
- `margin` e `padding`: spaziatura con valori CSS stringa.

Per `margin` e `padding` sono ammessi `all`, `x`, `y`, `top`, `right`, `bottom` e `left`. Per esempio, `{"y":"16px","left":"8px"}` imposta 16 pixel sopra e sotto e 8 pixel a sinistra.

Per lo sfondo dell'intero breadcrumb (`containerStyle`), usare un colore esadecimale (`hex`) o un gradiente CSS: una palette in quel punto non viene applicata dal componente. Per la riga delle voci (`itemsContainerStyle`) sono supportati sia `hex` sia i nomi di palette.

## Pulsante opzionale

Il pulsante si configura con `button`. Il testo è obbligatorio; gli altri campi sono facoltativi:

```json
"button": {
  "text": {
    "text": "prenotazioni.breadcrumb.new"
  },
  "mode": "bootstrap",
  "palette": "primary",
  "outline": false,
  "whiteSpace": "nowrap"
}
```

Campi utili:

- `text.text`: testo o chiave di traduzione.
- `mode`: usare `bootstrap` (è anche il valore predefinito). La modalità `custom` non è completamente supportata.
- `palette`: una palette tra quelle elencate sopra.
- `outline`: `true` per lo stile outline, `false` per quello pieno.
- `disabled`: `true` per disabilitare il pulsante.
- `whiteSpace`: `normal` o `nowrap`.
- `text`: può inoltre contenere gli stili testuali `fontSize`, `fontWeight`, `lineHeight`, `textTransform`, `textDecoration`, `margin` e `padding`.
- `border`, `padding`, `size`, `radius`, `icon`: facoltativi; permettono di configurare bordo, spaziatura, dimensione, arrotondamento e icona.

**Importante:** il JSON configura solo l'aspetto e il testo. Quando l'utente preme il pulsante, il componente emette un evento; la pagina deve collegarlo a un'azione, per esempio aprire un form o avviare una prenotazione. Se la pagina non ha questo collegamento nel codice, aggiungere `button` al JSON non basta a definire l'azione.

## Proprietà da evitare

Non aggiungere `background` direttamente dentro `breadcrumb`: non fa parte delle proprietà lette dal componente. Per impostare lo sfondo usare `containerStyle.background` o `itemsContainerStyle.background`, in base alla zona da colorare.

Non inserire classi Bootstrap come `text-primary`, `d-flex` o `mb-3` nei campi di stile testuale. Usare le proprietà documentate (`color`, `fontSize`, `margin`, `padding`); le classi del layout sono gestite dall'applicazione.

## Controlli prima di pubblicare

1. Modificare il JSON della pagina effettivamente caricato dalla route.
2. Verificare che il file sia JSON valido e che `title` e `items` siano presenti.
3. Controllare i percorsi `routerLink` delle voci cliccabili e ricordare che l'ultima voce non è un link.
4. Verificare che tutte le chiavi di traduzione esistano in italiano e inglese.
5. Se è presente `button`, verificare che la pagina abbia già un'azione collegata al suo evento.
6. Controllare il risultato su desktop e mobile, soprattutto se si modifica la spaziatura o il testo del titolo.
