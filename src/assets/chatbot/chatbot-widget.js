/**
 * EBot - Minimalist and Accessible Chatbot Interface
 * Version: 1.0.0
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

class ChatbotWidget {
    constructor(element, options = {}) {
        this.element = element;
        this.isOpen = false;
        this.isLoading = false;
        this.isDetailedMode = false;
        this.isExpanded = false;
        this.lastUserMessage = null;
        this.lastBotMessage = null;

        // Default configuration
        this.config = {
            apiUrl: 'http://localhost:8000/rag/ask',
            language: 'it',
            themeColor: '#007bff',
            position: 'bottom-right',
            avatarUrl: null,
            botName: 'Assistant',
            ...options
        };

        // Initialize i18next for localization
        this.initializeI18n();

        // Parse HTML data attributes
        this.parseDataAttributes();

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
                networkError: 'Errore di connessione. Controlla la tua connessione internet.',
                typing: 'Sta pensando...',
                online: 'Online',
                openChat: 'Apri chat',
                closeChat: 'Chiudi chat',
                userAvatar: 'Tu',
                sources: 'Fonti',
                botName: 'Assistente',
                responseMode: 'Modalità risposta',
                simple: 'Semplice',
                detailed: 'Dettagliata',
                modeChanged: 'Modalità cambiata a'
            },
            en: {
                welcome: 'Hello! How can I help you today?',
                placeholder: 'Type your message...',
                send: 'Send message',
                error: 'An error occurred. Please try again later.',
                networkError: 'Connection error. Please check your internet connection.',
                typing: 'Thinking...',
                online: 'Online',
                openChat: 'Open chat',
                closeChat: 'Close chat',
                userAvatar: 'You',
                sources: 'Sources',
                botName: 'Assistant',
                responseMode: 'Response mode',
                simple: 'Simple',
                detailed: 'Detailed',
                modeChanged: 'Mode changed to'
            },
            es: {
                welcome: '¡Hola! ¿Cómo puedo ayudarte hoy?',
                placeholder: 'Escribe tu mensaje...',
                send: 'Enviar mensaje',
                error: 'Se produjo un error. Inténtalo de nuevo más tarde.',
                networkError: 'Error de conexión. Verifica tu conexión a internet.',
                typing: 'Pensando...',
                online: 'En línea',
                openChat: 'Abrir chat',
                closeChat: 'Cerrar chat',
                userAvatar: 'Tú',
                sources: 'Fuentes',
                botName: 'Asistente',
                responseMode: 'Modo de respuesta',
                simple: 'Simple',
                detailed: 'Detallado',
                modeChanged: 'Modo cambiado a'
            },
            fr: {
                welcome: 'Bonjour! Comment puis-je vous aider aujourd\'hui ?',
                placeholder: 'Tapez votre message...',
                send: 'Envoyer le message',
                error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
                networkError: 'Erreur de connexion. Vérifiez votre connexion internet.',
                typing: 'En train de penser...',
                online: 'En ligne',
                openChat: 'Ouvrir le chat',
                closeChat: 'Fermer le chat',
                userAvatar: 'Vous',
                sources: 'Sources',
                botName: 'Assistant',
                responseMode: 'Mode de réponse',
                simple: 'Simple',
                detailed: 'Détaillé',
                modeChanged: 'Mode changé en'
            },
            de: {
                welcome: 'Hallo! Wie kann ich Ihnen heute helfen?',
                placeholder: 'Geben Sie Ihre Nachricht ein...',
                send: 'Nachricht senden',
                error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
                networkError: 'Verbindungsfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
                typing: 'Denkt nach...',
                online: 'Online',
                openChat: 'Chat öffnen',
                closeChat: 'Chat schließen',
                userAvatar: 'Sie',
                sources: 'Quellen',
                botName: 'Assistent',
                responseMode: 'Antwortmodus',
                simple: 'Einfach',
                detailed: 'Detailliert',
                modeChanged: 'Modus geändert zu'
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
        if (data.language) this.config.language = data.language;
        if (data.themeColor) this.config.themeColor = data.themeColor;
        if (data.position) this.config.position = data.position;
        if (data.avatarUrl) this.config.avatarUrl = data.avatarUrl;
        if (data.botName) this.config.botName = data.botName;
    }

    /**
     * Initialize the widget
     */
    init() {
        this.createWidget();
        this.attachEventListeners();
        this.applyCustomStyles();
        this.element.setAttribute('role', 'application');
        this.element.setAttribute('aria-label', 'EBot');
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
      
      <div class="chatbot-container" role="dialog" aria-labelledby="chatbot-title" aria-hidden="true">
        <div class="chatbot-progress" aria-hidden="true">
          <div class="chatbot-progress-bar"></div>
        </div>
        
        <header class="chatbot-header">
          <div class="chatbot-avatar" aria-hidden="true">
            ${this.config.avatarUrl ?
                `<img src="${this.config.avatarUrl}" alt="Bot Avatar">` :
                '<svg viewBox="0 0 64 64" fill="currentColor" style="width: 28px; height: 28px;"><rect x="18" y="16" width="28" height="32" rx="4" fill="currentColor"/><circle cx="28" cy="28" r="3" fill="#fff"/><circle cx="36" cy="28" r="3" fill="#fff"/><rect x="26" y="36" width="12" height="3" rx="1.5" fill="#fff"/><rect x="14" y="12" width="4" height="4" rx="2" fill="currentColor"/><rect x="46" y="12" width="4" height="4" rx="2" fill="currentColor"/><line x1="18" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2"/><line x1="46" y1="14" x2="50" y2="14" stroke="currentColor" stroke-width="2"/></svg>'
            }
          </div>
          <div>
                        <h2 class="chatbot-title" id="chatbot-title">${this.escapeHtml(this.config.botName || this.t('botName'))}</h2>
            <p class="chatbot-status">${this.t('online')}</p>
          </div>
          <button class="chatbot-resize-button" 
                  aria-label="Toggle widget size"
                  type="button"
                  title="Resize widget">
            <svg viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px;">
              <path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
            </svg>
          </button>
        </header>
        
        <div class="chatbot-toggle-container">
          <div>
            <p class="chatbot-toggle-label">${this.t('responseMode')}</p>
            <p class="chatbot-toggle-mode">${this.t('simple')}</p>
          </div>
          <label class="chatbot-toggle-switch" aria-label="${this.t('responseMode')}">
            <input type="checkbox" id="response-mode-toggle" aria-describedby="response-mode-desc">
            <span class="chatbot-toggle-slider"></span>
          </label>
        </div>
        
        <div class="chatbot-welcome">
          ${this.t('welcome')}
        </div>
        
        <div class="chatbot-messages" 
             role="log" 
             aria-live="polite" 
             aria-label="Messaggi della chat"
             tabindex="0">
        </div>
        
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
        this.welcomeMessage = this.element.querySelector('.chatbot-welcome');
        this.resizeButton = this.element.querySelector('.chatbot-resize-button');
    }

    /**
     * Apply custom styles based on configuration
     */
    applyCustomStyles() {
        const root = document.documentElement;
        root.style.setProperty('--chatbot-primary-color', this.config.themeColor);
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

        // Handle clicks outside to close chat
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.element.contains(e.target)) {
                // Don't close if clicking on the popover
                const popover = document.getElementById('chatbot-chunk-popover');
                if (popover && popover.contains(e.target)) {
                    return;
                }
                this.closeChat();
            }
        });

        // Delegate click event for chatbot-source-link
        this.messagesContainer.addEventListener('click', (e) => {
            const link = e.target.closest('.chatbot-source-link');
            if (link) {
                e.preventDefault();
                // Build the source object from data attributes
                const source = {
                    source: link.getAttribute('data-source'),
                    document: link.getAttribute('data-document'),
                    start_char: Number(link.getAttribute('data-start-char')),
                    end_char: Number(link.getAttribute('data-end-char')),
                    sentence_range: JSON.parse(link.getAttribute('data-sentence-range')),
                    text: link.getAttribute('data-text')
                };

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
    }

    /**
     * Handle toggle switch change
     */
    handleToggleChange() {
        this.isDetailedMode = this.toggleSwitch.checked;
        this.toggleModeText.textContent = this.isDetailedMode ? 'Dettagliata' : 'Semplice';

        // Announce change to screen readers
        const announcement = document.createElement('div');
        announcement.className = 'chatbot-sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `Modalità cambiata a: ${this.isDetailedMode ? 'dettagliata' : 'semplice'}`;

        this.element.appendChild(announcement);
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Get current API endpoint based on toggle state
     */
    getCurrentApiUrl() {
        const baseUrl = this.config.apiUrl;

        // If already using /ask/detailed, return as is for detailed mode
        if (this.isDetailedMode) {
            return baseUrl.replace('/ask', '/ask/detailed');
        }

        // For simple mode, ensure we use /ask
        return baseUrl.replace('/ask/detailed', '/ask');
    }

    /**
     * Toggle widget size
     */
    toggleSize() {
        this.isExpanded = !this.isExpanded;

        if (this.isExpanded) {
            this.container.classList.add('expanded');
            this.resizeButton.setAttribute('aria-label', 'Shrink widget');
            this.resizeButton.setAttribute('title', 'Make smaller');
        } else {
            this.container.classList.remove('expanded');
            this.resizeButton.setAttribute('aria-label', 'Expand widget');
            this.resizeButton.setAttribute('title', 'Make larger');
        }
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
            // Send API request
            const response = await this.sendApiRequest(message);

            // Calculate reasoning time
            const reasoningTime = ((Date.now() - startTime) / 1000).toFixed(2);

            console.log('API Response received:', response);
            console.log('Is blocked?', response?.blocked);
            console.log('Reasoning time:', reasoningTime, 'seconds');

            // Handle blocked response (202)
            if (response && response.blocked) {
                console.log('Handling blocked response, data:', response.data);
                this.addBlockedMessage(response.data, reasoningTime);
                this.lastBotMessage = response.data.message || 'Blocked';
            }
            // Add normal bot response (200)
            else if (response && response.answer) {
                console.log('Handling normal response');
                const sources = response.sources || null;
                this.addMessage(response.answer, 'bot', sources, reasoningTime);
                this.lastBotMessage = response.answer;
            }
            else {
                console.error('Invalid response format:', response);
                throw new Error('Formato della risposta non valido');
            }
        } catch (error) {
            console.error('Error in sendMessage:', error);
            this.showError(error);
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Send API request
     */
    async sendApiRequest(message) {
        const apiUrl = this.getCurrentApiUrl();

        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: message }),
            timeout: 120000 // 120 seconds timeout
        };

        if (typeof axios !== 'undefined') {
            // Use axios if available
            try {
                const response = await axios.post(apiUrl, { question: message }, {
                    timeout: 120000,
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: () => true  // Accept all status codes
                });

                console.log('Axios response status:', response.status, 'Data:', response.data);

                // Handle 202 blocked response
                if (response.status === 202) {
                    console.log('202 Blocked response detected');
                    return { blocked: true, data: response.data };
                }

                // Handle 200 success response
                if (response.status === 200) {
                    return response.data;
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

                // Handle 202 blocked response BEFORE checking response.ok
                if (response.status === 202) {
                    const data = await response.json();
                    console.log('202 Blocked response detected:', data);
                    return { blocked: true, data: data };
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
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
        this.hideError();
    }

    /**
     * Add message to chat
     */
    addMessage(content, type, sources = null, reasoningTime = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;

        // Use formatting for bot messages, escape HTML for user messages
        const formattedContent = type === 'bot' ? this.parseTextFormatting(content) : this.escapeHtml(content);

        // Build sources HTML if provided (only in detailed mode)
        let sourcesHtml = '';
        if (this.isDetailedMode && sources && Array.isArray(sources) && sources.length > 0) {
            sourcesHtml = this.buildSourcesHtml(sources);
        }

        // Add reasoning time for bot messages
        let reasoningTimeHtml = '';
        if (type === 'bot' && reasoningTime) {
            reasoningTimeHtml = `<div class="chatbot-reasoning-time">⏱️ ${reasoningTime}s</div>`;
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
        const threatIcon = threatLevelRaw.toLowerCase() === 'critical' ? '🚨' :
            threatLevelRaw.toLowerCase() === 'high' ? '🛑' :
                threatLevelRaw.toLowerCase() === 'medium' ? '⚠️' : 'ℹ️';

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
                ${reasoningTime ? `<div class="chatbot-reasoning-time">\u23f1\ufe0f ${reasoningTime}s</div>` : ''}
            </div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Announce to screen readers
        this.announceMessage(`Security alert: ${message}`, 'bot');
    }

    /**
     * Build HTML for sources section
     */
    buildSourcesHtml(sources) {
        if (!sources || sources.length === 0) return '';

        // Limit to maximum 5 sources
        const limitedSources = sources.slice(0, 5);

        const sourcesLabel = this.t('sources');
        const sourceItems = limitedSources.map((source, index) => {
            // Extract filename from document field, fallback to source field
            let baseName = source.document || source.source || `Source ${index + 1}`;

            // Shorten long filenames: show start + "..." + (char positions)
            const maxLength = 20;
            let displayText = baseName;

            if (baseName.length > maxLength) {
                displayText = baseName.substring(0, maxLength) + '...';
            }

            // Add character position info at the end
            if (source.start_char || source.end_char) {
                const positions = [];
                if (source.start_char) positions.push(`${source.start_char}`);
                if (source.end_char && source.end_char !== source.start_char) positions.push(`${source.end_char}`);
                if (positions.length > 0) {
                    displayText += ` (${positions.join('-')})`;
                }
            }

            const startChar = source.start_char || 0;
            const endChar = source.end_char || 0;
            const text = source.text || '';
            const document = source.document || source.source || '';

            // Create a clickable link with data attributes for potential custom handling
            return `
                <div class="chatbot-source-item">
                    <a href="#" 
                       class="chatbot-source-link"
                       data-source="${this.escapeHtml(document)}"
                       data-document="${this.escapeHtml(document)}"
                       data-start-char="${startChar}"
                       data-end-char="${endChar}"
                       data-sentence-range="${this.escapeHtml(JSON.stringify(source.sentence_range || []))}"
                       data-text="${this.escapeHtml(text)}">
                        <svg class="chatbot-source-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                        ${this.escapeHtml(displayText)}
                    </a>
                </div>
            `;
        }).join('');

        return `
            <div class="chatbot-sources">
                <div class="chatbot-sources-header">${sourcesLabel}:</div>
                <div class="chatbot-sources-list">
                    ${sourceItems}
                </div>
            </div>
        `;
    }

    /**
     * Announce message to screen readers
     */
    announceMessage(content, type) {
        const announcement = document.createElement('div');
        announcement.className = 'chatbot-sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `${type === 'user' ? this.t('userAvatar') : this.config.botName}: ${content}`;

        this.messagesContainer.appendChild(announcement);

        // Remove announcement after screen reader has time to read it
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Show error message
     */
    showError(error) {
        // Handle blocked response (202)
        if (response && response.blocked) {
            // Display the blocked message in the warning area
            this.addBlockedMessage(response.data);
            this.lastBotMessage = response.data.message || 'Blocked';
            return; // Do not treat as error
        }
        // Add normal bot response
        if (response && response.answer) {
            const sources = response.sources || null;
            this.addMessage(response.answer, 'bot', sources);
            this.lastBotMessage = response.answer;
            return;
        }
        // If neither, show error
        this.showError(new Error('Formato della risposta non valido'));

        this.container.insertBefore(errorElement, this.messagesContainer);

        // Auto-hide error after 5 seconds
        setTimeout(() => this.hideError(), 5000);
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorElement = this.container.querySelector('.chatbot-error');
        if (errorElement) {
            errorElement.remove();
        }
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
     * Escape HTML to prevent XSS (deprecated - use parseTextFormatting instead)
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Remove any existing chunk popover
     */
    removeChunkPopover() {
        const old = document.getElementById('chatbot-chunk-popover');
        if (old) old.remove();
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
        popover.style.background = '#fff';
        popover.style.border = '1px solid #e2e8f0';
        popover.style.borderRadius = '8px';
        popover.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
        popover.style.padding = '16px 20px';
        popover.style.minWidth = '220px';
        popover.style.maxWidth = '400px';
        popover.style.fontSize = '14px';
        popover.style.lineHeight = '1.5';
        popover.style.fontFamily = 'inherit';

        const chunkText = chunk.text || this.t('sources') + ' ' + (chunk.document || chunk.source || '');
        const escapedText = this.escapeHtml(chunkText);
        const escapedDocument = this.escapeHtml(chunk.document || chunk.source || '');

        popover.innerHTML = `
            <div style="font-weight:600; margin-bottom:8px; color:var(--chatbot-primary-color);">📄 ${this.t('sources')}</div>
            <div style="font-size:12px; color:#666; margin-bottom:8px;"><b>${escapedDocument}</b></div>
            <pre style="white-space:pre-wrap; word-wrap:break-word; background:#f8f9fa; padding:12px; border-radius:6px; margin:0 0 12px 0; font-size:13px; max-height:300px; overflow-y:auto; font-family:inherit;">${escapedText}</pre>
            <button class="chatbot-popover-close" style="padding:6px 16px; background:var(--chatbot-primary-color); color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:13px;">${this.t('closeChat').replace('chat', 'popup') || 'Chiudi'}</button>
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
     * Show violation popover with details
     */
    showViolationPopover(violation, targetLink) {
        this.removeChunkPopover(); // Reuse the same removal method

        // Create popover
        const popover = document.createElement('div');
        popover.id = 'chatbot-chunk-popover'; // Reuse the same ID
        popover.style.position = 'fixed';
        popover.style.zIndex = '2147483647';
        popover.style.background = '#fff';
        popover.style.border = '1px solid #e2e8f0';
        popover.style.borderRadius = '8px';
        popover.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
        popover.style.padding = '16px 20px';
        popover.style.minWidth = '220px';
        popover.style.maxWidth = '400px';
        popover.style.fontSize = '14px';
        popover.style.lineHeight = '1.5';
        popover.style.fontFamily = 'inherit';

        const code = this.escapeHtml(violation.code || 'Violation');
        const description = this.escapeHtml(violation.description || 'No description available');
        const threatLevel = this.escapeHtml(violation.threat_level || '');
        const confidence = violation.confidence || '';

        let metaInfo = '';
        if (threatLevel) {
            metaInfo += `<div style="font-size:12px; color:#666; margin-bottom:4px;"><b>Threat Level:</b> ${threatLevel}</div>`;
        }
        if (confidence) {
            metaInfo += `<div style="font-size:12px; color:#666; margin-bottom:4px;"><b>Confidence:</b> ${confidence}</div>`;
        }

        popover.innerHTML = `
            <div style="font-weight:600; margin-bottom:8px; color:#dc3545;">⚠️ Violation Details</div>
            <div style="font-size:13px; color:#333; margin-bottom:8px;"><b>${code}</b></div>
            ${metaInfo}
            <div style="white-space:pre-wrap; word-wrap:break-word; background:#f8f9fa; padding:12px; border-radius:6px; margin:0 0 12px 0; font-size:13px; max-height:300px; overflow-y:auto; color:#555;">${description}</div>
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
