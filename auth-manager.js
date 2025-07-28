/**
 * ========================================
 * TAILR AUTH MANAGER - AUTH0 INTEGRATION
 * ========================================
 * Optimiert für Netlify Auth0 Extension
 * Perfekt abgestimmt auf die HTML-Struktur
 * Version: 2.1 - Juli 2025
 */

import { createAuth0Client } from '@auth0/auth0-spa-js';

class TailrAuthManager {
  constructor() {
    // Auth0 Client
    this.auth0Client = null;
    this.user = null;
    
    // State Management
    this.isInitialized = false;
    this.isLoading = true;
    this.hasError = false;
    this.currentError = null;
    
    // DOM Elements Cache
    this.elements = {
      // State Containers
      authLoading: null,
      authLoggedOut: null,
      authLoggedIn: null,
      authError: null,
      
      // Buttons
      loginBtn: null,
      loginPopupBtn: null,
      logoutBtn: null,
      retryBtn: null,
      dashboardBtn: null,
      settingsBtn: null,
      
      // User Info Elements
      userAvatar: null,
      userAvatarPlaceholder: null,
      userName: null,
      userEmail: null,
      userStatus: null,
      
      // Error Elements
      errorMessage: null,
      
      // Loading Elements
      loadingTitle: null,
      loadingText: null
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
    
    // Configuration
    this.config = {
      domain: null,
      clientId: null,
      redirectUri: window.location.origin,
      logoutUri: window.location.origin,
      scope: 'openid profile email read:current_user update:current_user_metadata',
      audience: null
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * ========================================
   * INITIALIZATION
   * ========================================
   */
  
  async init() {
    try {
      console.log('🚀 TailrAuthManager: Initialisierung gestartet...');
      
      // Cache DOM elements
      this.cacheElements();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load configuration
      this.loadConfiguration();
      
      // Show loading state
      this.setState('loading');
      this.updateLoadingText('Auth0-Client wird initialisiert...');
      
      // Create Auth0 client
      await this.createAuth0Client();
      
      // Handle redirect callback if present
      if (this.isRedirectCallback()) {
        this.updateLoadingText('Anmeldung wird verarbeitet...');
        await this.handleRedirectCallback();
      }
      
      // Check current authentication
      this.updateLoadingText('Authentifizierungsstatus wird geprüft...');
      await this.checkAuthentication();
      
      // Mark as initialized
      this.isInitialized = true;
      this.isLoading = false;
      
      console.log('✅ TailrAuthManager: Erfolgreich initialisiert');
      this.triggerCallback('onInitialized', this.getStatus());
      
      // Show appropriate state
      this.showAppropriateState();
      
    } catch (error) {
      console.error('❌ TailrAuthManager: Initialisierung fehlgeschlagen', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Cache all DOM elements
   */
  cacheElements() {
    // State Containers
    this.elements.authLoading = document.getElementById('auth-loading');
    this.elements.authLoggedOut = document.getElementById('auth-logged-out');
    this.elements.authLoggedIn = document.getElementById('auth-logged-in');
    this.elements.authError = document.getElementById('auth-error');
    
    // Buttons
    this.elements.loginBtn = document.getElementById('auth-login-btn');
    this.elements.loginPopupBtn = document.getElementById('auth-login-popup-btn');
    this.elements.logoutBtn = document.getElementById('auth-logout-btn');
    this.elements.retryBtn = document.getElementById('retry-auth-btn');
    this.elements.dashboardBtn = document.getElementById('user-dashboard-btn');
    this.elements.settingsBtn = document.getElementById('user-settings-btn');
    
    // User Info Elements
    this.elements.userAvatar = document.getElementById('user-avatar');
    this.elements.userAvatarPlaceholder = document.getElementById('user-avatar-placeholder');
    this.elements.userName = document.getElementById('user-name');
    this.elements.userEmail = document.getElementById('user-email');
    this.elements.userStatus = document.getElementById('user-status');
    
    // Error Elements
    this.elements.errorMessage = document.getElementById('error-message');
    
    // Loading Elements
    this.elements.loadingTitle = document.querySelector('.loading-title');
    this.elements.loadingText = document.querySelector('.loading-text');
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Login Buttons
    this.elements.loginBtn?.addEventListener('click', () => this.handleLogin());
    this.elements.loginPopupBtn?.addEventListener('click', () => this.handleLoginPopup());
    
    // Logout Button
    this.elements.logoutBtn?.addEventListener('click', () => this.handleLogout());
    
    // Retry Button
    this.elements.retryBtn?.addEventListener('click', () => this.handleRetry());
    
    // Dashboard/Settings Buttons
    this.elements.dashboardBtn?.addEventListener('click', () => this.handleDashboard());
    this.elements.settingsBtn?.addEventListener('click', () => this.handleSettings());
    
    // Navigation buttons (using data attributes)
    document.addEventListener('click', (e) => {
      const category = e.target.dataset?.category;
      if (category) {
        this.handleNavigation(category, e.target);
      }
    });
  }

  /**
   * Load Auth0 configuration
   */
  loadConfiguration() {
    // Try to get from environment variables (Netlify)
    this.config.domain = process.env.AUTH0_DOMAIN || 
                        window.ENV?.AUTH0_DOMAIN || 
                        window.location.hostname.includes('netlify.app') ? 
                        window.NETLIFY_ENV?.AUTH0_DOMAIN : null;
                        
    this.config.clientId = process.env.AUTH0_CLIENT_ID || 
                          window.ENV?.AUTH0_CLIENT_ID || 
                          window.NETLIFY_ENV?.AUTH0_CLIENT_ID;
    
    // Set audience based on domain
    if (this.config.domain) {
      this.config.audience = `https://${this.config.domain}/api/v2/`;
    }
    
    // Validate configuration
    if (!this.config.domain || !this.config.clientId) {
      throw new Error('Auth0-Konfiguration nicht gefunden. Stellen Sie sicher, dass die Netlify Auth0 Extension korrekt konfiguriert ist.');
    }
    
    console.log('🔧 Auth0-Konfiguration geladen:', {
      domain: this.config.domain,
      clientId: this.config.clientId.substring(0, 8) + '...',
      audience: this.config.audience
    });
  }

  /**
   * Create Auth0 client instance
   */
  async createAuth0Client() {
    this.auth0Client = await createAuth0Client({
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
   * Handle login with redirect
   */
  async handleLogin() {
    if (!this.isInitialized) {
      console.warn('⚠️ Auth Manager noch nicht initialisiert');
      return;
    }

    try {
      this.setButtonLoading(this.elements.loginBtn, true);
      
      console.log('🔑 Weiterleitung zu Auth0 Login...');
      
      await this.auth0Client.loginWithRedirect({
        authorizationParams: {
          prompt: 'select_account',
          screen_hint: 'login'
        }
      });
    } catch (error) {
      console.error('❌ Login-Weiterleitung fehlgeschlagen:', error);
      this.setButtonLoading(this.elements.loginBtn, false);
      this.handleAuthError(error);
    }
  }

  /**
   * Handle login with popup
   */
  async handleLoginPopup() {
    if (!this.isInitialized) {
      console.warn('⚠️ Auth Manager noch nicht initialisiert');
      return;
    }

    try {
      this.setButtonLoading(this.elements.loginPopupBtn, true);
      
      console.log('🪟 Popup-Login wird gestartet...');
      
      await this.auth0Client.loginWithPopup({
        authorizationParams: {
          prompt: 'select_account',
          screen_hint: 'login'
        }
      });
      
      // Update user state after successful popup login
      await this.updateUserState();
      
      console.log('✅ Popup-Login erfolgreich');
      this.triggerCallback('onLogin', this.user);
      
    } catch (error) {
      console.error('❌ Popup-Login fehlgeschlagen:', error);
      this.handleAuthError(error);
    } finally {
      this.setButtonLoading(this.elements.loginPopupBtn, false);
    }
  }

  /**
   * Handle logout
   */
  async handleLogout() {
    if (!this.isInitialized) {
      console.warn('⚠️ Auth Manager noch nicht initialisiert');
      return;
    }

    try {
      this.setButtonLoading(this.elements.logoutBtn, true);
      
      console.log('🚪 Abmeldung wird durchgeführt...');
      
      // Trigger logout callback before actual logout
      this.triggerCallback('onLogout', this.user);
      
      // Clear user state
      this.user = null;
      this.triggerCallback('onUserChange', null);
      
      // Auth0 logout with return to origin
      await this.auth0Client.logout({
        logoutParams: {
          returnTo: this.config.logoutUri
        }
      });
      
    } catch (error) {
      console.error('❌ Abmeldung fehlgeschlagen:', error);
      this.handleAuthError(error);
      this.setButtonLoading(this.elements.logoutBtn, false);
    }
  }

  /**
   * Handle retry after error
   */
  async handleRetry() {
    console.log('🔄 Erneuter Versuch wird gestartet...');
    
    // Reset error state
    this.hasError = false;
    this.currentError = null;
    this.isLoading = true;
    
    // Show loading state
    this.setState('loading');
    this.updateLoadingText('Erneuter Verbindungsversuch...');
    
    // Reinitialize
    await this.init();
  }

  /**
   * Check if current URL is a redirect callback
   */
  isRedirectCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') || urlParams.has('error') || urlParams.has('state');
  }

  /**
   * Handle redirect callback after login
   */
  async handleRedirectCallback() {
    try {
      console.log('🔄 Redirect-Callback wird verarbeitet...');
      
      const result = await this.auth0Client.handleRedirectCallback();
      
      // Clean up URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Update user state
      await this.updateUserState();
      
      console.log('✅ Redirect-Callback erfolgreich verarbeitet');
      this.triggerCallback('onLogin', this.user);
      
      return result;
    } catch (error) {
      console.error('❌ Redirect-Callback fehlgeschlagen:', error);
      
      // Clean up URL even on error
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      throw error;
    }
  }

  /**
   * Check current authentication status
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
   * Update user state from Auth0
   */
  async updateUserState() {
    try {
      this.user = await this.auth0Client.getUser();
      
      if (this.user) {
        console.log('👤 Benutzerdaten aktualisiert:', this.user.email);
        this.updateUserUI();
      }
      
      this.triggerCallback('onUserChange', this.user);
    } catch (error) {
      console.error('❌ Benutzerdaten konnten nicht abgerufen werden:', error);
      this.user = null;
    }
  }

  /**
   * ========================================
   * TOKEN AND API METHODS
   * ========================================
   */

  /**
   * Get access token for API calls
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
      
      // If token retrieval fails, user might need to re-authenticate
      if (error.error === 'login_required') {
        this.user = null;
        this.triggerCallback('onUserChange', null);
        this.setState('logged-out');
      }
      
      throw error;
    }
  }

  /**
   * Make authenticated API call
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
   * UI STATE MANAGEMENT
   * ========================================
   */

  /**
   * Set current UI state
   */
  setState(state) {
    // Hide all states first
    this.hideAllStates();
    
    // Show requested state
    switch (state) {
      case 'loading':
        this.elements.authLoading?.style.setProperty('display', 'block');
        break;
      case 'logged-out':
        this.elements.authLoggedOut?.style.setProperty('display', 'block');
        break;
      case 'logged-in':
        this.elements.authLoggedIn?.style.setProperty('display', 'block');
        break;
      case 'error':
        this.elements.authError?.style.setProperty('display', 'block');
        break;
    }
    
    this.triggerCallback('onStateChange', state);
    console.log(`🎨 UI-Status geändert zu: ${state}`);
  }

  /**
   * Hide all UI states
   */
  hideAllStates() {
    this.elements.authLoading?.style.setProperty('display', 'none');
    this.elements.authLoggedOut?.style.setProperty('display', 'none');
    this.elements.authLoggedIn?.style.setProperty('display', 'none');
    this.elements.authError?.style.setProperty('display', 'none');
  }

  /**
   * Show appropriate state based on current status
   */
  showAppropriateState() {
    if (this.hasError) {
      this.setState('error');
    } else if (this.isLoading) {
      this.setState('loading');
    } else if (this.isAuthenticated()) {
      this.setState('logged-in');
    } else {
      this.setState('logged-out');
    }
  }

  /**
   * Update loading text
   */
  updateLoadingText(text) {
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = text;
    }
  }

  /**
   * Update user UI elements
   */
  updateUserUI() {
    if (!this.user) return;
    
    // User Name
    if (this.elements.userName) {
      this.elements.userName.textContent = this.getUserDisplayName();
    }
    
    // User Email
    if (this.elements.userEmail) {
      this.elements.userEmail.textContent = this.user.email || '';
    }
    
    // User Avatar
    const avatarUrl = this.getUserAvatar();
    if (avatarUrl && this.elements.userAvatar) {
      this.elements.userAvatar.src = avatarUrl;
      this.elements.userAvatar.alt = `${this.getUserDisplayName()} Avatar`;
      this.elements.userAvatar.style.display = 'block';
      if (this.elements.userAvatarPlaceholder) {
        this.elements.userAvatarPlaceholder.style.display = 'none';
      }
    } else {
      if (this.elements.userAvatar) {
        this.elements.userAvatar.style.display = 'none';
      }
      if (this.elements.userAvatarPlaceholder) {
        this.elements.userAvatarPlaceholder.style.display = 'flex';
      }
    }
  }

  /**
   * Set button loading state
   */
  setButtonLoading(button, loading) {
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (loading) {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      if (btnText) btnText.style.opacity = '0.6';
      if (btnLoading) btnLoading.style.display = 'inline-flex';
    } else {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      if (btnText) btnText.style.opacity = '1';
      if (btnLoading) btnLoading.style.display = 'none';
    }
  }

  /**
   * ========================================
   * ERROR HANDLING
   * ========================================
   */

  /**
   * Handle authentication errors
   */
  handleAuthError(error) {
    this.hasError = true;
    this.currentError = error;
    
    console.error('🚨 Authentifizierungsfehler:', error);
    
    // Update error message in UI
    if (this.elements.errorMessage) {
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
      
      this.elements.errorMessage.textContent = errorMessage;
    }
    
    this.setState('error');
    this.triggerCallback('onError', error);
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    this.isLoading = false;
    this.isInitialized = false;
    
    // Special handling for configuration errors
    if (error.message.includes('Auth0-Konfiguration')) {
      if (this.elements.errorMessage) {
        this.elements.errorMessage.innerHTML = `
          <strong>Konfigurationsfehler:</strong><br>
          ${error.message}<br><br>
          <em>Überprüfen Sie die Netlify Auth0 Extension-Einstellungen.</em>
        `;
      }
    }
    
    this.handleAuthError(error);
  }

  /**
   * ========================================
   * NAVIGATION HANDLERS
   * ========================================
   */

  /**
   * Handle dashboard navigation
   */
  handleDashboard() {
    console.log('📊 Navigation zu Dashboard');
    // Implement dashboard navigation logic
    // This could redirect to a dashboard page or show dashboard content
  }

  /**
   * Handle settings navigation
   */
  handleSettings() {
    console.log('⚙️ Navigation zu Einstellungen');
    // Implement settings navigation logic
  }

  /**
   * Handle general navigation
   */
  handleNavigation(category, element) {
    console.log(`🧭 Navigation zu: ${category}`);
    
    switch (category) {
      case 'home':
        window.location.href = '/';
        break;
      case 'profile':
        this.handleDashboard();
        break;
      default:
        console.log(`Unbekannte Navigation: ${category}`);
    }
  }

  /**
   * ========================================
   * UTILITY METHODS
   * ========================================
   */

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.user && this.isInitialized && !this.hasError;
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Get user display name
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
   * Get user avatar URL
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
   * Register event callback
   */
  on(event, callback) {
    if (this.callbacks[event] && typeof callback === 'function') {
      this.callbacks[event].push(callback);
    } else {
      console.warn(`⚠️ Unbekanntes Event: ${event} oder ungültiger Callback`);
    }
  }

  /**
   * Remove event callback
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Trigger event callbacks
   */
  triggerCallback(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Callback-Fehler für Event '${event}':`, error);
        }
      });
    }
  }

  /**
   * ========================================
   * STATUS AND DEBUGGING
   * ========================================
   */

  /**
   * Get current status
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
   * Debug information
   */
  debug() {
    console.group('🔍 TailrAuthManager Debug Info');
    console.log('Status:', this.getStatus());
    console.log('DOM Elements:', this.elements);
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

/**
 * ========================================
 * SINGLETON INSTANCE AND EXPORT
 * ========================================
 */

// Create singleton instance
const authManager = new TailrAuthManager();

// Global access for debugging (only in development)
if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
  window.authManager = authManager;
  window.debugAuth = () => authManager.debug();
}

// Export as default
export default authManager;

/**
 * ========================================
 * ADDITIONAL UTILITY EXPORTS
 * ========================================
 */

// Export class for custom instances if needed
export { TailrAuthManager };

// Export utility functions
export const authUtils = {
  isAuthenticated: () => authManager.isAuthenticated(),
  getCurrentUser: () => authManager.getCurrentUser(),
  getUserDisplayName: () => authManager.getUserDisplayName(),
  getUserAvatar: () => authManager.getUserAvatar(),
  hasRole: (role) => authManager.hasRole(role),
  getStatus: () => authManager.getStatus()
};

console.log('📦 TailrAuthManager geladen - Version 2.1');
