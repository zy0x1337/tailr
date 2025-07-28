/**
 * ========================================
 * TAILR AUTH MANAGER - AUTH0 INTEGRATION
 * ========================================
 * Kompatibel mit Standard-Script-Tags
 * Version: 2.3 - Juli 2025
 */

class AuthManager {
    constructor(app) {
        this.app = app;
        this.auth0Client = null;
        this.user = null;
        
        // State Management
        this.isInitialized = false;
        this.isLoading = true;
        this.hasError = false;
        this.currentError = null;
        
        // Configuration
        this.config = {
            domain: null,
            clientId: null,
            redirectUri: window.location.origin,
            logoutUri: window.location.origin,
            scope: 'openid profile email read:current_user update:current_user_metadata',
            audience: null
        };
        
        // Event Callbacks
        this.callbacks = {
            onLogin: [],
            onLogout: [],
            onUserChange: [],
            onError: [],
            onStateChange: [],
            onInitialized: []
        };
        
        // Initialize
        this.init();
    }

    /**
     * ========================================
     * INITIALIZATION
     * ========================================
     */
    
    async init() {
        try {
            console.log('🚀 AuthManager: Initialisierung gestartet...');
            
            // Auth0 SDK laden
            await this.loadAuth0SDK();
            
            // Configuration laden
            this.loadConfiguration();
            
            // Auth0 Client erstellen
            await this.createAuth0Client();
            
            // Redirect Callback handhaben
            if (this.isRedirectCallback()) {
                console.log('🔄 Redirect-Callback erkannt...');
                await this.handleRedirectCallback();
            }
            
            // Authentifizierungsstatus prüfen
            await this.checkAuthentication();
            
            // Initialisierung abgeschlossen
            this.isInitialized = true;
            this.isLoading = false;
            
            console.log('✅ AuthManager: Erfolgreich initialisiert');
            this.triggerCallback('onInitialized', this.getStatus());
            
           // Automatischer State-Wechsel nach Initialisierung
            setTimeout(() => {
                console.log('🔄 Automatischer State-Übergang nach Initialisierung');
                this.showAppropriateState();
            }, 200);
            
        } catch (error) {
            console.error('❌ AuthManager: Initialisierung fehlgeschlagen', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Auth0 SDK dynamisch laden
     */
    async loadAuth0SDK() {
        return new Promise((resolve, reject) => {
            // Prüfen ob Auth0 bereits geladen ist
            if (window.auth0) {
                resolve();
                return;
            }
            
            // Auth0 SDK über CDN laden
            const script = document.createElement('script');
            script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js';
            script.async = true;
            
            script.onload = () => {
                console.log('✅ Auth0 SDK geladen');
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('❌ Fehler beim Laden des Auth0 SDK:', error);
                reject(new Error('Auth0 SDK konnte nicht geladen werden'));
            };
            
            document.head.appendChild(script);
        });
    }

    /**
     * Konfiguration laden
     */
    loadConfiguration() {
        // Netlify Environment Variables oder Fallbacks
        this.config.domain = this.getEnvironmentVariable('AUTH0_DOMAIN');
        this.config.clientId = this.getEnvironmentVariable('AUTH0_CLIENT_ID');
        
        // Audience basierend auf Domain setzen
        if (this.config.domain) {
            this.config.audience = `https://${this.config.domain}/api/v2/`;
        }
        
        // Validierung
        if (!this.config.domain || !this.config.clientId) {
            throw new Error('Auth0-Konfiguration nicht gefunden. Stellen Sie sicher, dass AUTH0_DOMAIN und AUTH0_CLIENT_ID als Umgebungsvariablen gesetzt sind.');
        }
        
        console.log('🔧 Auth0-Konfiguration geladen:', {
            domain: this.config.domain,
            clientId: this.config.clientId.substring(0, 8) + '...',
            audience: this.config.audience
        });
    }

    /**
     * Environment Variable sicher abrufen (Browser-kompatibel)
     */
    getEnvironmentVariable(key) {
        // Sichere Überprüfung für verschiedene Quellen
        
        // 1. Webpack/Vite Environment Variables (zur Build-Zeit injiziert)
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
        
        // 2. Window-basierte Environment Variables
        if (window.ENV && window.ENV[key]) {
            return window.ENV[key];
        }
        
        // 3. Netlify-spezifische Environment Variables
        if (window.NETLIFY_ENV && window.NETLIFY_ENV[key]) {
            return window.NETLIFY_ENV[key];
        }
        
        // 4. Globale Variables (manuell gesetzt)
        if (window[key]) {
            return window[key];
        }
        
        // 5. Meta-Tags auslesen (Alternative Methode)
        const metaTag = document.querySelector(`meta[name="env-${key.toLowerCase()}"]`);
        if (metaTag) {
            return metaTag.getAttribute('content');
        }
        
        // 6. Fallback für bekannte Netlify-Patterns
        if (key === 'AUTH0_DOMAIN' && window.location.hostname.includes('netlify.app')) {
            // Versuche Auth0-Domain aus bekannten Patterns zu ermitteln
            const siteName = window.location.hostname.split('.')[0];
            return `${siteName}.auth0.com`; // Dies ist nur ein Fallback-Beispiel
        }
        
        console.warn(`⚠️ Environment Variable '${key}' nicht gefunden`);
        return null;
    }

    /**
     * Auth0 Client erstellen
     */
    async createAuth0Client() {
        if (!window.auth0) {
            throw new Error('Auth0 SDK nicht verfügbar');
        }
        
        this.auth0Client = await window.auth0.createAuth0Client({
            domain: this.config.domain,
            clientId: this.config.clientId,
            authorizationParams: {
                redirect_uri: this.config.redirectUri,
                audience: this.config.audience,
                scope: this.config.scope
            },
            cacheLocation: 'localstorage',
            useRefreshTokens: true,
            useRefreshTokensFallback: true
        });
    }

    /**
     * ========================================
     * AUTHENTICATION METHODS
     * ========================================
     */

    /**
     * Login mit Redirect
     */
    async login(options = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ Auth Manager noch nicht initialisiert');
            return;
        }

        try {
            console.log('🔑 Weiterleitung zu Auth0 Login...');
            
            await this.auth0Client.loginWithRedirect({
                authorizationParams: {
                    prompt: 'select_account',
                    screen_hint: 'login',
                    ...options
                }
            });
        } catch (error) {
            console.error('❌ Login fehlgeschlagen:', error);
            this.handleAuthError(error);
            throw error;
        }
    }

    /**
     * Login mit Popup
     */
    async loginWithPopup(options = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ Auth Manager noch nicht initialisiert');
            return;
        }

        try {
            console.log('🪟 Popup-Login wird gestartet...');
            
            await this.auth0Client.loginWithPopup({
                authorizationParams: {
                    prompt: 'select_account',
                    screen_hint: 'login',
                    ...options
                }
            });
            
            // User-Status aktualisieren
            await this.updateUserState();
            
            console.log('✅ Popup-Login erfolgreich');
            this.triggerCallback('onLogin', this.user);
            
        } catch (error) {
            console.error('❌ Popup-Login fehlgeschlagen:', error);
            this.handleAuthError(error);
            throw error;
        }
    }

    /**
     * Logout
     */
    async logout(options = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ Auth Manager noch nicht initialisiert');
            return;
        }

        try {
            console.log('🚪 Abmeldung wird durchgeführt...');
            
            // Callbacks auslösen
            this.triggerCallback('onLogout', this.user);
            
            // User-Status zurücksetzen
            this.user = null;
            this.triggerCallback('onUserChange', null);
            
            // Auth0 Logout
            await this.auth0Client.logout({
                logoutParams: {
                    returnTo: this.config.logoutUri,
                    ...options
                }
            });
            
        } catch (error) {
            console.error('❌ Abmeldung fehlgeschlagen:', error);
            this.handleAuthError(error);
            throw error;
        }
    }

