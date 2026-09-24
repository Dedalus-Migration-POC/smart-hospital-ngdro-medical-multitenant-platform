/**
 * EBot - Minimalist and Accessible Chatbot Interface
 * Version: 1.4.3
 *
 * Features:
 * - Flat design with light theme
 * - Accessible keyboard navigation and ARIA labels
 * - Multi-language support with i18next
 * - Customizable options via HTML attributes
 * - REST API communication with error handling
 * - Progress indicator during API calls
 * - Shows only last user-bot exchange
 */

// Enough of the chunk to locate the passage on the page; the server tries
// progressively shorter prefixes, and a long needle only makes a match less
// likely (it may span a line break).
const HIGHLIGHT_MAX_CHARS = 300;

class ChatbotWidget {
    constructor(element, options = {}) {
        this.element = element;
        this.isOpen = false;
        this.isLoading = false;
        this.isDetailedMode = true;
        this.isStreamMode = true;
        this.isExpanded = false;
        this.lastUserMessage = null;
        this.lastBotMessage = null;

        // Default configuration
        this.config = {
            apiUrl: 'http://localhost:8000/api/v1/queries',
            documentsUrl: null,
            language: 'it',
            sendLanguage: true,
            // null, not a literal: applyCustomStyles() writes themeColor as an
            // inline custom property, which beats the stylesheet. A default here
            // would silently override --chatbot-accent and make the CSS token
            // unreachable - two sources of truth for one colour. Leaving it null
            // lets the stylesheet own the default; a host still overrides it via
            // options.themeColor or data-theme-color.
            themeColor: null,
            position: 'bottom-right',
            avatarUrl: null,
            botName: 'Assistant',
            // Appearance (all optional, mapped to CSS variables)
            scheme: 'light',        // 'light' | 'dark' | 'auto'
            radius: null,           // container corner radius, e.g. '16px'
            width: null,            // panel width, e.g. '380px'
            height: null,           // panel height, e.g. '560px'
            fontFamily: null,       // font stack override
            ...options
        };

        // Parse HTML data attributes
        this.parseDataAttributes();

        // Initialize i18next for localization
        this.initializeI18n();

        // Initialize the widget
        this.init();
    }

    /**
     * Initialize internationalization
     */
    initializeI18n() {
        const translations = {
            it: {
                welcome: 'Ciao! Come posso aiutarti oggi?',
                placeholder: 'Scrivi il tuo messaggio...',
                send: 'Invia messaggio',
                error: 'Si è verificato un errore. Riprova più tardi.',
                networkError: 'Impossibile raggiungere il server. Controlla la tua connessione internet.',
                timeoutError: 'Il server non ha risposto in tempo. Riprova più tardi.',
                serverError: 'Il server ha riscontrato un problema. Riprova più tardi.',
                typing: 'Sta pensando...',
                online: 'Online',
                openChat: 'Apri chat',
                closeChat: 'Chiudi chat',
                userAvatar: 'Tu',
                sources: 'Fonti',
                page: 'Pagina',
                relatedFigures: 'Figure correlate',
                enlargeImage: 'Ingrandisci immagine',
                closeImage: 'Chiudi immagine',
                viewPage: 'Vedi pagina',
                openPdf: 'Apri PDF',
                botName: 'Assistente',
                responseMode: 'Modalità risposta dettagliata',
                simple: 'Disattiva',
                detailed: 'Attiva',
                modeChanged: 'Modalità cambiata a',
                streamMode: 'Streaming',
                streamOn: 'Attivo',
                streamOff: 'Disattivo',
                expandWidget: 'Espandi widget',
                shrinkWidget: 'Riduci widget',
                messagesRegion: 'Messaggi della chat'
            },
            en: {
                welcome: 'Hello! How can I help you today?',
                placeholder: 'Type your message...',
                send: 'Send message',
                error: 'An error occurred. Please try again later.',
                networkError: 'Unable to reach the server. Please check your internet connection.',
                timeoutError: 'The server did not respond in time. Please try again later.',
                serverError: 'The server encountered a problem. Please try again later.',
                typing: 'Thinking...',
                online: 'Online',
                openChat: 'Open chat',
                closeChat: 'Close chat',
                userAvatar: 'You',
                sources: 'Sources',
                page: 'Page',
                relatedFigures: 'Related figures',
                enlargeImage: 'Enlarge image',
                closeImage: 'Close image',
                viewPage: 'View page',
                openPdf: 'Open PDF',
                botName: 'Assistant',
                responseMode: 'Detailed response mode',
                simple: 'Disabled',
                detailed: 'Enabled',
                modeChanged: 'Mode changed to',
                streamMode: 'Streaming',
                streamOn: 'On',
                streamOff: 'Off',
                expandWidget: 'Expand widget',
                shrinkWidget: 'Shrink widget',
                messagesRegion: 'Chat messages'
            },
            es: {
                welcome: '¡Hola! ¿Cómo puedo ayudarte hoy?',
                placeholder: 'Escribe tu mensaje...',
                send: 'Enviar mensaje',
                error: 'Se produjo un error. Inténtalo de nuevo más tarde.',
                networkError: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
                timeoutError: 'El servidor no respondió a tiempo. Inténtalo de nuevo más tarde.',
                serverError: 'El servidor encontró un problema. Inténtalo de nuevo más tarde.',
                typing: 'Pensando...',
                online: 'En línea',
                openChat: 'Abrir chat',
                closeChat: 'Cerrar chat',
                userAvatar: 'Tú',
                sources: 'Fuentes',
                page: 'Página',
                relatedFigures: 'Figuras relacionadas',
                enlargeImage: 'Ampliar imagen',
                closeImage: 'Cerrar imagen',
                viewPage: 'Ver página',
                openPdf: 'Abrir PDF',
                botName: 'Asistente',
                responseMode: 'Modo de respuesta detallada',
                simple: 'Desactivado',
                detailed: 'Activado',
                modeChanged: 'Modo cambiado a',
                streamMode: 'Streaming',
                streamOn: 'Activado',
                streamOff: 'Desactivado',
                expandWidget: 'Ampliar widget',
                shrinkWidget: 'Reducir widget',
                messagesRegion: 'Mensajes del chat'
            },
            fr: {
                welcome: 'Bonjour! Comment puis-je vous aider aujourd\'hui ?',
                placeholder: 'Tapez votre message...',
                send: 'Envoyer le message',
                error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
                networkError: 'Impossible de joindre le serveur. Vérifiez votre connexion internet.',
                timeoutError: 'Le serveur n\'a pas répondu à temps. Veuillez réessayer plus tard.',
                serverError: 'Le serveur a rencontré un problème. Veuillez réessayer plus tard.',
                typing: 'En train de penser...',
                online: 'En ligne',
                openChat: 'Ouvrir le chat',
                closeChat: 'Fermer le chat',
                userAvatar: 'Vous',
                sources: 'Sources',
                page: 'Page',
                relatedFigures: 'Figures associées',
                enlargeImage: "Agrandir l'image",
                closeImage: "Fermer l'image",
                viewPage: "Voir la page",
                openPdf: "Ouvrir le PDF",
                botName: 'Assistant',
                responseMode: 'Mode de réponse détaillé',
                simple: 'Désactivé',
                detailed: 'Activé',
                modeChanged: 'Mode changé en',
                streamMode: 'Streaming',
                streamOn: 'Activé',
                streamOff: 'Désactivé',
                expandWidget: 'Agrandir le widget',
                shrinkWidget: 'Réduire le widget',
                messagesRegion: 'Messages du chat'
            },
            de: {
                welcome: 'Hallo! Wie kann ich Ihnen heute helfen?',
                placeholder: 'Geben Sie Ihre Nachricht ein...',
                send: 'Nachricht senden',
                error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
                networkError: 'Der Server ist nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.',
                timeoutError: 'Der Server hat nicht rechtzeitig geantwortet. Bitte versuchen Sie es später erneut.',
                serverError: 'Der Server hat ein Problem festgestellt. Bitte versuchen Sie es später erneut.',
                typing: 'Denkt nach...',
                online: 'Online',
                openChat: 'Chat öffnen',
                closeChat: 'Chat schließen',
                userAvatar: 'Sie',
                sources: 'Quellen',
                page: 'Seite',
                relatedFigures: 'Zugehörige Abbildungen',
                enlargeImage: 'Bild vergrößern',
                closeImage: 'Bild schließen',
                viewPage: 'Seite ansehen',
                openPdf: 'PDF öffnen',
                botName: 'Assistent',
                responseMode: 'Detaillierter Antwortmodus',
                simple: 'Deaktiviert',
                detailed: 'Aktiviert',
                modeChanged: 'Modus geändert zu',
                streamMode: 'Streaming',
                streamOn: 'An',
                streamOff: 'Aus',
                expandWidget: 'Widget vergrößern',
                shrinkWidget: 'Widget verkleinern',
                messagesRegion: 'Chat-Nachrichten'
            }
        };

        if (typeof i18next !== 'undefined') {
            i18next.init({
                lng: this.config.language,
                fallbackLng: 'en',
                resources: Object.keys(translations).reduce((acc, lang) => {
                    acc[lang] = { translation: translations[lang] };
                    return acc;
                }, {})
            });
        } else {
            // Fallback if i18next is not available
            this.translations = translations[this.config.language] || translations.en;
        }
    }

    /**
     * Get translated text
     */
    t(key) {
        if (typeof i18next !== 'undefined') {
            return i18next.t(key);
        }
        return this.translations[key] || key;
    }

