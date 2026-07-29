# Manuale di uso di cookieConsentConfig

## Obiettivo

La proprietà cookieConsentConfig definisce il comportamento del banner cookie, i testi multilingua, il contenuto della modale informativa e l'apertura del PDF di policy.

## Dove viene usata

- Nel bootstrap applicativo, durante inizializzazione:
  - src/app/initialize/providers/initialize-app.provider.ts
- Nel click handler globale per il PDF:
  - src/app/app.ts
- Nel modello TypeScript:
  - src/app/initialize/state/app-config.model.ts
- Esempio completo di configurazione:
  - src/app/initialize/state/mock.ts

## Struttura generale

https://tinesoft.github.io/ngx-cookieconsent/home
cookieConsentConfig estende la configurazione di ngx-cookieconsent e contiene 3 blocchi custom:

- customContent
- cookieConsentModal
- cookieConsentOpenPdf

## 1) customContent

Serve per sovrascrivere i testi del banner in base alla lingua corrente (it/en).

Chiavi supportate:

- header
- message
- dismiss
- allow
- deny
- link
- policy
- cookiePolicyLink
- privacyPolicyLink
- tosLink

Formato di ogni chiave:

- LocalizedText, cioè oggetto con it ed en.

Esempio:
customContent: {
header: { it: 'Intestazione', en: 'Header' },
message: { it: 'Testo IT', en: 'Text EN' },
dismiss: { it: 'Chiudi', en: 'Dismiss' }
}

Nota importante:
Le chiavi non standard di ngx-cookieconsent (cookiePolicyLink, privacyPolicyLink, tosLink) vanno dichiarate anche in content come stringhe placeholder, altrimenti i token nel template non si popolano.

## 2) content

Contiene i placeholder stringa usati dal layout/elements del banner.
Per i link custom usare almeno:

- cookiePolicyLink
- cookiePolicyHref
- privacyPolicyLink
- privacyPolicyHref
- tosLink
- tosHref

Esempio:
content: {
cookiePolicyLink: 'Cookie Policy',
cookiePolicyHref: 'https://.../cookie-policy',
privacyPolicyLink: 'Privacy Policy',
privacyPolicyHref: 'https://.../privacy-policy',
tosLink: 'Terms of Service',
tosHref: 'https://.../terms'
}

## 3) cookieConsentModal

Configura il contenuto della modale aperta dal link con id show_cookie_policy_info.
Layout:
Importante usare il button con id='show_cookie_policy_info'
<span id="cookieconsent:desc" class="cc-message">{{message}}
<a aria-label="learn more about cookies" tabindex="0" class="cookie_policy_link" id='show_cookie_policy_info' type="button" itButton="outline-primary" data-bs-toggle="modal" data-bs-target="#show_cookie_policy_modal">{{policy}} - MODALE</a>
</span>
Campi:

- title: LocalizedText
- text: LocalizedText
- closeButtonText: LocalizedText

## 4) cookieConsentOpenPdf

Configura l'apertura del PDF quando l'utente clicca il link con id show_cookie_policy_pdf.
Layout:
Importante usare button con id='show_cookie_policy_pdf'
<span id="cookieconsent:desc" class="cc-message">{{message}}
<a aria-label="learn more about cookies" tabindex="0" class="cookie_policy_link_pdf" id='show_cookie_policy_pdf' type="button" itButton="outline-primary" >{{policy}} - PDF</a>
</span>
Campi:

- url: endpoint PDF
- method: GET oppure POST

Esempio:
cookieConsentOpenPdf: {
url: 'https://example.com/cookie-policy.pdf',
method: 'GET'
}

Runtime:

- App intercetta il click su show_cookie_policy_pdf
- Legge cookieConsentConfig.cookieConsentOpenPdf
- Effettua chiamata HTTP con method/url
- Apre la risposta Blob tramite DownloadUtils.openPdf

## 5) Integrazione nel template del banner

Nel blocco elements.messagelink puoi usare token e anchor custom.

Token tipici:

- {{cookiePolicyLink}}
- {{privacyPolicyLink}}
- {{tosLink}}
- {{policy}}

ID usati dal progetto:

- show_cookie_policy_info per apertura modale
- show_cookie_policy_pdf per apertura PDF

## 6) Checklist rapida

- Definire cookieConsentConfig.content con i placeholder link
- Definire cookieConsentConfig.customContent con traduzioni it/en
- Definire cookieConsentConfig.cookieConsentModal se vuoi la modale
- Definire cookieConsentConfig.cookieConsentOpenPdf se vuoi apertura PDF
- Verificare che elements.messagelink contenga gli id corretti