    /**
     * Redirect Callback prüfen
     */
    isRedirectCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('code') || urlParams.has('error') || urlParams.has('state');
    }

    /**
     * Redirect Callback verarbeiten
     */
    async handleRedirectCallback() {
        try {
            console.log('🔄 Redirect-Callback wird verarbeitet...');
            
            const result = await this.auth0Client.handleRedirectCallback();
            
            // URL bereinigen
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // User-Status aktualisieren
            await this.updateUserState();
            
            console.log('✅ Redirect-Callback erfolgreich verarbeitet');
            this.triggerCallback('onLogin', this.user);
            
            return result;
        } catch (error) {
            console.error('❌ Redirect-Callback fehlgeschlagen:', error);
            
            // URL trotzdem bereinigen
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            throw error;
        }
    }

    /**
     * Authentifizierungsstatus prüfen
     */
    async checkAuthentication() {
        try {
            const isAuthenticated = await this.auth0Client.isAuthenticated();
            
            if (isAuthenticated) {
                await this.updateUserState();
                console.log('✅ Benutzer ist authentifiziert:', this.user?.email);
            } else {
                this.user = null;
                console.log('ℹ️ Benutzer ist nicht authentifiziert');
            }
            
            this.triggerCallback('onUserChange', this.user);
            return isAuthenticated;
        } catch (error) {
            console.error('❌ Authentifizierungsprüfung fehlgeschlagen:', error);
            this.user = null;
            return false;
        }
    }

    /**
     * User-Status aktualisieren
     */
    async updateUserState() {
        try {
            this.user = await this.auth0Client.getUser();
            
            if (this.user) {
                console.log('👤 Benutzerdaten aktualisiert:', this.user.email);
            }
            
            this.triggerCallback('onUserChange', this.user);
        } catch (error) {
            console.error('❌ Benutzerdaten konnten nicht abgerufen werden:', error);
            this.user = null;
        }
    }

    /**
     * ========================================
     * UI STATE MANAGEMENT (KORRIGIERT)
     * ========================================
     */

    /**
     * UI State setzen
     */
    setState(state) {
    console.log(`🎨 Modal State-Wechsel zu: ${state}`);
    
    // Alle States verstecken
    this.hideAllStates();
    
    // Gewünschten State anzeigen
    switch (state) {
        case 'loading':
            const loadingEl = document.getElementById('auth-loading');
            if (loadingEl) {
                loadingEl.style.display = 'block';
                console.log('✅ Modal Loading-State angezeigt');
            }
            break;
        case 'logged-out':
            const loggedOutEl = document.getElementById('auth-logged-out');
            if (loggedOutEl) {
                loggedOutEl.style.display = 'block';
                console.log('✅ Modal Logged-out-State angezeigt');
            }
            break;
        case 'logged-in':
            const loggedInEl = document.getElementById('auth-logged-in');
            if (loggedInEl) {
                loggedInEl.style.display = 'block';
                console.log('✅ Modal Logged-in-State angezeigt');
            }
            break;
        case 'error':
            const errorEl = document.getElementById('auth-error');
            if (errorEl) {
                errorEl.style.display = 'block';
                console.log('✅ Modal Error-State angezeigt');
            }
            break;
    }
    
    this.triggerCallback('onStateChange', state);
}

    /**
     * Alle UI States verstecken
     */
    hideAllStates() {
        const stateElements = [
            'auth-loading',
            'auth-logged-out', 
            'auth-logged-in',
            'auth-error'
        ];
        
        stateElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        console.log('🧹 Alle UI-States versteckt');
    }

    /**
     * Angemessenen State basierend auf Status anzeigen
     */
    showAppropriateState() {
    console.log('🎯 State-Bestimmung wird durchgeführt...', {
        hasError: this.hasError,
        isLoading: this.isLoading, 
        isInitialized: this.isInitialized,
        isAuthenticated: this.isAuthenticated()
    });
    
    if (this.hasError) {
        console.log('➡️ Wechsel zu: error');
        this.setState('error');
    } else if (this.isLoading || !this.isInitialized) {
        console.log('➡️ Wechsel zu: loading');
        this.setState('loading');
    } else if (this.isAuthenticated()) {
        console.log('➡️ Wechsel zu: logged-in');
        this.setState('logged-in');
    } else {
        console.log('➡️ Wechsel zu: logged-out');
        this.setState('logged-out');
    }
}

    /**
     * Debug-Methode für State-Probleme
     */
    debugState() {
        console.group('🔍 AuthManager State Debug');
        
        const status = this.getStatus();
        console.log('✅ Status:', status);
        
        // DOM-Elemente prüfen
        const elements = {
            loading: document.getElementById('auth-loading'),
            loggedOut: document.getElementById('auth-logged-out'),
            loggedIn: document.getElementById('auth-logged-in'),
            error: document.getElementById('auth-error')
        };
        
        console.log('🎨 DOM-Elemente:', elements);
        
        // Display-States prüfen
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                const display = window.getComputedStyle(element).display;
                console.log(`${key}: display = ${display}`);
            } else {
                console.error(`❌ Element '${key}' nicht gefunden`);
            }
        });
        
        // Auto-Fix anbieten
        if (status.isInitialized && !status.hasError && !status.isAuthenticated) {
            console.log('💡 Empfehlung: Sollte zu "logged-out" State wechseln');
            console.log('🔧 Auto-Fix wird angewendet...');
            this.setState('logged-out');
        }
        
        console.groupEnd();
    }

    /**
     * Automatisches Debug und Fix für State-Probleme
     */
    autoDebugAndFix() {
    console.log('🔍 Auto-Debug wird ausgeführt...');
    
    // Status prüfen
    const status = this.getStatus();
    console.log('Status:', status);
    
    // DOM-Elemente prüfen
    const elements = {
        loading: document.getElementById('auth-loading'),
        loggedOut: document.getElementById('auth-logged-out'), 
        loggedIn: document.getElementById('auth-logged-in'),
        error: document.getElementById('auth-error')
    };

    let hasVisibleElement = false;
    Object.keys(elements).forEach(key => {
        const element = elements[key];
        if (element) {
            const display = window.getComputedStyle(element).display;
            if (display !== 'none') {
                hasVisibleElement = true;
            }
            console.log(`${key}: ${display}`);
        }
    });

    // KORRIGIERTE PROBLEM-ERKENNUNG
    if (status.isInitialized && !status.hasError) {
        console.log('🔧 State-Korrektur wird angewendet...');
        
        if (status.isAuthenticated) {
            console.log('➡️ Wechsel zu: logged-in');
            this.setState('logged-in');
        } else {
            console.log('➡️ Wechsel zu: logged-out');  
            this.setState('logged-out');
        }
        
        console.log('✅ State-Problem automatisch behoben');
    }
}

    /**
     * ========================================
     * TOKEN AND API METHODS
     * ========================================
     */

    /**
     * Access Token abrufen
     */
    async getAccessToken(options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('Benutzer ist nicht authentifiziert');
        }

        try {
            return await this.auth0Client.getTokenSilently({
                authorizationParams: {
                    audience: this.config.audience,
                    scope: this.config.scope,
                    ...options
                }
            });
        } catch (error) {
            console.error('❌ Access Token konnte nicht abgerufen werden:', error);
            
            // Re-Authentication erforderlich
            if (error.error === 'login_required') {
                this.user = null;
                this.triggerCallback('onUserChange', null);
                this.setState('logged-out');
            }
            
            throw error;
        }
    }

    /**
     * Authentifizierte API-Anfrage
     */
    async apiCall(endpoint, options = {}) {
        try {
            const token = await this.getAccessToken();
            
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`API-Aufruf fehlgeschlagen: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('❌ API-Aufruf fehlgeschlagen:', error);
            throw error;
        }
    }

    /**
     * Update user metadata
     */
    async updateUserMetadata(metadata) {
        try {
            const token = await this.getAccessToken({
                scope: 'update:current_user_metadata'
            });
            
            const response = await fetch(`https://${this.config.domain}/api/v2/users/${this.user.sub}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_metadata: metadata
                })
            });

            if (!response.ok) {
                throw new Error(`Metadata-Update fehlgeschlagen: ${response.status}`);
            }

            // Refresh user data
            await this.updateUserState();
            
            console.log('✅ Benutzer-Metadata erfolgreich aktualisiert');
            return await response.json();
        } catch (error) {
            console.error('❌ Metadata-Update fehlgeschlagen:', error);
            throw error;
        }
    }

    /**
     * ========================================
     * UTILITY METHODS
     * ========================================
     */

    /**
     * Authentifizierungsstatus prüfen
     */
    isAuthenticated() {
        return !!this.user && this.isInitialized && !this.hasError;
    }

    /**
     * Aktueller Benutzer
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * User-ID abrufen
     */
    getCurrentUserId() {
        return this.user?.sub || null;
    }

    /**
     * Admin-Status prüfen
     */
    isCurrentUserAdmin() {
        if (!this.user) return false;
        
        // Prüfe Custom Claims für Admin-Rolle
        const roles = this.user[`https://tailr.netlify.app/roles`] || 
                      this.user[`${this.config.domain}/roles`] ||
                      [];
        
        return Array.isArray(roles) && roles.includes('admin');
    }

    /**
     * Display-Name abrufen
     */
    getUserDisplayName() {
        if (!this.user) return 'Unbekannter Benutzer';
        return this.user.name || 
               this.user.nickname || 
               this.user.given_name || 
               this.user.email?.split('@')[0] || 
               'Benutzer';
    }

    /**
     * Avatar-URL abrufen
     */
    getUserAvatar() {
        if (!this.user) return null;
        return this.user.picture || null;
    }

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        if (!this.user) return false;
        
        // Check custom claims for roles
        const roles = this.user[`https://tailr.netlify.app/roles`] || 
                      this.user[`${this.config.domain}/roles`] ||
                      [];
        
        return Array.isArray(roles) && roles.includes(role);
    }

    /**
     * Get user permissions
     */
    getPermissions() {
        if (!this.user) return [];
        
        return this.user[`https://tailr.netlify.app/permissions`] || 
               this.user[`${this.config.domain}/permissions`] ||
               [];
    }

    /**
     * ========================================
     * EVENT SYSTEM
     * ========================================
     */

    /**
     * Event-Callback registrieren
     */
    on(event, callback) {
        if (this.callbacks[event] && typeof callback === 'function') {
            this.callbacks[event].push(callback);
        } else {
            console.warn(`⚠️ Unbekanntes Event: ${event} oder ungültiger Callback`);
        }
    }

    /**
     * Event-Callback entfernen
     */
    off(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        }
    }

