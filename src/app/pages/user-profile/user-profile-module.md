# Modulo User Profile - Documentazione Tecnica

> Fonti: `src/app/pages/user-profile/`, `src/app/app.routes.ts`, `src/app/app.ts` e `src/app/guards/authenticated.guard.ts`.

## Scopo

La feature `user-profile` visualizza e aggiorna i dati anagrafici dell'utente autenticato, gli attributi aggiuntivi e i consensi privacy. Gestisce anche il completamento della registrazione dopo il login SPID attraverso un profilo temporaneo identificato dal query parameter `profilecode`.

Il form e la sua disposizione in sezioni sono multi-tenant: la configurazione (`UserConfig`) e' caricata da `PageConfigService.get('/user-profile')`, che fa il fetch (con cache in-memory) del json dedicato alla pagina in `assets/pages/user-profile.json`, indipendente dalla configurazione applicativa globale (`AppConfig`, risolta da `AppConfigService.loadAppConfig()` e messa in stato con `selectAppConfig`).

## Accesso e routing

Tutti i componenti della feature sono standalone (nessun `NgModule`). La route lazy-loaded e' definita in [app.routes.ts](../../app.routes.ts):

```ts
{
  path: 'user-profile',
  canActivate: [authenticatedGuard({ allowTemporary: true })],
  loadChildren: () => import('./pages/user-profile/user-profile.routes').then((m) => m.userProfileRoutes),
}
```

[user-profile.routes.ts](user-profile.routes.ts) espone un'unica route interna `''` associata al componente [`UserProfile`](user-profile.ts). Non esistono piu' route/componenti separati per "visualizzazione" e "registrazione": e' lo stesso componente contenitore a decidere quale vista mostrare in base alla presenza di `profilecode`.

`authenticatedGuard({ allowTemporary: true })`:

- se e' presente il query param `profilecode`, dispatcha `fetchUserProfile({ profileCode })` prima di valutare l'accesso;
- attende `selectInitialized` (impostato a `true` sia in caso di successo che di errore del fetch) e poi legge `selectUserProfile`;
- consente l'accesso se esiste un profilo e (non e' temporaneo oppure `allowTemporary` e' `true`), altrimenti reindirizza a `/login` con `returnUrl`.

`AppComponent` ([app.ts](../../app.ts)) richiede il profilo "definitivo" all'avvio del componente radice con `store.dispatch(fetchUserProfile())` (senza `profileCode`).

| URL                                  | Vista mostrata | Finalita'                                                    |
| ------------------------------------ | -------------- | ------------------------------------------------------------ |
| `/user-profile`                      | Profilo attivo | Consultazione e modifica del profilo autenticato             |
| `/user-profile?profilecode=<codice>` | Registrazione  | Completamento della registrazione SPID su profilo temporaneo |

`profileCode`/`isRegistration` determinano anche il breadcrumb (`pageConfig.breadcrumb` vs `pageConfig.breadcrumbRegistration`). Alla distruzione del componente, se l'utente e' ancora temporaneo, viene inviata l'action `sessionExpired`, che azzera il profilo nello store locale.

## Componenti

| Componente                         | File                                                                                                                                 | Responsabilita'                                                                                                                                                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `UserProfile`                      | [user-profile.ts](user-profile.ts)                                                                                                   | Contenitore: legge profilo e configurazione dallo store, costruisce dinamicamente il `FormGroup`, valida e invia il profilo aggiornato e i consensi.                                                                                                                     |
| `UserProfileRegistrationComponent` | [user-profile-registration/user-profile-registration.component.ts](user-profile-registration/user-profile-registration.component.ts) | Unica vista di presentazione del form: renderizza le sezioni configurate (campi statici e/o `DynamicFormComponent` per le sezioni `DYNAMIC_FORM`), i consensi e il pulsante di submit. Usata sia per il profilo attivo sia per la registrazione (prop `isRegistration`). |
| `ConsentsFormComponent`            | [consents-form/consents-form.component.ts](consents-form/consents-form.component.ts)                                                 | Renderizza la lista dei consensi (`ItCheckboxComponent`) e propaga il toggle al contenitore tramite `output`.                                                                                                                                                            |

