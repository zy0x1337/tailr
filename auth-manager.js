class AuthManager {
    constructor(app) {
        this.app = app;
        this.currentUser = null;
        this.token = null;

        // Warten bis DOM bereit ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeElements();
                this.checkAuth();
                this.setupEventListeners();
            });
        } else {
            this.initializeElements();
            this.checkAuth();
            this.setupEventListeners();
        }
    }

    initializeElements() {
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.logoutBtn = document.getElementById('logout-btn');
    }

    // Fügen Sie die fehlenden Methoden hinzu...
    async login(email, password) {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password: password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login fehlgeschlagen');
            }

            const result = await response.json();
            if (result.success) {
                this.currentUser = result.user;
                this.token = 'mock-token'; // Da Ihr Backend noch keine echten Tokens verwendet
                this.updateUIVisibility();
                alert('Login erfolgreich!');
                this.app.handleNavigation('home');
            }
        } catch (error) {
            console.error('Login-Fehler:', error);
            alert(`Login fehlgeschlagen: ${error.message}`);
        }
    }

    async register(username, password, passwordConfirm) {
        if (password !== passwordConfirm) {
            alert('Die Passwörter stimmen nicht überein.');
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Registrierung fehlgeschlagen');
            }

            alert(result.message);
            // Nach erfolgreicher Registrierung zum Login weiterleiten
            this.app.handleNavigation('login');
        } catch (error) {
            console.error('Registrierungs-Fehler:', error);
            alert(`Registrierung fehlgeschlagen: ${error.message}`);
        }
    }

    logout() {
        this.currentUser = null;
        this.token = null;
        this.updateUIVisibility();
        
        // Backend-Logout
        fetch('/api/users/logout', { method: 'POST' })
            .then(() => {
                console.log('Benutzer abgemeldet.');
                this.app.handleNavigation('home');
            })
            .catch(err => console.error('Logout-Fehler:', err));
    }

    setupEventListeners() {
        this.loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            await this.login(email, password);
        });

        this.registerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const passwordConfirm = e.target.passwordConfirm.value;
            await this.register(username, password, passwordConfirm);
        });

        this.logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Logout-Button im Dropdown
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
    }

    // Alternative: Event-Delegation für dynamische Logout-Buttons
    document.addEventListener('click', (e) => {
        if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
            e.preventDefault();
            this.logout();
        }
    });
    }

    checkAuth() {
        // Session vom Backend prüfen
        fetch('/api/users/session')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    this.currentUser = data.user;
                    this.token = 'mock-token';
                }
                this.updateUIVisibility();
            })
            .catch(err => {
                console.error('Auth-Check Fehler:', err);
                this.updateUIVisibility();
            });
    }

    // Korrigierte updateUIVisibility Methode
    updateUIVisibility() {
        const isLoggedIn = this.isLoggedIn();
        const isAdmin = this.isCurrentUserAdmin();
        
        // Bestehende Klassen-basierte Sichtbarkeit
        document.querySelectorAll('.logged-in').forEach(el => 
            el.style.display = isLoggedIn ? 'block' : 'none'
        );
        document.querySelectorAll('.logged-out').forEach(el => 
            el.style.display = isLoggedIn ? 'none' : 'block'
        );
        document.querySelectorAll('.admin-only').forEach(el => 
            el.style.display = isAdmin ? 'block' : 'none'
        );

        // User Session Bereich ein-/ausblenden
        const userSession = document.getElementById('user-session');
        if (userSession) {
            userSession.style.display = isLoggedIn ? 'block' : 'none';
        }

        // Username im Dropdown anzeigen
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay && isLoggedIn) {
            usernameDisplay.textContent = this.currentUser.username || 'Benutzer';
        }

        // Navigation-Links für Login/Register ausblenden wenn eingeloggt
        const loginLink = document.querySelector('[data-category="login"]');
        const registerLink = document.querySelector('[data-category="register"]');
        
        if (loginLink) loginLink.style.display = isLoggedIn ? 'none' : 'block';
        if (registerLink) registerLink.style.display = isLoggedIn ? 'none' : 'block';
    }

isLoggedIn() {
        return !!this.currentUser;
    }

    isCurrentUserAdmin() {
        if (!this.currentUser) {
            return false;
        }
        
        // Prüfung basierend auf der Benutzer-Struktur Ihres Systems
        return this.currentUser.role === 'admin' || 
               this.currentUser.isAdmin === true ||
               this.currentUser.admin === true;
    }
}

window.AuthManager = AuthManager;