/**
 * Erweiterte triggerCallback-Methode mit Navigation-Updates
 */
triggerCallback(event, data) {
    // Original Callback-Logik
    if (this.callbacks[event]) {
        this.callbacks[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`❌ Callback-Fehler für Event '${event}':`, error);
            }
        });
    }
    
    // ⭐ NAVIGATION-UPDATES BEI AUTH-ÄNDERUNGEN
    if (event === 'onUserChange') {
        this.updateNavigationAuthStatus();
    }
    
    if (event === 'onLogin' && data) {
        console.log('✅ Login erfolgreich - Navigation wird aktualisiert');
        setTimeout(() => {
            this.updateNavigationAuthStatus();
        }, 500);
    }
    
    if (event === 'onLogout') {
        console.log('🚪 Logout erfolgreich - Navigation wird zurückgesetzt');
        this.updateNavigationAuthStatus();
    }
}

/**
 * Navigation-Link-Status basierend auf Auth-Status aktualisieren
 */
updateNavigationAuthStatus() {
    const guestSession = document.getElementById('guest-session');
    const userSession = document.getElementById('user-session');
    const usernameDisplay = document.getElementById('username-display');
    
    if (this.isAuthenticated() && this.user) {
        console.log('👤 Benutzer eingeloggt - Navigation wird aktualisiert');
        
        // Guest-Links verstecken
        if (guestSession) {
            guestSession.style.display = 'none';
        }
        
        // User-Session anzeigen
        if (userSession) {
            userSession.style.display = 'block';
        }
        
        // Benutzername und Avatar aktualisieren
        this.updateUsernameDisplay();
        
    } else {
        console.log('🚪 Benutzer nicht eingeloggt - Navigation wird zurückgesetzt');
        
        // User-Session verstecken
        if (userSession) {
            userSession.style.display = 'none';
        }
        
        // Guest-Links anzeigen
        if (guestSession) {
            guestSession.style.display = 'flex';
        }
    }
}