    /**
     * Parse data attributes from HTML element
     */
    parseDataAttributes() {
        const data = this.element.dataset;
        if (data.apiUrl) this.config.apiUrl = data.apiUrl;
        if (data.documentsUrl) this.config.documentsUrl = data.documentsUrl;
        if (data.language) this.config.language = data.language;
        if (data.themeColor) this.config.themeColor = data.themeColor;
        if (data.position) this.config.position = data.position;
        if (data.avatarUrl) this.config.avatarUrl = data.avatarUrl;
        if (data.botName) this.config.botName = data.botName;
        if (data.scheme) this.config.scheme = data.scheme;
        if (data.radius) this.config.radius = data.radius;
        if (data.width) this.config.width = data.width;
        if (data.height) this.config.height = data.height;
        if (data.fontFamily) this.config.fontFamily = data.fontFamily;
    }

    /**
     * Initialize the widget
     */
    init() {
        this.createWidget();
        this.attachEventListeners();
        this.applyCustomStyles();
        this._watchColorScheme();
        this.element.setAttribute('role', 'application');
        this.element.setAttribute('aria-label', this.config.botName || 'EBot');
    }

    /**
     * Create the widget HTML structure
     */
    createWidget() {
        this.element.className = `chatbot-widget position-${this.config.position}`;
        this.element.innerHTML = `
      <button class="chatbot-fab" 
              aria-label="${this.t('openChat')}" 
              aria-expanded="false"
              type="button">
        <svg class="chatbot-fab-icon chat-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <svg class="chatbot-fab-icon close-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
      
      <!-- role="dialog" without aria-modal, deliberately. The widget is designed
           to leave the host page usable while open, and the FAB - the only close
           control - lives outside this element, so aria-modal="true" would both
           state something false and hide that control from assistive tech. Tab is
           still cycled within the widget (FAB included) and Escape still closes. -->
      <div class="chatbot-container" role="dialog" aria-labelledby="chatbot-title" aria-hidden="true">
        <div class="chatbot-progress" aria-hidden="true">
          <div class="chatbot-progress-bar"></div>
        </div>
        
        <header class="chatbot-header">
          <div class="chatbot-avatar" aria-hidden="true">
            ${this.config.avatarUrl ?
                        `<img src="${this.config.avatarUrl}" alt="${this.escapeHtml(this.config.botName || this.t('botName'))}">` :
            '<svg viewBox="0 0 64 64" fill="currentColor" style="width: 28px; height: 28px;"><rect x="18" y="16" width="28" height="32" rx="4" fill="currentColor"/><circle cx="28" cy="28" r="3" fill="#fff"/><circle cx="36" cy="28" r="3" fill="#fff"/><rect x="26" y="36" width="12" height="3" rx="1.5" fill="#fff"/><rect x="14" y="12" width="4" height="4" rx="2" fill="currentColor"/><rect x="46" y="12" width="4" height="4" rx="2" fill="currentColor"/><line x1="18" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2"/><line x1="46" y1="14" x2="50" y2="14" stroke="currentColor" stroke-width="2"/></svg>'
        }
          </div>
          <div>
                        <h2 class="chatbot-title" id="chatbot-title">${this.escapeHtml(this.config.botName || this.t('botName'))}</h2>
            <p class="chatbot-status">${this.t('online')}</p>
          </div>
          <button class="chatbot-resize-button"
                  aria-label="${this.t('expandWidget')}"
                  type="button"
                  title="${this.t('expandWidget')}">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
              <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
            </svg>
          </button>
        </header>
        
        <div class="chatbot-toggles-wrapper">
          <div class="chatbot-toggle-container">
            <div>
              <p class="chatbot-toggle-label">${this.t('responseMode')}</p>
              <p class="chatbot-toggle-mode">${this.t('detailed')}</p>
            </div>
            <label class="chatbot-toggle-switch" aria-label="${this.t('responseMode')}">
              <input type="checkbox" id="response-mode-toggle" checked aria-describedby="response-mode-desc">
              <span class="chatbot-toggle-slider"></span>
            </label>
          </div>
          
          <div class="chatbot-toggle-container">
            <div>
              <p class="chatbot-toggle-label">${this.t('streamMode')}</p>
              <p class="chatbot-toggle-stream-mode">${this.t('streamOn')}</p>
            </div>
            <label class="chatbot-toggle-switch" aria-label="${this.t('streamMode')}">
              <input type="checkbox" id="stream-mode-toggle" checked aria-describedby="stream-mode-desc">
              <span class="chatbot-toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div class="chatbot-welcome">
          ${this.t('welcome')}
        </div>
        
        <div class="chatbot-messages"
             role="log"
             aria-live="off"
             aria-label="${this.t('messagesRegion')}"
             tabindex="0">
        </div>

        <!-- Single persistent live region. Announcements are made by writing
             into it, never by inserting a new live element: a region that is
             created and filled in the same frame is announced unreliably, and
             two coexisting regions compete with each other. -->
        <div class="chatbot-sr-only chatbot-announcer"
             role="status"
             aria-live="polite"
             aria-atomic="true"></div>
        
        <form class="chatbot-input-container" role="form">
          <div class="chatbot-input-form">
            <textarea class="chatbot-input" 
                     placeholder="${this.t('placeholder')}"
                     aria-label="${this.t('placeholder')}"
                     rows="1"
                     maxlength="500"
                     required></textarea>
            <button type="submit" 
                    class="chatbot-send-button" 
                    aria-label="${this.t('send')}"
                    disabled>
              <svg class="chatbot-send-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    `;

        // Cache DOM elements
        this.fab = this.element.querySelector('.chatbot-fab');
        this.container = this.element.querySelector('.chatbot-container');
        this.messagesContainer = this.element.querySelector('.chatbot-messages');
        this.inputForm = this.element.querySelector('.chatbot-input-container');
        this.input = this.element.querySelector('.chatbot-input');
        this.sendButton = this.element.querySelector('.chatbot-send-button');
        this.progressBar = this.element.querySelector('.chatbot-progress-bar');
        this.toggleSwitch = this.element.querySelector('#response-mode-toggle');
        this.toggleModeText = this.element.querySelector('.chatbot-toggle-mode');
        this.streamToggleSwitch = this.element.querySelector('#stream-mode-toggle');
        this.streamToggleModeText = this.element.querySelector('.chatbot-toggle-stream-mode');
        this.announcer = this.element.querySelector('.chatbot-announcer');
        this.welcomeMessage = this.element.querySelector('.chatbot-welcome');
        this.resizeButton = this.element.querySelector('.chatbot-resize-button');
    }

    /**
     * Apply custom styles based on configuration
     */
    applyCustomStyles() {
        const root = document.documentElement;
        const set = (name, value) => {
            if (value) root.style.setProperty(name, value);
            else root.style.removeProperty(name);
        };

        // Both names: --chatbot-primary-color is the documented legacy knob, but
        // forwarding is one-way, so every rule migrated to the canonical token
        // would stop tracking themeColor if we set the alias alone.
        set('--chatbot-primary-color', this.config.themeColor);
        set('--chatbot-accent', this.config.themeColor);
        set('--chatbot-radius', this.config.radius);
        set('--chatbot-bubble-radius', this.config.radius ? `calc(${this.config.radius} - 2px)` : null);
        set('--chatbot-width', this.config.width);
        set('--chatbot-height', this.config.height);
        set('--chatbot-font-family', this.config.fontFamily);

        let scheme = this.config.scheme || 'light';
        if (scheme === 'auto') {
            scheme = this._prefersDarkScheme() ? 'dark' : 'light';
        }
        root.setAttribute('data-chatbot-scheme', scheme);
    }

