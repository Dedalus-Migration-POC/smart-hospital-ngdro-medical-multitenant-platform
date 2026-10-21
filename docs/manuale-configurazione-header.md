# Manuale di configurazione del header

Questa guida spiega come modificare il header dell'applicazione agendo sul solo file JSON, senza intervenire sul codice.

## Quale file modificare

Il progetto contiene due file:

- `src/assets/json-config/cms/config/header.json`
- `src/assets/json-config/default/config/header.json`

Attualmente l'applicazione carica il file **CMS** (`cms/config/header.json`). Per modificare il header visualizzato, intervenire quindi su questo file. Il file `default` è una configurazione di riferimento e non è quello caricato dal servizio di configurazione attuale.

Il JSON è servito al browser: non inserirvi password, token o altri segreti. In particolare, la configurazione di un feed RSS non deve contenere credenziali riservate.

## Struttura generale

Il header è composto da tre fasce, in questo ordine:

1. `topbar`: fascia superiore, facoltativa.
2. `main`: fascia principale, obbligatoria nel modello.
3. `bottombar`: fascia inferiore, facoltativa.

Omettere `topbar` o `bottombar` per non visualizzarli. Il collegamento accessibile “salta al contenuto principale” è già generato dall'applicazione e non va configurato nel JSON.

```json
{
  "topbar": {
    "height": "48px",
    "position": { "type": "sticky" },
    "background": { "fill": { "palette": "primary" } },
    "areas": {
      "layout": {
        "direction": "row",
        "align": "center",
        "justify": "between",
        "gap": "gap-2",
        "wrap": "wrap"
      },
      "start": {
        "layout": { "direction": "row", "align": "center", "gap": "gap-2" },
        "items": []
      }
    }
  },
  "main": {
    "height": "88px",
    "position": { "type": "sticky" },
    "background": { "fill": { "hex": "#003580" } },
    "areas": {
      "layout": {
        "direction": "row",
        "align": "center",
        "justify": "between",
        "gap": "gap-3",
        "wrap": "wrap"
      },
      "start": {
        "layout": { "direction": "row", "align": "center", "gap": "gap-2" },
        "items": [
          {
            "id": "header-home-link",
            "type": "LINK",
            "enabled": true,
            "props": {
              "text": "header.home",
              "url": "/",
              "external": false,
              "ariaLabel": "header.home",
              "style": {
                "mode": "bootstrap",
                "palette": "white",
                "textStyle": { "fontSize": "md", "fontWeight": "semibold" }
              }
            }
          }
        ]
      }
    }
  }
}
```

Le righe lunghe dell'esempio sono formattate su una singola riga per mantenerlo compatto; è possibile indentare il JSON in modo diverso senza cambiarne il risultato.

## Proprietà di una fascia

Ogni fascia (`topbar`, `main`, `bottombar`) può avere queste proprietà:

| Proprietà    | Significato                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `height`     | Altezza CSS, per esempio `"48px"` o `"5rem"`.                                                                                                                 |
| `position`   | Comportamento del header: `type` accetta `"sticky"` o `"fixed"`; `stackable` è un booleano; `className` aggiunge la classe prevista dal comportamento sticky. |
| `background` | Sfondo descritto nella sezione [Colori e stile](#colori-e-stile). È richiesto dal modello TypeScript, anche se può essere un oggetto vuoto `{}`.              |
| `border`     | Bordo: larghezza, stile, colore e raggio.                                                                                                                     |
| `padding`    | Spaziatura interna della fascia.                                                                                                                              |
| `className`  | Classe CSS aggiuntiva definita dal progetto. Non crea da sola nuove regole di stile.                                                                          |
| `areas`      | Disposizione degli elementi, descritta nella sezione seguente.                                                                                                |

`height`, `position`, `border`, `padding`, `className` e `areas` sono facoltativi nel modello. La fascia principale `main` è invece obbligatoria nella configurazione del header.

## Aree e layout

`areas` dispone il contenuto in tre zone orizzontali: `start`, `center` ed `end`. Ogni zona è facoltativa; viene mostrata quando contiene almeno un elemento attivo.

```json
"areas": {
  "layout": { "direction": "row", "align": "center", "justify": "between", "gap": "gap-3", "wrap": "wrap" },
  "start": {
    "layout": { "direction": "row", "align": "center", "gap": "gap-2" },
    "items": []
  },
  "center": {
    "layout": { "direction": "row", "align": "center", "justify": "center" },
    "items": []
  },
  "end": {
    "layout": { "direction": "row", "align": "center", "justify": "end", "gap": "gap-3" },
    "items": []
  }
}
```

`areas.layout` e il `layout` di ogni area sono obbligatori dal modello. In ogni area, `items` è una lista obbligatoria, anche se può essere vuota.

Proprietà ammesse in `layout`:

| Proprietà   | Valori                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `direction` | `row`, `column`, `row-reverse`, `column-reverse`; è ammesso anche un array di queste direzioni. |
| `align`     | `start`, `center`, `end`, `baseline`, `stretch`, `self-start`, `self-end`, `self-center`.       |
| `justify`   | `start`, `center`, `end`, `between`, `around`, `evenly`.                                        |
| `wrap`      | `wrap`, `nowrap`, `reverse`.                                                                    |
| `gap`       | `gap-0`, `gap-1`, `gap-2`, `gap-3`, `gap-4`, `gap-5`.                                           |
| `grow`      | `grow-0`, `grow-1`.                                                                             |
| `shrink`    | `shrink-0`, `shrink-1`.                                                                         |

Una zona può inoltre avere `size` (`basis`, `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`), `background`, `margin` e `padding`. Le dimensioni e gli spazi sono stringhe CSS, per esempio `"240px"`, `"30%"` o `"1rem"`.

Usare `align`, non `align-items`: `align-items` non è una proprietà riconosciuta dal modello e viene ignorata.

## Elementi e proprietà comuni

Ogni elemento in `items` ha questa forma:

```json
{
  "id": "identificativo-univoco",
  "type": "LINK",
  "enabled": true,
  "className": "classe-facoltativa",
  "props": {}
}
```

- `id`: identificativo univoco dell'elemento nell'area; viene usato per riconoscere l'elemento durante il rendering.
- `type`: tipo di componente. Il valore determina la forma accettata in `props`.
- `enabled`: `true` per mostrare l'elemento, `false` per nasconderlo senza cancellarlo.
- `className`: facoltativo; classe CSS applicata al contenitore dell'elemento.
- `props`: configurazione specifica del tipo. Non tutte le tipologie usano `props`.

Le stringhe usate per etichette, testi e messaggi possono essere chiavi di traduzione, come `header.topbar.login-button`. Le chiavi devono esistere nei file `src/assets/i18n/it.json` e `src/assets/i18n/en.json`; usare testo letterale solo se non serve tradurlo. Le chiavi di traduzione non vanno racchiuse tra parentesi graffe.

## Tipi di elemento supportati

### `LINK`

`props` accetta:

| Proprietà     | Uso                                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| `text`        | Testo o chiave di traduzione; obbligatorio.                                    |
| `url`         | Destinazione del collegamento; facoltativa nel modello.                        |
| `external`    | `true` per un link esterno, `false` per una navigazione interna; obbligatorio. |
| `description` | Descrizione facoltativa.                                                       |
| `target`      | `"_self"`, `"_blank"`, `"_parent"` o `"_top"`.                                 |
| `ariaLabel`   | Nome accessibile facoltativo.                                                  |
| `disabled`    | Disabilita il link quando è `true`.                                            |
| `icon`        | Icona facoltativa.                                                             |
| `style`       | Stile facoltativo del link.                                                    |

`style` supporta `mode: "bootstrap"` (modalità consigliata), `palette` (`white`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, `black`), `textStyle` e `hover`. In `textStyle` sono disponibili `fontSize`, `fontWeight`, `lineHeight`, `textTransform`, `textDecoration`, `margin` e `padding`. `hover` ammette `textDecoration` e `textDecorationThickness`. Il modello include anche `mode: "custom"`, ma la gestione dello stile custom è indicata nel codice come non completata.

### `IMAGE_BLOCK`

`props` accetta `id`, `image` (obbligatorio), `className`, `margin`, `padding`, `layout`, `action`, `clickable` e `text`.

- `image`: `type` può essere `url`, `file`, `inlineSvg` o `base64`; `value` contiene il percorso, URL o contenuto corrispondente; `decorative` è obbligatorio. Si possono configurare anche `width`, `height`, `className`, `alt`, `ariaLabel`, `margin`, `padding` e `tooltip` (`enabled`, `tooltipLabel`, `tooltipClassName`). Per immagini informative compilare `alt` e, quando serve, `ariaLabel`; per immagini decorative impostare `decorative: true`.
- `action`: facoltativa; `type` è `route` o `externalLink`, `url` è obbligatorio e `target` è facoltativo.
- `clickable`: abilita il click sull'intero blocco.
- `text`: titolo e sottotitolo facoltativi, ciascuno con `text` e gli stili testuali.
- `layout`: dispone immagine e testo con le stesse proprietà Flex descritte sopra.

### `SOCIAL`

`props` richiede `title`, `showLabel`, `socials` e `layout`; `className` e `labelStyle` sono facoltativi. `socials` è un array di voci con `id`, `label`, `ariaLabel` e `url`; si possono aggiungere `target`, `margin` e un `icon` oppure un'`image`.

### `TEXT`

`props` richiede `id` e `text`. Accetta inoltre le proprietà testuali: `fontSize`, `fontWeight`, `color`, `lineHeight`, `textTransform`, `textDecoration`, `margin` e `padding`. `headingTag` può essere `h1`, `h2`, `h3`, `h4`, `h5` o `h6`; se omesso, il testo viene mostrato senza un tag di intestazione.

### `SELECT_LANG`

`props` richiede `arialabel` e `color`. `color` accetta una delle palette elencate nella sezione [Colori e stile](#colori-e-stile). Il nome della proprietà è scritto esattamente `arialabel` nel modello attuale.

### `GOOGLE_TRANSLATE`

Non richiede `props`: il selettore viene creato dal componente. La disponibilità delle lingue dipende dalla configurazione generale di Google Translate.

### `USER_DROPDOWN_MENU`

`props` configura il pulsante di login e il menu visibile all'utente autenticato:

- `button.loggedInUser`: stile del pulsante per l'utente autenticato, compresi `textStyle`, `icon`, `padding`, palette e `hover`.
- `button.login`: `text` (oggetto con `text` e stili testuali) e `icon` del pulsante che porta al login.
- `caret`: `show` obbligatorio e `color` facoltativo.
- `dropdownMenu`: `background`, `border` e `items`; ogni voce ha `id`, `text`, `nameFunction` e può avere `icon` e `padding`.
- `nameFunction`: solo `gotoUserProfile` o `logout` sono ammesse.

Il modello TypeScript dichiara anche `props.id` e `dropdownMenu.padding` come obbligatori, ma il JSON CMS attuale li omette e il componente non li legge. Per le voci del menu, invece, usare sempre `id`, `text` e `nameFunction`.

### `AUTH_METHODS`

È possibile passare in `props` un oggetto con `id`, `isDarkTheme`, `isCard`, `isVertical` e `authMethods`. Ogni metodo include `type` (`SPID`, `CIE`, `MYID` o `LOCAL`), titolo, descrizione, pulsante e configurazione specifica del provider. `SPID`, `CIE` e `MYID` possono richiedere identificativi diversi per ambiente (`dev`, `test`, `prod`); `LOCAL` può configurare login, password, recupero password, registrazione e OTP. Usare questa tipologia solo se il header deve davvero mostrare l'accesso: la configurazione tocca il flusso di autenticazione del tenant.

### `SERVICE_CARDS`

`props` deve essere un contenitore di card. Le proprietà principali del contenitore sono `items` (obbligatorio), `header`, `containerLayout`, `itemsLayout`, `itemColBootstrapClasses`, `actionsLayout`, `className`, `ariaLabel`, `padding` e `margin`. Ogni voce di `items` è una card `mediaText` oppure `data`, con un proprio schema di campi e azioni. Poiché queste card possono dipendere dai dati e dalle azioni dell'applicazione, riutilizzare una configurazione di card già presente nel tenant invece di inventare un formato nuovo nel header.

### `FEED_RSS`

`props` richiede `container`, `orientation`, `feedRssConnectionData` e `itemConfig`.

- `container`: `title`; facoltativamente `size`, `background`, `margin` e `padding`.
- `orientation`: `horizontal` o `vertical`.
- `feedRssConnectionData`: `"getFromFirebase"` oppure un oggetto con `baseUrl`, `apiKey` e `domainName`.
- `itemConfig`: `readMore` è richiesto; consente di configurare `container`, `fields`, titolo, categoria, data, descrizione e relativi layout.
- `notFoundMessage`: configurazione facoltativa di un blocco immagine/testo quando non ci sono contenuti.

Il feed invia `apiKey` come token Bearer al servizio configurato. Se è un segreto, non inserirlo in un JSON statico: configurare il recupero da Firebase o demandare la protezione al servizio backend. L'orientamento verticale è previsto dal modello ma non è ottimizzato nell'interfaccia corrente.

## Colori e stile

Un colore può essere espresso come palette, per esempio `{ "palette": "primary" }`, oppure come codice esadecimale, per esempio `{ "hex": "#003580" }`. Le palette riconosciute sono `white`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark` e `black`.

Esempi:

```json
"background": { "fill": { "palette": "primary" } }
```

```json
"background": { "fill": { "hex": "#003580" } }
```

È ammesso anche `background.gradient` con una stringa CSS. Per un bordo si possono usare `width`, `style` (`solid`, `dashed`, `dotted`, `double`, `groove`, `ridge`, `inset`, `outset`, `none`), `color` e `radius`.

Le proprietà `margin` e `padding` accettano `all`, `x`, `y`, `top`, `right`, `bottom` e `left`, con valori CSS stringa. `x` e `y` impostano rispettivamente i due lati orizzontali e verticali; le proprietà dei singoli lati prevalgono sui valori generali.

Le icone supportano `type: "font-awesome"` con `name` (per esempio `fa-regular fa-user`) oppure `type: "design-kit"` con un nome icona del Design Kit. Possono avere `color`, `fontSize`, `size`, `margin`, `padding` e `position` (`before` o `after`).

## Tipi da non usare

Il modello condiviso elenca anche `LINKS`, `DIVIDER`, `SPACER` e `DYNAMIC_FORM`, ma il renderer del header attuale non li collega a un componente. Impostarli in `type` non mostra quindi contenuto. Per evitare un header apparentemente vuoto, usare solo i tipi documentati nella sezione precedente.

## Controlli prima della pubblicazione

1. Modificare `src/assets/json-config/cms/config/header.json`, non il file `default`, salvo che sia stato cambiato il percorso di caricamento.
2. Verificare che il file sia JSON valido: virgolette doppie, virgole tra proprietà, nessuna virgola dopo l'ultimo elemento.
3. Controllare che ogni item abbia `id`, `type` e `enabled`, e che `props` corrisponda al tipo scelto.
4. Verificare le chiavi di traduzione sia in italiano sia in inglese e controllare la resa su desktop e mobile.
5. Non aggiungere credenziali o segreti ai file pubblicati dal browser.