/**
 * Benutzername und Avatar in Navigation aktualisieren
 */
updateUsernameDisplay() {
    const usernameDisplay = document.getElementById('username-display');
    if (!usernameDisplay || !this.user) return;
    
    const displayName = this.getUserDisplayName();
    const avatarUrl = this.getUserAvatar();
    
    // Avatar-Element erstellen oder aktualisieren
    let avatarElement = usernameDisplay.querySelector('#user-nav-avatar');
    if (avatarUrl) {
        if (!avatarElement) {
            avatarElement = document.createElement('img');
            avatarElement.id = 'user-nav-avatar';
            avatarElement.alt = `${displayName} Avatar`;
            usernameDisplay.insertBefore(avatarElement, usernameDisplay.firstChild);
        }
        avatarElement.src = avatarUrl;
        avatarElement.style.display = 'block';
    } else {
        if (avatarElement) {
            avatarElement.style.display = 'none';
        }
    }
    
    // Benutzername aktualisieren
    const textContent = usernameDisplay.childNodes;
    let textNode = null;
    for (let node of textContent) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNode = node;
            break;
        }
    }
    
    if (textNode) {
        textNode.textContent = `👤 ${displayName}`;
    } else {
        // Falls kein Text-Node vorhanden, erstelle einen
        const span = document.createElement('span');
        span.textContent = `👤 ${displayName}`;
        usernameDisplay.appendChild(span);
    }
    
    // Accessibility-Attribute aktualisieren
    usernameDisplay.setAttribute('aria-label', `${displayName} - Profil-Menü öffnen`);
    usernameDisplay.setAttribute('title', `Angemeldet als ${displayName}`);
}