Le classi `UserProfileFormComponent`, `ReadOnlySectionComponent`, `FieldTypesComponent` e `FieldTextComponent` descritte in versioni precedenti di questo documento non esistono piu' nel codice attuale: il layout dei campi e' gestito da `UserProfileRegistrationComponent` in combinazione con il componente condiviso `DynamicFormComponent` (`src/app/components/dynamic-form`) per le sezioni di tipo `DYNAMIC_FORM`.

I testi visibili sono risolti tramite le chiavi `user-profile-page.*` e `commons.*` di `ngx-translate`.

## Configurazione e modello dati

Modello definito in [user-profile.model.ts](user-profile.model.ts).

`UserConfig` contiene `sections: Section[]` e opzionalmente `consents` (titolo/sottotitolo localizzati) e `submitButton`. Ogni `Section` dichiara `title`, `subTitle` opzionale, flag `readOnly`, una lista di `fields?: Field[]` e/o `areas.center.items: UserConfigSectionItem[]` per campi renderizzati tramite `DynamicFormComponent` (item con `type: 'DYNAMIC_FORM'` e `enabled !== false`).

Un `Field` puo' definire `key`, tipo (`FieldType.TEXT` o `FieldType.DATE`), `alignment` (`HORIZONTAL`/`VERTICAL`), `readOnly`, classi di layout per label/campo, `dateFormat` e `validators` (`required`, `email`, `phone_number`, `cap`, `text`, mappati su `ValidationType`).

Il contenitore (`UserProfile.createForm`) costruisce dinamicamente un `FormGroup` unendo `UserConfig` e `UserProfile`:

- per ogni `field` statico di ogni `section`, calcola il valore da `UserProfile` o dagli `additionalAttributes` (`getFormValue`) e applica i validatori solo se il campo non e' `readOnly`;
- per ogni campo dinamico (`getDynamicFormFields`) crea un `FormControl` eventualmente disabilitato se il campo o la sezione sono in sola lettura;
- i validatori sono risolti in `getValidators`/`getDynamicFormValidators` mappando `ValidationType` sui validator di `NgxFormValidators`/`Validators`.

`UserProfile` (modello) include dati principali (`fiscalCode`, `firstName`, `lastName`, `email`), `additionalAttributes: AdditionalAttribute[]`, `consents: UserConsent[]`, `hasDifferentData`, `consentsSigned` e un `code` opzionale (presente per i profili temporanei/derivati da SPID). Per il rendering dei consensi (`consents` computed nel componente), il campo `summary` viene separato in testo ordinario e link quando contiene il marcatore `<Link .../>`; i consensi senza testo o link valido vengono filtrati.

## Flusso di caricamento

```text
AppComponent
  -> fetchUserProfile()               // all'avvio dell'app, senza profileCode
  -> UserProfileEffects.fetchUserProfile$
  -> UserProfileService.fetchUserProfile()
  -> fetchUserProfileSuccess({ data, temporary: !!profileCode })
  -> userProfileState (temporary=false)

UserProfile (componente)
  -> pageConfig = PageConfigService.get('/user-profile')
  -> effect: quando userProfile() e pageConfig() sono entrambi disponibili
     -> form.set(createForm(userProfile, userConfig))
```

Con `profilecode` (gestito dalla guard, non dal componente) viene invece dispatchato:

```text
fetchUserProfile({ profileCode })
  -> UserProfileService.fetchUserProfile(profileCode)
  -> POST oauth/api/wrapper/profile-by-code { code: profileCode }
  -> fetchUserProfileSuccess({ data, temporary: true })
```

Se il profilo risultante contiene un `code`, l'effect pianifica un nuovo `fetchUserProfile({ profileCode: data.code })` dopo 1.740.000 ms (29 minuti), per rinnovare il profilo temporaneo prima della scadenza.

> Nota implementativa attuale: `UserProfileService` ha un flag `IS_DEV = true` hardcoded che fa restituire dati mock (`MOCK_PROFILE`, `MOCK_CONSENTS` in [user-profile.mock.ts](state/user-profile.mock.ts)) invece di eseguire le chiamate HTTP reali per `fetchUserProfile()` e `fetchUserConsents()`. Le action/reducer/effect per `fetchUserConsents` esistono ma non risultano dispatchate da nessun componente: i consensi mostrati nella UI provengono da `userProfile.consents`, non dallo stato `userConsents` separato.

## Salvataggio del profilo

