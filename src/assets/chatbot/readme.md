Integrazione chatbot-widget:

1. Copia i file del widget nel progetto Angular
   Copia questi file dentro il tuo progetto Angular, ad esempio in una cartella assets:
   chatbot-widget.js
   chatbot-widget.css
   assets (se ti serve contenuto statico aggiuntivo)

2. Aggiungi CSS e JS globali in angular.json
   Nel blocco build.options:

"styles": [
"src/styles.css",
"src/assets/ebot/chatbot-widget.css"
],

"scripts": [
"https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js",
"https://cdn.jsdelivr.net/npm/i18next@23.5.1/dist/umd/i18next.min.js",
"src/assets/ebot/chatbot-widget.js"
]

!!!!! scripts nel file angular.json danno errore in avvio. Si puo metterli nel index.html. Ma sono opzionali, Quindi puoi anche provare a rimuoverli del tutto e verificare se il comportamento ti basta.
"https://cdn.jsdelivr.net/npm/axios@1.5.0/dist/axios.min.js",
"https://cdn.jsdelivr.net/npm/i18next@23.5.1/dist/umd/i18next.min.js",

3. in html:
<div
  id="chatbot-widget"
  data-bot-name="Assistant">
</div>

4. in ts
   declare global {
   interface Window {
   initChatbotWidget?: (elementId: string, options?: {
   apiUrl?: string;
   language?: 'it' | 'en' | 'es' | 'fr' | string;
   themeColor?: string;
   position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
   botName?: string;
   avatarUrl?: string;
   }) => { destroy?: () => void } | null;
   }
   }

private widgetInstance: { destroy?: () => void } | null = null;

ngAfterViewInit(): void {
// Piccolo defer per sicurezza dopo il render della view
setTimeout(() => {
if (!window.initChatbotWidget) {
console.error('initChatbotWidget non disponibile: controlla scripts in angular.json');
return;
}

      this.widgetInstance = window.initChatbotWidget('chatbot-widget', {
        apiUrl: 'https://echatbot-iet-demo.apps.cluokdtst01.pe-ita.aws/rag/ask',
        language: 'it',
        themeColor: '#007bff',
        position: 'bottom-right',
        botName: 'Assistant'
      });
    }, 0);

}

ngOnDestroy(): void {
// Evita listener duplicati se il componente viene distrutto/ricreato
this.widgetInstance?.destroy?.();
this.widgetInstance = null;
}