/**
 * User-Dropdown Event-Handler einrichten
 */
setupUserDropdownEvents() {
    const usernameDisplay = document.getElementById('username-display');
    const userSession = document.getElementById('user-session');
    const logoutBtn = document.getElementById('logout-btn-dropdown');
    
    if (usernameDisplay) {
        // Dropdown Toggle per Klick
        usernameDisplay.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleUserDropdown();
        });
        
        // Dropdown Toggle per Tastatur
        usernameDisplay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleUserDropdown();
            }
        });
    }
    
    // Logout-Button Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleLogout();
        });
    }
    
    // Dropdown schließen bei Klick außerhalb
    document.addEventListener('click', (e) => {
        if (userSession && !userSession.contains(e.target)) {
            this.closeUserDropdown();
        }
    });
    
    // ESC-Taste zum Schließen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            this.closeUserDropdown();
        }
    });
}

/**
 * User-Dropdown öffnen/schließen
 */
toggleUserDropdown() {
    const usernameDisplay = document.getElementById('username-display');
    const dropdown = document.querySelector('#user-session .dropdown');
    
    if (!usernameDisplay || !dropdown) return;
    
    const isExpanded = usernameDisplay.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        this.closeUserDropdown();
    } else {
        this.openUserDropdown();
    }
}

/**
 * User-Dropdown öffnen
 */