## Esempio

cookieConsentConfig: {
//https://tinesoft.github.io/ngx-cookieconsent/home
cookie: {
domain: window.location.hostname,
},
palette: {
popup: {
background: '#000',
border: '#000',
link: '#ed0e12',
text: '#f1d600',
},
button: {
background: '#f1d600',
border: '#f1d600',
text: '#ed0e12',
},
},
position: 'bottom-left',
theme: 'classic',
type: 'info',
layout: 'my-custom-layout',
layouts: {
'my-custom-layout': '{{header}}{{messagelink}}{{compliance}}',
},
elements: {
header: `<span class="cc-header mb-3">{{header}}</span>`,
messagelink: `
<span id="cookieconsent:desc" class="cc-message">{{message}}
<a aria-label="learn more about cookies" tabindex="0" class="cc-link" href="{{cookiePolicyHref}}" target="_blank" rel="noopener">{{cookiePolicyLink}}</a>,
<a aria-label="learn more about our privacy policy" tabindex="1" class="cc-link" href="{{privacyPolicyHref}}" target="_blank" rel="noopener">{{privacyPolicyLink}}</a> and our
<a aria-label="learn more about our terms of service" tabindex="2" class="cc-link" href="{{tosHref}}" target="_blank" rel="noopener">{{tosLink}}</a>
</span>
<span id="cookieconsent:desc" class="cc-message">{{message}}
<a aria-label="learn more about cookies" tabindex="0" class="cookie_policy_link" id='show_cookie_policy_info' type="button" itButton="outline-primary" data-bs-toggle="modal" data-bs-target="#show_cookie_policy_modal">{{policy}} - MODALE</a>
</span>

    <span id="cookieconsent:desc" class="cc-message">{{message}}
      <a aria-label="learn more about cookies" tabindex="0" class="cookie_policy_link_pdf" id='show_cookie_policy_pdf' type="button" itButton="outline-primary" >{{policy}} - PDF</a>
    </span>
      `,
    },
    content: {
      cookiePolicyLink: 'Cookie Policy',
      cookiePolicyHref: 'https://cookie.com',

      privacyPolicyLink: 'Privacy Policy',
      privacyPolicyHref: 'https://privacy.com',

      tosLink: 'Terms of Service',
      tosHref: 'https://tos.com',
    },
    customContent: {
      header: { it: 'Cookie header prova ', en: 'Cookie header test' },
      message: {
        it: 'Utilizzando il nostro sito, riconosci di aver letto e compreso la nostra ',
        en: 'By using our site, you acknowledge that you have read and understand our ',
      },
      dismiss: { it: 'Chiudi', en: 'Dismiss' },
      cookiePolicyLink: { it: 'Cookie Policy IT', en: 'Cookie Policy EN' },
      privacyPolicyLink: { it: 'Privacy Policy IT', en: 'Privacy Policy EN' },
      tosLink: { it: 'Terms of Service IT', en: 'Terms of Service EN' },
    },
    cookieConsentModal: {
      title: { it: 'Titolo IT', en: 'Title EN' },
      text: {
        it: "Il nostro sito utilizza esclusivamente cookie tecnici obbligatori, necessari per garantire il corretto funzionamento del sito e fornire i servizi richiesti dagli utenti. <br /><br /> Questi cookie non richiedono il consenso dell'utente, in quanto essenziali per: <br /> La navigazione e la fruizione del sito web<br /> La gestione della sessione e l’autenticazione (se prevista)<br /> La memorizzazione delle preferenze dell'utente (ad esempio, lingua o impostazioni di accessibilità)<br />La sicurezza del sito e la prevenzione di frodi<br /><br />Questi cookie non raccolgono informazioni personali né vengono utilizzati per finalità di marketing. Se disabilitati, il sito potrebbe non funzionare correttamente.",
        en: 'Our site uses only strictly necessary technical cookies, required to ensure the proper functioning of the site and to provide the services requested by users. <br /><br /> These cookies do not require user consent, as they are essential for: <br /> Browsing and using the website<br /> Session management and authentication (if applicable)<br /> Storing user preferences (e.g., language or accessibility settings)<br /> Website security and fraud prevention<br /><br /> These cookies do not collect personal information nor are they used for marketing purposes. If disabled, the site may not function correctly.',
      },
      closeButtonText: { it: 'Chiudi', en: 'Close' },
    },
    cookieConsentOpenPdf: {
      url: 'https://pdfobject.com/pdf/sample.pdf',
      method: 'GET',
    },

},