Alla conferma (`UserProfile.submit()`), il contenitore:

1. verifica la validita' del form e che tutti i consensi obbligatori siano accettati (`userConsentsForm`); in caso contrario marca i controlli come touched e mostra una notifica di errore (`ItNotificationService`);
2. ricompone il payload partendo dal profilo corrente (`currentProfile`), aggiornando `additionalAttributes` con i valori del form, i `consents` (quelli obbligatori restano sempre `accepted: true`, gli altri riflettono lo stato di `userConsentsForm`) e sovrascrivendo i campi principali presenti sia nel form sia nel profilo;
3. dispatcha `updateUserProfile({ data: userProfile })`.

L'effect (`updateUserProfile$`) chiama:

```text
POST oauth/api/wrapper/change-profile?login=<true|false>
```

`login` vale `true` quando la risposta del profilo corrente contiene `data.code` (caso registrazione). Gli esiti sono:

| Esito                                  | Comportamento                                                                                                                                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aggiornamento senza `code` in risposta | Aggiorna lo store (`updateUserProfileSuccess`) e mostra una notifica di successo (`edit-profile-success`).                                                                                               |
| Risposta con `code`                    | Dispatcha `spidConfirm({ code })`.                                                                                                                                                                       |
| Errore di aggiornamento                | Ridispatcha `fetchUserProfile()` per ripristinare il profilo dallo stato server, mostra una notifica di errore (per HTTP 401 usa il messaggio `access-errors.restart`, altrimenti `edit-profile-error`). |

`spidConfirm$` invoca `GET oauth/token-internal?code=<codice>`. Nel codice attuale il completamento e' gestito nel ramo di errore con `error.status === 200`: ricarica il profilo (`fetchUserProfile()`), naviga a `/idp-redirect` e mostra la notifica `registration-success`. Gli altri errori mostrano la notifica `registration-error`.

## Stato NgRx

La feature e' registrata globalmente con la chiave `userProfileState` (file in [state/](state/): `user-profile.actions.ts`, `.reducer.ts`, `.effects.ts`, `.selectors.ts`, `.service.ts`).

| Area di stato                         | Dati e flag                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Profilo                               | `userProfile`, `userProfileLoading`, `userProfileError`, `temporary`, `initialized` |
| Consensi (non usato dalla UI attuale) | `userConsents`, `userConsentsLoading`, `userConsentsError`                          |
| Aggiornamento profilo                 | `updateUserProfileLoading`, `updateUserProfileError`                                |
| Aggiornamento consensi                | `updateUserConsentsLoading`, `updateUserConsentsError`                              |
| Conferma SPID                         | `spidConfirmLoading`, `spidConfirmError`                                            |

Non esiste piu' uno stato/selettore dedicato a `userConfig`: la configurazione del form arriva da `selectAppConfig` (stato `initializeApp`), non dalla feature `user-profile`.

Selettori principali: `selectUserProfile` (data/loading/error/temporary), `selectUserConsents` (data/loading/error, non consumato dalla UI), `selectInitialized`, `selectTemporary`, `selectAdditionalAttributes`, `selectUserPhoneNumber` (usati anche da altri moduli, es. topbar), `selectUpdateUserProfileLoading/Error`, `selectUpdateUserConsentsLoading/Error`, `selectspidConfirmLoading/Error`.

Le action `fetchUserConsents`/`updateUserConsents` richiamano rispettivamente:

```text
GET  oauth/api/wrapper/consents
POST management-privacy-consent/api/user/consents/WAPP
```

ma, come indicato sopra, non sono attualmente dispatchate da alcun componente: la pagina legge e salva i consensi esclusivamente tramite `userProfile.consents` e l'action `updateUserProfile`.

## Integrazioni esterne

`UserProfileService` espone inoltre `refreshSession()` (`POST oauth/refresh`) e `logout()` (`POST oauth/logout`, con il `code` del profilo come query param se disponibile, letto da `selectUserProfile`). Topbar, intercettori HTTP e componenti di autenticazione riusano il servizio o le action della feature per caricare il profilo, chiudere la sessione o reagire alla sua scadenza.

Il profilo e' quindi uno stato condiviso: altri moduli riusano dati anagrafici e numero di telefono tramite i selettori `selectAdditionalAttributes`/`selectUserPhoneNumber`.