openUserDropdown() {
    const usernameDisplay = document.getElementById('username-display');
    const dropdown = document.querySelector('#user-session .dropdown');
    
    if (usernameDisplay && dropdown) {
        usernameDisplay.setAttribute('aria-expanded', 'true');
        dropdown.classList.add('open');
        
        // Focus auf erstes Menü-Item
        const firstMenuItem = dropdown.querySelector('.dropdown-link');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }
}

/**
 * User-Dropdown schließen
 */
closeUserDropdown() {
    const usernameDisplay = document.getElementById('username-display');
    const dropdown = document.querySelector('#user-session .dropdown');
    
    if (usernameDisplay && dropdown) {
        usernameDisplay.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
    }
}

    /**
     * ========================================
     * ERROR HANDLING
     * ========================================
     */

    /**
     * Auth-Fehler behandeln
     */
    handleAuthError(error) {
        this.hasError = true;
        this.currentError = error;
        
        console.error('🚨 Authentifizierungsfehler:', error);
        
        // Update error message in UI
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            let errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
            
            if (error.error === 'access_denied') {
                errorMessage = 'Zugriff verweigert. Bitte versuchen Sie es erneut.';
            } else if (error.error === 'login_required') {
                errorMessage = 'Anmeldung erforderlich. Bitte melden Sie sich an.';
            } else if (error.error === 'network_error') {
                errorMessage = 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            errorMessageElement.textContent = errorMessage;
        }
        
        this.setState('error');
        this.triggerCallback('onError', error);
    }

    /**
     * Initialisierungsfehler behandeln
     */
    handleInitializationError(error) {
        this.isLoading = false;
        this.isInitialized = false;
        
        // Special handling for configuration errors
        const errorMessageElement = document.getElementById('error-message');
        if (error.message.includes('Auth0-Konfiguration') && errorMessageElement) {
            errorMessageElement.innerHTML = `
                <strong>Konfigurationsfehler:</strong><br>
                ${error.message}<br><br>
                <em>Überprüfen Sie die Netlify Auth0 Extension-Einstellungen.</em>
            `;
        }
        
        this.handleAuthError(error);
    }

    /**
     * ========================================
     * STATUS AND DEBUGGING
     * ========================================
     */

    /**
     * Aktueller Status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            isAuthenticated: this.isAuthenticated(),
            hasError: this.hasError,
            user: this.user,
            error: this.currentError,
            config: {
                domain: this.config.domain,
                clientId: this.config.clientId ? `${this.config.clientId.substring(0, 8)}...` : null
            }
        };
    }

    /**
     * Debug-Informationen
     */
    debug() {
        console.group('🔍 AuthManager Debug Info');
        console.log('Status:', this.getStatus());
        console.log('Callbacks:', Object.keys(this.callbacks).map(key => 
            `${key}: ${this.callbacks[key].length} listeners`
        ));
        console.groupEnd();
    }

    /**
     * Reset auth manager
     */
    async reset() {
        console.log('🔄 Auth Manager wird zurückgesetzt...');
        
        // Clear user state
        this.user = null;
        this.hasError = false;
        this.currentError = null;
        this.isInitialized = false;
        this.isLoading = true;
        
        // Clear Auth0 cache
        if (this.auth0Client) {
            try {
                await this.auth0Client.logout({ 
                    logoutParams: { returnTo: this.config.logoutUri },
                    openUrl: false 
                });
            } catch (error) {
                console.warn('⚠️ Cache-Clearing fehlgeschlagen:', error);
            }
        }
        
        // Reinitialize
        await this.init();
    }
}

// Global verfügbar machen
window.AuthManager = AuthManager;

// Global access for debugging (only in development)
if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    window.authManager = window.haustierWissenInstance?.authManager;
    window.debugAuth = () => window.haustierWissenInstance?.authManager?.debugState();
}

console.log('📦 AuthManager geladen - Version 2.3');