    /**
     * Whether the OS/browser currently prefers a dark color scheme.
     */
    _prefersDarkScheme() {
        return Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    /**
     * Keep `scheme: 'auto'` live.
     *
     * A pure CSS `prefers-color-scheme` media query updates automatically when
     * the OS/browser preference changes; this class instead resolves it into a
     * `data-chatbot-scheme` attribute once per `applyCustomStyles()` call, so
     * without this listener the widget freezes on whatever the preference was
     * at load time until the page is reloaded, even while the surrounding page
     * (if it uses the media query directly in CSS) keeps updating live.
     */
    _watchColorScheme() {
        if (!window.matchMedia) return;
        this._darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._darkSchemeChangeHandler = () => this.applyCustomStyles();
        this._darkSchemeMediaQuery.addEventListener('change', this._darkSchemeChangeHandler);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Toggle chat
        this.fab.addEventListener('click', () => this.toggleChat());

        // Handle form submission
        this.inputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Handle input changes
        this.input.addEventListener('input', () => {
            this.adjustTextareaHeight();
            this.toggleSendButton();
        });

        // Handle keyboard navigation
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Handle toggle switch change
        this.toggleSwitch.addEventListener('change', () => {
            this.handleToggleChange();
        });

        // Handle stream toggle switch change
        this.streamToggleSwitch.addEventListener('change', () => {
            this.handleStreamToggleChange();
        });

        // Handle resize button click
        this.resizeButton.addEventListener('click', () => {
            this.toggleSize();
        });

        // Handle ESC key to close chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
                this.fab.focus();
            }
        });

        // Trap Tab/Shift+Tab inside the panel while open, so keyboard focus
        // never escapes into the page behind it.
        this.element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !this.isOpen) return;

            const focusable = this.getFocusableElements();
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (e.shiftKey) {
                if (active === first || !this.element.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last || !this.element.contains(active)) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // The chat stays open on outside clicks: it is closed only by the FAB
        // (or by Escape). Users type in the page while the answer is on screen.

        // Delegate click event for inline citation chips: jump to the matching source card
        this.messagesContainer.addEventListener('click', (e) => {
            // Checked first, in case anything zoomable ever renders inside a
            // message: clicking a picture should show the picture, not
            // whatever is behind it.
            if (this.handleZoomableImageClick(e.target)) {
                e.preventDefault();
                return;
            }

            const citation = e.target.closest('.chatbot-citation');
            if (citation) {
                e.preventDefault();
                this.handleCitationClick(citation);
                return;
            }

            const link = e.target.closest('.chatbot-source-link');
            if (link) {
                e.preventDefault();
                const source = this._sourceFromLink(link);

                // Show built-in popover
                this.showChunkPopover(source, link);

                // Also dispatch event for custom handling if needed
                window.dispatchEvent(new CustomEvent('chatbot-source-click', { detail: source }));
            }

            // Handle violation link clicks
            const violationLink = e.target.closest('.chatbot-violation-link');
            if (violationLink) {
                e.preventDefault();
                // Build the violation object from data attributes
                const violation = {
                    code: violationLink.getAttribute('data-code'),
                    description: violationLink.getAttribute('data-description'),
                    threat_level: violationLink.getAttribute('data-threat-level'),
                    confidence: violationLink.getAttribute('data-confidence')
                };
                
                // Show violation popover
                this.showViolationPopover(violation, violationLink);
                
                // Also dispatch event for custom handling if needed
                window.dispatchEvent(new CustomEvent('chatbot-violation-click', { detail: violation }));
            }
        });

        // Keyboard activation for inline citation chips (Enter / Space)
        this.messagesContainer.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const citation = e.target.closest('.chatbot-citation');
            if (citation) {
                e.preventDefault();
                this.handleCitationClick(citation);
            }
        });
    }

    /**
     * All currently focusable elements inside the panel, in DOM/tab order.
     * Backs the Tab/Shift+Tab focus trap in `attachEventListeners()`.
     */
    getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), ' +
            'input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
        // Query the widget root, not the container: the FAB sits outside the
        // panel and is the only close control, so it must stay in the cycle.
        return Array.from(this.element.querySelectorAll(selector))
            .filter((el) => el.offsetParent !== null || document.activeElement === el);
    }

    /**
     * Handle toggle switch change
     */
    handleToggleChange() {
        this.isDetailedMode = this.toggleSwitch.checked;
        this.toggleModeText.textContent = this.isDetailedMode ? this.t('detailed') : this.t('simple');
        
        // Announce change through the single live region.
        this.announce(`${this.t('modeChanged')}: ${this.isDetailedMode ? this.t('detailed') : this.t('simple')}`);
    }

    /**
     * Handle stream toggle switch change
     */
    handleStreamToggleChange() {
        this.isStreamMode = this.streamToggleSwitch.checked;
        this.streamToggleModeText.textContent = this.isStreamMode ? this.t('streamOn') : this.t('streamOff');
        
        // Announce change through the single live region.
        this.announce(`${this.t('streamMode')}: ${this.isStreamMode ? this.t('streamOn') : this.t('streamOff')}`);
    }

    /**
     * Get current API endpoint based on toggle state
     */
    getCurrentApiUrl() {
        const baseUrl = this.config.apiUrl.replace(/\/$/, '');

        // Append /stream if stream mode is enabled
        if (this.isStreamMode) {
            return baseUrl + '/stream';
        }

        return baseUrl;
    }

    /**
     * Base URL for the document endpoints (original file, rendered page).
     *
     * Defaults to a sibling of the configured query endpoint - the two live
     * under the same API version - so a host page only has to configure one
     * URL in the common case.
     *
     * @returns {string} Base URL with no trailing slash.
     */
    getDocumentsBaseUrl() {
        if (this.config.documentsUrl) {
            return this.config.documentsUrl.replace(/\/$/, '');
        }
        return this.config.apiUrl.replace(/\/$/, '').replace(/\/queries$/, '/documents');
    }

    /**
     * Build request body for API calls
     */
    buildRequestBody(message) {
        const body = {
            question: message,
            response_type: this.isDetailedMode ? 'detailed' : 'simple'
        };

        // Include language if configured
        if (this.config.sendLanguage && this.config.language) {
            body.language = this.config.language;
        }

        return body;
    }

    /**
     * Toggle widget size
     */
    toggleSize() {
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            this.container.classList.add('expanded');
            this.resizeButton.setAttribute('aria-label', this.t('shrinkWidget'));
            this.resizeButton.setAttribute('title', this.t('shrinkWidget'));
        } else {
            this.container.classList.remove('expanded');
            this.resizeButton.setAttribute('aria-label', this.t('expandWidget'));
            this.resizeButton.setAttribute('title', this.t('expandWidget'));
        }

        this.refreshRenderedSources();
    }

    /**
     * Toggle chat open/close
     */
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    /**
     * Open chat
     */
    openChat() {
        this.isOpen = true;
        this.fab.classList.add('active');
        this.fab.setAttribute('aria-expanded', 'true');
        this.fab.setAttribute('aria-label', this.t('closeChat'));
        this.container.classList.add('open');
        this.container.setAttribute('aria-hidden', 'false');

        // Focus on input for accessibility
        setTimeout(() => {
            if (this.input) {
                this.input.focus();
            }
        }, 300);
    }

    /**
     * Close chat
     */
    closeChat() {
        this.isOpen = false;
        this.fab.classList.remove('active');
        this.fab.setAttribute('aria-expanded', 'false');
        this.fab.setAttribute('aria-label', this.t('openChat'));
        this.container.classList.remove('open');
        this.container.setAttribute('aria-hidden', 'true');
    }

    /**
     * Adjust textarea height based on content
     */
    adjustTextareaHeight() {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 100) + 'px';
    }

    /**
     * Toggle send button enabled/disabled
     */
    toggleSendButton() {
        const hasText = this.input.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }

    /**
     * Send message
     */
    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        // Hide welcome message on first message
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
        }

        // Clear input and disable send button
        this.input.value = '';
        this.adjustTextareaHeight();
        this.toggleSendButton();

        // Add user message
        this.addMessage(message, 'user');
        this.lastUserMessage = message;

        // Show loading state and track start time
        const startTime = Date.now();
        this.setLoading(true);

        try {
            // Choose streaming or non-streaming based on toggle
            if (this.isStreamMode) {
                await this.sendStreamingApiRequest(message, startTime);
            } else {
                await this.sendNonStreamingApiRequest(message, startTime);
            }
        } catch (error) {
            console.error('Error in sendMessage:', error);
            this.showError(error);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Send streaming API request and handle progressive response
     */
    async sendStreamingApiRequest(message, startTime) {
        const apiUrl = this.getCurrentApiUrl();
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        let response;
        try {
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.buildRequestBody(message)),
                signal: controller.signal
            });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
        }

        clearTimeout(timeoutId);
        console.log('Streaming response status:', response.status);

        // Handle 202 blocked response (envelope: { status, data: { blocked, message, ... } })
        if (response.status === 202) {
            const envelope = await response.json();
            const data = envelope.data || envelope;
            console.log('202 Blocked response detected:', data);
            const reasoningTime = ((Date.now() - startTime) / 1000).toFixed(2);
            this.addBlockedMessage(data, reasoningTime);
            this.lastBotMessage = data.message || 'Blocked';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Create initial bot message element for streaming
        const messageElement = this.createStreamingMessageElement();
        const contentDiv = messageElement.querySelector('.chatbot-message-content');
        
        // Track accumulated response
        let accumulatedAnswer = '';
        let sources = null;
        let finalReasoningTime = null;
        let hasReceivedData = false;
        let blockedData = null;
        let errorData = null;

        // Read the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        console.log('[Streaming] Started reading stream...');

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('[Streaming] Stream ended');
                    break;
                }
                
                // Decode the chunk
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                console.log('[Streaming] Received chunk:', chunk.substring(0, 100) + (chunk.length > 100 ? '...' : ''));
                
                // Process complete lines
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (!line.trim()) continue;

                    // SSE comment line (`: heartbeat`) — keep-alive, carries no
                    // data. Must be dropped before JSON.parse, or the plain-text
                    // fallback below turns it into answer text.
                    if (line.trimStart().startsWith(':')) continue;

                    console.log('[Streaming] Processing line:', line.substring(0, 100) + (line.length > 100 ? '...' : ''));
                    
                    // Remove SSE "data: " prefix if present
                    let jsonLine = line;
                    if (line.startsWith('data: ')) {
                        jsonLine = line.substring(6); // Remove "data: " prefix
                        console.log('[Streaming] Removed SSE prefix, JSON:', jsonLine.substring(0, 100) + (jsonLine.length > 100 ? '...' : ''));
                    }
                    
                    if (!jsonLine.trim()) continue;
                    
                    try {
                        const data = JSON.parse(jsonLine);
                        console.log('[Streaming] Parsed data:', data);
                        
                        // Handle different chunk types
                        if (data.type === 'token' && data.content) {
                            hasReceivedData = true;
                            accumulatedAnswer += data.content;
                            this.updateStreamingMessage(contentDiv, accumulatedAnswer);
                            console.log('[Streaming] Added token, total length:', accumulatedAnswer.length);
                        } else if (data.type === 'sources' && data.sources) {
                            hasReceivedData = true;
                            sources = data.sources;
                            console.log('[Streaming] Received sources:', sources.length);
                        } else if (data.type === 'done') {
                            // Stream complete (SSE format)
                            hasReceivedData = true;
                            if (data.sources) {
                                sources = data.sources;
                            }
                            console.log('[Streaming] Done message received, confidence:', data.confidence);
                        } else if (data.type === 'complete') {
                            hasReceivedData = true;
                            // Stream complete
                            if (data.answer) {
                                accumulatedAnswer = data.answer;
                            }
                            if (data.sources) {
                                sources = data.sources;
                            }
                            console.log('[Streaming] Complete message received');
                        } else if (data.type === 'blocked') {
                            // Terminal event: what we already rendered has been
                            // superseded and must be replaced, not appended to.
                            hasReceivedData = true;
                            blockedData = data;
                            console.log('[Streaming] Blocked event received - replacing streamed answer');
                            break;
                        } else if (data.type === 'error') {
                            // Terminal event: generation itself failed (not a
                            // guardrails block). Whatever tokens streamed so far
                            // are incomplete - replace them with the error, same
                            // as the blocked case above.
                            hasReceivedData = true;
                            errorData = data;
                            console.log('[Streaming] Error event received - replacing streamed answer');
                            break;
                        } else if (data.answer) {
                            // Fallback: handle non-streaming format (complete response)
                            hasReceivedData = true;
                            accumulatedAnswer = data.answer;
                            if (data.sources) {
                                sources = data.sources;
                            }
                            this.updateStreamingMessage(contentDiv, accumulatedAnswer);
                            console.log('[Streaming] Received complete answer in single chunk');
                        }
                    } catch (parseError) {
                        console.warn('[Streaming] Failed to parse chunk as JSON:', jsonLine.substring(0, 100), parseError);
                        // Fallback: treat as plain text
                        if (jsonLine.trim() && !hasReceivedData) {
                            hasReceivedData = true;
                            accumulatedAnswer += jsonLine;
                            this.updateStreamingMessage(contentDiv, accumulatedAnswer);
                        }
                    }
                }

                if (blockedData || errorData) break;
            }

            // Process any remaining buffer (a comment line here is keep-alive, not data)
            if (buffer.trim() && !buffer.trimStart().startsWith(':')) {
                console.log('[Streaming] Processing remaining buffer:', buffer.substring(0, 100));
                
                // Remove SSE "data: " prefix if present
                let jsonBuffer = buffer;
                if (buffer.startsWith('data: ')) {
                    jsonBuffer = buffer.substring(6);
                }
                
                try {
                    const data = JSON.parse(jsonBuffer);
                    if (data.type === 'blocked') {
                        blockedData = data;
                    }
                    if (data.type === 'error') {
                        errorData = data;
                    }
                    if (data.answer) {
                        accumulatedAnswer = data.answer;
                    }
                    if (data.sources) {
                        sources = data.sources;
                    }
                } catch (e) {
                    console.warn('[Streaming] Failed to parse remaining buffer');
                }
            }
            
            // Calculate final reasoning time
            finalReasoningTime = ((Date.now() - startTime) / 1000).toFixed(2);
            
            console.log('[Streaming] Final accumulated answer:', accumulatedAnswer.substring(0, 100) + (accumulatedAnswer.length > 100 ? '...' : ''));
            console.log('[Streaming] Has received data:', hasReceivedData);
            
            // A blocked event supersedes whatever was streamed: the backend can
            // only judge a finished answer once it exists, so replace the
            // rendered text rather than leaving it beside the rejection.
            if (blockedData) {
                messageElement.remove();
                this.addBlockedMessage(blockedData, ((Date.now() - startTime) / 1000).toFixed(2));
                this.lastBotMessage = blockedData.message || 'Blocked';
                console.log('[Streaming] Streamed answer replaced by blocked response');
                return;
            }

            // Same idea as the blocked case: generation failed, so whatever
            // partial text streamed is incomplete and must not be presented
            // as the answer. Unlike the client-inferred "No response received"
            // fallback below, this carries the backend's own reason.
            if (errorData) {
                messageElement.remove();
                this.addErrorMessage(errorData.message || this.t('error'), errorData.code);
                this.lastBotMessage = errorData.message || 'Error';
                console.log('[Streaming] Streamed answer replaced by error response');
                return;
            }

            // Update final message with sources and reasoning time
            if (accumulatedAnswer) {
                this.finalizeStreamingMessage(contentDiv, accumulatedAnswer, sources, finalReasoningTime);
                this.lastBotMessage = accumulatedAnswer;
            } else {
                console.error('[Streaming] No answer received from stream');
                throw new Error('No response received from streaming endpoint');
            }
            
            console.log('[Streaming] Completed successfully');
            console.log('[Streaming] Reasoning time:', finalReasoningTime, 'seconds');
            
        } catch (streamError) {
            console.error('[Streaming] Error:', streamError);
            throw streamError;
        }
    }

    /**
     * Create initial message element for streaming
     */
    createStreamingMessageElement() {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot';
        
        messageElement.innerHTML = `
            <div class="chatbot-message-avatar" aria-hidden="true">AI</div>
            <div class="chatbot-message-content" role="text"></div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        console.log('[Streaming] Created message element');
        
        return messageElement;
    }

    /**
     * Update streaming message with new content
     */
    updateStreamingMessage(contentDiv, text) {
        const formattedContent = this.parseTextFormatting(text);
        contentDiv.innerHTML = formattedContent;
        this.scrollToBottom();
        console.log('[Streaming] Updated message, length:', text.length);
    }

    /**
     * Finalize streaming message with sources and reasoning time
     */
    finalizeStreamingMessage(contentDiv, text, sources, reasoningTime) {
        console.log('[Streaming] Finalizing message, text length:', text.length);

        // Now that the full text is available, upgrade inline [n] markers to citation chips
        const formattedContent = this.renderAnswerWithCitations(text, sources);

        // Build sources HTML if provided (both modes: simple answers are still cited)
        let sourcesHtml = '';
        if (sources && Array.isArray(sources) && sources.length > 0) {
            sourcesHtml = this.buildSourcesHtml(sources);
        }

        // Add reasoning time
        let reasoningTimeHtml = '';
        if (reasoningTime) {
            reasoningTimeHtml = `<div class="chatbot-reasoning-time">${this.icon('clock')} ${reasoningTime}s</div>`;
        }

        contentDiv.innerHTML = formattedContent + sourcesHtml + reasoningTimeHtml;
        this.scrollToBottom();
        
        console.log('[Streaming] Finalized message successfully');
        
        // Announce completion to screen readers
        this.announceMessage(text, 'bot');
    }

    /**
     * Send non-streaming API request (traditional mode)
     */
    async sendNonStreamingApiRequest(message, startTime) {
        const apiUrl = this.getCurrentApiUrl();
        const requestBody = this.buildRequestBody(message);
        
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            timeout: 120000 // 120 seconds timeout
        };

        if (typeof axios !== 'undefined') {
            // Use axios if available
            try {
                const response = await axios.post(apiUrl, requestBody, {
                    timeout: 120000,
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: () => true  // Accept all status codes
                });

                console.log('Axios response status:', response.status, 'Data:', response.data);

                // Calculate reasoning time
                const reasoningTime = ((Date.now() - startTime) / 1000).toFixed(2);

                // Handle 202 blocked response (envelope: { status, data: { blocked, message, ... } })
                if (response.status === 202) {
                    console.log('202 Blocked response detected');
                    const data = response.data.data || response.data;
                    this.addBlockedMessage(data, reasoningTime);
                    this.lastBotMessage = data.message || 'Blocked';
                    return;
                }

                // Handle 200 success response (envelope: { status, data: { answer, sources, ... } })
                if (response.status === 200) {
                    const data = response.data.data || response.data;
                    if (data && data.answer) {
                        const sources = data.sources || null;
                        this.addMessage(data.answer, 'bot', sources, reasoningTime);
                        this.lastBotMessage = data.answer;
                    } else {
                        throw new Error('Invalid response format');
                    }
                    return;
                }

                // Other status codes are errors
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            } catch (error) {
                console.error('Axios error:', error);
                throw error;
            }
        } else {
            // Fallback to fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            try {
                const response = await fetch(apiUrl, {
                    ...requestConfig,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                console.log('Fetch response status:', response.status);

                // Calculate reasoning time
                const reasoningTime = ((Date.now() - startTime) / 1000).toFixed(2);

                // Handle 202 blocked response BEFORE checking response.ok
                if (response.status === 202) {
                    const envelope = await response.json();
                    const data = envelope.data || envelope;
                    console.log('202 Blocked response detected:', data);
                    this.addBlockedMessage(data, reasoningTime);
                    this.lastBotMessage = data.message || 'Blocked';
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const envelope = await response.json();
                const data = envelope.data || envelope;
                if (data && data.answer) {
                    const sources = data.sources || null;
                    this.addMessage(data.answer, 'bot', sources, reasoningTime);
                    this.lastBotMessage = data.answer;
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                throw error;
            }
        }
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        this.toggleSendButton();

        if (loading) {
            this.progressBar.classList.add('loading');
            this.element.querySelector('.chatbot-status').innerHTML = '<span class="chatbot-spinner"></span> ' + this.t('typing');
        } else {
            this.progressBar.classList.remove('loading');
            this.element.querySelector('.chatbot-status').textContent = this.t('online');
        }
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    /**
     * Add message to chat
     */
    addMessage(content, type, sources = null, reasoningTime = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;
        
        // Use formatting for bot messages (with inline citation chips), escape HTML for user messages
        const formattedContent = type === 'bot' ? this.renderAnswerWithCitations(content, sources) : this.escapeHtml(content);

        // Build sources HTML if provided (both modes: simple answers are still cited)
        let sourcesHtml = '';
        if (sources && Array.isArray(sources) && sources.length > 0) {
            sourcesHtml = this.buildSourcesHtml(sources);
        }

        // Add reasoning time for bot messages
        let reasoningTimeHtml = '';
        if (type === 'bot' && reasoningTime) {
            reasoningTimeHtml = `<div class="chatbot-reasoning-time">${this.icon('clock')} ${reasoningTime}s</div>`;
        }

        messageElement.innerHTML = `
      <div class="chatbot-message-avatar" aria-hidden="true">
        ${type === 'user' ? this.t('userAvatar')[0] : 'AI'}
      </div>
      <div class="chatbot-message-content" role="text">
        ${formattedContent}
        ${sourcesHtml}
        ${reasoningTimeHtml}
      </div>
    `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Announce new messages to screen readers
        this.announceMessage(content, type);
    }

    /**
     * Add blocked message to chat (for 202 responses)
     */
    addBlockedMessage(blockedData, reasoningTime = null) {
        console.log('addBlockedMessage called with:', blockedData);
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot blocked';
        
        const message = this.escapeHtml(blockedData.message || 'Request blocked by security guardrails');
        const threatLevelRaw = blockedData.threat_level || 'unknown';
        const threatLevel = this.escapeHtml(threatLevelRaw.toLowerCase());
        const violations = blockedData.violations || [];
        
        console.log('Parsed values:', { message, threatLevel, violations });
        
        // Build violations HTML (similar to sources with clickable links) - only in detailed mode
        let violationsHtml = '';
        if (this.isDetailedMode && violations.length > 0) {
            const violationItems = violations.map((violation, index) => {
                // Handle both string violations and object violations
                if (typeof violation === 'string') {
                    return `
                        <div class="chatbot-source-item">
                            <a href="#" 
                               class="chatbot-source-link chatbot-violation-link"
                               data-code="${this.escapeHtml(violation)}"
                               data-description=""
                               data-threat-level=""
                               data-confidence="">
                                <svg class="chatbot-source-icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                ${this.escapeHtml(violation)}
                            </a>
                        </div>
                    `;
                } else {
                    // Handle object violations with code and description
                    const code = violation.code || `Violation ${index + 1}`;
                    const description = violation.description || '';
                    const vThreatLevel = violation.threat_level || '';
                    const confidence = violation.confidence || '';
                    
                    return `
                        <div class="chatbot-source-item">
                            <a href="#" 
                               class="chatbot-source-link chatbot-violation-link"
                               data-code="${this.escapeHtml(code)}"
                               data-description="${this.escapeHtml(description)}"
                               data-threat-level="${this.escapeHtml(vThreatLevel)}"
                               data-confidence="${confidence}">
                                <svg class="chatbot-source-icon" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                ${this.escapeHtml(code)}
                            </a>
                        </div>
                    `;
                }
            }).join('');
            
            violationsHtml = `
                <div class="chatbot-sources">
                    <div class="chatbot-sources-header">Violations detected:</div>
                    <div class="chatbot-sources-list">
                        ${violationItems}
                    </div>
                </div>
            `;
        }
        
        // Determine icon and color based on threat level
        const threatIcon = threatLevelRaw.toLowerCase() === 'critical' ? this.icon('siren') :
                          threatLevelRaw.toLowerCase() === 'high' ? this.icon('stop') :
                          threatLevelRaw.toLowerCase() === 'medium' ? this.icon('warning') : this.icon('info');
        
        messageElement.innerHTML = `
            <div class="chatbot-message-avatar blocked" aria-hidden="true">
                ${threatIcon}
            </div>
            <div class="chatbot-message-content chatbot-blocked-content" role="alert">
                <div class="chatbot-blocked-header">
                    <strong>Security Alert</strong>
                    <span class="chatbot-threat-level chatbot-threat-${threatLevel}">${this.escapeHtml(threatLevelRaw)}</span>
                </div>
                <div style="height: 8px;"></div>
                <div class="chatbot-blocked-message">${message}</div>
                ${violationsHtml}
                ${reasoningTime ? `<div class="chatbot-reasoning-time">${this.icon('clock')} ${reasoningTime}s</div>` : ''}
            </div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Announce to screen readers
        // No announce() here: the card itself carries role="alert", an assertive
        // live region, so the text is already read. Announcing again made screen
        // readers say every blocked message twice.
    }

    /**
     * SVG path data for the source-pill icon, based on content type.
     */
    getSourceIconPath(contentType) {
        if (contentType === 'table') {
            // Grid/table icon
            return 'M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h8V5h-8zM5 11v4h4v-4H5zm6 0v4h8v-4h-8zM5 17v2h4v-2H5zm6 0v2h8v-2h-8z';
        }
        if (contentType === 'figure') {
            // Image/photo icon
            return 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z';
        }
        // Default: generic document icon
        return 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
    }

    /**
     * Reconstruct a source object from a source-link's data attributes.
     *
     * Image data (the source's own figure, and any figures related to it)
     * travels as attributes on the link rather than as visible `<img>` elements
     * - the source list never shows an image, only the popover this feeds does.
     * There is no URL to fall back to: the API never sends one.
     */
    _sourceFromLink(link) {
        return {
            source: link.getAttribute('data-source'),
            document: link.getAttribute('data-document'),
            contentType: link.getAttribute('data-content-type') || 'text',
            assetUrl: link.getAttribute('data-asset-src') || '',
            relatedFigures: JSON.parse(link.getAttribute('data-related-figures') || '[]'),
            caption: link.getAttribute('data-caption') || '',
            tableIndex: link.getAttribute('data-table-index') || '',
            figureIndex: link.getAttribute('data-figure-index') || '',
            start_char: Number(link.getAttribute('data-start-char')),
            end_char: Number(link.getAttribute('data-end-char')),
            page_number: Number(link.getAttribute('data-page-number')) || -1,
            section_title: link.getAttribute('data-section-title') || '',
            section_path: link.getAttribute('data-section-path') || '',
            sentence_range: JSON.parse(link.getAttribute('data-sentence-range') || '[]'),
            text: link.getAttribute('data-text')
        };
    }

    /**
     * Handle a click/activation on an inline citation chip: find the matching
     * source card in the same message, scroll to it, highlight it briefly, and
     * open its popover.
     */
    handleCitationClick(citation) {
        const number = citation.getAttribute('data-citation');
        const message = citation.closest('.chatbot-message');
        if (!message) return;

        const targetLink = message.querySelector(`.chatbot-source-link[data-citation-number="${number}"]`);
        if (!targetLink) return;

        targetLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        targetLink.classList.add('chatbot-source-highlight');
        setTimeout(() => targetLink.classList.remove('chatbot-source-highlight'), 1600);

        const source = this._sourceFromLink(targetLink);
        this.showChunkPopover(source, citation);
        window.dispatchEvent(new CustomEvent('chatbot-source-click', { detail: source }));
    }

    /**
     * Build HTML for sources section
     */
    buildSourcesHtml(sources) {
        if (!sources || sources.length === 0) return '';

        // Sources are already limited to the ones actually cited in the answer, so
        // render all of them — an inline [n] marker must always have a matching card.
        const sourcesLabel = this.t('sources');
        const sourceItems = sources.map((source, index) => {
            const contentType = source.content_type || 'text';
            // The citation number ties this card to the inline [n] marker in the answer.
            const citationNumber = typeof source.citation_number === 'number' ? source.citation_number : index + 1;

            // Extract filename from document field, fallback to source field
            let baseName = source.document || source.source || `Source ${citationNumber}`;

            // Shorten long filenames: show start + "..." + (char positions)
            // Full filenames are shown when the widget is expanded (more room).
            const maxLength = 20;
            let displayText = baseName;

            if (!this.isExpanded && baseName.length > maxLength) {
                displayText = baseName.substring(0, maxLength) + '...';
            }

            if (contentType === 'table' && source.table_index) {
                displayText = `Table ${source.table_index} · ${displayText}`;
            } else if (contentType === 'figure' && source.figure_index) {
                displayText = `Figure ${source.figure_index} · ${displayText}`;
            }

            // Page number is the most concrete pointer back into the source
            // document; section title is a fallback when no page is available
            // (e.g. non-PDF documents). Shown on its own line rather than
            // appended to displayText so long filenames don't crowd it out.
            const pageNumber = source.page_number || -1;
            const sectionTitle = source.section_title || '';
            const sectionPath = source.section_path || '';
            // `caption` is the document's own wording for a figure/table and
            // carries no OCR noise, unlike `text` - so it is what a human reads.
            const caption = source.caption || '';
            let metaText = '';
            if (pageNumber > 0) {
                metaText = `${this.t('page')} ${pageNumber}`;
            } else if (sectionTitle) {
                metaText = sectionTitle;
            }
            if (caption) {
                metaText = metaText ? `${metaText} · ${caption}` : caption;
            }

            const startChar = source.start_char || 0;
            const endChar = source.end_char || 0;
            const text = source.text || '';
            const document = source.document || source.source || '';
            const assets = Array.isArray(source.assets) ? source.assets : [];
            // Images travel inline as base64 (self-contained, no second request and
            // no asset URL ever reaches the client) - mirroring how table content is
            // already self-contained in `text`. There is no URL fallback: the API
            // never sends one.
            const selfAsset = assets.find((asset) => asset.link === 'self' && asset.asset_data);
            const imageSrc = contentType === 'figure'
                ? (source.asset_data || (selfAsset && selfAsset.asset_data) || '')
                : '';

            // Figures printed inside, or referenced by, a cited passage. This is
            // what puts the diagram next to the paragraph that cites it, instead
            // of only showing it when the figure itself happens to be cited.
            // They travel as data on the link and render only inside the popover
            // (see showChunkPopover) - images never appear inline in the source
            // list itself, only in a popup.
            const relatedFigures = assets.filter(
                (asset) => asset.type === 'figure' && asset.link !== 'self' && asset.asset_data
            );

            // The source list never shows an image, only an icon; a figure
            // source's own image (and any related figures) surface in the
            // popover when the card is clicked, or the lightbox from there.
            const icon = `<svg class="chatbot-source-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="${this.getSourceIconPath(contentType)}"/>
                </svg>`;

            const assetSrcAttr = imageSrc ? ` data-asset-src="${this.escapeHtml(imageSrc)}"` : '';
            const relatedFiguresAttr = relatedFigures.length
                ? ` data-related-figures="${this.escapeAttributeJson(
                      relatedFigures.map((asset) => ({ asset_data: asset.asset_data, caption: asset.caption || '' }))
                  )}"`
                : '';

            // Create a clickable link with data attributes for potential custom handling
            return `
                <div class="chatbot-source-item${relatedFigures.length ? ' chatbot-source-item-has-figures' : ''}">
                    <a href="#"
                       class="chatbot-source-link"
                       title="${this.escapeHtml(document)}"
                       data-citation-number="${citationNumber}"
                       data-source="${this.escapeHtml(document)}"
                       data-document="${this.escapeHtml(document)}"
                       data-content-type="${this.escapeHtml(contentType)}"
                       data-table-index="${source.table_index || ''}"
                       data-figure-index="${source.figure_index || ''}"
                       data-start-char="${startChar}"
                       data-end-char="${endChar}"
                       data-page-number="${pageNumber}"
                       data-section-title="${this.escapeHtml(sectionTitle)}"
                       data-section-path="${this.escapeHtml(sectionPath)}"
                       data-caption="${this.escapeHtml(caption)}"
                       data-sentence-range="${this.escapeHtml(JSON.stringify(source.sentence_range || []))}"
                       data-text="${this.escapeHtml(text)}"${assetSrcAttr}${relatedFiguresAttr}>
                        <span class="chatbot-source-number" aria-hidden="true">${citationNumber}</span>
                        ${icon}
                        <span class="chatbot-source-text">
                            <span class="chatbot-source-name">${this.escapeHtml(displayText)}</span>
                            ${metaText ? `<span class="chatbot-source-meta">${this.escapeHtml(metaText)}</span>` : ''}
                        </span>
                    </a>
                </div>
            `;
        }).join('');

        const encodedSources = this.escapeAttributeJson(sources);

        return `
            <div class="chatbot-sources" data-sources="${encodedSources}">
                <div class="chatbot-sources-header">${sourcesLabel}:</div>
                <div class="chatbot-sources-list">
                    ${sourceItems}
                </div>
            </div>
        `;
    }

    /**
     * Re-render already-displayed source lists to reflect the current
     * expanded/collapsed filename truncation state.
     */
    refreshRenderedSources() {
        const sourceBlocks = this.messagesContainer?.querySelectorAll('.chatbot-sources[data-sources]');
        if (!sourceBlocks) return;

        sourceBlocks.forEach((block) => {
            let sources;
            try {
                sources = JSON.parse(block.dataset.sources);
            } catch (e) {
                return;
            }
            block.outerHTML = this.buildSourcesHtml(sources);
        });
    }

    /**
     * Announce message to screen readers
     */
    announce(text) {
        if (!this.announcer) return;

        // Blank first, then write on the next frame. Assigning the same string
        // twice is not a mutation, so a screen reader would stay silent on a
        // repeated announcement - clearing guarantees a change to observe.
        clearTimeout(this._announceTimer);
        this.announcer.textContent = '';
        requestAnimationFrame(() => {
            this.announcer.textContent = text;
            this._announceTimer = setTimeout(() => {
                this.announcer.textContent = '';
            }, 3000);
        });
    }

    announceMessage(content, type) {
        const speaker = type === 'user' ? this.t('userAvatar') : this.config.botName;
        this.announce(`${speaker}: ${content}`);
    }

    /**
     * Show error message in the chat as a bot-style error bubble
     */
    showError(error) {
        const errorMessage = this.classifyError(error);
        this.addErrorMessage(errorMessage);
    }

    /**
     * Classify an error and return the appropriate i18n message
     */
    classifyError(error) {
        if (!error) return this.t('error');

        const message = (error.message || '').toLowerCase();
        const name = (error.name || '').toLowerCase();

        // Network / connection refused
        if (name === 'typeerror' && message.includes('fetch')) {
            return this.t('networkError');
        }
        if (message.includes('network') || message.includes('err_connection')) {
            return this.t('networkError');
        }

        // Timeout / abort
        if (name === 'aborterror' || message.includes('abort') || message.includes('timeout')) {
            return this.t('timeoutError');
        }

        // HTTP server errors (5xx)
        if (message.includes('http 5') || message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
            return this.t('serverError');
        }

        // HTTP client errors (4xx) — show generic
        if (message.includes('http 4')) {
            return this.t('error');
        }

        return this.t('error');
    }

    /**
     * Add an error message to the chat as a distinct bot-style bubble
     */
    addErrorMessage(text, code = null) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot error';

        // A backend-provided code (e.g. GENERATION_FAILED) is authoritative -
        // show it as-is instead of guessing a category from the message text.
        let errorIcon = this.icon('warning');
        let errorType = code;
        if (!errorType) {
            const isNetwork = text === this.t('networkError');
            const isTimeout = text === this.t('timeoutError');
            const isServer = text === this.t('serverError');

            errorType = 'error';
            if (isNetwork) {
                errorIcon = this.icon('plug');
                errorType = 'network';
            } else if (isTimeout) {
                errorIcon = this.icon('clock');
                errorType = 'timeout';
            } else if (isServer) {
                errorIcon = this.icon('server');
                errorType = 'server';
            }
        }

        messageElement.innerHTML = `
            <div class="chatbot-message-avatar error" aria-hidden="true">
                ${errorIcon}
            </div>
            <div class="chatbot-message-content chatbot-error-content" role="alert">
                <div class="chatbot-error-header">
                    <strong>Error</strong>
                    <span class="chatbot-error-badge chatbot-error-${this.escapeHtml(errorType.toLowerCase())}">${this.escapeHtml(errorType)}</span>
                </div>
                <div style="height: 8px;"></div>
                <div class="chatbot-error-message">${this.escapeHtml(text)}</div>
            </div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // No announce() here either: .chatbot-error-content carries role="alert".
    }

    /**
     * Scroll messages to bottom
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * Parse markdown-style text formatting and convert to HTML
     */
    parseTextFormatting(text) {
        // Use marked.js if available for proper markdown parsing
        if (typeof marked !== 'undefined') {
            try {
                // Configure marked with custom renderer for styling
                marked.setOptions({
                    breaks: true, // Convert \n to <br>
                    gfm: true, // GitHub Flavored Markdown
                    headerIds: false,
                    mangle: false
                });
                
                // Parse markdown to HTML
                let html = marked.parse(text);
                
                // Add custom styling to lists
                html = html.replace(/<ul>/g, '<ul style="margin: 8px 0; padding-left: 20px; list-style: none;">');
                html = html.replace(/<ol>/g, '<ol style="margin: 8px 0; padding-left: 20px;">');
                html = html.replace(/<li>/g, '<li style="margin: 4px 0; position: relative; padding-left: 8px;">');
                html = html.replace(/<p>/g, '<p style="margin: 8px 0;">');

                // Style bullet points
                html = html.replace(/<li style="([^"]*)">(?!<)/g, '<li style="$1"><span style="color: var(--chatbot-primary-color); font-weight: bold; margin-right: 8px;">•</span>');

                // Wrap tables (e.g. reproduced from extracted PDF tables) so wide
                // tables scroll horizontally instead of breaking the bubble layout.
                html = html.replace(/<table>/g, '<div class="chatbot-table-wrapper"><table>');
                html = html.replace(/<\/table>/g, '</table></div>');

                return html;
            } catch (error) {
                console.error('Marked parsing error:', error);
                // Fallback to manual parsing if marked fails
            }
        }
        
        // Fallback: manual parsing if marked.js is not available
        const div = document.createElement('div');
        div.textContent = text;
        let escapedText = div.innerHTML;
        
        // Bold
        escapedText = escapedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Line breaks
        escapedText = escapedText.replace(/\n/g, '<br>');
        
        // Bullet points
        escapedText = escapedText.replace(/^[\*\-]\s+(.+)$/gm, '<div style="margin: 4px 0;"><span style="color: var(--chatbot-primary-color); font-weight: bold;">•</span> $1</div>');
        
        return escapedText;
    }

    /**
     * Render a bot answer as HTML with inline [n] markers upgraded to clickable
     * citation chips linked to their source cards.
     *
     * Runs only on finalized text (never per streamed token, since a marker can
     * split across chunks). Chips are only created for numbers that actually have
     * a cited source, keyed off each source's citation_number.
     */
    renderAnswerWithCitations(text, sources) {
        let html = this.parseTextFormatting(text);
        if (sources && Array.isArray(sources) && sources.length > 0) {
            const cited = sources
                .map(s => (typeof s.citation_number === 'number' ? s.citation_number : null))
                .filter(n => n !== null);
            if (cited.length > 0) {
                html = this.upgradeCitationsInHtml(html, cited);
            }
        }
        return html;
    }

    /**
     * Replace [n] / [n, m] markers in already-parsed answer HTML with clickable
     * <sup class="chatbot-citation"> chips.
     *
     * Works on the parsed DOM's text nodes (never a raw string replace) so it is
     * XSS-safe and cannot collide with marked.js link syntax; markers inside
     * links/code/pre are left untouched, as are numbers that were not cited.
     */
    upgradeCitationsInHtml(html, citedNumbers) {
        const citedSet = new Set(citedNumbers);
        const template = document.createElement('template');
        template.innerHTML = html;

        const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        const pattern = /\[(\d+(?:\s*,\s*\d+)*)\]/g;

        textNodes.forEach(node => {
            // Skip markers already inside a link, code span, or preformatted block
            if (node.parentElement && node.parentElement.closest('a, code, pre')) return;

            const value = node.nodeValue;
            if (value.indexOf('[') === -1) return;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            let changed = false;
            let match;
            pattern.lastIndex = 0;

            while ((match = pattern.exec(value)) !== null) {
                const numbers = match[1]
                    .split(',')
                    .map(part => parseInt(part.trim(), 10))
                    .filter(n => !Number.isNaN(n));
                const validNumbers = numbers.filter(n => citedSet.has(n));

                // Text preceding this marker
                fragment.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
                lastIndex = match.index + match[0].length;

                if (validNumbers.length === 0) {
                    // No cited number here — keep the original marker text verbatim
                    fragment.appendChild(document.createTextNode(match[0]));
                    continue;
                }

                changed = true;
                validNumbers.forEach(n => {
                    const chip = document.createElement('sup');
                    chip.className = 'chatbot-citation';
                    chip.setAttribute('data-citation', String(n));
                    chip.setAttribute('role', 'button');
                    chip.setAttribute('tabindex', '0');
                    chip.setAttribute('title', `${this.t('sources')} ${n}`);
                    chip.textContent = String(n);
                    fragment.appendChild(chip);
                });
            }

            if (changed) {
                fragment.appendChild(document.createTextNode(value.slice(lastIndex)));
                node.parentNode.replaceChild(fragment, node);
            }
        });

        return template.innerHTML;
    }

    /**
     * Inline SVG icons, used instead of emoji so glyphs don't depend on a
     * colour-emoji font (tofu boxes on Linux/kiosk/locked-down Windows
     * builds without one) and so colour follows the theme via currentColor.
     * All paths in one lookup so the icon set stays visible at a glance.
     */
    icon(name) {
        const icons = {
            clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 13.5"/>',
            siren: '<path d="M12 2a6 6 0 0 0-6 6v3.09c0 .68-.24 1.34-.68 1.86L4 15h16l-1.32-2.05a3 3 0 0 1-.68-1.86V8a6 6 0 0 0-6-6z"/><rect x="10" y="17" width="4" height="2" rx="1"/>',
            stop: '<polygon points="8 2 16 2 22 8 22 16 16 22 8 22 2 16 2 8"/><line x1="9" y1="15" x2="15" y2="9"/><line x1="9" y1="9" x2="15" y2="15"/>',
            warning: '<path d="M12 3 2 20h20L12 3z"/><line x1="12" y1="9" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/>',
            info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7.5" x2="12" y2="7.5"/>',
            plug: '<path d="M9 3v4M15 3v4M6 7h12v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7z"/><path d="M12 18v3"/>',
            server: '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><line x1="7" y1="7" x2="7" y2="7"/><line x1="7" y1="17" x2="7" y2="17"/>',
            image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
            chart: '<line x1="4" y1="19" x2="20" y2="19"/><line x1="7" y1="15" x2="7" y2="19"/><line x1="12" y1="10" x2="12" y2="19"/><line x1="17" y1="6" x2="17" y2="19"/>',
            document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>'
        };
        const solid = name === 'siren';
        const style = solid
            ? 'fill="currentColor" stroke="none"'
            : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
        return `<svg viewBox="0 0 24 24" width="1em" height="1em" ${style} aria-hidden="true" focusable="false" style="vertical-align: -0.125em;">${icons[name] || ''}</svg>`;
    }

    /**
     * Escape HTML to prevent XSS (deprecated - use parseTextFormatting instead)
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Serialize a value to JSON safe to embed inside an HTML attribute value.
     *
     * escapeHtml() doesn't escape quotes (only used for text nodes elsewhere),
     * so JSON destined for a `data-*` attribute - which may contain arbitrary
     * quoted strings, like a figure caption - needs its own escaping.
     */
    escapeAttributeJson(value) {
        return JSON.stringify(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Remove any existing chunk popover
     */
    removeChunkPopover() {
        const old = document.getElementById('chatbot-chunk-popover');
        if (old) old.remove();
    }

    /**
     * Remove the image lightbox, if one is open.
     */
    removeImageLightbox() {
        const existing = document.getElementById('chatbot-image-lightbox');
        if (existing) existing.remove();
        if (this._lightboxKeyHandler) {
            document.removeEventListener('keydown', this._lightboxKeyHandler);
            this._lightboxKeyHandler = null;
        }
    }

    /**
     * Show a figure full-size over the page.
     *
     * Thumbnails and in-popover figures are deliberately small, so the only way
     * to actually read a diagram is to open it at full size. The image data is
     * already inline (base64), so this costs no extra request.
     *
     * @param {string} src   Image source (a base64 data URI).
     * @param {string} [caption] Caption shown under the image.
     */
    showImageLightbox(src, caption) {
        if (!src) return;
        this.removeImageLightbox();

        const overlay = document.createElement('div');
        overlay.id = 'chatbot-image-lightbox';
        overlay.className = 'chatbot-image-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', this.t('enlargeImage'));

        overlay.innerHTML = `
            <button class="chatbot-lightbox-close" type="button" aria-label="${this.escapeHtml(this.t('closeImage'))}" title="${this.escapeHtml(this.t('closeImage'))}">&times;</button>
            <figure class="chatbot-lightbox-figure">
                <img src="${this.escapeHtml(src)}" alt="${this.escapeHtml(caption || '')}">
                ${caption ? `<figcaption>${this.escapeHtml(caption)}</figcaption>` : ''}
            </figure>
        `;

        // Backdrop closes; clicks on the image itself must not.
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target === overlay || e.target.closest('.chatbot-lightbox-close')) {
                this.removeImageLightbox();
            }
        });

        this._lightboxKeyHandler = (e) => {
            if (e.key === 'Escape') this.removeImageLightbox();
        };
        document.addEventListener('keydown', this._lightboxKeyHandler);

        document.body.appendChild(overlay);
        overlay.querySelector('.chatbot-lightbox-close').focus();
    }

    /**
     * Open the lightbox for a zoomable image element, if the click hit one.
     *
     * @param {EventTarget} target Click target.
     * @returns {boolean} True when a lightbox was opened.
     */
    handleZoomableImageClick(target) {
        const image = target.closest && target.closest('img.chatbot-zoomable');
        if (!image) return false;

        // Prefer an explicit caption over the alt text, which may be empty.
        const caption = image.getAttribute('data-caption') || image.getAttribute('alt') || '';
        this.showImageLightbox(image.getAttribute('src'), caption);
        return true;
    }

    /**
     * Show chunk popover with content
     */
    showChunkPopover(chunk, targetLink) {
        this.removeChunkPopover();

        // Create popover
        const popover = document.createElement('div');
        popover.id = 'chatbot-chunk-popover';
        popover.style.position = 'fixed';
        popover.style.zIndex = '2147483647';
        popover.style.background = 'var(--chatbot-surface)';
        popover.style.color = 'var(--chatbot-text)';
        popover.style.border = '1px solid var(--chatbot-border)';
        popover.style.borderRadius = '8px';
        popover.style.boxShadow = 'var(--chatbot-shadow)';
        popover.style.padding = '16px 20px';
        popover.style.minWidth = '220px';
        popover.style.maxWidth = '400px';
        // A long chunk plus attached figures can exceed any viewport; capping
        // height here (rather than only each content block) is what actually
        // keeps the close button on screen - positionChunkPopover can only
        // reposition the popover, not shrink it.
        popover.style.maxHeight = 'calc(100vh - 20px)';
        popover.style.overflowY = 'auto';
        popover.style.fontSize = '14px';
        popover.style.lineHeight = '1.5';
        popover.style.fontFamily = 'inherit';

        const chunkText = chunk.text || this.t('sources') + ' ' + (chunk.document || chunk.source || '');
        const escapedText = this.escapeHtml(chunkText);
        const escapedDocument = this.escapeHtml(chunk.document || chunk.source || '');

        const contentType = chunk.contentType || 'text';
        const headerIcon = contentType === 'figure' ? this.icon('image') : contentType === 'table' ? this.icon('chart') : this.icon('document');

        const metaParts = [];
        if (chunk.page_number > 0) metaParts.push(`${this.t('page')} ${chunk.page_number}`);
        if (chunk.section_path) metaParts.push(chunk.section_path);
        else if (chunk.section_title) metaParts.push(chunk.section_title);
        const metaHtml = metaParts.length
            ? `<div style="font-size:11px; color:var(--chatbot-muted); margin-bottom:8px;">${this.escapeHtml(metaParts.join(' · '))}</div>`
            : '';

        const zoomTitle = this.escapeHtml(this.t('enlargeImage'));

        // Images live only in the popover (and the lightbox opened from it) -
        // never inline in the source list. A figure source shows its own
        // image; a text source's related figures (printed beside it, or
        // referenced by it) render here too, in their own small gallery.
        let bodyHtml;
        if (contentType === 'figure' && chunk.assetUrl) {
            // chunk.assetUrl always holds the inline base64 image data here (see
            // _sourceFromLink) - the API never sends a fetchable asset URL, so
            // there is nothing else to request.
            const escapedImageSrc = this.escapeHtml(chunk.assetUrl);
            // The caption is the document's own wording; `text` is the indexed
            // form and carries OCR output, which reads as noise under an image.
            const figureCaption = chunk.caption || chunkText;
            const captionHtml = figureCaption
                ? `<div style="font-size:13px; color:var(--chatbot-muted); margin-top:8px;">${this.escapeHtml(figureCaption)}</div>`
                : '';
            bodyHtml = `
                <img class="chatbot-zoomable" src="${escapedImageSrc}" alt="${this.escapeHtml(chunk.caption || '')}" data-caption="${this.escapeHtml(chunk.caption || '')}" title="${zoomTitle}" style="max-width:100%; max-height:280px; display:block; margin:0 0 4px 0; border-radius:6px;">
                ${captionHtml}
            `;
        } else if (contentType === 'table' && typeof marked !== 'undefined') {
            bodyHtml = `<div class="chatbot-table-wrapper" style="max-height:300px; overflow-y:auto; margin:0 0 12px 0;">${marked.parse(chunkText)}</div>`;
        } else {
            bodyHtml = `<pre style="white-space:pre-wrap; word-wrap:break-word; background:var(--chatbot-surface-2); padding:12px; border-radius:6px; margin:0 0 12px 0; font-size:13px; max-height:300px; overflow-y:auto; font-family:inherit;">${escapedText}</pre>`;
        }

        const relatedFigures = Array.isArray(chunk.relatedFigures) ? chunk.relatedFigures : [];
        const relatedFiguresHtml = relatedFigures.length
            ? `<div style="font-size:11px; color:var(--chatbot-muted); margin-bottom:6px;">${this.escapeHtml(this.t('relatedFigures'))}</div>
                <div class="chatbot-popover-figures">
                    ${relatedFigures.map((asset) => `
                        <figure class="chatbot-popover-figure">
                            <img class="chatbot-zoomable" src="${this.escapeHtml(asset.asset_data)}" alt="${this.escapeHtml(asset.caption || '')}" data-caption="${this.escapeHtml(asset.caption || '')}" title="${zoomTitle}">
                            ${asset.caption ? `<figcaption>${this.escapeHtml(asset.caption)}</figcaption>` : ''}
                        </figure>
                    `).join('')}
                </div>`
            : '';

        const documentName = chunk.document || chunk.source || '';
        const isPdf = documentName.toLowerCase().endsWith('.pdf');
        const pageNumber = Number(chunk.page_number) || -1;
        const actionsHtml = isPdf
            ? `<div class="chatbot-popover-actions">
                    ${pageNumber > 0
                        ? `<button type="button" class="chatbot-popover-view-page">${this.escapeHtml(this.t('viewPage'))} ${pageNumber}</button>`
                        : ''}
                    <button type="button" class="chatbot-popover-open-pdf">${this.escapeHtml(this.t('openPdf'))}</button>
                </div>`
            : '';

        popover.innerHTML = `
            <div style="font-weight:600; margin-bottom:8px; color:var(--chatbot-primary-color);">${headerIcon} ${this.t('sources')}</div>
            <div style="font-size:12px; color:var(--chatbot-muted); margin-bottom:4px;"><b>${escapedDocument}</b></div>
            ${metaHtml}
            ${bodyHtml}
            ${relatedFiguresHtml}
            ${actionsHtml}
            <button class="chatbot-popover-close" style="padding:6px 16px; background:var(--chatbot-primary-color); color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:13px;">${this.t('closeChat').replace('chat', 'popup') || 'Chiudi'}</button>
        `;

        // Add close button handler with event stopping
        const closeBtn = popover.querySelector('.chatbot-popover-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeChunkPopover();
        });

        const viewPageBtn = popover.querySelector('.chatbot-popover-view-page');
        if (viewPageBtn) {
            viewPageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const base = this.getDocumentsBaseUrl();
                const file = encodeURIComponent(documentName);
                const needle = (chunk.text || '').trim().slice(0, HIGHLIGHT_MAX_CHARS);
                const src = `${base}/${file}/pages/${pageNumber}`
                    + `?width=1240&highlight=${encodeURIComponent(needle)}`;
                this.showImageLightbox(src, `${documentName} — ${this.t('page')} ${pageNumber}`);
            });
        }

        const openPdfBtn = popover.querySelector('.chatbot-popover-open-pdf');
        if (openPdfBtn) {
            openPdfBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const base = this.getDocumentsBaseUrl();
                const file = encodeURIComponent(documentName);
                const fragment = pageNumber > 0 ? `#page=${pageNumber}` : '';
                window.open(`${base}/${file}/file${fragment}`, '_blank', 'noopener');
            });
        }

        // Stop propagation on popover clicks to prevent chat from closing,
        // and open the lightbox when a figure source's own image is clicked.
        popover.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleZoomableImageClick(e.target);
        });

        // Measure before positioning: how tall the popover ends up depends on
        // its content, so a fixed guess would push some popovers off-screen.
        document.body.appendChild(popover);
        this.positionChunkPopover(popover, targetLink);

        // An inline image still decodes asynchronously, so the popover can grow
        // taller *after* this first measurement - reposition once each image
        // has actually settled, or a figure could push the close button (or
        // the popover itself) past the edge of the viewport regardless of the
        // check above.
        popover.querySelectorAll('img').forEach((img) => {
            if (img.complete) return;
            img.addEventListener('load', () => this.positionChunkPopover(popover, targetLink), { once: true });
        });

        // Remove on outside click
        setTimeout(() => {
            const handler = (e) => {
                if (!popover.contains(e.target) && !e.target.closest('.chatbot-image-lightbox')) {
                    this.removeChunkPopover();
                    document.removeEventListener('mousedown', handler);
                }
            };
            document.addEventListener('mousedown', handler);
        }, 0);
    }

    /**
     * Place an already-rendered popover next to its trigger, inside the viewport.
     *
     * Uses the popover's measured size rather than an assumed one, flipping it
     * above the trigger when there is more room there, so it cannot hang off the
     * bottom of the screen and take its close button with it.
     *
     * @param {HTMLElement} popover    The rendered popover.
     * @param {HTMLElement} targetLink The element it points at.
     */
    positionChunkPopover(popover, targetLink) {
        const margin = 10;
        const gap = 6;
        const rect = targetLink.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const height = popover.offsetHeight;
        const width = popover.offsetWidth;

        const fitsBelow = rect.bottom + gap + height + margin <= viewportHeight;
        const fitsAbove = rect.top - gap - height - margin >= 0;
        // Prefer below; flip up only when it does not fit there but does above.
        const placeAbove = !fitsBelow && fitsAbove;

        let top = placeAbove ? rect.top - gap - height : rect.bottom + gap;
        top = Math.min(Math.max(margin, top), Math.max(margin, viewportHeight - height - margin));

        let left = Math.min(rect.left, viewportWidth - width - margin);
        left = Math.max(margin, left);

        popover.style.top = top + 'px';
        popover.style.left = left + 'px';
    }

    /**
     * Show violation popover with details
     */
    showViolationPopover(violation, targetLink) {
        this.removeChunkPopover(); // Reuse the same removal method

        // Create popover
        const popover = document.createElement('div');
        popover.id = 'chatbot-chunk-popover'; // Reuse the same ID
        popover.style.position = 'fixed';
        popover.style.zIndex = '2147483647';
        popover.style.background = 'var(--chatbot-surface)';
        popover.style.color = 'var(--chatbot-text)';
        popover.style.border = '1px solid var(--chatbot-border)';
        popover.style.borderRadius = '8px';
        popover.style.boxShadow = 'var(--chatbot-shadow)';
        popover.style.padding = '16px 20px';
        popover.style.minWidth = '220px';
        popover.style.maxWidth = '400px';
        // A long chunk plus attached figures can exceed any viewport; capping
        // height here (rather than only each content block) is what actually
        // keeps the close button on screen - positionChunkPopover can only
        // reposition the popover, not shrink it.
        popover.style.maxHeight = 'calc(100vh - 20px)';
        popover.style.overflowY = 'auto';
        popover.style.fontSize = '14px';
        popover.style.lineHeight = '1.5';
        popover.style.fontFamily = 'inherit';

        const code = this.escapeHtml(violation.code || 'Violation');
        const description = this.escapeHtml(violation.description || 'No description available');
        const threatLevel = this.escapeHtml(violation.threat_level || '');
        const confidence = violation.confidence || '';

        let metaInfo = '';
        if (threatLevel) {
            metaInfo += `<div style="font-size:12px; color:var(--chatbot-muted); margin-bottom:4px;"><b>Threat Level:</b> ${threatLevel}</div>`;
        }
        if (confidence) {
            metaInfo += `<div style="font-size:12px; color:var(--chatbot-muted); margin-bottom:4px;"><b>Confidence:</b> ${confidence}</div>`;
        }

        popover.innerHTML = `
            <div style="font-weight:600; margin-bottom:8px; color:var(--chatbot-danger-color);">${this.icon('warning')} Violation Details</div>
            <div style="font-size:13px; margin-bottom:8px;"><b>${code}</b></div>
            ${metaInfo}
            <div style="white-space:pre-wrap; word-wrap:break-word; background:var(--chatbot-surface-2); padding:12px; border-radius:6px; margin:0 0 12px 0; font-size:13px; max-height:300px; overflow-y:auto;">${description}</div>
            <button class="chatbot-popover-close" style="padding:6px 16px; background:var(--chatbot-primary-color); color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:13px;">Chiudi</button>
        `;

        // Add close button handler with event stopping
        const closeBtn = popover.querySelector('.chatbot-popover-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeChunkPopover();
        });

        // Stop propagation on popover clicks to prevent chat from closing
        popover.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Position popover near the button (using fixed positioning relative to viewport)
        const rect = targetLink.getBoundingClientRect();

        // Calculate position, ensuring it stays within viewport
        let top = rect.bottom + 6;
        let left = rect.left;

        // Adjust if popover would go off screen
        if (left + 400 > window.innerWidth) {
            left = window.innerWidth - 420;
        }
        if (top + 400 > window.innerHeight) {
            top = rect.top - 410;
        }

        popover.style.top = top + 'px';
        popover.style.left = Math.max(10, left) + 'px';

        // Remove on outside click
        setTimeout(() => {
            const handler = (e) => {
                if (!popover.contains(e.target)) {
                    this.removeChunkPopover();
                    document.removeEventListener('mousedown', handler);
                }
            };
            document.addEventListener('mousedown', handler);
        }, 0);

        document.body.appendChild(popover);
    }

    /**
     * Destroy widget (cleanup)
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.handleEscapeKey);
        document.removeEventListener('click', this.handleOutsideClick);
        if (this._darkSchemeMediaQuery) {
            this._darkSchemeMediaQuery.removeEventListener('change', this._darkSchemeChangeHandler);
        }

        // Remove any popovers
        this.removeChunkPopover();

        // Remove widget from DOM
        this.element.innerHTML = '';
        this.element.className = '';
    }
}

/**
 * Auto-initialize widgets on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('[id^="chatbot-widget"]');
    widgets.forEach(element => {
        new ChatbotWidget(element);
    });
});

/**
 * Global initialization function for manual setup
 */
window.ChatbotWidget = ChatbotWidget;

/**
 * Initialize widget with custom options
 */
window.initChatbotWidget = (elementId, options = {}) => {
    const element = document.getElementById(elementId);
    if (element) {
        return new ChatbotWidget(element, options);
    }
    console.error(`Element with id "${elementId}" not found`);
    return null;
};
