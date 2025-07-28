class HaustierWissen {
    constructor() {
    // ===== GRUNDLEGENDE EIGENSCHAFTEN =====
    this.petsData = { categories: [], species: {} };
    this.blogData = [];
    this.currentCategory = null;
    this.speciesList = null;
    this.activeFilters = {};
    this.currentTheme = 'dark';
    this.favorites = new Set(JSON.parse(localStorage.getItem('petFavorites') || '[]'));
    this.favoritesModal = null;
    this.advancedFilter = null;
    this.animalOfDay = null;
    this.speciesObserver = null;
    this.scrollPosition = 0;
    this.isModalOpen = false;

    // ===== SORT & FILTER EIGENSCHAFTEN =====
    this.currentSort = { field: null, order: 'asc' };
    this.displayedCount = 12;
    this.itemsPerLoad = 12;

    // ===== THEME-SYSTEM EIGENSCHAFTEN =====
    this.themeNames = {
        'light': 'Hell',
        'dark': 'Dunkel',
        'luxury': 'Luxury',
        'eco': 'Eco',
        'playful': 'Playful',
        'seasonal-spring': 'Frühling',
        'seasonal-summer': 'Sommer',
        'seasonal-autumn': 'Herbst',
        'seasonal-winter': 'Winter'
    };
    
    this.themeIcons = {
        'light': '☀️',
        'dark': '🌙',
        'luxury': '✨',
        'eco': '🌿',
        'playful': '🎾',
        'seasonal-spring': '🌸',
        'seasonal-summer': '☀️',
        'seasonal-autumn': '🍂',
        'seasonal-winter': '❄️'
    };

    // ===== DOM-REFERENZEN INITIALISIERUNG =====
    this.initializeDOM();
    
    // ===== SINGLETON-PATTERN =====
    if (window.haustierWissenInstance) {
        return window.haustierWissenInstance;
    }
    window.haustierWissenInstance = this;

    // ===== INITIALISIERUNG NACH DOM-READY =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
        this.init();
    }
}

initializeDOM() {
    // ===== HAUPTSEKTIONEN =====
    this.headerContent = document.querySelector('.header__content');
    this.categoriesGrid = document.querySelector('.categories__grid');
    this.categoriesSection = document.querySelector('.categories-section');
    this.speciesSection = document.querySelector('.species-section');
    this.toolsSection = document.querySelector('.tools-section');
    this.blogOverviewSection = document.getElementById('blog-section');
    this.blogDetailSection = document.getElementById('blog-detail-section');
    this.petProfileSection = document.getElementById('pet-profile-section');
    this.comparisonSection = document.getElementById('comparison-section');
    this.myPetsSection = document.getElementById('my-pets-section');
    this.petProfileDetailSection = document.getElementById('pet-profile-detail-section');

    // ===== HAUPT-MODAL REFERENZEN =====
    this.speciesModal = document.getElementById('species-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalCloseBtn = this.speciesModal?.querySelector('.modal-close');
    this.modalGallery = this.speciesModal?.querySelector('.modal-gallery');
    this.modalTabsContainer = this.speciesModal?.querySelector('.modal-tabs');
    
    // ===== EIGENSCHAFTEN-MODAL REFERENZEN =====
    this.eigenschaftenModal = document.getElementById('eigenschaften-modal');
    this.eigenschaftenModalClose = document.getElementById('eigenschaften-modal-close');
    this.eigenschaftenContent = document.getElementById('eigenschaften-content');
    this.eigenschaftenModalTitle = document.getElementById('eigenschaften-modal-title');

    // ===== KRITISCHE DOM-ELEMENTE =====
    this.speciesGrid = document.getElementById('species-grid');
    this.speciesTitle = document.getElementById('species-title');
    
    // ===== FAVORITEN-MODAL =====
    this.favoritesModal = document.getElementById('favorites-modal');
    
    // ===== SEARCH & FILTER ELEMENTE =====
    this.searchInput = document.getElementById('species-search');
    this.subcategoryFilter = document.getElementById('subcategory-filter');
    this.sizeFilter = document.getElementById('size-filter');
    this.careFilter = document.getElementById('care-filter');
    this.resetFiltersBtn = document.getElementById('reset-filters');
    
    // ===== NAVIGATION ELEMENTE =====
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.jumpToTopBtn = document.getElementById('jumpToTopBtn');
    this.backToCategoriesBtn = document.getElementById('back-to-categories');
    
    // ===== THEME-ELEMENTE =====
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeDropdown = document.getElementById('theme-dropdown');
    this.themeIcon = document.getElementById('theme-icon');
    
    // ===== BLOG-ELEMENTE =====
    this.blogGrid = document.getElementById('blog-grid');
    this.blogSearchInput = document.getElementById('blog-search');
    this.blogSortSelect = document.getElementById('blog-sort');
    this.blogLoadMoreBtn = document.querySelector('.blog-load-btn');
    this.blogModal = document.getElementById('blog-modal');
    this.blogModalContent = document.getElementById('blog-modal-content');
    this.blogModalClose = document.getElementById('blog-modal-close');
    this.blogBackBtn = document.getElementById('blog-back-btn');
    
    // ===== PROFIL-ELEMENTE =====
    this.myPetsGrid = document.getElementById('my-pets-grid');
    this.myPetsEmpty = document.getElementById('my-pets-empty');
    this.addNewProfileBtn = document.getElementById('add-new-profile-btn');
    this.backToOverviewBtn = document.getElementById('back-to-overview-btn');
    this.profileDetailContent = document.getElementById('profile-detail-content');
    this.deleteAccountBtn = document.getElementById('delete-account-btn');
    
    // ===== VERGLEICH-ELEMENTE =====
    this.comparisonSlots = {
        slot1: document.getElementById('slot-1'),
        slot2: document.getElementById('slot-2'),
        slot3: document.getElementById('slot-3')
    };
    this.clearComparisonBtn = document.getElementById('clear-comparison');
    this.exportComparisonBtn = document.getElementById('export-comparison');
    this.exportImageBtn = document.getElementById('export-image');
    this.radarChartContainer = document.getElementById('radar-chart-container');
    this.comparisonTableContainer = document.getElementById('comparison-table-container');
    
    // ===== ADMIN-ELEMENTE =====
    this.adminLogSection = document.getElementById('admin-log-section');
    this.adminLogContent = document.getElementById('admin-log-content');

    // ===== VALIDIERUNG UND DEBUG-AUSGABE =====
    this.validateRequiredElements();
}

validateRequiredElements() {
    // ===== KRITISCHE ELEMENTE PRÜFEN =====
    const criticalElements = [
        { element: this.speciesModal, name: 'species-modal', critical: true },
        { element: this.eigenschaftenModal, name: 'eigenschaften-modal', critical: true },
        { element: this.speciesGrid, name: 'species-grid', critical: true },
        { element: this.speciesTitle, name: 'species-title', critical: false },
        { element: this.categoriesGrid, name: 'categories-grid', critical: true },
        { element: this.categoriesSection, name: 'categories-section', critical: true },
        { element: this.speciesSection, name: 'species-section', critical: true }
    ];
    
    // ===== WICHTIGE ELEMENTE PRÜFEN =====
    const importantElements = [
        { element: this.modalTitle, name: 'modal-title', critical: false },
        { element: this.modalCloseBtn, name: 'modal-close', critical: false },
        { element: this.modalGallery, name: 'modal-gallery', critical: false },
        { element: this.modalTabsContainer, name: 'modal-tabs', critical: false },
        { element: this.eigenschaftenModalClose, name: 'eigenschaften-modal-close', critical: false },
        { element: this.eigenschaftenContent, name: 'eigenschaften-content', critical: false },
        { element: this.eigenschaftenModalTitle, name: 'eigenschaften-modal-title', critical: false }
    ];
    
    // ===== OPTIONALE ELEMENTE PRÜFEN =====
    const optionalElements = [
        { element: this.themeToggle, name: 'theme-toggle', critical: false },
        { element: this.favoritesModal, name: 'favorites-modal', critical: false },
        { element: this.blogOverviewSection, name: 'blog-section', critical: false },
        { element: this.comparisonSection, name: 'comparison-section', critical: false },
        { element: this.myPetsSection, name: 'my-pets-section', critical: false },
        { element: this.petProfileSection, name: 'pet-profile-section', critical: false },
        { element: this.adminLogSection, name: 'admin-log-section', critical: false }
    ];
    
    // ===== VALIDIERUNG DURCHFÜHREN =====
    let criticalErrorsFound = false;
    
    console.log('=== DOM ELEMENTS VALIDATION ===');
    
    [...criticalElements, ...importantElements, ...optionalElements].forEach(({ element, name, critical }) => {
        const exists = !!element;
        const status = exists ? '✅' : (critical ? '❌' : '⚠️');
        const level = critical ? 'KRITISCH' : exists ? 'OK' : 'OPTIONAL';
        
        console.log(`${status} ${name}: ${level}`);
        
        if (!exists && critical) {
            criticalErrorsFound = true;
            console.error(`❌ KRITISCHES Element '${name}' fehlt!`);
        }
    });
    
    // ===== MODAL-REFERENZEN SPEZIFISCH PRÜFEN =====
    console.log('\n=== MODAL-REFERENZEN STATUS ===');
    const modalRefs = {
        'Haupt-Modal': this.speciesModal,
        'Modal-Titel': this.modalTitle,
        'Modal-Schließen': this.modalCloseBtn,
        'Modal-Galerie': this.modalGallery,
        'Modal-Tabs': this.modalTabsContainer,
        'Eigenschaften-Modal': this.eigenschaftenModal,
        'Eigenschaften-Titel': this.eigenschaftenModalTitle,
        'Eigenschaften-Inhalt': this.eigenschaftenContent,
        'Eigenschaften-Schließen': this.eigenschaftenModalClose
    };
    
    Object.entries(modalRefs).forEach(([name, element]) => {
        const status = element ? '✅' : '❌';
        console.log(`${status} ${name}:`, !!element);
    });
    
    // ===== THEME-SYSTEM PRÜFEN =====
    console.log('\n=== THEME-SYSTEM STATUS ===');
    const themeElements = {
        'Theme-Toggle': this.themeToggle,
        'Theme-Dropdown': this.themeDropdown,
        'Theme-Icon': this.themeIcon
    };
    
    Object.entries(themeElements).forEach(([name, element]) => {
        const status = element ? '✅' : '⚠️';
        console.log(`${status} ${name}:`, !!element);
    });
    
    // ===== ZUSAMMENFASSUNG =====
    if (criticalErrorsFound) {
        console.error('\n❌ KRITISCHE FEHLER GEFUNDEN! Anwendung funktioniert möglicherweise nicht korrekt.');
        console.warn('Bitte überprüfen Sie die HTML-Struktur und stellen Sie sicher, dass alle kritischen Elemente vorhanden sind.');
    } else {
        console.log('\n✅ Alle kritischen Elemente gefunden - Anwendung sollte funktionieren');
    }
    
    console.log('=== VALIDATION COMPLETE ===\n');
    
    // ===== ZUSÄTZLICHE SETUP-FUNKTIONEN =====
    this.setupDOMObservers();
    this.preloadCriticalResources();
}

setupDOMObservers() {
    // ===== MUTATION OBSERVER FÜR DYNAMISCHE INHALTE =====
    if (window.MutationObserver) {
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Neue Species-Cards erkannt
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList?.contains('species-card')) {
                            this.setupSpeciesCardEvents(node);
                        }
                    });
                }
            });
        });
        
        // Observer für Species-Grid starten
        if (this.speciesGrid) {
            this.mutationObserver.observe(this.speciesGrid, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // ===== RESIZE OBSERVER FÜR RESPONSIVE ANPASSUNGEN =====
    if (window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === this.speciesGrid) {
                    this.adjustGridLayout();
                }
            }
        });
        
        if (this.speciesGrid) {
            this.resizeObserver.observe(this.speciesGrid);
        }
    }
}

preloadCriticalResources() {
    // ===== KRITISCHE BILDER VORLÄDEN =====
    const criticalImages = [
        'images/placeholder.jpg',
        'images/placeholder-animal.jpg',
        'images/placeholder-blog.jpg',
        'images/avatar-default.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // ===== THEME AUS LOCALSTORAGE LADEN =====
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && this.themeNames[savedTheme]) {
        this.currentTheme = savedTheme;
    }
    
    // ===== FILTER-ZUSTÄNDE INITIALISIEREN =====
    this.activeFilters = {};
    this.currentSort = { field: null, order: 'asc' };
    
    console.log('✅ Kritische Ressourcen vorgeladen');
}

setupSpeciesCardEvents(cardElement) {
    // ===== FAVORITEN-BUTTON SETUP =====
    const favoriteBtn = cardElement.querySelector('.favorite-btn');
    if (favoriteBtn) {
        const speciesId = parseInt(favoriteBtn.dataset.speciesId);
        if (speciesId) {
            this.updateFavoriteButton(favoriteBtn, speciesId);
        }
    }
    
    // ===== CARD-KLICK EVENTS =====
    const speciesId = parseInt(cardElement.dataset.speciesId);
    if (speciesId) {
        cardElement.addEventListener('click', (e) => {
            // Nicht auslösen wenn Favoriten-Button geklickt wurde
            if (e.target.closest('.favorite-btn')) return;
            
            this.showSpeciesDetail(speciesId);
        });
    }
    
    // ===== ANIMATION SETUP =====
    if (typeof SpeciesCardAnimator !== 'undefined') {
        SpeciesCardAnimator.initializeCard(cardElement);
    }
}

adjustGridLayout() {
    if (!this.speciesGrid) return;
    
    const containerWidth = this.speciesGrid.offsetWidth;
    
    if (containerWidth >= 1200) {
        this.speciesGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    } else if (containerWidth >= 900) {
        this.speciesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (containerWidth >= 600) {
        this.speciesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else {
        this.speciesGrid.style.gridTemplateColumns = '1fr';
    }
}

// ===== CLEANUP METHODEN =====
cleanup() {
    // ===== OBSERVER BEREINIGEN =====
    if (this.mutationObserver) {
        this.mutationObserver.disconnect();
    }
    
    if (this.resizeObserver) {
        this.resizeObserver.disconnect();
    }
    
    if (this.speciesObserver) {
        this.speciesObserver.disconnect();
    }
    
    console.log('✅ Cleanup abgeschlossen');
}

    async init() {
    console.log('🔧 HaustierWissen init gestartet...');
    this.setupEventListeners();
    await this.loadPetData();
    await this.loadBlogData();
    
    // GEÄNDERT: EnhancedBlogManager erst nach Blog-Daten laden
    if (this.blogData.length > 0) {
        this.blogManager = new EnhancedBlogManager(this);
    }
    
    this.setupThemeSystem();
    this.initFavoritesModal();
    this.animalOfDay = new AnimalOfTheDay(this);
    this.enhanceEigenschaftenModal();
    this.addParallaxEffect();
    this.tooltipSystem = new FinalTooltipSystem();
    this.showHome();
    this.updateFavoriteButtons();
    this.petProfileCreator = new PetProfileCreator('pet-profile-form', this);
    this.authManager = new AuthManager(this);
}

    async showMyPets() {
    this.showSection(this.myPetsSection);
    const grid = document.getElementById('my-pets-grid');
    const emptyState = document.getElementById('my-pets-empty');
    grid.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch('/api/pet-profiles');
        const profiles = await response.json();
        
        grid.innerHTML = '';
        
        if (profiles.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            profiles.forEach(profile => {
                const card = document.createElement('div');
                card.className = 'pet-profile-card';
                card.innerHTML = `
                    <div class="pet-profile-card__header">
                        <img src="${profile.profileImage || 'images/placeholder.jpg'}" class="pet-profile-card__bg-image" alt="">
                        <img src="${profile.profileImage || 'images/placeholder.jpg'}" alt="${profile.petName}" class="pet-profile-card__image" onerror="this.onerror=null;this.src='images/placeholder.jpg';">
                    </div>
                    <div class="pet-profile-card__content">
                        <h3 class="pet-profile-card__name">${profile.petName || 'Unbenannt'}</h3>
                        <p class="pet-profile-card__species">${profile.breed || profile.species}</p>
                        <p class="pet-profile-card__info">
                            Alter: ${profile.birthDate ? Math.floor((new Date() - new Date(profile.birthDate)) / 31557600000) + ' Jahre' : 'Unbekannt'}
                        </p>
                        <div class="pet-profile-card__actions">
                            <button class="btn btn--secondary view-profile-btn" data-id="${profile.id}">Profil ansehen</button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Fehler beim Laden der Haustier-Profile:', error);
        grid.innerHTML = '<p>Fehler beim Laden der Profile.</p>';
    }
}

async showPetProfileDetail(profileId) {
    this.hideAllSections();
    this.showSection(this.petProfileDetailSection);
    const content = document.getElementById('profile-detail-content');
    content.innerHTML = '<div class="loading-spinner"></div>';

    try {
        // Annahme: /api/pet-profiles/:id ist Ihr Endpunkt für ein einzelnes Profil
        const response = await fetch(`/api/pet-profiles/${profileId}`);
        if (!response.ok) throw new Error('Profil nicht gefunden');
        
        // Annahme: Die API-Antwort für das Profil enthält die 'ownerId'
        const p = await response.json(); 

        // --- BERECHTIGUNGSPRÜFUNG ---
        // Prüfen, ob ein Benutzer angemeldet ist und seine ID und Rolle abrufen
        const currentUserId = this.authManager.getCurrentUserId();
        const isAdmin = this.authManager.isCurrentUserAdmin();
        
        // Prüfen, ob der aktuelle Benutzer der Besitzer des Profils ist
        const isOwner = p.ownerId === currentUserId;

        const displayValue = (value, fallback = 'Keine Angabe') => value || `<span class="text-secondary">${fallback}</span>`;
        const createInfoItem = (label, value) => {
            if (!value) return '';
            return `<div class="info-item"><span class="info-item__label">${label}</span><span class="info-item__value">${displayValue(value)}</span></div>`;
        };

        // Das HTML wird nun dynamisch basierend auf den Berechtigungen erstellt
        content.innerHTML = `
            <div class="profile-detail-layout">
                <header class="profile-detail-header">
                    <img src="${p.profileImage || 'images/placeholder.jpg'}" alt="${p.petName}" class="profile-detail-header__image" onerror="this.onerror=null;this.src='images/placeholder.jpg';">
                    <div class="profile-detail-header__info">
                        <h2>${p.petName}</h2>
                        <p>${p.breed || p.species}</p>
                    </div>
                    <div class="profile-detail-header__actions">
                        <!-- Die Buttons werden nur angezeigt, wenn der Nutzer Besitzer ODER Admin ist -->
                        ${isOwner || isAdmin ? `
                            <button class="btn btn--secondary edit-profile-btn" data-id="${p.id}">Bearbeiten</button>
                            <button class="btn btn--danger delete-profile-btn" data-id="${p.id}">Löschen</button>
                        ` : ''}
                    </div>
                </header>
                
                <aside class="profile-sidebar">
                    <div class="profile-section-card">
                        <h3>Steckbrief</h3>
                        <div class="info-grid" style="grid-template-columns: 1fr;">
                            ${createInfoItem('Geschlecht', p.gender)}
                            ${createInfoItem('Geburtsdatum', p.birthDate)}
                            ${createInfoItem('Größe', p.size)}
                            ${createInfoItem('Gewicht', p.weight ? p.weight + ' kg' : '')}
                            ${createInfoItem('Mikrochip', p.microchip)}
                        </div>
                    </div>
                    <button class="btn btn--primary" id="back-to-overview-btn" style="width: 100%;">← Zurück zur Übersicht</button>
                </aside>

                <main class="profile-main-content">
                    <!-- Restlicher Inhalt bleibt unverändert -->
                    <div class="profile-section-card">
                        <h3>Charakter & Verhalten</h3>
                        <div class="info-grid">
                            ${createInfoItem('Temperament', p.temperament)}
                            ${createInfoItem('Aktivitätslevel', p.activityLevel)}
                            ${createInfoItem('Sozialverhalten', p.socialBehavior)}
                            ${createInfoItem('Besonderheiten', p.specialTraits)}
                        </div>
                    </div>
                </main>
            </div>
        `;
    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        content.innerHTML = '<p class="error-message">Das Haustierprofil konnte nicht geladen werden.</p>';
    }
}

async handleDeleteProfile(profileId) {
    if (!confirm('Sind Sie sicher, dass Sie dieses Profil endgültig löschen möchten?')) {
        return;
    }

    try {
        const response = await fetch(`/api/pet-profiles/${profileId}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
            alert('Profil erfolgreich gelöscht.');
            this.showMyPets(); // Zurück zur Übersicht
        } else {
            alert('Fehler beim Löschen des Profils.');
        }
    } catch (error) {
        console.error('Fehler:', error);
        alert('Ein schwerwiegender Fehler ist aufgetreten.');
    }
}

async showAdminLog() {
    // Zusätzliche Sicherheitsprüfung im Frontend
    if (!this.authManager.isCurrentUserAdmin()) {
        console.warn('Nicht-Admin hat versucht, auf das Log zuzugreifen.');
        this.showHome();
        return;
    }

    this.hideAllSections();
    const adminLogSection = document.getElementById('admin-log-section');
    this.showSection(adminLogSection);

    const content = document.getElementById('admin-log-content');
    content.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch('/api/audit-log', {
            headers: { 'Authorization': `Bearer ${this.authManager.getToken()}` }
        });
        if (!response.ok) throw new Error('Logs konnten nicht geladen werden.');

        const logs = await response.json();

        if (logs.length === 0) {
            content.innerHTML = '<p>Keine Log-Einträge vorhanden.</p>';
            return;
        }

        // Tabelle zur Darstellung der Logs erstellen
        let tableHTML = `
            <table class="audit-log-table">
                <thead>
                    <tr>
                        <th>Zeitstempel</th>
                        <th>Benutzer</th>
                        <th>Aktion</th>
                        <th>Ziel</th>
                        <th>IP-Adresse</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map(log => `
                        <tr>
                            <td>${new Date(log.timestamp).toLocaleString('de-DE')}</td>
                            <td>${log.userEmail} (ID: ${log.userId})</td>
                            <td>${log.action}</td>
                            <td>${log.targetResourceId || '-'}</td>
                            <td>${log.ipAddress}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        content.innerHTML = tableHTML;

    } catch (error) {
        console.error('Fehler beim Laden des Audit-Logs:', error);
        content.innerHTML = '<p class="error-message">Die Audit-Logs konnten nicht geladen werden.</p>';
    }
}

    /**
 * Fügt Favoriten-Buttons zu bestehenden Karten hinzu (Fallback/Legacy-Support)
 */
addFavoriteButtonsToExistingCards() {
    console.log('Adding modern favorite buttons to existing cards...');
    
    const tryAddButtons = () => {
        // Nur Karten ohne Favoriten-Buttons behandeln
        const cardsWithoutButtons = document.querySelectorAll('.species-card:not(:has(.favorite-btn)):not(:has(.favorite-button))');
        
        if (cardsWithoutButtons.length === 0) {
            console.log('Keine Karten ohne Favoriten-Buttons gefunden');
            return;
        }
        
        cardsWithoutButtons.forEach(card => {
            const imageContainer = card.querySelector('.species-card__image, .card-hero-image');
            if (imageContainer) {
                const speciesId = parseInt(card.dataset.speciesId);
                
                if (!isNaN(speciesId)) {
                    const favoriteBtn = this.createFavoriteButton(speciesId);
                    imageContainer.appendChild(favoriteBtn);
                    
                    console.log(`Favoriten-Button hinzugefügt für Species ID: ${speciesId}`);
                }
            }
        });
    };
    
    // Sofortiger Versuch
    tryAddButtons();
    
    // Fallback nach kurzer Verzögerung (für dynamische Inhalte)
    setTimeout(() => {
        tryAddButtons();
    }, 500);
}

/**
 * Erstellt einen standardisierten Favoriten-Button
 */
createFavoriteButton(speciesId) {
    const isFav = this.isFavorite(speciesId);
    const favoriteBtn = document.createElement('button');
    
    favoriteBtn.className = `favorite-btn modern-favorite-btn ${isFav ? 'active' : ''}`;
    favoriteBtn.dataset.speciesId = speciesId;
    favoriteBtn.setAttribute('aria-label', isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen');
    favoriteBtn.innerHTML = `
        <svg class="favorite-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;
    favoriteBtn.title = isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen';
    
    return favoriteBtn;
}

toggleThemeDropdown() {
    const dropdown = document.querySelector('.header__theme-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

closeThemeDropdown() {
    const dropdown = document.querySelector('.header__theme-dropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
    }
}

animateParticles(particle) {
    // Einfache Partikel-Animation implementierung
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // Entferne alte Partikel
    const existingParticles = document.querySelector('.particle-container');
    if (existingParticles) {
        existingParticles.remove();
    }
    
    document.body.appendChild(particleContainer);
    
    // 5 Partikel erstellen
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            this.createSingleParticle(particleContainer, particle);
        }, i * 1000);
    }
}

createSingleParticle(container, particle) {
    const particleElement = document.createElement('div');
    particleElement.textContent = particle;
    particleElement.style.cssText = `
        position: absolute;
        font-size: 2rem;
        opacity: 0.7;
        animation: particleFall 4s linear forwards;
        left: ${Math.random() * 100}%;
        top: -50px;
    `;
    
    container.appendChild(particleElement);
    
    // Partikel nach Animation entfernen
    setTimeout(() => {
        if (particleElement.parentNode) {
            particleElement.remove();
        }
    }, 4000);
}

    // THEME
   applyTheme(theme) {
    console.log('Applying theme:', theme);
    
    // Alle Theme-Klassen entfernen
    document.body.classList.remove(
        'theme-light', 'theme-dark', 'theme-luxury', 'theme-eco',
        'theme-playful', 'theme-seasonal-spring', 'theme-seasonal-summer',
        'theme-seasonal-autumn', 'theme-seasonal-winter'
    );
    
    // Neue Theme-Klasse hinzufügen
    document.body.classList.add(`theme-${theme}`);
    
    // Theme speichern
    this.currentTheme = theme;
    localStorage.setItem('selectedTheme', theme);
    
    // UI aktualisieren
    this.updateThemeUI(theme);
    
    // Spezielle Theme-Effekte anwenden (mit Verzögerung)
    setTimeout(() => {
        this.applyThemeEffects(theme);
    }, 100);

    // Spezielle Eigenschaften-Modal Theme-Anpassungen
    setTimeout(() => {
        this.applyEigenschaftenModalTheme(theme);
    }, 100);
}

applyEigenschaftenModalTheme(theme) {
    const modal = document.getElementById('eigenschaften-modal');
    if (!modal) return;
    
    // Theme-spezifische Anpassungen für das Eigenschaften-Modal
    modal.setAttribute('data-theme', theme);
    
    // Spezielle Effekte für bestimmte Themes
    if (theme === 'luxury') {
        modal.classList.add('luxury-effects');
    } else {
        modal.classList.remove('luxury-effects');
    }
}

// In Ihrer HaustierWissen-Klasse
setupThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Debug: Prüfen ob Elemente existieren
    console.log('Theme elements found:', {
        toggle: !!themeToggle,
        dropdown: !!themeDropdown,
        options: themeOptions.length
    });
    
    if (!themeToggle) {
        console.error('Theme toggle button nicht gefunden!');
        return;
    }
    
    // Theme-Namen Mapping
    this.themeNames = {
        'light': 'Hell',
        'dark': 'Dunkel',
        'luxury': 'Luxury',
        'eco': 'Eco',
        'playful': 'Playful',
        'seasonal-spring': 'Frühling',
        'seasonal-summer': 'Sommer',
        'seasonal-autumn': 'Herbst',
        'seasonal-winter': 'Winter'
    };
    
    // Theme-Icons Mapping
    this.themeIcons = {
        'light': '☀️',
        'dark': '🌙',
        'luxury': '✨',
        'eco': '🌿',
        'playful': '🎾',
        'seasonal-spring': '🌸',
        'seasonal-summer': '☀️',
        'seasonal-autumn': '🍂',
        'seasonal-winter': '❄️'
    };
    
    // Aktuelles Theme laden
    this.currentTheme = localStorage.getItem('selectedTheme') || 'dark';
    this.applyTheme(this.currentTheme);
    
    // Event-Listener für Theme-Optionen
    themeOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const selectedTheme = option.dataset.theme;
            this.applyTheme(selectedTheme);
            this.closeThemeDropdown();
        });
    });
    
    // Dropdown Toggle
    themeToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleThemeDropdown();
    });
    
    // Dropdown schließen bei Klick außerhalb
    document.addEventListener('click', () => {
        this.closeThemeDropdown();
    });
}

applyTheme(theme) {
    // Alle Theme-Klassen entfernen
    document.body.classList.remove(
        'theme-light', 'theme-dark', 'theme-luxury', 'theme-eco',
        'theme-playful', 'theme-seasonal-spring', 'theme-seasonal-summer',
        'theme-seasonal-autumn', 'theme-seasonal-winter'
    );
    
    // Neue Theme-Klasse hinzufügen
    document.body.classList.add(`theme-${theme}`);
    
    // Theme speichern
    this.currentTheme = theme;
    localStorage.setItem('selectedTheme', theme);
    
    // UI aktualisieren
    this.updateThemeUI(theme);
    
    // Spezielle Theme-Effekte anwenden
    this.applyThemeEffects(theme);
}

updateThemeUI(theme) {
    const themeIcon = document.getElementById('theme-icon');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Icon aktualisieren
    if (themeIcon) {
        themeIcon.textContent = this.themeIcons[theme] || '🎨';
    }
    
    // Aktive Option markieren
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === theme);
    });
}

applyThemeEffects(theme) {
    // Alle vorherigen Effekte entfernen
    this.removeAllThemeEffects();
    
    // Spezielle Effekte für verschiedene Themes
    switch(theme) {
        case 'playful':
            this.addPlayfulEffects();
            break;
        case 'seasonal-spring':
            this.addSeasonalEffects('spring');
            break;
        case 'seasonal-summer':
            this.addSeasonalEffects('summer');
            break;
        case 'seasonal-autumn':
            this.addSeasonalEffects('autumn');
            break;
        case 'seasonal-winter':
            this.addSeasonalEffects('winter');
            break;
    }
}

// Neue Hilfsmethode zum Entfernen aller Theme-Effekte
removeAllThemeEffects() {
    const cards = document.querySelectorAll('.species-card, .category-card, .tool-card, .blog-card');
    cards.forEach(card => {
        // Entferne alle Theme-spezifischen Event-Listener
        card.removeEventListener('mouseenter', this.playfulMouseEnter);
        card.removeEventListener('mouseleave', this.playfulMouseLeave);
        
        // Entferne inline Styles
        card.style.removeProperty('--random-rotation');
        card.style.removeProperty('transform');
        card.style.removeProperty('transition');
    });
}

addPlayfulEffects() {
    // Warten bis DOM bereit ist
    setTimeout(() => {
        const cards = document.querySelectorAll('.species-card, .category-card, .tool-card, .blog-card');
        console.log('Adding playful effects to', cards.length, 'cards');
        
        cards.forEach(card => {
            // Entferne alte Event-Listener
            card.removeEventListener('mouseenter', this.playfulMouseEnter);
            card.removeEventListener('mouseleave', this.playfulMouseLeave);
            
            // Neue Event-Listener nur für zusätzliche Effekte
            this.playfulMouseEnter = () => {
                // CSS übernimmt bereits die Neigung, hier nur zusätzliche Effekte
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                
                // Zufällige leichte Variation der Neigung
                const randomRotation = (Math.random() - 0.5) * 3; // -1.5 bis 1.5 Grad
                card.style.setProperty('--random-rotation', `${randomRotation}deg`);
            };
            
            this.playfulMouseLeave = () => {
                card.style.removeProperty('--random-rotation');
            };
            
            card.addEventListener('mouseenter', this.playfulMouseEnter);
            card.addEventListener('mouseleave', this.playfulMouseLeave);
        });
    }, 200);
}

addSeasonalEffects(season) {
    // Saisonale Partikel-Effekte (optional)
    this.createSeasonalParticles(season);
}

createSeasonalParticles(season) {
    const particles = {
        'spring': '🌸',
        'summer': '☀️',
        'autumn': '🍂',
        'winter': '❄️'
    };
    
    // Einfache Partikel-Animation
    const particle = particles[season];
    if (particle) {
        this.animateParticles(particle);
    }
}


    // DATEN
    async loadPetData() {
        try {
            const res = await fetch('petsData.json');
            if (!res.ok) throw new Error(res.statusText);
            this.petsData = await res.json();
            this.renderCategories();
        } catch (err) {
            console.error('🐛 petsData.json konnte nicht geladen werden:', err);
        }
    }
    async loadBlogData() {
        try {
            const res = await fetch('blogData.json');
            if (!res.ok) throw new Error(res.statusText);
            this.blogData = await res.json();
            this.blogManager = new EnhancedBlogManager(this.blogData);
        } catch (err) {
            console.error('🐛 blogData.json konnte nicht geladen werden:', err);
        }
    }

/**
 * Richtet alle globalen Event-Listener für die Anwendung ein.
 * Diese Methode wird nur einmal bei der Initialisierung aufgerufen.
 */
setupEventListeners() {
    // ===== MODAL EVENT-LISTENER MIT HIERARCHIE-BEWUSSTSEIN =====
    
    // Haupt-Modal Event-Listener
    if (this.modalCloseBtn) {
        this.modalCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeSpeciesModal();
        });
    }

    // Eigenschaften-Modal Event-Listener
    if (this.eigenschaftenModalClose) {
        this.eigenschaftenModalClose.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeEigenschaftenModal();
        });
    }

    // KORRIGIERT: Schließen bei Klick außerhalb - mit Modal-Hierarchie
    window.addEventListener('click', (event) => {
        // Eigenschaften-Modal hat Priorität (höhere z-index)
        if (this.eigenschaftenModal && 
            event.target === this.eigenschaftenModal && 
            this.eigenschaftenModal.style.display === 'block') {
            this.closeEigenschaftenModal();
            return; // Wichtig: Event hier stoppen
        }
        
        // Haupt-Modal nur schließen wenn Eigenschaften-Modal nicht offen ist
        if (this.speciesModal && 
            event.target === this.speciesModal &&
            (!this.eigenschaftenModal || this.eigenschaftenModal.style.display === 'none')) {
            this.closeSpeciesModal();
        }
    });

    // ===== ZENTRALER EVENT-LISTENER MIT VERBESSERTER LOGIK =====
    document.addEventListener('click', (e) => {
        const target = e.target;

        // PRÜFUNG: Ist der Klick innerhalb des Eigenschaften-Modals?
    if (this.isInsideEigenschaftenModal(target)) {
        console.log('Klick innerhalb Eigenschaften-Modal - ignoriert');
        return; // Event nicht weiterverarbeiten
    }

        // 1. EIGENSCHAFTEN-BUTTON (HÖCHSTE PRIORITÄT)
        if (target.matches('.eigenschaften-button')) {
            e.preventDefault();
            e.stopPropagation();
            
            const speciesId = parseInt(target.dataset.speciesId);
            if (speciesId) {
                const species = this.findSpeciesById(speciesId);
                if (species) {
                    this.showEigenschaftenModal(species);
                }
            }
            return;
        }

        // 3. VOLLSTÄNDIGER SCHUTZ FÜR HAUPT-MODAL
        const speciesModal = document.getElementById('species-modal');
        if (speciesModal && speciesModal.contains(target) && 
            (!eigenschaftenModal || eigenschaftenModal.style.display === 'none')) {
            e.stopPropagation();
            console.log('✅ Klick innerhalb Haupt-Modal abgefangen');
            return;
        }

        // 4. FAVORITEN-SYSTEM
        const favoriteBtn = target.closest('.favorite-btn, .modern-favorite-btn, .aotd-favorite-btn');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            const speciesId = parseInt(favoriteBtn.dataset.speciesId || favoriteBtn.dataset.species, 10);
            if (speciesId) {
                this.toggleFavorite(speciesId);
            }
            return;
        }

        // 5. THEME-SYSTEM
        if (target.closest('#theme-toggle')) {
            e.stopPropagation();
            if (typeof this.toggleThemeDropdown === 'function') {
                this.toggleThemeDropdown();
            }
            return;
        }

        const themeOption = target.closest('.theme-option');
        if (themeOption) {
            const selectedTheme = themeOption.dataset.theme;
            if (typeof this.applyTheme === 'function') {
                this.applyTheme(selectedTheme);
            }
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
            return;
        }

        // 6. NAVIGATION
        const navTarget = target.closest('[data-category]');
        if (navTarget) {
            e.preventDefault();
            if (typeof this.handleNavigation === 'function') {
                this.handleNavigation(navTarget.dataset.category, navTarget);
            }
            return;
        }

        // 7. SPECIES-CARD
        const speciesCard = target.closest('.species-card');
        if (speciesCard) {
            e.preventDefault();
            const speciesId = parseInt(speciesCard.dataset.speciesId, 10);
            if (speciesId) {
                this.showSpeciesDetail(speciesId);
            }
            return;
        }

        // 8. SONSTIGE BUTTONS
        if (target.matches('#favorites-link')) {
            e.preventDefault();
            if (typeof this.showFavoritesModal === 'function') {
                this.showFavoritesModal();
            }
            return;
        }

        if (target.matches('#jumpToTopBtn')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (target.matches('#back-to-categories')) {
            e.preventDefault();
            this.showHome();
            return;
        }

        // 9. PROFIL-BUTTONS
        if (target.matches('.view-profile-btn')) {
            e.preventDefault();
            const profileId = target.dataset.id;
            if (profileId) {
                this.showPetProfileDetail(profileId);
            }
            return;
        }

        if (target.matches('.edit-profile-btn')) {
            e.preventDefault();
            const profileId = target.dataset.id;
            if (profileId) {
                console.log('Edit profile:', profileId);
            }
            return;
        }

        if (target.matches('.delete-profile-btn')) {
            e.preventDefault();
            const profileId = target.dataset.id;
            if (profileId) {
                this.handleDeleteProfile(profileId);
            }
            return;
        }

        if (target.matches('#back-to-overview-btn')) {
            e.preventDefault();
            this.showMyPets();
            return;
        }

        if (target.matches('#add-new-profile-btn')) {
            e.preventDefault();
            this.handleNavigation('pet-profile', target);
            return;
        }

        if (target.matches('#delete-account-btn')) {
            e.preventDefault();
            this.handleDeleteAccount();
            return;
        }

        // 10. Dropdown schließen bei Klick außerhalb
        if (!target.closest('.header__theme-dropdown, #theme-toggle')) {
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
        }
    });

    // ===== KEYBOARD EVENT-LISTENER =====
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Eigenschaften-Modal hat Priorität wenn offen
            if (this.eigenschaftenModal && this.eigenschaftenModal.style.display === 'block') {
                this.closeEigenschaftenModal();
            } else if (this.speciesModal && this.speciesModal.style.display === 'block') {
                this.closeSpeciesModal();
            }
            
            // Theme-Dropdown schließen
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
            
            // Rating-Details schließen
            document.querySelectorAll('.rating-details.visible').forEach(detail => {
                detail.classList.remove('visible');
                detail.closest('.rating-item--detailed').classList.remove('expanded');
            });
        }
    });

    // ===== NAVIGATION EVENT-LISTENER =====
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('href').substring(1);
            if (typeof this.navigateToSection === 'function') {
                this.navigateToSection(targetSection);
            }
        });
    });

    // ===== RESPONSIVE NAVIGATION =====
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('species-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (typeof this.handleSearch === 'function') {
                    this.handleSearch(e.target.value);
                }
            }, 300);
        });
    }

    // ===== FILTER BUTTONS =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            if (typeof this.toggleFilter === 'function') {
                this.toggleFilter(filterType);
            }
        });
    });

    // ===== FAVORITEN-MODAL EVENT-LISTENER =====
    if (this.favoritesModal) {
        const favCloseBtn = this.favoritesModal.querySelector('.modal-close');
        if (favCloseBtn) {
            favCloseBtn.addEventListener('click', () => {
                this.closeFavoritesModal();
            });
        }
        
        this.favoritesModal.addEventListener('click', (e) => {
            if (e.target === this.favoritesModal) {
                this.closeFavoritesModal();
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // ===== SCROLL EVENT-LISTENER =====
    const jumpToTopBtn = document.getElementById('jumpToTopBtn');
    if (jumpToTopBtn) {
        window.addEventListener('scroll', () => {
            jumpToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
    }

    // ===== WINDOW RESIZE EVENT-LISTENER =====
    window.addEventListener('resize', this.debounce(() => {
        if (typeof this.handleWindowResize === 'function') {
            this.handleWindowResize();
        }
    }, 250));

    // ===== PAGE VISIBILITY API =====
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('page-hidden');
        } else {
            document.body.classList.remove('page-hidden');
        }
    });

    // ===== TOUCH EVENTS FÜR MOBILE =====
    if (typeof this.setupTouchEvents === 'function') {
        this.setupTouchEvents();
    }

    console.log('✅ Alle Event-Listener wurden erfolgreich eingerichtet');
}

handleNavigation(catId, linkEl) {
    console.log(`Navigiere zu: ${catId}`);

    // WICHTIG: Alle Modals schließen bei Navigation
    this.cleanupAllModals();

    // Aktiven Zustand der Navigationslinks aktualisieren
    document.querySelectorAll('.header__nav-link.active, .dropdown-link.active')
        .forEach(l => l.classList.remove('active'));
    if (linkEl) {
        const mainLink = linkEl.closest('.dropdown')?.querySelector('.header__nav-link') || linkEl;
        if(mainLink) mainLink.classList.add('active');
        if (linkEl.classList.contains('dropdown-link')) {
            linkEl.classList.add('active');
        }
    }

    // Zuerst alle Hauptsektionen ausblenden
    this.hideAllSections();

    // Die korrekte Sektion basierend auf der 'data-category' (catId) anzeigen
    switch (catId) {
        case 'home':
            this.showHome();
            break;
        case 'login':
            this.showSection(document.getElementById('login-section'));
            break;
        case 'register':
            this.showSection(document.getElementById('register-section'));
            break;
        case 'admin-login':
            this.showSection(document.getElementById('admin-login-section'));
            break;
        case 'blog':
            this.showBlog();
            break;
        case 'my-pets':
            this.showMyPets();
            break;
        case 'pet-profile':
            this.showSection(this.petProfileSection);
            break;
        case 'tools':
            this.showSection(this.toolsSection);
            break;
        case 'comparison':
            this.showSection(this.comparisonSection);
            break;
        case 'admin-log':
            this.showAdminLog();
            break;
        default:
            // Dieser Fall fängt alle Tierkategorien ab (z.B. 'dogs', 'cats')
            this.showCategory(catId);
            break;
    }
}

navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== HILFSMETHODEN FÜR EVENT-HANDLING =====

// Debounce-Funktion für Performance-Optimierung
debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window Resize Handler
handleWindowResize() {
    // Responsive Anpassungen
    if (this.chart) {
        this.chart.resize();
    }
    
    // Mobile Navigation anpassen
    const viewport = window.innerWidth;
    document.body.classList.toggle('mobile-view', viewport < 768);
    document.body.classList.toggle('tablet-view', viewport >= 768 && viewport < 1024);
    document.body.classList.toggle('desktop-view', viewport >= 1024);
}

/**
 * Account-Löschung handhaben
 */
async handleDeleteAccount() {
    const confirmation = confirm(
        'Sind Sie sicher, dass Sie Ihr Konto endgültig löschen möchten? ' +
        'Diese Aktion kann nicht rückgängig gemacht werden.'
    );
    
    if (!confirmation) return;
    
    try {
        if (this.authManager) {
            await this.authManager.deleteAccount();
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Kontos:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
}

// Touch-Events für mobile Geräte
setupTouchEvents() {
    // Touch-Unterstützung für Property-Cards
    document.addEventListener('touchstart', (e) => {
        const propertyCard = e.target.closest('.property-card');
        if (propertyCard) {
            propertyCard.classList.add('touch-active');
        }
    });

    document.addEventListener('touchend', (e) => {
        const propertyCard = e.target.closest('.property-card');
        if (propertyCard) {
            propertyCard.classList.remove('touch-active');
            
            // Touch-Feedback für Property Cards
            setTimeout(() => {
                propertyCard.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    propertyCard.style.transform = 'scale(1)';
                }, 100);
            }, 50);
        }
    });
}

createInfoCard(icon, label, value, accent = false) {
    if (!value) {
        console.log(`Leerer Wert für ${label}, Card wird übersprungen`);
        return '';
    }
    
    return `
        <div class="modern-info-card ${accent ? 'modern-info-card--accent' : ''}">
            <div class="modern-info-card__icon">${icon}</div>
            <div class="modern-info-card__content">
                <span class="modern-info-card__label">${label}</span>
                <span class="modern-info-card__value">${value}</span>
            </div>
        </div>
    `;
}

generateAdditionalInfo(species) {
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>ℹ️ Weitere Informationen</h4>
                <span class="premium-badge">Details</span>
            </div>
            <div class="additional-info">
                ${species.subcategoryName ? `<p><strong>Kategorie:</strong> ${species.subcategoryName}</p>` : ''}
                ${species.id ? `<p><strong>ID:</strong> ${species.id}</p>` : ''}
            </div>
        </div>
    `;
}

generateTemperamentSection(temperaments) {
    if (!temperaments || temperaments.length === 0) return '';
    
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>🎭 Temperament</h4>
                <span class="premium-badge">Charakter</span>
            </div>
            <div class="temperament-tags">
                ${temperaments.map(trait => `<span class="temperament-tag">${trait}</span>`).join('')}
            </div>
        </div>
    `;
}

    // MODAL
    showSpeciesDetail(speciesId) {
    const species = this.findSpeciesById(speciesId);
    if (!species) {
        console.error('Tierart nicht gefunden:', speciesId);
        return;
    }

    // NEUE: showSpeciesModal aufrufen statt populateModal
    this.showSpeciesModal(species);
}

closeSpeciesModal() {
    console.log('=== CLOSE SPECIES MODAL ===');
    
    // WICHTIG: Eigenschaften-Modal zuerst schließen
    this.closeEigenschaftenModal();
    
    // Modal verstecken
    this.speciesModal.classList.remove('show');
    this.speciesModal.classList.add('hidden');
    
    // Body-Styles vollständig zurücksetzen
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Scroll-Position wiederherstellen
    if (this.scrollPosition) {
        window.scrollTo(0, this.scrollPosition);
        this.scrollPosition = 0;
    }
    
    // Modal-Status zurücksetzen
    this.isModalOpen = false;
    
    console.log('Modal closed successfully');
}

    findSpeciesById(id) {
    for (const category of Object.values(this.petsData.species || {})) {
        for (const subcat of Object.values(category.subcategories || {})) {
            const species = subcat.species?.find(s => s.id === id);
            if (species) {
                console.log('Found species:', species); // DEBUG
                return species;
            }
        }
    }
    console.log('Species not found for ID:', id); // DEBUG
    return null;
}

    populateModal(species) {
    if (!this.modalTitle || !this.modalGallery || !species) {
        console.error('Modal-Elemente oder Tierart nicht gefunden');
        return;
    }

    // Modal-Titel setzen
    this.modalTitle.textContent = species.name || 'Unbekannte Tierart';

    // Galerie und Tab-Inhalte befüllen
    this.populateModalGallery(species);
    this.populateAllTabs(species);

    // ---- KORREKTUR: Standard-Tab beim Öffnen aktivieren ----
    // Setzt den ersten Tab und den ersten Inhaltsbereich visuell als Standard aktiv.
    // Dies geschieht nun ohne einen problematischen .click()-Aufruf.
    this.modalTabsContainer.querySelectorAll('.modal-tab').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
    });
    this.speciesModal.querySelectorAll('.modal-tab-content').forEach((content, index) => {
        content.classList.toggle('active', index === 0);
    });

    // Event-Listener für andere dynamische Elemente im Modal (z.B. Favoriten-Button)
    this.setupModalEventListeners(species);
}



populateModalGallery(species) {
    if (!this.modalGallery) return;
    this.modalGallery.innerHTML = '';

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'species-gallery';

    // Haupt-Bild
    const mainImageContainer = document.createElement('div');
    mainImageContainer.className = 'species-main-image';
    const mainImage = document.createElement('img');
    mainImage.src = species.image || 'images/placeholder.jpg';
    mainImage.alt = `Hauptbild von ${species.name}`;
    mainImage.className = 'main-image';
    mainImage.onerror = () => { mainImage.src = 'images/placeholder.jpg'; };
    mainImageContainer.appendChild(mainImage);
    galleryContainer.appendChild(mainImageContainer);

    // Thumbnail-Galerie (nur wenn mehr als ein Bild vorhanden ist)
    const allImages = [species.image, ...(species.gallery || [])].filter(Boolean);
    const uniqueImages = [...new Set(allImages)];

    if (uniqueImages.length > 1) {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'species-thumbnails';

        uniqueImages.forEach(src => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Thumbnail von ${species.name}`;
            thumb.className = 'thumbnail';
            thumb.classList.toggle('active', src === mainImage.src);
            thumb.onerror = () => { thumb.style.display = 'none'; };

            thumb.addEventListener('click', () => {
                mainImage.src = src;
                // Aktiven Zustand bei allen Thumbnails aktualisieren
                thumbnailContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            thumbnailContainer.appendChild(thumb);
        });
        galleryContainer.appendChild(thumbnailContainer);
    }

    this.modalGallery.appendChild(galleryContainer);
}

populateAllTabs(species) {
    this.populateOverviewTab(species);
    this.populateCareTab(species);
    this.populateHealthTab(species);
}

populateOverviewTab(species) {
    console.log('=== POPULATE OVERVIEW DEBUG ===');
    console.log('Species:', species.name);
    console.log('Species data:', species);
    
    const container = document.getElementById('tab-overview');
    if (!container) {
        console.error('❌ Element #tab-overview nicht gefunden!');
        // Fallback: Element erstellen
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            const newContainer = document.createElement('div');
            newContainer.id = 'tab-overview';
            newContainer.className = 'modal-tab-content active';
            modalBody.appendChild(newContainer);
            container = newContainer;
        } else {
            return;
        }
    }

    // Einfacher HTML-String für Debugging
    const steckbriefHTML = `
        <div class="premium-modal-content">
            <!-- Hero-Sektion -->
            <div class="species-hero">
                <h3>${species.name || 'Unbekanntes Tier'}</h3>
                <p class="species-hero__subtitle">${species.description || 'Eine wunderbare Tierart mit einzigartigen Eigenschaften.'}</p>
            </div>

            <div class="eigenschaften-button-container">
    <button class="eigenschaften-button" data-species-id="${species.id}">
        🔍 Eigenschaften im Detail
    </button>
</div>

            <!-- Basis-Steckbrief -->
            <div class="premium-section">
                <div class="premium-section__header">
                    <h4>📊 Steckbrief</h4>
                    <span class="premium-badge">Übersicht</span>
                </div>
                <div class="basic-info-table">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <th style="padding: 12px; text-align: left; background: var(--color-secondary);">Herkunft</th>
                            <td style="padding: 12px;">${species.origin || 'Unbekannt'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <th style="padding: 12px; text-align: left; background: var(--color-secondary);">Größe</th>
                            <td style="padding: 12px;">${species.size || 'Unbekannt'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <th style="padding: 12px; text-align: left; background: var(--color-secondary);">Gewicht</th>
                            <td style="padding: 12px;">${species.weight || 'Unbekannt'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <th style="padding: 12px; text-align: left; background: var(--color-secondary);">Lebenserwartung</th>
                            <td style="padding: 12px;">${species.lifeExpectancy || 'Unbekannt'}</td>
                        </tr>
                        <tr>
                            <th style="padding: 12px; text-align: left; background: var(--color-secondary);">Pflegeaufwand</th>
                            <td style="padding: 12px;">${species.careLevel || 'Unbekannt'}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Temperament falls vorhanden -->
            ${species.temperament && species.temperament.length > 0 ? `
                <div class="premium-section">
                    <div class="premium-section__header">
                        <h4>🎭 Temperament</h4>
                        <span class="premium-badge">Charakter</span>
                    </div>
                    <div class="temperament-tags">
                        ${species.temperament.map(trait => `<span class="temperament-tag">${trait}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    container.innerHTML = steckbriefHTML;
    console.log('✅ Steckbrief eingefügt');
    console.log('=== DEBUG END ===');
}

generateActionableRecommendations(ratings, speciesName) {
    if (!ratings) return '';
    
    const recommendations = [];
    
    // Bewegung & Aktivität
    const energy = this.getRatingValue(ratings.energy);
    if (energy >= 4) {
        recommendations.push({
            icon: '▲',
            title: 'Hoher Bewegungsbedarf',
            description: `${speciesName} benötigt täglich intensive körperliche und geistige Auslastung.`,
            priority: 'high'
        });
    }
    
    // Anfängerfreundlichkeit
    const beginnerFriendly = this.getRatingValue(ratings.beginnerFriendly);
    if (beginnerFriendly <= 2) {
        recommendations.push({
            icon: '◆',
            title: 'Erfahrung erforderlich',
            description: `${speciesName} benötigt erfahrene Hundehalter mit konsequenter Führung.`,
            priority: 'critical'
        });
    }
    
    // Pflegeaufwand
    const grooming = this.getRatingValue(ratings.grooming);
    if (grooming >= 4) {
        recommendations.push({
            icon: '◐',
            title: 'Intensive Pflege',
            description: `${speciesName} benötigt regelmäßige und aufwendige Fellpflege.`,
            priority: 'medium'
        });
    }
    
    if (recommendations.length === 0) return '';
    
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>Handlungsempfehlungen</h4>
                <span class="premium-badge">Wichtig</span>
            </div>
            <div class="recommendations-grid">
                ${recommendations.map(rec => `
                    <div class="recommendation-card recommendation-card--${rec.priority}">
                        <div class="recommendation-icon">${rec.icon}</div>
                        <div class="recommendation-content">
                            <h5 class="recommendation-title">${rec.title}</h5>
                            <p class="recommendation-description">${rec.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

generateStarRating(rating) {
    const numericRating = parseFloat(rating);
    const ratingLevel = Math.round(numericRating);
    const percentage = (numericRating / 5) * 100;
    
    const ratingSymbols = ['', '', '', '', ''];
    const ratingTexts = ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
    
    return `
        <div class="rating-bar-display">
            <div class="rating-bars">
                ${ratingSymbols.map((symbol, index) => `
                    <span class="rating-bar-symbol ${index < ratingLevel ? 'active' : ''}">${symbol}</span>
                `).join('')}
            </div>
            <span class="rating-text">${ratingTexts[ratingLevel - 1] || 'Unbekannt'}</span>
            <span class="rating-numeric">${numericRating}/5</span>
        </div>
    `;
}

generateOptimizedCategories(ratings) {
    const orderedCategories = {
        suitability: {
            title: 'Eignung & Alltag',
            icon: '🏠',
            color: '#3b82f6',
            priority: 'critical',
            properties: {
                familienfreundlichkeit: 'Familienfreundlichkeit',
                apartmentTauglichkeit: 'Apartment-Tauglichkeit',
                anfängertauglichkeit: 'Anfängertauglichkeit'
            },
            description: 'Grundlegende Eignung für verschiedene Lebenssituationen'
        },
        
        activity: {
            title: 'Aktivität & Auslastung',
            icon: '🏃',
            color: '#10b981',
            priority: 'high',
            properties: {
                bewegungsbedarf: 'Bewegungsbedarf',
                energielevel: 'Energielevel',
                arbeitsfähigkeit: 'Arbeitsfähigkeit'
            },
            description: 'Tägliche körperliche und geistige Anforderungen'
        },
        
        behavior: {
            title: 'Verhalten & Training',
            icon: '🎯',
            color: '#8b5cf6',
            priority: 'high',
            properties: {
                trainierbarkeit: 'Trainierbarkeit',
                wachtrieb: 'Wach-/Schutztrieb',
                belltendenz: 'Belltendenz',
                unabhängigkeit: 'Unabhängigkeit'
            },
            description: 'Verhaltensmuster und Trainingsaspekte'
        },
        
        care: {
            title: 'Pflege & Gesundheit',
            icon: '💊',
            color: '#f59e0b',
            priority: 'medium',
            properties: {
                fellpflegeaufwand: 'Fellpflegeaufwand',
                gesundheitsrobustheit: 'Gesundheitsrobustheit',
                temperaturresistenz: 'Temperaturresistenz'
            },
            description: 'Pflege- und Gesundheitsaspekte'
        },
        
        instincts: {
            title: 'Instinkte',
            icon: '🐺',
            color: '#ef4444',
            priority: 'low',
            properties: {
                beutetrieb: 'Beutetrieb'
            },
            description: 'Natürliche Instinkte und Triebe'
        }
    };

    return Object.entries(orderedCategories).map(([key, category]) => 
        this.generateCategorySection(key, category, ratings)
    ).join('');
}

generateCategorySection(categoryKey, category, ratings) {
    // SICHERHEITSCHECK: category und category.properties prüfen
    if (!category || !category.properties) {
        console.warn(`Kategorie "${categoryKey}" hat keine properties definiert:`, category);
        return '';
    }

    const availableRatings = Object.entries(category.properties)
        .map(([key, label]) => {
            const ratingData = ratings[key];
            let value, details = null;
            
            if (typeof ratingData === 'number') {
                value = ratingData;
            } else if (typeof ratingData === 'object' && ratingData !== null) {
                value = this.getRatingValue(ratingData);
                details = ratingData;
            } else {
                value = 3; // Fallback-Wert
            }
            
            return {
                key,
                label: this.formatRatingLabel(key),
                raw: ratingData,
                value: value,
                details: details,
                impact: this.getPropertyImpact(key, value)
            };
        })
        .filter(rating => rating.value > 0);
    
    // SICHERHEITSCHECK: Keine Ratings verfügbar
    if (availableRatings.length === 0) {
        console.warn(`Keine verfügbaren Ratings für Kategorie "${categoryKey}"`);
        return '';
    }
    
    const categoryAverage = this.getCategoryAverage(availableRatings);
    const categoryTooltip = this.getCategoryTooltip(categoryKey);
    
    return `
        <div class="properties-category properties-category--${category.priority || 'medium'}" 
             data-category="${categoryKey}">
            
            <div class="category-header" style="--category-color: ${category.color || 'var(--color-primary)'}">
                <div class="category-header__main">
                    <div class="category-icon-wrapper">
                        <span class="category-icon">${category.icon || '📊'}</span>
                    </div>
                    <div class="category-info">
                        <h4 class="category-title">
                            ${category.title || categoryKey}
                        </h4>
                        <p class="category-description">${category.description || 'Keine Beschreibung verfügbar'}</p>
                    </div>
                </div>
                
                <div class="category-summary">
                    <div class="category-average">
                        <span class="average-score">${categoryAverage}</span>
                        <span class="average-label">Durchschnitt</span>
                    </div>
                </div>
            </div>
            
            <div class="category-content">
                <div class="properties-grid properties-grid--${category.priority || 'medium'}">
                    ${availableRatings.map(rating => 
                        this.generateEnhancedPropertyCard(rating, category.priority || 'medium')
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

getCategoryImpactIndicator(categoryKey, averageScore) {
    const numericScore = parseFloat(averageScore);
    const impactRules = {
        suitability: {
            high: numericScore <= 2 ? 'Nicht geeignet' : numericScore >= 4 ? 'Sehr geeignet' : 'Bedingt geeignet',
            color: numericScore <= 2 ? 'var(--color-error)' : numericScore >= 4 ? 'var(--color-success)' : 'var(--color-warning)'
        },
        dailyNeeds: {
            high: numericScore >= 4 ? 'Intensiv' : numericScore >= 3 ? 'Moderat' : 'Gering',
            color: numericScore >= 4 ? 'var(--color-warning)' : numericScore >= 3 ? 'var(--color-primary)' : 'var(--color-success)'
        },
        behavior: {
            high: numericScore >= 4 ? 'Sehr trainierbar' : numericScore >= 3 ? 'Gut trainierbar' : 'Herausfordernd',
            color: numericScore >= 4 ? 'var(--color-success)' : numericScore >= 3 ? 'var(--color-primary)' : 'var(--color-warning)'
        },
        environment: {
            high: numericScore >= 4 ? 'Sehr anpassungsfähig' : numericScore >= 3 ? 'Anpassungsfähig' : 'Spezielle Bedürfnisse',
            color: numericScore >= 4 ? 'var(--color-success)' : numericScore >= 3 ? 'var(--color-primary)' : 'var(--color-warning)'
        },
        special: {
            high: numericScore >= 4 ? 'Besondere Aufmerksamkeit' : numericScore >= 3 ? 'Moderate Besonderheiten' : 'Unauffällig',
            color: numericScore >= 4 ? 'var(--color-warning)' : numericScore >= 3 ? 'var(--color-primary)' : 'var(--color-success)'
        }
    };

    const rule = impactRules[categoryKey] || { high: 'Standard', color: 'var(--color-text-secondary)' };
    
    return `
        <div class="impact-indicator" style="--indicator-color: ${rule.color}">
            <div class="impact-dot"></div>
            <span class="impact-text">${rule.high}</span>
        </div>
    `;
}

generateEnhancedPropertyCard(rating, priority) {
    const percentage = (rating.value / 5) * 100;
    const level = this.getRatingLevel(rating.value, rating.key);
    const levelClass = this.getLevelClass(rating.value, rating.key);
    const context = this.getRatingContext(rating.key);
    const gradient = this.getContextGradient(context, rating.value);
    
    return `
        <div class="property-card property-card--${priority}" 
             data-rating="${rating.value}"
             data-property-key="${rating.key}">
            
            <div class="property-card__header">
                <div class="property-info">
                    <h5 class="property-title" id="property-${rating.key}">
                        ${this.formatRatingLabel(rating.key)}
                    </h5>
                    <span class="property-level property-level--${levelClass}">
                        ${level}
                    </span>
                </div>
                <div class="property-score">
                    <span class="score-number">${rating.value}</span>
                    <span class="score-max">/5</span>
                </div>
            </div>
            
            <div class="property-bar">
                <div class="property-fill" 
                     style="width: ${percentage}%; background: ${gradient};"
                     data-width="${percentage}%"
                     data-context="${context}">
                </div>
            </div>
            
            ${rating.details ? this.generateSafeSubRatings(rating) : ''}
        </div>
    `;
}

    initializePropertyTooltips() {
        setTimeout(() => {
            document.querySelectorAll('[data-property-key]').forEach(card => {
                const propertyKey = card.dataset.propertyKey;
                const titleElement = card.querySelector('.property-title');
                const tooltipConfig = this.getPropertyTooltip(propertyKey);
                
                if (titleElement && tooltipConfig) {
                    this.tooltipSystem.addTooltip(titleElement, tooltipConfig);
                }
            });
        }, 100);
    }

// Neue Methode für Eigenschaftsgewichtung
getPropertyWeight(propertyKey) {
    const weights = {
        // === SEHR HOHE GEWICHTUNG (Entscheidungsrelevant) ===
        'anfängertauglichkeit': 5,
        'familienfreundlichkeit': 5,
        'energielevel': 5,
        'trainierbarkeit': 5,
        
        // === HOHE GEWICHTUNG (Wichtig für Alltag) ===
        'bewegungsbedarf': 4,
        'apartmentTauglichkeit': 4,
        'gesundheitsrobustheit': 4,
        'arbeitsfähigkeit': 4,
        
        // === MITTLERE GEWICHTUNG (Relevant) ===
        'wachtrieb': 3,
        'fellpflegeaufwand': 3,
        'temperaturresistenz': 3,
        'belltendenz': 3,
        
        // === NIEDRIGE GEWICHTUNG (Zusatzinfo) ===
        'beutetrieb': 2,
        'unabhängigkeit': 2,
    };
    
    return weights[propertyKey] || 3; // Standard-Gewichtung
}

// Gewichtigkeit-Labels für Anzeige
getWeightLabel(weight) {
    const labels = {
        1: 'Sehr gering',
        2: 'Gering', 
        3: 'Mittel',
        4: 'Hoch',
        5: 'Sehr hoch'
    };
    
    return labels[weight] || 'Mittel';
}

// Gewichtigkeit-Klassen für Styling
getWeightClass(weight) {
    const classes = {
        1: 'weight-very-low',
        2: 'weight-low',
        3: 'weight-medium', 
        4: 'weight-high',
        5: 'weight-very-high'
    };
    
    return classes[weight] || 'weight-medium';
}

generateSafeSubRatings(rating) {
    // Prüfen ob rating.details existiert und ein Objekt ist
    const ratingData = rating.details || rating.raw;
    
    if (!ratingData || typeof ratingData !== 'object' || Array.isArray(ratingData)) {
        return ''; // Keine Sub-Ratings verfügbar
    }
    
    // Nur echte numerische Sub-Ratings extrahieren (außer 'overall')
    const validSubRatings = Object.entries(ratingData)
        .filter(([key, value]) => {
            return key !== 'overall' && 
                   typeof value === 'number' && 
                   value >= 1 && 
                   value <= 5 &&
                   !['id', 'category', 'type', 'meta'].includes(key);
        })
        .slice(0, 4); // Maximal 4 Sub-Ratings anzeigen
    
    if (validSubRatings.length === 0) {
        return ''; // Keine gültigen Sub-Ratings gefunden
    }
    
    return `
        <div class="sub-ratings-compact">
            <div class="sub-ratings-header">
                <span class="sub-ratings-title">Detailbewertung</span>
                <span class="sub-ratings-count">${validSubRatings.length} Aspekte</span>
            </div>
            <div class="sub-ratings-list">
                ${validSubRatings.map(([key, value]) => `
                    <div class="sub-rating-item">
                        <span class="sub-rating-label">${this.formatRatingLabel(key)}</span>
                        <div class="sub-rating-visual">
                            <div class="sub-rating-bars">
                                ${[1,2,3,4,5].map(dot => `
                                    <span class="sub-bar ${dot <= value ? 'active' : ''}">▪</span>
                                `).join('')}
                            </div>
                            <span class="sub-rating-value">${value}/5</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

debugSubRatings(species) {
    console.log('=== SUB-RATINGS DEBUG ===');
    console.log('Species:', species.name);
    console.log('Ratings object:', species.ratings);
    
    if (species.ratings) {
        Object.entries(species.ratings).forEach(([key, value]) => {
            console.log(`Rating ${key}:`, value);
            if (typeof value === 'object' && value !== null) {
                console.log(`  Sub-ratings for ${key}:`, Object.keys(value));
                Object.entries(value).forEach(([subKey, subValue]) => {
                    console.log(`    ${subKey}: ${subValue} (${typeof subValue})`);
                });
            }
        });
    }
    
    // Test Sub-Rating-Generierung
    if (species.ratings?.trainability) {
        const result = this.generateSubRatingsHTML(species.ratings.trainability);
        console.log('Generated sub-ratings HTML:', result);
    }
    
    console.log('=== DEBUG END ===');
}

getRatingLevel(value) {
    const levels = ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
    return levels[value - 1] || 'Unbekannt';
}

/**
 * Erweiterte Methode für kontextabhängige Level-Klassen
 */
getLevelClass(value, propertyKey) {
    const context = this.getRatingContext(propertyKey);
    
    switch (context) {
        case 'positive_high':
            // KORRIGIERT: Konsistente Bewertung
            if (value <= 2) return 'negative';     // ROT (1-2 = schlecht)
            if (value <= 3) return 'neutral';      // GELB (3 = mittel)
            return 'positive';                     // GRÜN (4-5 = gut)
            
        case 'positive_low':
            // Niedrige Werte = positiv (z.B. Belltendenz)
            if (value <= 1) return 'very-positive';
            if (value <= 2) return 'positive';
            if (value <= 3) return 'neutral';
            if (value <= 4) return 'negative';
            return 'very-negative';
            
        case 'balanced':
            // Mittlere Werte = optimal
            if (value <= 1) return 'negative';
            if (value <= 2) return 'slightly-negative';
            if (value <= 3) return 'optimal';
            if (value <= 4) return 'slightly-negative';
            return 'negative';
            
        default:
            if (value <= 2) return 'low';
            if (value <= 3) return 'neutral';
            return 'high';
    }
}

getPropertyImpact(property, value) {
    const context = this.getRatingContext(property);
    const levelClass = this.getLevelClass(value, property);
    const level = this.getRatingLevel(value, property);
    
    // Zusätzliche kontextspezifische Beschreibungen
    const impactDescriptions = {
        'beginnerFriendly': {
            'very-negative': 'Nur für Experten geeignet',
            'negative': 'Hundeerfahrung erforderlich',
            'neutral': 'Bedingt für Anfänger',
            'positive': 'Gut für Anfänger',
            'very-positive': 'Ideal für Erstbesitzer'
        },
        'energy': {
            'low': 'Ruhiger Begleiter',
            'medium': 'Ausgewogener Energielevel',
            'high': 'Sehr aktiv - viel Bewegung nötig'
        },
        'grooming': {
            'very-positive': 'Extrem pflegeleicht',
            'positive': 'Wenig Pflegeaufwand',
            'neutral': 'Normaler Pflegeaufwand',
            'negative': 'Intensive Pflege nötig',
            'very-negative': 'Sehr aufwendige Pflege'
        }
    };
    
    const description = impactDescriptions[property]?.[levelClass] || level;
    
    return {
        text: description,
        level: levelClass,
        context: context
    };
}

generateCategoryTips(categoryKey, ratings) {
    const tips = {
        suitability: 'Diese Eigenschaften bestimmen grundlegend, ob die Rasse zu Ihnen passt.',
        dailyNeeds: 'Planen Sie Ihren Alltag entsprechend dieser täglichen Anforderungen.',
        behavior: 'Diese Verhaltensmuster prägen das Zusammenleben maßgeblich.',
        environment: 'Berücksichtigen Sie Ihre Wohnsituation und lokalen Gegebenheiten.',
        special: 'Diese Eigenschaften erfordern spezielle Aufmerksamkeit und Vorbereitung.'
    };
    
    return tips[categoryKey] ? `
        <div class="category-tip">
            <div class="tip-icon">💡</div>
            <p class="tip-text">${tips[categoryKey]}</p>
        </div>
    ` : '';
}

generateKeyMetrics(ratings) {
    const keyProperties = [
        { key: 'anfängertauglichkeit', label: 'Anfängertauglichkeit', priority: 'high' },
        { key: 'energielevel', label: 'Energielevel', priority: 'high' },
        { key: 'familienfreundlichkeit', label: 'Familienfreundlichkeit', priority: 'high' },
        { key: 'trainierbarkeit', label: 'Trainierbarkeit', priority: 'high' },
        { key: 'fellpflegeaufwand', label: 'Fellpflegeaufwand', priority: 'medium' },
        { key: 'apartmentTauglichkeit', label: 'Apartment-Tauglichkeit', priority: 'medium' }
    ];

    return `
        <div class="key-metrics-grid">
            <h4 class="metrics-title">Wichtigste Eigenschaften auf einen Blick</h4>
            <div class="metrics-cards">
                ${keyProperties.map(prop => {
                    const value = this.getRatingValue(ratings[prop.key]);
                    const level = this.getRatingLevel(value, prop.key);
                    const levelClass = this.getLevelClass(value, prop.key);
                    
                    return `
                        <div class="metric-card metric-card--${prop.priority}">
                            <div class="metric-icon">
                                <div class="metric-bars">
                                    ${[1,2,3,4,5].map(i => `
                                        <span class="metric-bar ${i <= value ? 'active' : ''}"></span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="metric-content">
                                <h5 class="metric-label">${prop.label}</h5>
                                <div class="metric-value">
                                    <span class="metric-level metric-level--${levelClass}">${level}</span>
                                    <span class="metric-score">${value}/5</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

generateCategorizedRatings(ratings) {
    const categories = {
        behavior: {
            title: 'Verhalten & Charakter',
            icon: '◐',
            color: '#3b82f6',
            properties: {
                trainability: 'Trainierbarkeit',
                friendliness: 'Freundlichkeit',
                independence: 'Unabhängigkeit',
                protectiveInstinct: 'Schutzinstinkt',
                alertness: 'Wachsamkeit',
                packBehavior: 'Rudelverhalten'
            },
            description: 'Verhalten, Training und soziale Eigenschaften'
        },
        physical: {
            title: 'Körper & Gesundheit',
            icon: '◕',
            color: '#10b981',
            properties: {
                energy: 'Energielevel',
                exerciseNeeds: 'Bewegungsbedarf',
                healthRobustness: 'Gesundheit & Robustheit',
                grooming: 'Pflegeaufwand',
                shedding: 'Haaren',
                drooling: 'Sabbern'
            },
            description: 'Körperliche Anforderungen und Gesundheitsaspekte'
        },
        environment: {
            title: 'Umgebung & Anpassung',
            icon: '●',
            color: '#f59e0b',
            properties: {
                adaptability: 'Anpassungsfähigkeit',
                coldTolerance: 'Kältetoleranz',
                heatTolerance: 'Hitzetoleranz',
                vocalization: 'Lautäußerungen',
                preyDrive: 'Jagdtrieb'
            },
            description: 'Anpassung an verschiedene Umgebungen und Bedingungen'
        },
        lifestyle: {
            title: 'Lebensstil & Eignung',
            icon: '○',
            color: '#8b5cf6',
            properties: {
                beginnerFriendly: 'Anfängerfreundlich',
                workingCapability: 'Arbeitsfähigkeit',
                mouthingTendency: 'Beißneigung',
                apartmentLiving: 'Wohnungshaltung'
            },
            description: 'Eignung für verschiedene Lebensstile und Erfahrungsgrade'
        }
    };

    let categorizedHTML = '';

    Object.entries(categories).forEach(([categoryKey, category]) => {
        const availableRatings = Object.entries(category.properties)
            .filter(([key]) => ratings[key])
            .map(([key, label]) => ({
                key,
                label,
                value: this.getRatingValue(ratings[key]),
                details: ratings[key]
            }));

        if (availableRatings.length > 0) {
            categorizedHTML += `
                <div class="properties-category">
                    <div class="properties-category__header" style="--category-color: ${category.color}">
                        <div class="category-header__content">
                            <div class="category-icon">${category.icon}</div>
                            <div class="category-info">
                                <h4 class="category-title">${category.title}</h4>
                                <p class="category-description">${category.description}</p>
                            </div>
                        </div>
                        <div class="category-average">
                            <span class="average-score">${this.getCategoryAverage(availableRatings)}</span>
                            <span class="average-label">Durchschnitt</span>
                        </div>
                    </div>
                    
                    <div class="properties-category__content">
                        <div class="properties-grid">
                            ${availableRatings.map(rating => this.generatePropertyCard(rating)).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    });

    return categorizedHTML;
}

generateRatingRecommendations(ratings, speciesName) {
    if (!ratings) return '';
    
    const recommendations = [];
    
    // Bewegungsbedarf
    const bewegungsbedarf = this.getRatingValue(ratings.bewegungsbedarf);
    if (bewegungsbedarf >= 4) {
        recommendations.push({
            icon: '🏃',
            title: 'Hoher Bewegungsbedarf',
            description: `${speciesName} benötigt täglich intensive körperliche und geistige Auslastung.`,
            category: 'activity'
        });
    }
    
    // Anfängertauglichkeit
    const anfängertauglichkeit = this.getRatingValue(ratings.anfängertauglichkeit);
    if (anfängertauglichkeit <= 2) {
        recommendations.push({
            icon: '⚠️',
            title: 'Nur für Erfahrene',
            description: `${speciesName} eignet sich nur für erfahrene Hundehalter.`,
            category: 'experience'
        });
    }
    
    // Apartment-Tauglichkeit
    const apartmentTauglichkeit = this.getRatingValue(ratings.apartmentTauglichkeit);
    if (apartmentTauglichkeit <= 2) {
        recommendations.push({
            icon: '🏠',
            title: 'Nicht für Wohnungen',
            description: `${speciesName} ist nicht für Wohnungshaltung geeignet.`,
            category: 'housing'
        });
    }
    
    // Fellpflege
    const fellpflegeaufwand = this.getRatingValue(ratings.fellpflegeaufwand);
    if (fellpflegeaufwand >= 4) {
        recommendations.push({
            icon: '✂️',
            title: 'Intensive Fellpflege',
            description: `${speciesName} benötigt regelmäßige und aufwendige Fellpflege.`,
            category: 'grooming'
        });
    }
    
    // Beutetrieb
    const beutetrieb = this.getRatingValue(ratings.beutetrieb);
    if (beutetrieb >= 4) {
        recommendations.push({
            icon: '🐾',
            title: 'Starker Beutetrieb',
            description: `${speciesName} hat einen ausgeprägten Beutetrieb - Vorsicht bei Kleintieren.`,
            category: 'behavior'
        });
    }
    
    if (recommendations.length === 0) return '';
    
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>⚠️ Wichtige Hinweise</h4>
                <span class="premium-badge">Empfehlungen</span>
            </div>
            <div class="recommendations-grid">
                ${recommendations.map(rec => `
                    <div class="recommendation-card recommendation-card--${rec.category}">
                        <div class="recommendation-icon">${rec.icon}</div>
                        <div class="recommendation-content">
                            <h5 class="recommendation-title">${rec.title}</h5>
                            <p class="recommendation-description">${rec.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

getAverageRating(ratings) {
    if (!ratings || typeof ratings !== 'object') {
        return '0.0';
    }
    
    // === HUNDE-SPEZIFISCHE GEWICHTUNGEN ===
    const properties = {
        // KRITISCHE EIGENSCHAFTEN (Make-or-Break)
        familienfreundlichkeit: { weight: 2.0, critical: true },
        trainierbarkeit: { weight: 1.8, critical: true },
        gesundheitsrobustheit: { weight: 1.6, critical: true },
        
        // WICHTIGE ALLTAGSEIGENSCHAFTEN
        apartmentTauglichkeit: { weight: 1.3 },
        anfängertauglichkeit: { weight: 1.2 },
        bewegungsbedarf: { weight: 1.1 },
        
        // MODERATE EIGENSCHAFTEN
        fellpflegeaufwand: { weight: 0.9 },
        energielevel: { weight: 0.8 },        // Korreliert mit Bewegungsbedarf
        wachtrieb: { weight: 0.7 },
        
        // WENIGER KRITISCHE EIGENSCHAFTEN
        belltendenz: { weight: 0.6 },
        temperaturresistenz: { weight: 0.5 },
        arbeitsfähigkeit: { weight: 0.4 },
        beutetrieb: { weight: 0.3 }
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    let criticalIssues = [];
    
    // === EIGENSCHAFTEN VERARBEITEN ===
    Object.entries(properties).forEach(([propertyKey, config]) => {
        const rawValue = this.getRatingValue(ratings[propertyKey]);
        
        if (rawValue && rawValue > 0) {
            // === KRITISCHE EIGENSCHAFTEN PRÜFEN ===
            if (config.critical && rawValue < 2.5) {
                criticalIssues.push({
                    property: propertyKey,
                    value: rawValue,
                    impact: (2.5 - rawValue) * 0.3  // Strafpunkte
                });
            }
            
            totalScore += rawValue * config.weight;
            totalWeight += config.weight;
        }
    });
    
    // === FALLBACK ===
    if (totalWeight === 0) {
        return '2.5';
    }
    
    // === BASIS-DURCHSCHNITT ===
    let baseAverage = totalScore / totalWeight;
    
    // === KRITISCHE PROBLEME BERÜCKSICHTIGEN ===
    let criticalPenalty = 0;
    criticalIssues.forEach(issue => {
        criticalPenalty += issue.impact;
    });
    
    // === PROBLEMATISCHE KOMBINATIONEN ===
    const combinationPenalties = this.calculateCombinationPenalties(ratings);
    
    // === FINALE BEWERTUNG ===
    let finalScore = baseAverage - criticalPenalty - combinationPenalties;
    
    // === REALISTISCHE BEWERTUNGS-ANPASSUNG ===
    // Verhindert zu viele "perfekte" Hunde
    if (finalScore > 4.0) {
        finalScore = 4.0 + (finalScore - 4.0) * 0.4;  // Dämpfung sehr hoher Werte
    } else if (finalScore < 2.0) {
        finalScore = 2.0 + (finalScore - 2.0) * 0.7;  // Leichte Anhebung sehr niedriger Werte
    }
    
    // === BONUS FÜR BESONDERS GEEIGNETE HUNDE ===
    const bonus = this.calculateSuitabilityBonus(ratings);
    finalScore += bonus;
    
    // === AUF 1-5 BEGRENZEN ===
    finalScore = Math.max(1.0, Math.min(5.0, finalScore));
    
    return finalScore.toFixed(1);
}

/**
 * Generiert Erklärungstext für die Gesamtbewertung
 */
getAverageRatingExplanation(ratings) {
    const score = this.getAverageRating(ratings);
    
    return `
        <div class="rating-explanation">
            <details>
                <summary>
                    <strong>Gesamtbewertung: ${score}/5 ⭐</strong>
                    <span class="info-icon">ℹ️ Wie wird diese Bewertung berechnet?</span>
                </summary>
                
                <div class="explanation-content">
                    <h4>📊 Berechnung der Gesamtbewertung</h4>
                    <p>Die Gesamtbewertung basiert auf einem <strong>gewichteten Durchschnitt</strong> aller Eigenschaften, wobei besonders wichtige Merkmale stärker berücksichtigt werden:</p>
                    
                    <div class="weight-breakdown">
                        <h5>🔴 Kritische Eigenschaften (höchste Gewichtung):</h5>
                        <ul>
                            <li><strong>Familienfreundlichkeit</strong> (Gewichtung: 2.0) - Wichtigste Eigenschaft für Haushalte</li>
                            <li><strong>Trainierbarkeit</strong> (Gewichtung: 1.8) - Essentiell für das Zusammenleben</li>
                            <li><strong>Gesundheitsrobustheit</strong> (Gewichtung: 1.6) - Langzeitkosten und Wohlbefinden</li>
                        </ul>
                        
                        <h5>🟡 Wichtige Alltagseigenschaften:</h5>
                        <ul>
                            <li><strong>Apartmenttauglichkeit</strong> (Gewichtung: 1.3)</li>
                            <li><strong>Anfängertauglichkeit</strong> (Gewichtung: 1.2)</li>
                            <li><strong>Bewegungsbedarf</strong> (Gewichtung: 1.1)</li>
                        </ul>
                        
                        <h5>🟢 Moderate Eigenschaften:</h5>
                        <ul>
                            <li>Fellpflegeaufwand, Energielevel, Wachtrieb (Gewichtung: 0.6-0.9)</li>
                        </ul>
                    </div>
                    
                    <div class="calculation-details">
                        <h5>🔧 Berechnungsschritte:</h5>
                        <ol>
                            <li><strong>Gewichteter Durchschnitt</strong> aller verfügbaren Eigenschaften</li>
                            <li><strong>Strafpunkte</strong> für kritische Schwächen (z.B. schlechte Familienfreundlichkeit)</li>
                            <li><strong>Kombinationsstrafen</strong> für problematische Eigenschaftspaare</li>
                            <li><strong>Bonus</strong> für besonders geeignete Hunde (z.B. perfekte Familienhunde)</li>
                            <li><strong>Realistische Anpassung</strong> - verhindert zu viele "perfekte" Bewertungen</li>
                        </ol>
                    </div>
                    
                    <div class="rating-scale">
                        <h5>📈 Bewertungsskala:</h5>
                        <ul>
                            <li><strong>1.0-2.4:</strong> Schwierige Rassen - nur für sehr erfahrene Halter</li>
                            <li><strong>2.5-3.4:</strong> Durchschnittliche Rassen mit besonderen Herausforderungen</li>
                            <li><strong>3.5-4.2:</strong> Gut geeignete Rassen für die meisten Halter</li>
                            <li><strong>4.3-5.0:</strong> Außergewöhnlich geeignete Rassen (sehr selten)</li>
                        </ul>
                    </div>
                    
                    <div class="important-disclaimer">
                        <h5>⚠️ Wichtige Hinweise:</h5>
                        <div class="disclaimer-box">
                            <p><strong>Diese Bewertung basiert auf Durchschnittswerten der Rasse und sollte nur als grobe Orientierung dienen.</strong></p>
                            <p>Die Gesamtbewertung stellt eine <em>ungefähre Einschätzung</em> dar, die auf typischen Eigenschaften der Rasse beruht. Sie kann nicht die individuellen Unterschiede einzelner Hunde berücksichtigen.</p>
                            <p><strong>Jeder Hund ist einzigartig!</strong> Faktoren wie:</p>
                            <ul>
                                <li>Individuelle Persönlichkeit und Charakter</li>
                                <li>Aufzucht und Sozialisierung</li>
                                <li>Training und Erziehung</li>
                                <li>Gesundheitszustand</li>
                                <li>Lebensbedingungen</li>
                            </ul>
                            <p>...können die tatsächlichen Eigenschaften eines Hundes erheblich beeinflussen.</p>
                            <p><strong>Empfehlung:</strong> Lernen Sie den konkreten Hund persönlich kennen und lassen Sie sich von Züchtern, Tierheimen oder Hundetrainern individuell beraten.</p>
                        </div>
                    </div>
                </div>
            </details>
        </div>
    `;
}

/**
 * Berechnet Strafpunkte für problematische Eigenschafts-Kombinationen
 */
calculateCombinationPenalties(ratings) {
    let penalty = 0;
    
    const bewegung = this.getRatingValue(ratings.bewegungsbedarf) || 3;
    const training = this.getRatingValue(ratings.trainierbarkeit) || 3;
    const familie = this.getRatingValue(ratings.familienfreundlichkeit) || 3;
    const anfänger = this.getRatingValue(ratings.anfängertauglichkeit) || 3;
    const bell = this.getRatingValue(ratings.belltendenz) || 3;
    const wach = this.getRatingValue(ratings.wachtrieb) || 3;
    
    // Hoher Bewegungsbedarf + schlechte Trainierbarkeit = Problem
    if (bewegung >= 4 && training <= 2) {
        penalty += 0.4;
    }
    
    // Schlechte Familienfreundlichkeit + schlechte Anfängertauglichkeit = Problem
    if (familie <= 2 && anfänger <= 2) {
        penalty += 0.5;
    }
    
    // Sehr hohe Belltendenz + hoher Wachtrieb = Lärmprobleme
    if (bell >= 4 && wach >= 4) {
        penalty += 0.3;
    }
    
    // Sehr hoher Bewegungsbedarf + sehr schlechte Anfängertauglichkeit = Problem
    if (bewegung >= 4.5 && anfänger <= 2) {
        penalty += 0.6;
    }
    
    return penalty;
}

/**
 * Berechnet Bonus für besonders geeignete Hunde
 */
calculateSuitabilityBonus(ratings) {
    let bonus = 0;
    
    const familie = this.getRatingValue(ratings.familienfreundlichkeit) || 3;
    const training = this.getRatingValue(ratings.trainierbarkeit) || 3;
    const gesundheit = this.getRatingValue(ratings.gesundheitsrobustheit) || 3;
    const anfänger = this.getRatingValue(ratings.anfängertauglichkeit) || 3;
    const apartment = this.getRatingValue(ratings.apartmentTauglichkeit) || 3;
    
    // Perfekte Familienhunde
    if (familie >= 4.5 && training >= 4 && gesundheit >= 4) {
        bonus += 0.3;
    }
    
    // Ideale Anfängerhunde
    if (anfänger >= 4.5 && training >= 4 && familie >= 3) {
        bonus += 0.2;
    }
    
    // Apartment-geeignete Hunde
    if (apartment >= 3.5 && this.getRatingValue(ratings.belltendenz) <= 3) {
        bonus += 0.2;
    }
    
    // Allround-Hunde (gut in vielen Bereichen)
    const goodRatings = [familie, training, gesundheit, anfänger, apartment]
        .filter(rating => rating >= 4).length;
    
    if (goodRatings >= 4) {
        bonus += 0.1;
    }
    
    return bonus;
}

getCategoryAverage(ratingArray) {
    if (!ratingArray || ratingArray.length === 0) {
        return '3.0'; // Fallback statt 0.0
    }
    
    const validRatings = ratingArray.filter(rating => rating.value > 0);
    if (validRatings.length === 0) {
        return '3.0';
    }
    
    const sum = validRatings.reduce((total, rating) => total + rating.value, 0);
    const average = sum / validRatings.length;
    return average.toFixed(1);
}

generatePropertyCard(rating) {
    const percentage = (rating.value / 5) * 100;
    const ratingText = ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'][rating.value - 1];
    const ratingEmoji = ['', '', '', '', ''][rating.value - 1];

    return `
        <div class="property-card" data-rating="${rating.value}">
            <div class="property-card__header">
                <div class="property-info">
                    <h5 class="property-title">${rating.label}</h5>
                    <span class="property-value">${ratingEmoji} ${ratingText}</span>
                </div>
                <div class="property-score">
                    <span class="score-number">${rating.value}</span>
                    <span class="score-max">/5</span>
                </div>
            </div>
            
            <div class="property-bar">
                <div class="property-fill" style="width: ${percentage}%"></div>
                <div class="property-marks">
                    ${[1,2,3,4,5].map(mark => `
                        <div class="bar-mark ${mark <= rating.value ? 'active' : ''}" 
                             style="left: ${(mark-1) * 25}%"></div>
                    `).join('')}
                </div>
            </div>
            
            ${this.generateSubRatingsCompact(rating.details)}
        </div>
    `;
}

generateSubRatingsCompact(ratingDetails) {
    console.log('Generating compact sub-ratings for:', ratingDetails);
    
    if (!ratingDetails || typeof ratingDetails !== 'object' || Array.isArray(ratingDetails)) {
        console.log('Invalid rating details:', typeof ratingDetails);
        return '';
    }
    
    const subRatings = Object.entries(ratingDetails)
        .filter(([key, value]) => {
            const isValid = key !== 'overall' && 
                           typeof value === 'number' && 
                           value >= 1 && 
                           value <= 5;
            console.log(`Sub-rating ${key}: ${value} (valid: ${isValid})`);
            return isValid;
        })
        .slice(0, 4); // Maximal 4 Sub-Ratings
    
    if (subRatings.length === 0) {
        console.log('No valid sub-ratings found');
        return '';
    }
    
    console.log('Valid sub-ratings:', subRatings.length);
    
    return `
        <div class="sub-ratings-compact">
            <div class="sub-ratings-header">
                <span class="sub-ratings-title">Detailbewertung</span>
                <span class="sub-ratings-count">${subRatings.length} Aspekte</span>
            </div>
            <div class="sub-ratings-list">
                ${subRatings.map(([key, value]) => `
                    <div class="sub-rating-item">
                        <span class="sub-rating-label">${this.formatRatingLabel(key)}</span>
                        <div class="sub-rating-visual">
                            <div class="sub-rating-bars">
                                ${[1,2,3,4,5].map(dot => `
                                    <span class="sub-bar ${dot <= value ? 'active' : ''}">▪</span>
                                `).join('')}
                            </div>
                            <span class="sub-rating-value">${value}/5</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

populateCareTab(species) {
    const container = document.getElementById('tab-care');
    if (!container) return;

    const details = species.details || {};

    const createCareGuideCard = (icon, title, content, tips = []) => {
        if (!content) return '';
        return `
            <div class="care-guide-card">
                <div class="care-guide-card__header">
                    <div class="care-guide-card__icon">${icon}</div>
                    <h4>${title}</h4>
                </div>
                <div class="care-guide-card__content">
                    <p>${content}</p>
                    ${tips.length > 0 ? `
                        <div class="care-tips">
                            <span class="care-tips__label">💡 Profi-Tipps:</span>
                            <ul class="care-tips__list">
                                ${tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div class="care-guide-container">
            ${createCareGuideCard('🏠', 'Ideale Haltungsumgebung', details.suitability, [
                'Ausreichend Platz schaffen',
                'Rückzugsmöglichkeiten einrichten',
                'Sicherheit gewährleisten'
            ])}
            ${createCareGuideCard('🏃', 'Bewegung & Aktivität', details.activity, [
                'Regelmäßige Bewegungszeiten einhalten',
                'Abwechslungsreiche Aktivitäten anbieten',
                'Wetter berücksichtigen'
            ])}
            ${createCareGuideCard('✨', 'Fellpflege & Hygiene', details.grooming, [
                'Regelmäßiges Bürsten',
                'Professionelle Pflege bei Bedarf',
                'Gesunde Ernährung für schönes Fell'
            ])}
            ${createCareGuideCard('🍽️', 'Ernährung & Fütterung', details.nutrition, [
                'Hochwertiges Futter wählen',
                'Fütterungszeiten einhalten',
                'Leckerlis in Maßen'
            ])}
            ${createCareGuideCard('🧠', 'Training & Sozialisation', details.character, [
                'Früh mit Training beginnen',
                'Positive Verstärkung nutzen',
                'Geduld und Konsistenz'
            ])}
        </div>
    `;
}

populateHealthTab(species) {
    const container = document.getElementById('tab-health');
    if (!container) return;

    const details = species.details || {};

    container.innerHTML = `
        <div class="health-dashboard">
            <!-- Gesundheitsprofil -->
            <div class="health-profile-card">
                <div class="health-profile-card__header">
                    <div class="health-icon">🏥</div>
                    <div>
                        <h4>Gesundheitsprofil</h4>
                        <span class="health-subtitle">Lebenserwartung: ${species.lifeExpectancy || 'Unbekannt'}</span>
                    </div>
                </div>
                <div class="health-content">
                    <p>${details.health || 'Keine spezifischen Gesundheitsinformationen verfügbar. Regelmäßige tierärztliche Kontrollen werden empfohlen.'}</p>
                </div>
            </div>

            <!-- Gesundheits-Checkliste -->
            <div class="health-checklist-card">
                <h4>📋 Gesundheits-Checkliste</h4>
                <div class="health-checklist">
                    <div class="checklist-item">
                        <span class="checklist-icon">🔍</span>
                        <span>Regelmäßige Vorsorgeuntersuchungen</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checklist-icon">💉</span>
                        <span>Impfungen nach Tierarzt-Plan</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checklist-icon">🦷</span>
                        <span>Zahnpflege und Maulhygiene</span>
                    </div>
                    <div class="checklist-item">
                        <span class="checklist-icon">⚖️</span>
                        <span>Gewichtskontrolle</span>
                    </div>
                </div>
            </div>

            <!-- Notfall-Dashboard -->
            <div class="emergency-dashboard">
                <div class="emergency-header">
                    <span class="emergency-icon">🚨</span>
                    <h4>Notfall-Kontakte</h4>
                    <span class="emergency-badge">Wichtig</span>
                </div>
                <div class="emergency-contacts">
                    <div class="emergency-contact">
                        <div class="contact-icon">📞</div>
                        <div class="contact-info">
                            <strong>Tierärztlicher Notdienst</strong>
                            <p>Ihr lokaler Tierarzt oder regionale Tierklinik</p>
                        </div>
                    </div>
                    <div class="emergency-contact">
                        <div class="contact-icon">☠️</div>
                        <div class="contact-info">
                            <strong>Giftnotruf (Berlin)</strong>
                            <p>030 19240 - bei Vergiftungen</p>
                        </div>
                    </div>
                </div>
                <div class="emergency-tips">
                    <h5>💡 Bei einem Notfall:</h5>
                    <ol>
                        <li>Ruhe bewahren</li>
                        <li>Situation einschätzen</li>
                        <li>Sofort tierärztliche Hilfe kontaktieren</li>
                        <li>Erste-Hilfe-Maßnahmen nur wenn sicher</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
}

getHealthRisk(level) {
    switch (level) {
        case 1: return 'Sehr niedrig';
        case 2: return 'Niedrig';
        case 3: return 'Mittel';
        case 4: return 'Hoch';
        case 5: return 'Sehr hoch';
        default: return 'Unbekannt';
    }
}

getVetCosts(level) {
    switch (level) {
        case 1: return 'Sehr niedrig';
        case 2: return 'Niedrig';
        case 3: return 'Mittel';
        case 4: return 'Hoch';
        case 5: return 'Sehr hoch';
        default: return 'Unbekannt';
    }
}

setupModalEventListeners(species) {
    const favBtn = this.speciesModal.querySelector('.favorite-btn');
    if (favBtn) {
        // Zuerst alle alten Listener entfernen, um Duplikate zu vermeiden
        const newFavBtn = favBtn.cloneNode(true);
        favBtn.parentNode.replaceChild(newFavBtn, favBtn);

        newFavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFavorite(species.id);
        });
        // Zustand des Buttons aktualisieren
        this.updateFavoriteButton(newFavBtn, species.id);
    }
}

showCategory(category) {
    console.log('Showing category:', category);
    
    this.currentCategory = category;
    this.hideAllSections();
    this.speciesSection.style.display = 'block';
    
    const categoryData = this.petsData.species[category];
    if (!categoryData) {
        console.warn('Kategorie nicht gefunden:', category);
        return;
    }
    
    this.renderCategorySpecies(categoryData);
    // addFavoriteButtonsToExistingCards() wird jetzt von List.js aufgerufen
}

renderCategorySpecies(categoryData) {
    const catInfo = this.petsData.categories?.find(c => c.id === this.currentCategory);
    
    this.speciesSection.innerHTML = `
        <div class="container">
            <h2 class="section__title">${catInfo?.name || 'Tierarten'}</h2>
            
            <!-- List.js Container -->
            <div id="species-list">

                <!-- Suchfeld -->
<div class="species__search-container">
    <input class="search" placeholder="Tierart suchen..." />
    <!-- Counter wird nur bei aktiver Suche angezeigt -->
    <div class="search-results">
        <span>Gefunden: <span class="result-count">0</span> Tiere</span>
    </div>
</div>
                
                <!-- Filter-Dropdowns -->
                <div class="species__filters">
                    <!-- NEU: Subcategory Filter -->
                    <select id="subcategory-filter">
                        <option value="">Alle Gruppen</option>
                        ${this.generateSubcategoryOptions(categoryData)}
                    </select>
                    
                    <select id="size-filter">
                        <option value="">Alle Größen</option>
                        <option value="Klein">Klein</option>
                        <option value="Mittel">Mittel</option>
                        <option value="Groß">Groß</option>
                    </select>
                    
                    <select id="care-filter">
                        <option value="">Alle Pflegegrade</option>
                        <option value="Einfach">Einfach</option>
                        <option value="Mittel">Mittel</option>
                        <option value="Hoch">Hoch</option>
                    </select>
                    
                    <button class="btn btn--secondary" id="reset-filters">Filter zurücksetzen</button>
                </div>
                
                <!-- Sortier-Buttons mit Richtungsanzeige -->
<div class="species__sort">
    <div class="sort-group">
        <label class="sort-label">Sortieren nach:</label>
        <button class="sort btn btn--mini" data-sort="name" data-order="asc">
            Nach Name <span class="sort-direction">↑</span>
        </button>
        <button class="sort btn btn--mini" data-sort="size" data-order="asc">
            Nach Größe <span class="sort-direction">↑</span>
        </button>
        <button class="sort btn btn--mini" data-sort="care-level" data-order="asc">
            Nach Pflege <span class="sort-direction">↑</span>
        </button>
        <button class="sort btn btn--mini" data-sort="subcategory" data-order="asc">
            Nach Gruppe <span class="sort-direction">↑</span>
        </button>
    </div>
</div>
                
                <!-- Species Grid -->
                <div id="species-grid" class="species__grid list"></div>
                
                <!-- Pagination -->
                <div class="pagination-container">
                    <ul class="pagination"></ul>
                </div>
            </div>
        </div>
    `;
    
    // Alle Arten sammeln
    const allSpecies = [];
    Object.values(categoryData.subcategories || {}).forEach(subcat => {
        if (subcat.species) {
            // Subcategory-Name zu jeder Art hinzufügen
            subcat.species.forEach(species => {
                species.subcategoryName = subcat.name;
                species.subcategoryId = subcat.id;
            });
            allSpecies.push(...subcat.species);
        }
    });
    
    // List.js initialisieren
    this.initListJS(allSpecies);
}

generateSubRatingsHTML(ratingObject) {
    // Erweiterte Validierung
    if (!ratingObject || typeof ratingObject !== 'object' || Array.isArray(ratingObject)) {
        console.log('Invalid rating object:', ratingObject);
        return '';
    }
    
    // Debugging: Struktur ausgeben
    console.log('Rating object structure:', Object.keys(ratingObject));
    
    const subRatings = Object.entries(ratingObject)
        .filter(([key, value]) => {
            // Erweiterte Filterung
            return key !== 'overall' && 
                   typeof value === 'number' && 
                   value > 0 && 
                   value <= 5;
        })
        .map(([key, value]) => {
            const label = this.formatRatingLabel(key);
            return `
                <div class="modal-sub-rating">
                    <span class="modal-sub-rating-label">${label}</span>
                    <div class="modal-sub-rating-value">
                        <div class="modal-sub-rating-stars">${'★'.repeat(value)}${'☆'.repeat(5-value)}</div>
                        <span class="modal-sub-rating-number">${value}/5</span>
                    </div>
                </div>
            `;
        }).join('');
    
    if (!subRatings) {
        console.log('No valid sub-ratings found');
        return '';
    }
    
    return `
        <div class="modal-sub-ratings">
            <h6>Detailbewertung:</h6>
            ${subRatings}
        </div>
    `;
}

generateDetailedRatings(ratings) {
    if (!ratings) return '';
    
    const generateDetailedModalRating = (label, value, description = '', subRatings = null) => {
        if (!value || value < 1) return '';
        const percentage = (value / 5) * 100;
        const ratingText = ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'][value - 1];
        
        return `
            <div class="modal-rating-card">
                <div class="modal-rating-header">
                    <h5 class="modal-rating-title">${label}</h5>
                    <span class="modal-rating-value">${ratingText} (${value}/5)</span>
                </div>
                <div class="modal-rating-bar">
                    <div class="modal-rating-fill" style="width: ${percentage}%"></div>
                </div>
                ${description ? `<p class="modal-rating-description">${description}</p>` : ''}
                ${subRatings ? this.generateSubRatingsHTML(subRatings) : ''}
            </div>
        `;
    };

    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>📈 Detaillierte Eigenschaften</h4>
                <span class="premium-badge">Analyse</span>
            </div>
            <div class="modal-ratings-container">
                ${generateDetailedModalRating(
                    'Trainierbarkeit', 
                    this.getRatingValue(ratings.trainability),
                    'Wie gut lässt sich diese Rasse erziehen und trainieren?',
                    ratings.trainability
                )}
                ${generateDetailedModalRating(
                    'Freundlichkeit', 
                    this.getRatingValue(ratings.friendliness),
                    'Wie sozial und freundlich ist diese Rasse gegenüber Menschen und anderen Tieren?',
                    ratings.friendliness
                )}
                ${generateDetailedModalRating(
                    'Energielevel', 
                    this.getRatingValue(ratings.energy),
                    'Wie viel Bewegung und Aktivität benötigt diese Rasse täglich?',
                    ratings.energy
                )}
                ${generateDetailedModalRating(
                    'Pflegeaufwand', 
                    this.getRatingValue(ratings.grooming),
                    'Wie intensiv ist die erforderliche Fellpflege und Hygiene?',
                    ratings.grooming
                )}
                ${generateDetailedModalRating(
                    'Anfängerfreundlichkeit', 
                    this.getRatingValue(ratings.beginnerFriendly),
                    'Wie gut eignet sich diese Rasse für Erstbesitzer?',
                    ratings.beginnerFriendly
                )}
                ${ratings.protectiveInstinct ? generateDetailedModalRating(
                    'Schutzinstinkt', 
                    this.getRatingValue(ratings.protectiveInstinct),
                    'Wie ausgeprägt ist der natürliche Beschützerinstinkt?',
                    ratings.protectiveInstinct
                ) : ''}
                ${ratings.independence ? generateDetailedModalRating(
                    'Unabhängigkeit', 
                    this.getRatingValue(ratings.independence),
                    'Wie selbstständig kann diese Rasse alleine gelassen werden?',
                    ratings.independence
                ) : ''}
            </div>
        </div>
    `;
}

createInfoCard(icon, label, value, accent = false) {
    if (!value) return '';
    return `
        <div class="modern-info-card ${accent ? 'modern-info-card--accent' : ''}">
            <div class="modern-info-card__icon">${icon}</div>
            <div class="modern-info-card__content">
                <span class="modern-info-card__label">${label}</span>
                <span class="modern-info-card__value">${value}</span>
            </div>
        </div>
    `;
}

generateTemperamentSection(temperaments) {
    if (!temperaments || temperaments.length === 0) return '';
    
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>🎭 Temperament</h4>
                <span class="premium-badge">Charakter</span>
            </div>
            <div class="temperament-tags">
                ${temperaments.map(trait => `<span class="temperament-tag">${trait}</span>`).join('')}
            </div>
        </div>
    `;
}

// Rating-Labels formatieren
formatRatingLabel(key) {
    const labels = {
        // === HAUPT-RATINGS ===
        'energielevel': 'Energielevel',
        'bewegungsbedarf': 'Bewegungsbedarf',
        'familienfreundlichkeit': 'Familienfreundlichkeit',
        'trainierbarkeit': 'Trainierbarkeit',
        'anfängertauglichkeit': 'Anfängertauglichkeit',
        'wachtrieb': 'Wach-/Schutztrieb',
        'belltendenz': 'Belltendenz',
        'fellpflegeaufwand': 'Fellpflegeaufwand',
        'gesundheitsrobustheit': 'Gesundheitsrobustheit',
        'temperaturresistenz': 'Temperaturresistenz',
        'beutetrieb': 'Beutetrieb',
        'arbeitsfähigkeit': 'Arbeitsfähigkeit',
        'unabhängigkeit': 'Unabhängigkeit',
        'apartmentTauglichkeit': 'Apartment-Tauglichkeit',
        
        // === SUB-RATINGS BEWEGUNGSBEDARF ===
        'physicalActivity': 'Körperliche Aktivität',
        'mentalStimulation': 'Geistige Auslastung',
        'playfulness': 'Verspieltheit',
        'wanderlust': 'Wandertrieb',
        
        // === SUB-RATINGS FAMILIENFREUNDLICHKEIT ===
        'children': 'Kinder',
        'family': 'Familie',
        'freundlichkeitFremde': 'Freundlichkeit Fremde',
        'socialAdaptation': 'Soziale Anpassung',
        
        // === SUB-RATINGS TRAINIERBARKEIT ===
        'obedience': 'Gehorsamkeit',
        'focusSpan': 'Konzentrationsspanne',
        'commandRetention': 'Befehlsbehalten',
        'adaptability': 'Anpassungsfähigkeit',
        
        // === SUB-RATINGS WACHTRIEB ===
        'watchfulness': 'Wachsamkeit',
        'territorialBehavior': 'Territorialverhalten',
        'responsiveness': 'Reaktionsfähigkeit',
        'alertness': 'Aufmerksamkeit',
        
        // === SUB-RATINGS FELLPFLEGE ===
        'haaren': 'Haaren',
        'brushingFrequency': 'Bürstenhäufigkeit',
        'professionalGrooming': 'Professionelle Pflege',
        
        // === SUB-RATINGS GESUNDHEIT ===
        'erbkrankheitenRisiko': 'Erbkrankheiten-Risiko',
        'geneticHealth': 'Genetische Gesundheit',
        'immuneSystem': 'Immunsystem',
        'injuryResistance': 'Verletzungsresistenz',
        
        // === SUB-RATINGS TEMPERATURRESISTENZ ===
        'kälteresistenz': 'Kälteresistenz',
        'hitzeresistenz': 'Hitzeresistenz',
        'weatherResistance': 'Wetterbeständigkeit',
        'seasonalAdaptation': 'Saisonale Anpassung',
        
        // === SUB-RATINGS BEUTETRIEB ===
        'chasing': 'Hetzen',
        'hunting': 'Jagdverhalten',
        'catCompatibility': 'Katzenverträglichkeit',
        'smallAnimalTolerance': 'Kleintiertoleranz',
        
        // === SUB-RATINGS ARBEITSFÄHIGKEIT ===
        'taskFocus': 'Aufgabenfokus',
        'endurance': 'Ausdauer',
        'problemSolving': 'Problemlösung',
        'versatility': 'Vielseitigkeit',
        
        // === SUB-RATINGS APARTMENT-TAUGLICHKEIT ===
        'spaceRequirements': 'Platzbedarf',
        'noiseTolerance': 'Lärmtoleranz',
        'neighborCompatibility': 'Nachbarschaftsverträglichkeit'
    };
    
    return labels[key] || this.capitalizeFirst(key);
}

// Hilfsmethode für Fallback-Formatierung
capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Zusätzliche Informationen generieren
generateAdditionalInfo(species) {
    return `
        <div class="premium-section">
            <div class="premium-section__header">
                <h4>ℹ️ Weitere Informationen</h4>
                <span class="premium-badge">Details</span>
            </div>
            <div class="additional-info">
                ${species.subcategoryName ? `<p><strong>Kategorie:</strong> ${species.subcategoryName}</p>` : ''}
                ${species.id ? `<p><strong>ID:</strong> ${species.id}</p>` : ''}
            </div>
        </div>
    `;
}

// Debug-Funktion für Species-Daten
debugSpeciesData(species) {
    console.log('=== SPECIES DATA DEBUG ===');
    console.log('Species object:', species);
    console.log('Name:', species.name);
    console.log('Origin:', species.origin);
    console.log('Size:', species.size);
    console.log('Weight:', species.weight);
    console.log('Life expectancy:', species.lifeExpectancy);
    console.log('Care level:', species.careLevel);
    console.log('Temperament:', species.temperament);
    console.log('Ratings:', species.ratings);
    console.log('=== END DEBUG ===');
}

// Für Rating-Werte
getRatingValue(rating) {
    // Fall 1: Direkte Zahl (wie energy: 5)
    if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
        return Math.round(rating);
    }
    
    // Fall 2: Objekt mit 'overall' Wert (wie trainability: {overall: 5, ...})
    if (typeof rating === 'object' && rating !== null && !Array.isArray(rating)) {
        if (rating.overall !== undefined && typeof rating.overall === 'number') {
            return Math.round(rating.overall);
        }
        
        // Fall 3: Durchschnitt aus numerischen Sub-Werten berechnen
        const numericValues = Object.entries(rating)
            .filter(([key, value]) => {
                return typeof value === 'number' && 
                       value >= 1 && 
                       value <= 5 &&
                       key !== 'overall';
            })
            .map(([key, value]) => value);
        
        if (numericValues.length > 0) {
            const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
            return Math.round(average);
        }
    }
    
    // Fallback für ungültige oder fehlende Werte
    console.warn('Invalid rating value:', rating);
    return 3; // Neutral-Wert als Fallback
}

/**
 * Gradient-Bestimmung basierend auf Kontext
 */
getContextGradient(context, value = null) {
    if (value !== null) {
        return this.getDynamicGradient(context, value);
    }
    
    const gradients = {
        'positive_high': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        'positive_low': 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
        'balanced': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
        'neutral': 'linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%)'
    };
    return gradients[context] || gradients['neutral'];
}

getDynamicGradient(context, value) {
    const numericValue = parseInt(value);
    
    // Für positive_high Eigenschaften (Anfängertauglichkeit, Apartment-Tauglichkeit)
    if (context === 'positive_high') {
        if (numericValue <= 2) {
            // Niedrig = Negativ (ROT) - konsistent mit getLevelClass
            return 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)';
        }
        if (numericValue <= 3) {
            // Mittel = Neutral (ORANGE/GELB)
            return 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)';
        }
        // Hoch = Positiv (GRÜN)
        return 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)';
    }
    
    // Für positive_low Eigenschaften (niedrige Werte sind gut)
    if (context === 'positive_low') {
        if (numericValue <= 1) {
            return 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)';
        }
        if (numericValue <= 2) {
            return 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)';
        }
        if (numericValue <= 3) {
            return 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)';
        }
        if (numericValue <= 4) {
            return 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)';
        }
        return 'linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)';
    }
    
    // Für balanced Eigenschaften - immer grau
    if (context === 'balanced') {
        return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)';
    }
    
    // Fallback für neutrale Eigenschaften
    return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #d1d5db 100%)';
}

// Erweiterte Methode für kontextabhängige Level-Klassen
getLevelClass(value, propertyKey) {
    const context = this.getRatingContext(propertyKey);
    
    switch (context) {
        case 'positive_high':
            // Hohe Werte = positiv (grün)
            if (value <= 2) return 'negative';
            if (value <= 3) return 'neutral';
            return 'positive';
            
        case 'positive_low':
            // Niedrige Werte = positiv
            if (value <= 1) return 'very-positive';
            if (value <= 2) return 'positive';
            if (value <= 3) return 'neutral';
            if (value <= 4) return 'negative';
            return 'very-negative';
            
        case 'balanced':
            // NEU: Mittlere Werte = optimal, hohe Werte = neutral-grau
            if (value <= 1) return 'negative';
            if (value <= 2) return 'slightly-negative';
            if (value <= 3) return 'optimal';
            if (value <= 4) return 'neutral-high';  // Neue Klasse
            return 'neutral-high';  // Auch für Wert 5
            
        default:
            if (value <= 2) return 'low';
            if (value <= 3) return 'neutral';
            return 'neutral-high';  // Statt 'high'
    }
}

/**
 * Erweiterte Rating-Level Texte mit Kontext-Berücksichtigung
 */
getRatingLevel(value, propertyKey) {
    const context = this.getRatingContext(propertyKey);
    
    const levelTexts = {
        positive_high: ['Sehr schlecht', 'Schlecht', 'Durchschnittlich', 'Gut', 'Sehr gut'],
        positive_low: ['Sehr gut', 'Gut', 'Durchschnittlich', 'Hoch', 'Sehr hoch'],
        balanced: ['Zu niedrig', 'Niedrig', 'Optimal', 'Hoch', 'Sehr hoch'],
        neutral: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch']
    };
    
    const texts = levelTexts[context] || levelTexts.neutral;
    return texts[value - 1] || 'Unbekannt';
}

debugCategoryDisplay(species) {
    console.log('=== CATEGORY DISPLAY DEBUG ===');
    console.log('Species:', species.name);
    console.log('Ratings structure:', JSON.stringify(species.ratings, null, 2));
    
    const categories = ['suitability', 'dailyNeeds', 'behavior', 'environment', 'special'];
    
    categories.forEach(catKey => {
        console.log(`\n--- ${catKey} ---`);
        const category = this.getCategoryDefinition(catKey);
        if (category) {
            Object.entries(category.properties).forEach(([key, label]) => {
                const exists = !!species.ratings[key];
                const value = this.getRatingValue(species.ratings[key]);
                console.log(`${key}: exists=${exists}, value=${value}, raw=`, species.ratings[key]);
            });
        }
    });
    
    console.log('=== DEBUG END ===');
}

    populateModal(species) {
    if (!this.modalTitle || !this.modalGallery || !species) {
        console.error('Modal-Elemente oder Tierart nicht gefunden');
        return;
    }

    // Modal-Titel setzen
    this.modalTitle.textContent = species.name || 'Unbekannte Tierart';

    // Galerie befüllen
    this.populateModalGallery(species);

    // Inhalte für alle Tabs befüllen
    this.populateAllTabs(species);

    // ---- KORREKTUR: Standard-Tab beim Öffnen aktivieren ----
    // Setzt den ersten Tab und den ersten Inhaltsbereich als Standard aktiv.
    this.modalTabsContainer.querySelectorAll('.modal-tab').forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
    });
    this.speciesModal.querySelectorAll('.modal-tab-content').forEach((content, index) => {
        content.classList.toggle('active', index === 0);
    });

    // Event-Listener für andere dynamische Elemente im Modal (z.B. Favoriten-Button)
    this.setupModalEventListeners(species);
}

// KORRIGIERTE Galerie-Methode
populateModalGallery(species) {
    // Galerie-Inhalt leeren, aber Struktur beibehalten
    this.modalGallery.innerHTML = '';
    
    // Haupt-Bild erstellen
    const mainImage = document.createElement('img');
    mainImage.src = species.image || 'images/placeholder.jpg';
    mainImage.alt = species.name;
    mainImage.loading = 'lazy';
    mainImage.style.cssText = `
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 16px;
    `;
    
    this.modalGallery.appendChild(mainImage);
    
    // Zusätzliche Bilder falls vorhanden
    if (species.gallery && species.gallery.length > 1) {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.style.cssText = `
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 8px 0;
        `;
        
        species.gallery.forEach((src, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = src;
            thumbnail.alt = `${species.name} Bild ${index + 1}`;
            thumbnail.style.cssText = `
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 8px;
                cursor: pointer;
                opacity: ${index === 0 ? '1' : '0.7'};
                transition: opacity 0.3s ease;
            `;
            
            thumbnail.addEventListener('click', () => {
                mainImage.src = src;
                thumbnailContainer.querySelectorAll('img').forEach(img => img.style.opacity = '0.7');
                thumbnail.style.opacity = '1';
            });
            
            thumbnailContainer.appendChild(thumbnail);
        });
        
        this.modalGallery.appendChild(thumbnailContainer);
    }
}

// KORRIGIERTE Tab-Inhalte ohne buildModalStructure
populateModalTabs(species) {
    // Übersicht Tab
    const overviewTab = this.speciesModal.querySelector('#tab-overview');
    if (overviewTab) {
        overviewTab.innerHTML = `
            <div class="species-detail-facts">
                <h3>📋 Grunddaten</h3>
                <ul>
                    <li><strong>Herkunft:</strong> ${species.origin || 'Unbekannt'}</li>
                    <li><strong>Größe:</strong> ${species.size || 'Unbekannt'}</li>
                    <li><strong>Gewicht:</strong> ${species.weight || 'Unbekannt'}</li>
                    <li><strong>Lebenserwartung:</strong> ${species.lifeExpectancy || 'Unbekannt'}</li>
                    <li><strong>Pflegeaufwand:</strong> ${species.careLevel || 'Unbekannt'}</li>
                </ul>
                
                ${species.temperament && species.temperament.length > 0 ? `
                    <div class="species-detail-temperament">
                        <h4>🎭 Temperament</h4>
                        <div class="temperament-tags">
                            ${species.temperament.map(t => `<span class="temperament-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${species.description ? `
                    <div class="species-detail-section">
                        <h3>📖 Beschreibung</h3>
                        <p>${species.description}</p>
                    </div>
                ` : ''}
                
                ${species.ratings ? this.generateRatingsHTML(species.ratings) : ''}
            </div>
        `;
    }
    
    // Haltung Tab
    const careTab = this.speciesModal.querySelector('#tab-care');
    if (careTab) {
        careTab.innerHTML = `
            ${species.details?.character ? `<div class="species-detail-section"><h3>🎭 Charakter & Verhalten</h3><p>${species.details.character}</p></div>` : ''}
            ${species.details?.activity ? `<div class="species-detail-section"><h3>⚡ Aktivität & Beschäftigung</h3><p>${species.details.activity}</p></div>` : ''}
            ${species.details?.suitability ? `<div class="species-detail-section"><h3>🏠 Eignung & Haltung</h3><p>${species.details.suitability}</p></div>` : ''}
            ${species.details?.grooming ? `<div class="species-detail-section"><h3>🧼 Pflege</h3><p>${species.details.grooming}</p></div>` : ''}
            ${species.details?.nutrition ? `<div class="species-detail-section"><h3>🍽️ Ernährung</h3><p>${species.details.nutrition}</p></div>` : ''}
        `;
    }
    
    // Gesundheit Tab
    const healthTab = this.speciesModal.querySelector('#tab-health');
    if (healthTab) {
        healthTab.innerHTML = `
            ${species.details?.health ? `<div class="species-detail-section"><h3>🏥 Gesundheit & Erbkrankheiten</h3><p>${species.details.health}</p></div>` : ''}
            <div class="species-detail-section">
                <h3>📊 Gesundheitsübersicht</h3>
                <p><strong>Lebenserwartung:</strong> ${species.lifeExpectancy || 'Unbekannt'}</p>
                <p><strong>Schwierigkeitsgrad:</strong> ${species.careLevel || 'Nicht angegeben'}</p>
            </div>
        `;
    }
}

/**
 * Erstellt eine kompakte, moderne Tierkarte mit einheitlicher Darstellung
 * @param {Object} species - Das Tierart-Objekt
 * @returns {string} - Vollständiger HTML-String der Karte
 */
renderSpeciesCard(species) {
    // SICHERE Datenextraktion mit Fallbacks
    const name = species.name || 'Unbekannte Tierart';
    const image = species.image || 'images/placeholder-animal.jpg';
    const description = this.limitText(species.description || species.shortDescription || '', 150);
    const subcategoryName = species.subcategoryName || '';
    
    const difficulty = this.getDifficultyInfo(species.careLevel);
    const isFavorite = this.isFavorite(species.id);
    const temperamentTags = this.renderTemperamentTags(species.temperament || []);
    
    return `
        <div class="species-card" data-species-id="...">
       <div class="species-card__header">
           <div class="species-card__image">
               <img src="..." alt="..." />
           </div>
           <div class="species-card__overlay">
               <span class="category-badge">Kategorie</span>
               <button class="favorite-btn" data-species-id="...">❤️</button>
           </div>
       </div>
       
       <div class="species-card__content">
           <div class="species-card__main">
               <h3 class="species-card__title">Tierart Name</h3>
               <p class="species-card__description">Beschreibung...</p>
           </div>
           
           <div class="species-card__facts">
               <div class="fact-item" data-fact="origin">
                   <span class="fact-icon">🌍</span>
                   <span class="fact-label">Herkunft</span>
                   <span class="fact-value">Deutschland</span>
               </div>
               <div class="fact-item" data-fact="size">
                   <span class="fact-icon">📏</span>
                   <span class="fact-label">Größe</span>
                   <span class="fact-value">Mittel</span>
               </div>
               <div class="fact-item" data-fact="weight">
                   <span class="fact-icon">⚖️</span>
                   <span class="fact-label">Gewicht</span>
                   <span class="fact-value">15-25 kg</span>
               </div>
               <div class="fact-item" data-fact="lifespan">
                   <span class="fact-icon">❤️</span>
                   <span class="fact-label">Lebenserwartung</span>
                   <span class="fact-value">12-15 Jahre</span>
               </div>
               <div class="fact-item" data-fact="care">
                   <span class="fact-icon">🧼</span>
                   <span class="fact-label">Pflegeaufwand</span>
                   <span class="fact-value">Mittel</span>
               </div>
           </div>
           
           <div class="temperament-section">
               <div class="temperament-tags">
                   <span class="temperament-tag">Freundlich</span>
               </div>
           </div>
       </div>
       
       <div class="species-card__footer">
           <button class="btn btn--primary details-btn">Details ansehen</button>
       </div>
   </div>
    `;
}

/**
 * Bestimmt Schwierigkeitsgrad-Informationen
 */
getDifficultyInfo(careLevel) {
    const level = (careLevel || '').toLowerCase();
    
    if (level.includes('einfach') || level.includes('niedrig') || level.includes('anfänger')) {
        return { level: 'easy', text: 'Einfach', icon: '🟢' };
    }
    
    if (level.includes('hoch') || level.includes('erfahren') || level.includes('schwer')) {
        return { level: 'hard', text: 'Schwer', icon: '🔴' };
    }
    
    return { level: 'medium', text: 'Mittel', icon: '🟡' };
}

/**
 * Rendert Temperament-Tags (maximal 3 + Mehr-Indikator)
 */
renderTemperamentTags(temperamentArray) {
    if (!temperamentArray || temperamentArray.length === 0) {
        return '';
    }
    
    const visibleTags = temperamentArray.slice(0, 3);
    const remainingCount = temperamentArray.length - 3;
    
    let tagsHTML = visibleTags.map(trait => 
        `<span class="temperament-tag">${trait}</span>`
    ).join('');
    
    if (remainingCount > 0) {
        const allRemaining = temperamentArray.slice(3).join(', ');
        tagsHTML += `<span class="temperament-tag more-indicator" 
                            title="${allRemaining}">+${remainingCount}</span>`;
    }
    
    return `
        <div class="temperament-section">
            <div class="temperament-tags">
                ${tagsHTML}
            </div>
        </div>
    `;
}

// Rating-Hilfsfunktionen
calculateAverageRating(ratingObject) {
    if (typeof ratingObject !== 'object') return ratingObject || 3;
    
    const values = Object.values(ratingObject).filter(v => typeof v === 'number');
    if (values.length === 0) return 3;
    
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

normalizeRatingForDisplay(rating) {
    if (typeof rating === 'number') {
        return {
            overall: rating,
            isSimple: true
        };
    }
    
    if (typeof rating === 'object' && rating.overall !== undefined) {
        return {
            ...rating,
            isSimple: false
        };
    }
    
    // Fallback für unbekannte Strukturen
    return {
        overall: 3,
        isSimple: true
    };
}

// Favoriten-Modal anzeigen
showFavoritesModal() {
    console.log('Favoriten-Modal wird angezeigt');
    
    // Favoriten-Arten sammeln
    const favoriteSpecies = [];
    for (const category of Object.values(this.petsData.species || {})) {
        for (const subcat of Object.values(category.subcategories || {})) {
            const favs = subcat.species?.filter(s => this.isFavorite(s.id)) || [];
            favoriteSpecies.push(...favs);
        }
    }
    
    // Zur Species-Sektion wechseln und Favoriten anzeigen
    this.hideAllSections();
    this.speciesSection.style.display = 'block';
    document.getElementById('species-title').textContent = 'Meine Favoriten';
    
    if (favoriteSpecies.length > 0) {
        this.renderFilteredSpecies(favoriteSpecies);
    } else {
        const grid = document.getElementById('species-grid');
        grid.innerHTML = '<div class="no-species">Keine Favoriten vorhanden.</div>';
    }
}

    // FAVORITEN-SYSTEM METHODEN

toggleFavorite(speciesId) {
    // Schritt 1: Prüfen, ob das Tier bereits ein Favorit ist
    if (this.favorites.has(speciesId)) {
        // Fall 1: Ja, es ist ein Favorit -> Entfernen
        this.favorites.delete(speciesId);
        this.showToast('Aus Favoriten entfernt');
        console.log(`Favorit entfernt: ${speciesId}`, this.favorites);
    } else {
        // Fall 2: Nein, es ist kein Favorit -> Hinzufügen
        this.favorites.add(speciesId);
        this.showToast('Zu Favoriten hinzugefügt ❤️');
        console.log(`Favorit hinzugefügt: ${speciesId}`, this.favorites);
    }

    // Schritt 2: Die Favoritenliste im Browser-Speicher aktualisieren
    this.saveFavorites();

    // Schritt 3: Alle Herz-Buttons auf der Seite aktualisieren
    this.updateFavoriteButtons();
}

// Stellen Sie sicher, dass diese Hilfsfunktionen auch in Ihrer Klasse vorhanden sind.
// Fügen Sie sie hinzu, falls sie fehlen.

saveFavorites() {
    // Speichert das Set als Array im localStorage
    localStorage.setItem('petFavorites', JSON.stringify(Array.from(this.favorites)));
}

isFavorite(speciesId) {
    // Eine einfache Funktion, um den Status zu prüfen
    return this.favorites.has(speciesId);
}

updateFavoriteButtons() {
    // Geht durch alle sichtbaren Herz-Buttons und passt ihr Aussehen an
    const allFavoriteButtons = document.querySelectorAll('.favorite-btn');
    allFavoriteButtons.forEach(btn => {
        const id = parseInt(btn.dataset.speciesId, 10);
        if (this.isFavorite(id)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
            btn.title = 'Aus Favoriten entfernen';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
            btn.title = 'Zu Favoriten hinzufügen';
        }
    });

    // Zähler im Header aktualisieren
    const counter = document.querySelector('.favorites-counter');
    if(counter) {
        counter.textContent = this.favorites.size;
        counter.style.display = this.favorites.size > 0 ? 'inline-block' : 'none';
    }
}

// Hilfsfunktion für die Benachrichtigung (Toast-Message)
showToast(message) {
    // Alten Toast entfernen, falls vorhanden
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) {
        oldToast.remove();
    }

    // Neuen Toast erstellen
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Toast nach kurzer Zeit einblenden und dann wieder ausblenden
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

saveFavorites() {
    localStorage.setItem('petFavorites', JSON.stringify([...this.favorites]));
}

isFavorite(speciesId) {
    return this.favorites.has(speciesId);
}

getFavoriteSpecies() {
    const favoriteSpecies = [];
    for (const category of Object.values(this.petsData.species || {})) {
        for (const subcat of Object.values(category.subcategories || {})) {
            const species = subcat.species?.filter(s => this.favorites.has(s.id)) || [];
            favoriteSpecies.push(...species);
        }
    }
    return favoriteSpecies;
}

updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const speciesId = parseInt(btn.dataset.speciesId);
        const isFav = this.isFavorite(speciesId);
        btn.classList.toggle('active', isFav);
        btn.innerHTML = isFav ? '❤️' : '🤍';
        btn.title = isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen';
    });
    this.updateFavoritesCounter();
}

updateFavoritesCounter() {
    const counter = document.querySelector('.favorites-counter');
    if (counter) {
        counter.textContent = this.favorites.size;
        counter.style.display = this.favorites.size > 0 ? 'inline-flex' : 'none';
    }
}

showFavoriteNotification(speciesId) {
    const species = this.findSpeciesById(speciesId);
    const isFav = this.isFavorite(speciesId);
    const message = isFav 
        ? `${species.name} zu Favoriten hinzugefügt` 
        : `${species.name} aus Favoriten entfernt`;
    
    this.showNotification(message, isFav ? 'success' : 'info');
}

showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span class="notification__icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification__message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Favoriten Modal Methoden
initFavoritesModal() {
    const modalHTML = `
        <div id="favorites-modal" class="modal hidden">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Meine Favoriten</h2>
                    <button class="modal-close" aria-label="Modal schließen">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="favorites-grid" id="favorites-grid"></div>
                    <div class="favorites-empty" id="favorites-empty" style="display: none;">
                        <div class="favorites-empty__icon">💔</div>
                        <h3>Keine Favoriten</h3>
                        <p>Sie haben noch keine Tierarten zu Ihren Favoriten hinzugefügt.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    this.favoritesModal = document.getElementById('favorites-modal');
    this.setupFavoritesModalEvents();
}

setupFavoritesModalEvents() {
    const closeBtn = this.favoritesModal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => this.closeFavoritesModal());
    
    this.favoritesModal.addEventListener('click', (e) => {
        if (e.target === this.favoritesModal) this.closeFavoritesModal();
    });
}

showFavoritesModal() {
    this.renderFavorites();
    this.favoritesModal.classList.remove('hidden');
    this.favoritesModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

closeFavoritesModal() {
    this.favoritesModal.classList.remove('show');
    this.favoritesModal.classList.add('hidden');
    document.body.style.overflow = '';
}

renderFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const favoritesEmpty = document.getElementById('favorites-empty');
    const favoriteSpecies = this.getFavoriteSpecies();

    if (favoriteSpecies.length === 0) {
        favoritesGrid.style.display = 'none';
        favoritesEmpty.style.display = 'block';
        return;
    }

    favoritesGrid.style.display = 'grid';
    favoritesEmpty.style.display = 'none';
    
    favoritesGrid.innerHTML = favoriteSpecies.map(species => `
<div class="species-card" data-species-id="${species.id}">
    <div class="species-card__image">
        <img src="${species.image}" alt="${species.name}" loading="lazy">
        <button class="favorite-btn ${this.isFavorite(species.id) ? 'active' : ''}" data-species-id="${species.id}">
            ${this.isFavorite(species.id) ? '❤️' : '🤍'}
        </button>
    </div>
    <div class="species-card__content">
        <h3 class="species-card__title">${species.name}</h3>
        <p class="species-card__description">${species.description}</p>
        <ul class="species-card__info-list">
            <li><strong>Herkunft:</strong> ${species.origin}</li>
            <li><strong>Größe:</strong> ${species.size}</li>
            <li><strong>Gewicht:</strong> ${species.weight}</li>
            <li><strong>Lebenserwartung:</strong> ${species.lifeExpectancy}</li>
        </ul>
    </div>
    <div class="species-card__footer">
        <span class="species-card__more-info">Mehr erfahren →</span>
    </div>
</div>
    `).join('');
}

// Hilfsmethode für gefilterte Anzeige
renderFilteredSpecies(filteredSpecies) {
    const speciesGrid = document.getElementById('species-grid');
    
    if (!speciesGrid) {
        console.error('Element #species-grid nicht gefunden');
        this.reinitializeSpeciesSection();
        
        const newSpeciesGrid = document.getElementById('species-grid');
        if (!newSpeciesGrid) {
            console.error('Konnte species-grid auch nach Reinitializing nicht erstellen');
            return;
        }
        
        this.renderToGrid(newSpeciesGrid, filteredSpecies);
        return;
    }
    
    // Grid vollständig leeren und alle Event-Listener entfernen
    this.clearGrid(speciesGrid);
    
    // Neue Karten rendern
    this.renderToGrid(speciesGrid, filteredSpecies);
}

// Grid vollständig leeren
clearGrid(grid) {
    // Alle Event-Listener entfernen (falls vorhanden)
    const existingCards = grid.querySelectorAll('.species-card');
    existingCards.forEach(card => {
        card.remove();
    });
    
    // Grid komplett leeren
    grid.innerHTML = '';
    
    // Sicherstellen, dass keine CSS-Klassen Probleme verursachen
    grid.className = 'species__grid';
}

renderToGrid(grid, filteredSpecies) {
    if (filteredSpecies.length === 0) {
        grid.innerHTML = '<div class="no-species">Keine Tierarten gefunden.</div>';
        return;
    }
    
    // NEUE VERSION: Nutzt renderSpeciesCard
    grid.innerHTML = filteredSpecies.map(species => this.renderSpeciesCard(species)).join('');
    
    // Event-Listener nach DOM-Update
    setTimeout(() => {
        this.updateSpeciesCardAttributes();
        this.addFavoriteButtonsToExistingCards();
    }, 50);
}

    generateRatingsHTML(ratings, category = 'dogs') {
    const labels = {
        dogs: {
            energy: 'Energielevel',
            trainability: 'Trainierbarkeit',
            friendliness: 'Freundlichkeit',
            grooming: 'Pflegeaufwand',
            beginnerFriendly: 'Anfängerfreundlich'
        },
        cats: {
            energy: 'Energielevel',
            trainability: 'Intelligenz',  // Hier der Unterschied!
            friendliness: 'Freundlichkeit',
            grooming: 'Pflegeaufwand',
            beginnerFriendly: 'Anfängerfreundlich'
        }
    };
    
    const currentLabels = labels[category];
    let html = '<div class="species-detail-ratings"><h3>Bewertungen</h3>';
    for (const [key, value] of Object.entries(ratings)) {
        const label = currentLabels[key] || key;  // Diese Zeile nutzt jetzt currentLabels
        const width = (value / 5) * 100;
        html += `
            <div class="rating-item">
                <strong>${label}</strong>
                <div class="rating-bar">
                    <div class="rating-bar-inner" style="width: ${width}%;"></div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    return html;
}

// Blendet alle Hauptsektionen aus
hideAllSections() {
    console.log('Hiding all sections...');
    
    // Liste aller möglichen Sektionen
    const sectionSelectors = [
        '.categories-section',
        '.species-section', 
        '.tools-section',
        '#blog-section',
        '#blog-detail-section',
        '#pet-profile-section',
        '#comparison-section', 
        '#my-pets-section',
        '#pet-profile-detail-section',
        '#login-section',
        '#register-section',
        '#admin-login-section',
        '#admin-log-section'
    ];
    
    // Sektionen über Selektoren verstecken
    sectionSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Zusätzlich über gespeicherte Referenzen verstecken
    const sections = [
        this.categoriesSection,
        this.speciesSection,
        this.toolsSection,
        this.blogOverviewSection,
        this.blogDetailSection,
        this.petProfileSection,
        this.comparisonSection,
        this.myPetsSection,
        this.petProfileDetailSection
    ];
    
    sections.forEach(section => {
        if (section && section.style) {
            section.style.display = 'none';
        }
    });
    
    console.log('✅ All sections hidden');
}

// Zeigt eine spezifische Sektion an
showSection(section) {
    if (!section) {
        console.warn('❌ Sektion ist null oder undefiniert');
        return;
    }
    
    if (typeof section === 'string') {
        section = document.querySelector(section);
    }
    
    if (section && section.style) {
        section.style.display = 'block';
        console.log('✅ Sektion angezeigt:', section.id || section.className);
    } else {
        console.warn('❌ Sektion konnte nicht angezeigt werden:', section);
    }
}

showComparison() {
    console.log('Showing comparison section');
    
    // Alle anderen Sektionen verstecken
    this.hideAllSections();
    
    // Vergleichssektion anzeigen
    const comparisonSection = document.getElementById('comparison-section');
    if (comparisonSection) {
        comparisonSection.style.display = 'block';
        
        // Vergleichsfunktion initialisieren falls noch nicht geschehen
        if (typeof animalComparison === 'undefined' && typeof AnimalComparison !== 'undefined') {
            window.animalComparison = new AnimalComparison();
        }
    }
}

    showHome() {
    console.log('Showing home - resetting all states');
    
    // Alle Sektionen ausblenden
    this.hideAllSections();
    
    // Home-Sektionen anzeigen
    document.title = 'tailr.wiki';
    this.categoriesSection.style.display = 'block';
    this.toolsSection.style.display = 'block';
    
    console.log('Home shown, currentCategory reset to:', this.currentCategory);
}

showBlog() {
    console.log('Showing blog section...');
    this.hideAllSections();
    
    // Blog-Sektion anzeigen
    const blogSection = document.getElementById('blog-section');
    if (blogSection) {
        this.showSection(blogSection);
        
        // BlogManager initialisieren falls noch nicht geschehen
        if (!this.blogManager && this.blogData.length > 0) {
            this.blogManager = new EnhancedBlogManager(this);
        } else if (this.blogManager) {
            // Blog-Manager aktualisieren
            this.blogManager.applyFilters();
        }
    } else {
        console.error('❌ Blog-Sektion nicht gefunden');
    }
}

    // Rendering
    renderCategories() {
        if (!this.categoriesGrid || !this.petsData.categories) return;
        this.categoriesGrid.innerHTML = this.petsData.categories.map(c => `
            <a href="#" class="category-card" data-category="${c.id}">
                <div class="category-card__image">
                    <img src="${c.image}" alt="${c.name}" loading="lazy" />
                </div>
                <div class="category-card__content">
                    <div class="category-card__count">${c.speciesCount} Arten</div>
                    <h3 class="category-card__title">${c.name}</h3>
                    <p class="category-card__description">${c.description}</p>
                </div>
            </a>
        `).join('');
    }
    getCategoryName(id) {
        return this.petsData.categories?.find(c => c.id === id)?.name || 'Kategorie';
    }
    // =============== BLOG-METHODEN ===============
  showBlogDetail(blogId) {
    const post = this.blogData.find(p => p.id === blogId);
    if (!post || !this.blogDetailSection) return;
    
    this.hideAllSections();
    document.title = `${post.title} – tailr.wiki`;
    
    this.blogDetailSection.innerHTML = `
      <div class="container">
        <a href="#" id="blog-back-btn" class="btn btn--secondary">← Zurück zum Blog</a>
        <div class="blog-detail-wrapper">
          <aside class="blog-meta">
            <img src="${post.author?.avatar || 'images/avatar-default.jpg'}" 
                 alt="${post.author?.name || 'Admin'}" 
                 class="blog-meta__avatar"
                 onerror="this.style.display='none'">
            <div class="blog-meta__author">${post.author?.name || 'tailr.wiki Admin'}</div>
            <div class="blog-meta__info">
              <p><strong>Veröffentlicht:</strong><br>${post.date || 'Unbekannt'}</p>
              <p><strong>Lesezeit:</strong><br>${post.readingTime || 'Unbekannt'}</p>
              <p><strong>Kategorie:</strong><br>${post.category || 'Allgemein'}</p>
            </div>
          </aside>
          <article class="blog-article">
            <img src="${post.heroImage || post.cardImage || 'images/blog/placeholder.jpg'}" 
                 alt="${post.title}" class="blog-article__image"
                 onerror="this.style.display='none'">
            <h1 class="blog-article__title">${post.title}</h1>
            <div class="blog-article__content">${post.content || post.excerpt}</div>
          </article>
        </div>
      </div>
    `;
    
    this.blogDetailSection.style.display = 'block';
    window.scrollTo(0, 0);
  }

  initListJS(speciesData) {
    const options = {
        valueNames: [
            'name', 'description', 'size', 'care-level', 'origin', 'temperament', 
            'weight', 'life-expectancy', 'subcategory', // ← Alle Felder hinzugefügt
            { name: 'species-id', attr: 'data-species-id' },
            { name: 'image', attr: 'src' }
        ],
        item: this.createSpeciesTemplate(),
        page: 12,
        pagination: {
            innerWindow: 2,
            outerWindow: 1
        }
    };
    
    // VOLLSTÄNDIGE Datenverarbeitung
    const listData = speciesData.map(species => ({
        'name': species.name,
        'description': this.truncateDescription(species.description || ''),
        'size': species.size || 'Unbekannt',
        'care-level': species.careLevel || 'Unbekannt',
        'origin': species.origin || 'Unbekannt',
        'weight': species.weight || 'Unbekannt',                    // ← NEU
        'life-expectancy': species.lifeExpectancy || 'Unbekannt',   // ← NEU
        'temperament': this.formatTemperamentTags(species.temperament),
        'subcategory': species.subcategoryName || 'Unbekannt',
        'species-id': species.id,
        'image': species.image || 'images/placeholder.jpg'
    }));
    
    this.speciesList = new List('species-list', options, listData);
    
    // Event-Handler nach Initialisierung
    setTimeout(() => {
        this.updateSpeciesCardAttributes();
        this.addFavoriteButtonsToExistingCards();
        this.updateResultCount();
    }, 100);
    
    this.speciesList.on('updated', () => {
        setTimeout(() => {
            this.updateSpeciesCardAttributes();
            this.addFavoriteButtonsToExistingCards();
            this.updateResultCount();
        }, 50);
    });
    
    this.setupAdvancedFilters();
    this.updateResultCount();
    this.setupSearchListener();
}

// Temperament-Tags für List.js formatieren (ERWEITERT)
formatTemperamentTags(temperamentArray) {
    if (!temperamentArray || temperamentArray.length === 0) return '';
    
    // Intelligente Kategorisierung
    const categorizeTemperament = (trait) => {
        const positive = ['Freundlich', 'Intelligent', 'Loyal', 'Ruhig', 'Verspielt', 'Liebevoll', 'Sanft'];
        const attention = ['Territorial', 'Dominant', 'Schüchtern', 'Aggressiv', 'Misstrauisch'];
        
        if (positive.some(p => trait.toLowerCase().includes(p.toLowerCase()))) return 'positive';
        if (attention.some(a => trait.toLowerCase().includes(a.toLowerCase()))) return 'attention';
        return 'neutral';
    };
    
    return temperamentArray.map((trait, index) => {
        const type = categorizeTemperament(trait);
        return `<span class="temperament-tag" data-type="${type}" style="animation-delay: ${index * 100}ms">${trait}</span>`;
    }).join('');
}

// Hilfsfunktionen für bessere Datenformatierung
truncateDescription(description, maxLength = 120) {
    if (!description) return '';
    return description.length > maxLength 
        ? description.substring(0, maxLength) + '...' 
        : description;
}

_truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text || 'Keine Beschreibung verfügbar';
    return text.substring(0, maxLength).trim() + '...';
}

formatTemperamentPreview(temperamentArray) {
    if (!temperamentArray || temperamentArray.length === 0) return 'Nicht angegeben';
    
    // Zeige die ersten 2-3 wichtigsten Eigenschaften
    const preview = temperamentArray.slice(0, 3).join(', ');
    return temperamentArray.length > 3 ? preview + '...' : preview;
}

createSpeciesTemplate() {
    return `
        <div class="species-card enhanced">
            <div class="species-card__header">
                <div class="species-card__image">
                    <img class="image" src="" alt="" loading="lazy">
                </div>
                <div class="species-card__category">
                    <span class="subcategory-badge subcategory"></span>
                </div>
            </div>
            
            <div class="species-card__content">
                <div class="species-card__main-info">
                    <h3 class="species-card__title name"></h3>
                    <p class="species-card__description description"></p>
                </div>
                
                <!-- ALLE 5 STECKBRIEF-DATEN -->
                <div class="species-card__facts">
                    <div class="fact-item" data-fact="origin">
                        <span class="fact-icon">🌍</span>
                        <span class="fact-label">Herkunft</span>
                        <span class="fact-value origin"></span>
                    </div>
                    <div class="fact-item" data-fact="size">
                        <span class="fact-icon">📏</span>
                        <span class="fact-label">Größe</span>
                        <span class="fact-value size"></span>
                    </div>
                    <div class="fact-item" data-fact="weight">
                        <span class="fact-icon">⚖️</span>
                        <span class="fact-label">Gewicht</span>
                        <span class="fact-value weight"></span>
                    </div>
                    <div class="fact-item" data-fact="lifespan">
                        <span class="fact-icon">❤️</span>
                        <span class="fact-label">Lebenserwartung</span>
                        <span class="fact-value life-expectancy"></span>
                    </div>
                    <div class="fact-item" data-fact="care">
                        <span class="fact-icon">🧼</span>
                        <span class="fact-label">Pflegeaufwand</span>
                        <span class="fact-value care-level"></span>
                    </div>
                </div>
                
                <!-- Temperament -->
                <div class="temperament-section">
                    <div class="temperament-tags temperament"></div>
                </div>
            </div>
            
            <div class="species-card__footer">
                <button class="btn btn--mini btn--primary species-card__more-btn">
                    Mehr erfahren
                </button>
            </div>
        </div>
    `;
}


setupAdvancedFilters() {
    const subcategoryFilter = document.getElementById('subcategory-filter');
    const sizeFilter = document.getElementById('size-filter');
    const careFilter = document.getElementById('care-filter');
    const resetBtn = document.getElementById('reset-filters');
    
    // Mehrfach-Filter Objekt
    this.activeFilters = {};
    this.currentSort = { field: null, order: 'asc' };
    
    // Subcategory Filter
    subcategoryFilter?.addEventListener('change', (e) => {
        if (e.target.value) {
            this.activeFilters.subcategory = e.target.value;
        } else {
            delete this.activeFilters.subcategory;
        }
        this.applyFilters();
    });
    
    // Size Filter
    sizeFilter?.addEventListener('change', (e) => {
        if (e.target.value) {
            this.activeFilters.size = e.target.value;
        } else {
            delete this.activeFilters.size;
        }
        this.applyFilters();
    });
    
    // Care Level Filter
    careFilter?.addEventListener('change', (e) => {
        if (e.target.value) {
            this.activeFilters.careLevel = e.target.value;
        } else {
            delete this.activeFilters.careLevel;
        }
        this.applyFilters();
    });
    
    // Reset Button
    resetBtn?.addEventListener('click', () => {
        this.resetAllFilters();
    });
    
    // NEU: Sortier-Buttons Event-Listener
    this.setupSortButtons();
}

setupSortButtons() {
    const sortButtons = document.querySelectorAll('.sort[data-sort]');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sortField = button.dataset.sort;
            const currentOrder = button.dataset.order || 'asc';
            
            // Richtung umschalten wenn derselbe Button geklickt wird
            if (this.currentSort.field === sortField) {
                this.currentSort.order = currentOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.currentSort.order = 'asc';
            }
            
            this.currentSort.field = sortField;
            
            // UI aktualisieren
            this.updateSortButtonsUI(sortField, this.currentSort.order);
            
            // Sortierung anwenden
            this.applySorting();
            
            // Counter aktualisieren (wird jetzt angezeigt, da Sortierung aktiv)
            setTimeout(() => {
                this.updateResultCount();
            }, 100);
        });
    });
}

updateSortButtonsUI(activeField, activeOrder) {
    const sortButtons = document.querySelectorAll('.sort[data-sort]');
    
    sortButtons.forEach(button => {
        const field = button.dataset.sort;
        const directionSpan = button.querySelector('.sort-direction');
        
        if (field === activeField) {
            // Aktiver Button
            button.classList.add('active');
            button.dataset.order = activeOrder;
            directionSpan.textContent = activeOrder === 'asc' ? '↑' : '↓';
            directionSpan.style.opacity = '1';
        } else {
            // Inaktive Buttons
            button.classList.remove('active');
            button.dataset.order = 'asc';
            directionSpan.textContent = '↑';
            directionSpan.style.opacity = '0.5';
        }
    });
}

applySorting() {
    if (!this.speciesList || !this.currentSort.field) return;
    
    console.log('Applying sort:', this.currentSort.field, this.currentSort.order);
    
    // List.js Sortierung anwenden
    this.speciesList.sort(this.currentSort.field, {
        order: this.currentSort.order
    });
    
    // Nach Sortierung Attribute und Counter aktualisieren
    setTimeout(() => {
        this.updateSpeciesCardAttributes();
        this.updateResultCount();
    }, 100);
}

applyFilters() {
    this.speciesList.filter((item) => {
        return Object.keys(this.activeFilters).every(key => {
            const filterValue = this.activeFilters[key];
            const itemValue = item.values()[key === 'careLevel' ? 'care-level' : key];
            return itemValue.includes(filterValue);
        });
    });
}

resetAllFilters() {
    // Filter zurücksetzen
    this.activeFilters = {};
    this.currentSort = { field: null, order: 'asc' };
    
    // UI zurücksetzen
    document.getElementById('subcategory-filter').value = '';
    document.getElementById('size-filter').value = '';
    document.getElementById('care-filter').value = '';
    
    // Such-Input leeren
    const searchInput = document.querySelector('.search');
    if (searchInput) searchInput.value = '';
    
    // Sortier-Buttons zurücksetzen
    document.querySelectorAll('.sort[data-sort]').forEach(button => {
        button.classList.remove('active');
        button.dataset.order = 'asc';
        const directionSpan = button.querySelector('.sort-direction');
        if (directionSpan) {
            directionSpan.textContent = '↑';
            directionSpan.style.opacity = '0.5';
        }
    });
    
    // Alle Filter entfernen
    this.speciesList.filter();
    this.speciesList.search();
    
    // Standard-Sortierung (alphabetisch)
    this.speciesList.sort('name', { order: 'asc' });
    
    // Counter verstecken (da keine Suche mehr aktiv)
    const searchResultsContainer = document.querySelector('.search-results');
    if (searchResultsContainer) {
        searchResultsContainer.style.display = 'none';
    }
}

updateResultCount() {
    const updateCounter = () => {
        const countElement = document.querySelector('.result-count');
        const searchResultsContainer = document.querySelector('.search-results');
        
        if (!countElement || !searchResultsContainer || !this.speciesList) {
            return false;
        }
        
        // Prüfen ob eine Suche oder Filterung aktiv ist
        const isSearchActive = this.isSearchOrFilterActive();
        
        if (isSearchActive) {
            // KORRIGIERT: Alle gefilterten Ergebnisse zählen, nicht nur sichtbare
            const totalCount = this.speciesList.matchingItems ? 
                              this.speciesList.matchingItems.length : 
                              this.speciesList.items.length;
            
            const currentPageCount = this.speciesList.visibleItems ? 
                                   this.speciesList.visibleItems.length : 0;
            
            // Erweiterte Anzeige mit Seiteninformation
            if (totalCount > 12) {
                countElement.innerHTML = `
                    <span class="total-count">${totalCount}</span> Tiere gefunden
                    <span class="page-info">(${currentPageCount} auf dieser Seite)</span>
                `;
            } else {
                countElement.textContent = totalCount;
            }
            
            searchResultsContainer.style.display = 'flex';
            console.log('Result count updated - Total:', totalCount, 'Current page:', currentPageCount);
        } else {
            // Keine Suche/Filter aktiv - Counter verstecken
            searchResultsContainer.style.display = 'none';
            console.log('Result count hidden - no active search/filter');
        }
        
        return true;
    };
    
    // Sofortiger Versuch
    if (!updateCounter()) {
        // Fallback nach kurzer Verzögerung
        setTimeout(() => {
            if (!updateCounter()) {
                // Zweiter Fallback
                setTimeout(updateCounter, 200);
            }
        }, 50);
    }
}

isSearchOrFilterActive() {
    // Prüfen ob Suchfeld aktiv ist
    const searchInput = document.querySelector('.search');
    const hasSearchText = searchInput && searchInput.value.trim().length > 0;
    
    // Prüfen ob Filter aktiv sind
    const hasActiveFilters = Object.keys(this.activeFilters || {}).length > 0;
    
    // Prüfen ob Sortierung aktiv ist (nicht Standard alphabetisch)
    const hasActiveSorting = this.currentSort && 
                            this.currentSort.field && 
                            !(this.currentSort.field === 'name' && this.currentSort.order === 'asc');
    
    console.log('Search active check:', {
        hasSearchText,
        hasActiveFilters,
        hasActiveSorting,
        searchValue: searchInput?.value,
        activeFilters: this.activeFilters,
        currentSort: this.currentSort
    });
    
    return hasSearchText || hasActiveFilters || hasActiveSorting;
}

generateSubcategoryOptions(categoryData) {
    const subcategories = Object.values(categoryData.subcategories || {});
    
    return subcategories.map(subcat => {
        const speciesCount = subcat.species?.length || 0;
        return `<option value="${subcat.name}">${subcat.name} (${speciesCount})</option>`;
    }).join('');
}

setupSpeciesCardEvents() {
    // Entfernen Sie alte Event-Listener um Duplikate zu vermeiden
    document.querySelectorAll('.species-card').forEach(card => {
        card.removeEventListener('click', this.handleSpeciesCardClick);
    });
    
    // Neue Event-Listener hinzufügen
    document.querySelectorAll('.species-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Verhindere Event wenn Favoriten-Button geklickt wurde
            if (e.target.matches('.favorite-btn')) return;
            
            const speciesId = parseInt(card.dataset.speciesId);
            if (speciesId) {
                this.showSpeciesDetail(speciesId);
            }
        });
    });
}

updateSpeciesCardAttributes() {
    console.log('=== DEBUG: updateSpeciesCardAttributes ===');
    
    const cards = document.querySelectorAll('#species-grid .species-card');
    const visibleItems = this.speciesList ? this.speciesList.visibleItems : [];
    
    console.log('Cards found:', cards.length);
    console.log('Visible items:', visibleItems.length);
    
    cards.forEach((card, index) => {
        if (visibleItems[index]) {
            const speciesId = visibleItems[index].values()['species-id'];
            card.setAttribute('data-species-id', speciesId);
            
            // DEBUG: Jede Karte einzeln loggen
            console.log(`Card ${index}: ID = ${speciesId}`);
        }
    });
    
    console.log('=== DEBUG END ===');
}

setupSearchListener() {
    const searchInput = document.querySelector('.search');
    
    if (searchInput) {
        // Event-Listener für Eingabe
        searchInput.addEventListener('input', () => {
            // Kurze Verzögerung für bessere Performance
            setTimeout(() => {
                this.updateResultCount();
            }, 100);
        });
        
        // Event-Listener für Leeren des Suchfelds
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' || searchInput.value === '') {
                setTimeout(() => {
                    this.updateResultCount();
                }, 100);
            }
        });
    }
}

// NEUE Methode: Event-Listener bereinigen
cleanupModalEventListeners() {
    // Alle dynamischen Buttons finden und alte Listener entfernen
    const dynamicButtons = this.speciesModal.querySelectorAll('#load-3d-model-btn, #close-3d-viewer-btn, #reload-3d-model-btn');
    
    dynamicButtons.forEach(btn => {
        // Klonen und ersetzen entfernt alle Event-Listener
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
}

// Modal öffnen (korrigiert)
showSpeciesDetail(speciesId) {
    const species = this.findSpeciesById(speciesId);
    if (!species || !this.speciesModal) {
        console.error('Tierart oder Modal nicht gefunden:', speciesId);
        return;
    }
    
    console.log('=== SHOW SPECIES MODAL ===');
    console.log('Opening modal for:', species.name);
    
    // Event-Listener bereinigen
    this.cleanupModalEventListeners();
    
    // Scroll-Position speichern
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';

    // Inhalt befüllen
    this.populateModal(species);

    // Modal anzeigen
    this.speciesModal.classList.remove('hidden');
    this.speciesModal.classList.add('show');
    this.isModalOpen = true;
    
    console.log('Modal opened successfully');
}

/**
 * Öffnet das Eigenschaften-Modal für eine bestimmte Tierart
 * @param {Object} species - Das Tierart-Objekt mit allen Daten
 */
showEigenschaftenModal(species) {
    // Debug-Ausgaben für Entwicklung
    console.log('=== EIGENSCHAFTEN MODAL ERWEITERT ===');
    console.log('Modal aufgerufen für:', species?.name);
    
    // Grundlegende Validierung der erforderlichen Elemente
    if (!this.eigenschaftenModal || !species) {
        console.error('❌ Modal oder Species-Daten fehlen!');
        return;
    }
    
    // Vorherigen Modal-Inhalt komplett leeren um Überschneidungen zu vermeiden
    if (this.eigenschaftenContent) {
        this.eigenschaftenContent.innerHTML = '';
    }
    
    // Modal-Titel mit dem Namen der Tierart setzen
    if (this.eigenschaftenModalTitle) {
        this.eigenschaftenModalTitle.textContent = `Eigenschaften: ${species.name}`;
    }
    
    // Erweiterten HTML-Inhalt für das Modal generieren
    // Diese Methode erstellt die komplette Darstellung aller Eigenschaften
    const eigenschaftenHTML = this.generateAdvancedEigenschaftenContent(species);
    this.eigenschaftenContent.innerHTML = eigenschaftenHTML;
    
    // Modal sichtbar machen mit CSS-Klassen und Style-Attributen
    this.eigenschaftenModal.style.display = 'block';           // Modal einblenden
    this.eigenschaftenModal.classList.remove('hidden');        // Hidden-Klasse entfernen
    this.eigenschaftenModal.classList.add('show');             // Show-Klasse für Animationen hinzufügen
    
    // Hintergrund-Scroll deaktivieren während Modal geöffnet ist
    // Verhindert, dass Benutzer im Hintergrund scrollen kann
    if (document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
    }

    // Event-Listener für Modal-Interaktionen einrichten
    // Behandelt Klicks, Touch-Events etc. innerhalb des Modals
    this.setupEigenschaftenModalEventHandling();
    
    // Global Modal-Status setzen für andere Funktionen
    this.isModalOpen = true;
    
    // Animationen für Property Cards mit Verzögerung starten
    // Timeout sorgt dafür, dass DOM vollständig geladen ist
    setTimeout(() => {
    if (this.eigenschaftenModal && this.eigenschaftenModal.classList.contains('show')) {
        this.triggerPropertyCardAnimations();
    }
}, 500);
    
    // Erfolgreiche Öffnung bestätigen
    console.log('✅ Erweiterte Eigenschaften-Modal geöffnet');
}

/**
 * Erweiterte Tooltip-Definitionen
 */
getPropertyTooltip(propertyKey) {
    const tooltips = {
        // Bewegung & Aktivität
        'energielevel': {
            title: 'Energielevel',
            description: 'Beschreibt die allgemeine Aktivität und den Bewegungsdrang der Rasse.',
            details: 'Ein hoher Wert bedeutet, dass das Tier täglich intensive körperliche und geistige Beschäftigung benötigt.',
            tips: 'Planen Sie mindestens 2-3 Stunden aktive Beschäftigung pro Tag ein.',
            importance: 'high'
        },
        
        'bewegungsbedarf': {
            title: 'Bewegungsbedarf',
            description: 'Zeigt an, wie viel tägliche Bewegung die Rasse benötigt.',
            details: 'Umfasst sowohl körperliche Aktivitäten wie Spaziergänge als auch Spielzeit.',
            tips: 'Regelmäßige Spaziergänge und Spielzeiten sind essentiell für das Wohlbefinden.',
            importance: 'high'
        },
        
        // Familie & Soziales
        'familienfreundlichkeit': {
            title: 'Familienfreundlichkeit',
            description: 'Bewertet, wie gut sich die Rasse für Familien mit Kindern eignet.',
            details: 'Berücksichtigt Geduld, Sanftmut und Schutzinstinkt gegenüber Familienmitgliedern.',
            tips: 'Frühe Sozialisation mit Kindern verschiedener Altersgruppen ist wichtig.',
            importance: 'critical'
        },
        
        'freundlichkeitFremde': {
            title: 'Freundlichkeit zu Fremden',
            description: 'Zeigt das typische Verhalten gegenüber unbekannten Personen.',
            details: 'Ein niedriger Wert kann auf Wachsamkeit hindeuten, ein hoher auf Offenheit.',
            tips: 'Sozialisation von klein auf hilft bei der Entwicklung angemessenen Verhaltens.',
            importance: 'medium'
        },
        
        // Training & Erziehung
        'trainierbarkeit': {
            title: 'Trainierbarkeit',
            description: 'Bewertet, wie leicht sich die Rasse erziehen und trainieren lässt.',
            details: 'Umfasst Lerngeschwindigkeit, Gehorsam und Motivation zur Zusammenarbeit.',
            tips: 'Positive Verstärkung und Konsistenz sind der Schlüssel zum Erfolg.',
            importance: 'high'
        },
        
        'anfängertauglichkeit': {
            title: 'Anfängertauglichkeit',
            description: 'Zeigt an, wie gut sich die Rasse für Erstbesitzer eignet.',
            details: 'Berücksichtigt Erziehungsaufwand, Führungsanspruch und Fehlerverzeihenheit.',
            tips: 'Anfänger sollten bei niedrigen Werten professionelle Hilfe in Anspruch nehmen.',
            importance: 'critical'
        },
        
        // Pflege & Gesundheit
        'fellpflegeaufwand': {
            title: 'Fellpflegeaufwand',
            description: 'Beschreibt den zeitlichen und finanziellen Aufwand für die Fellpflege.',
            details: 'Umfasst Bürsten, Baden, Trimmen und professionelle Pflege.',
            tips: 'Regelmäßige Pflege verhindert Verfilzungen und Hautprobleme.',
            importance: 'medium'
        },
        
        'gesundheitsrobustheit': {
            title: 'Gesundheitsrobustheit',
            description: 'Bewertet die allgemeine gesundheitliche Stabilität der Rasse.',
            details: 'Berücksichtigt bekannte Erbkrankheiten und allgemeine Anfälligkeit.',
            tips: 'Seriöse Züchter führen Gesundheitstests durch und können Nachweise vorlegen.',
            importance: 'high'
        },
        
        // Verhalten
        'wachtrieb': {
            title: 'Wach-/Schutztrieb',
            description: 'Zeigt die natürliche Neigung zum Bewachen und Beschützen.',
            details: 'Ein hoher Wert kann zu verstärktem Bellen oder territorialem Verhalten führen.',
            tips: 'Training hilft dabei, den Schutztrieb in angemessene Bahnen zu lenken.',
            importance: 'medium'
        },
        
        'belltendenz': {
            title: 'Belltendenz',
            description: 'Beschreibt die Häufigkeit und Intensität des Bellens.',
            details: 'Wichtiger Faktor für Wohnungshaltung und Nachbarschaftsverträglichkeit.',
            tips: 'Anti-Bell-Training kann bei hoher Belltendenz hilfreich sein.',
            importance: 'medium'
        },
        
        'beutetrieb': {
            title: 'Beutetrieb',
            description: 'Bewertet den natürlichen Jagdinstinkt und Hetztrieb.',
            details: 'Beeinflusst das Verhalten gegenüber Kleintieren und beim Freilauf.',
            tips: 'Starker Beutetrieb erfordert besondere Vorsicht bei Kleintieren im Haushalt.',
            importance: 'medium'
        },
        
        // Umgebung
        'apartmentTauglichkeit': {
            title: 'Apartment-Tauglichkeit',
            description: 'Zeigt, wie gut sich die Rasse für die Wohnungshaltung eignet.',
            details: 'Berücksichtigt Platzbedarf, Lautstärke und Bewegungsdrang.',
            tips: 'Auch wohnungstaugliche Rassen benötigen ausreichend Auslauf und Beschäftigung.',
            importance: 'high'
        },
        
        'temperaturresistenz': {
            title: 'Temperaturresistenz',
            description: 'Bewertet die Anpassung an verschiedene Klimabedingungen.',
            details: 'Umfasst sowohl Hitze- als auch Kältetoleranz.',
            tips: 'Extreme Temperaturen erfordern besondere Schutzmaßnahmen.',
            importance: 'low'
        }
    };
    
    return tooltips[propertyKey] || {
        title: this.formatRatingLabel(propertyKey),
        description: 'Keine detaillierte Beschreibung verfügbar.',
        importance: 'low'
    };
}

/**
 * Kategorie-Tooltips definieren
 */
getCategoryTooltip(categoryKey) {
    const categoryTooltips = {
        'suitability': {
            title: 'Eignung & Alltag',
            description: 'Diese Kategorie bewertet grundlegende Eigenschaften, die bestimmen, ob eine Rasse zu Ihrem Lebensstil passt.',
            details: 'Berücksichtigt Familiensituation, Wohnsituation und Erfahrungsgrad.',
            tips: 'Diese Faktoren sind entscheidend für eine erfolgreiche Mensch-Tier-Beziehung.',
            importance: 'critical'
        },
        
        'activity': {
            title: 'Aktivität & Auslastung',
            description: 'Hier finden Sie alle Informationen zum täglichen Bewegungs- und Beschäftigungsbedarf.',
            details: 'Umfasst körperliche Aktivität, geistige Herausforderungen und Spielbedürfnisse.',
            tips: 'Unterschätzen Sie nicht den Zeitaufwand für angemessene Beschäftigung.',
            importance: 'high'
        },
        
        'behavior': {
            title: 'Verhalten & Training',
            description: 'Diese Eigenschaften prägen das Zusammenleben und die Erziehung maßgeblich.',
            details: 'Beeinflusst sowohl das Verhalten im Alltag als auch die Trainingsherausforderungen.',
            tips: 'Realistische Einschätzung der eigenen Trainingsfähigkeiten ist wichtig.',
            importance: 'high'
        },
        
        'care': {
            title: 'Pflege & Gesundheit',
            description: 'Informationen zu Pflegeaufwand und gesundheitlichen Aspekten der Rasse.',
            details: 'Bestimmt laufende Kosten und täglichen Zeitaufwand für die Tierpflege.',
            tips: 'Berücksichtigen Sie auch langfristige Gesundheitskosten.',
            importance: 'medium'
        }
    };
    
    return categoryTooltips[categoryKey];
}

setupTooltipMobileSupport() {
    // Touch-Events für mobile Tooltips
    document.addEventListener('touchstart', (e) => {
        const tooltip = e.target.closest('.property-tooltip, .category-tooltip');
        if (tooltip) {
            e.preventDefault();
            
            // Alle anderen Tooltips schließen
            document.querySelectorAll('.tooltip-active').forEach(el => {
                el.classList.remove('tooltip-active');
            });
            
            // Aktuellen Tooltip aktivieren
            tooltip.classList.add('tooltip-active');
            
            // Nach 5 Sekunden automatisch schließen
            setTimeout(() => {
                tooltip.classList.remove('tooltip-active');
            }, 5000);
        } else {
            // Tooltips schließen wenn außerhalb getippt wird
            document.querySelectorAll('.tooltip-active').forEach(el => {
                el.classList.remove('tooltip-active');
            });
        }
    });
}

// Hilfsmethode für Modal-Zugehörigkeit
isInsideEigenschaftenModal(element) {
    const eigenschaftenModal = document.getElementById('eigenschaften-modal');
    if (!eigenschaftenModal) return false;
    
    // Prüfen ob Modal sichtbar ist UND Element darin enthalten
    const isModalVisible = eigenschaftenModal.style.display === 'block' || 
                          eigenschaftenModal.classList.contains('show');
    
    return isModalVisible && eigenschaftenModal.contains(element);
}

setupEigenschaftenModalEventHandling() {
    const modalContainer = this.eigenschaftenModal.querySelector('.eigenschaften-modal-container');
    
    if (modalContainer) {
        // Nur grundlegender Event-Handler ohne spezifische Interaktionen
        this.eigenschaftenModalClickHandler = (e) => {
            e.stopPropagation();
            console.log('Klick innerhalb Eigenschaften-Modal (keine Interaktion)');
        };
        
        modalContainer.addEventListener('click', this.eigenschaftenModalClickHandler);
    }
}

setupAdditionalEigenschaftenEvents(container) {
    // Keyboard-Navigation
    container.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
    e.preventDefault();
    const focusableElements = container.querySelectorAll('.property-card, .temperament-tag');
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
    
    if (nextIndex >= 0 && nextIndex < focusableElements.length) {
        focusableElements[nextIndex].focus();
    }
}
    });
    
    // Touch-Events für mobile Geräte
    container.addEventListener('touchstart', (e) => {
        const touchedElement = e.target.closest('.temperament-tag');
        if (touchedElement) {
            touchedElement.classList.add('touch-active');
        }
    });
    
    container.addEventListener('touchend', (e) => {
        const touchedElement = e.target.closest('.temperament-tag');
        if (touchedElement) {
            touchedElement.classList.remove('touch-active');
        }
    });
}

/**
 * Erweiterte Eigenschaften-Modal Enhancement mit finalem Tooltip-System
 * 
 * Features:
 * - Modernes Tooltip-System mit intelligenter Positionierung
 * - Vollständige Theme-Integration
 * - Mobile-optimierte Touch-Unterstützung
 * - Accessibility-Unterstützung
 * - Dynamic Content Observer
 * - Error Handling & Fallbacks
 */
enhanceEigenschaftenModal() {
    const modal = document.getElementById('eigenschaften-modal');
    if (!modal) {
        console.warn('Eigenschaften-Modal nicht gefunden');
        return false;
    }

    try {
        // 1. Tooltip-System initialisieren
        this.initializeTooltipSystem();
        
        // 2. Bestehende Tooltips bereinigen
        this.cleanupExistingTooltips();
        
        // 3. Property-Tooltips einrichten
        this.setupPropertyTooltips();
        
        // 4. Kategorie-Tooltips einrichten
        this.setupCategoryTooltips();
        
        // 5. Mobile-Unterstützung aktivieren
        this.enableMobileTooltipSupport();
        
        // 6. Accessibility-Features einrichten
        this.setupAccessibilityFeatures();
        
        // 7. Dynamic Content Observer starten
        this.startContentObserver(modal);
        
        // 8. Theme-spezifische Styles injizieren
        this.injectThemeStyles();
        
        // 9. Performance-Optimierungen
        this.optimizeTooltipPerformance();
        
        console.log('✅ Eigenschaften-Modal erfolgreich mit finalem Tooltip-System enhanced');
        return true;
        
    } catch (error) {
        console.error('❌ Fehler beim Enhancement des Eigenschaften-Modals:', error);
        this.handleEnhancementError(error);
        return false;
    }
}

/**
 * Tooltip-System initialisieren
 */
initializeTooltipSystem() {
    if (!this.tooltipSystem) {
        this.tooltipSystem = new FinalTooltipSystem();
    }
    
    // Globale Konfiguration direkt setzen (ohne setGlobalConfig)
    this.tooltipSystem.globalConfig = {
        defaultDelay: 300,
        defaultHideDelay: 150,
        maxWidth: 360,
        mobileBreakpoint: 768,
        animationDuration: 300,
        zIndexBase: 50000
    };
}

/**
 * Bestehende Tooltips bereinigen
 */
cleanupExistingTooltips() {
    // Alte Tooltip-Elemente entfernen
    const oldTooltips = document.querySelectorAll('.tooltip-content, .tooltip-popup, .property-tooltip');
    oldTooltips.forEach(tooltip => tooltip.remove());
    
    // Tooltip-System zurücksetzen
    if (this.tooltipSystem) {
        this.tooltipSystem.removeAllTooltips();
    }
    
    // Alte Style-Elemente entfernen
    const oldStyles = document.querySelectorAll('#tooltip-fix-styles, #tooltip-mobile-fixes, #modern-tooltip-styles');
    oldStyles.forEach(style => style.remove());
}

/**
 * Property-Tooltips einrichten
 */
setupPropertyTooltips() {
    const setupTooltips = () => {
        const propertyCards = document.querySelectorAll('[data-property-key]');
        
        propertyCards.forEach(card => {
            const propertyKey = card.dataset.propertyKey;
            const titleElement = card.querySelector('.property-title');
            
            if (!propertyKey || !titleElement) return;
            
            // Bereits vorhandene Tooltips überspringen
            if (titleElement.hasAttribute('data-tooltip-initialized')) return;
            
            const tooltipConfig = this.getPropertyTooltip(propertyKey);
            
            if (tooltipConfig) {
                try {
                    this.tooltipSystem.addTooltip(titleElement, {
                        ...tooltipConfig,
                        trigger: 'hover',
                        placement: 'auto',
                        delay: 200,
                        hideDelay: 100
                    });
                    
                    titleElement.setAttribute('data-tooltip-initialized', 'true');
                } catch (error) {
                    console.warn(`Tooltip für Property "${propertyKey}" konnte nicht erstellt werden:`, error);
                }
            }
        });
    };
    
    // Sofort ausführen
    setupTooltips();
    
    // Für spätere dynamische Inhalte
    this.setupTooltipsCallback = setupTooltips;
}

/**
 * Kategorie-Tooltips einrichten
 */
setupCategoryTooltips() {
    const categoryHeaders = document.querySelectorAll('.category-title');
    
    categoryHeaders.forEach(header => {
        const categoryElement = header.closest('[data-category]');
        if (!categoryElement) return;
        
        const categoryKey = categoryElement.dataset.category;
        const categoryTooltip = this.getCategoryTooltip(categoryKey);
        
        if (categoryTooltip) {
            try {
                this.tooltipSystem.addTooltip(header, {
                    ...categoryTooltip,
                    trigger: 'hover',
                    placement: 'bottom',
                    delay: 300,
                    hideDelay: 150
                });
            } catch (error) {
                console.warn(`Kategorie-Tooltip für "${categoryKey}" konnte nicht erstellt werden:`, error);
            }
        }
    });
}

/**
 * Mobile-Unterstützung aktivieren
 */
enableMobileTooltipSupport() {
    const modal = document.getElementById('eigenschaften-modal');
    if (!modal) return;
    
    // Touch-Event-Handler
    const touchHandler = (e) => {
        const trigger = e.target.closest('.tooltip-container');
        if (!trigger) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const tooltip = this.tooltipSystem.getTooltipByElement(trigger);
        if (tooltip) {
            this.tooltipSystem.toggleTooltip(tooltip);
        }
    };
    
    // Touch-Events nur auf mobilen Geräten
    if (window.innerWidth <= 768) {
        modal.addEventListener('touchstart', touchHandler, { passive: false });
        
        // Auto-Hide für mobile Tooltips
        this.tooltipSystem.onTooltipShow = (tooltip) => {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    this.tooltipSystem.hideTooltip(tooltip);
                }, 5000);
            }
        };
    }
}

/**
 * Accessibility-Features einrichten
 */
setupAccessibilityFeatures() {
    // Screen Reader Support
    const liveRegion = document.createElement('div');
    liveRegion.id = 'tooltip-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Tooltip-Inhalt an Screen Reader weiterleiten
    this.tooltipSystem.onTooltipShow = (tooltip) => {
        if (liveRegion) {
            liveRegion.textContent = `${tooltip.config.title}: ${tooltip.config.description}`;
        }
    };
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.tooltipSystem.activeTooltip) {
            this.tooltipSystem.hideTooltip(this.tooltipSystem.activeTooltip);
        }
    });
}

/**
 * Dynamic Content Observer starten
 */
startContentObserver(modal) {
    // Mutation Observer für dynamische Inhalte
    this.contentObserver = new MutationObserver((mutations) => {
        let shouldReinitialize = false;
        
        mutations.forEach(mutation => {
            // Neue Property-Cards hinzugefügt
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasPropertyCards = addedNodes.some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.querySelector('[data-property-key]') || node.hasAttribute('data-property-key'))
                );
                
                if (hasPropertyCards) {
                    shouldReinitialize = true;
                }
            }
        });
        
        if (shouldReinitialize) {
            // Debounced Reinitialization
            clearTimeout(this.reinitTimeout);
            this.reinitTimeout = setTimeout(() => {
                this.setupTooltipsCallback();
            }, 100);
        }
    });
    
    this.contentObserver.observe(modal, {
        childList: true,
        subtree: true
    });
}

/**
 * Theme-spezifische Styles injizieren
 */
injectThemeStyles() {
    if (document.getElementById('final-tooltip-theme-styles')) return;
    
    const currentTheme = document.body.className.match(/theme-([a-z-]+)/)?.[1] || 'default';
    
    const style = document.createElement('style');
    style.id = 'final-tooltip-theme-styles';
    style.textContent = `
        /* Theme-spezifische Tooltip-Anpassungen */
        .tooltip-content {
            --tooltip-bg: var(--color-surface);
            --tooltip-border: var(--color-border);
            --tooltip-text: var(--color-text);
            --tooltip-shadow: rgba(0, 0, 0, 0.1);
        }
        
        .theme-dark .tooltip-content {
            --tooltip-bg: rgba(18, 18, 20, 0.95);
            --tooltip-border: rgba(255, 255, 255, 0.1);
            --tooltip-shadow: rgba(0, 0, 0, 0.4);
        }
        
        .theme-luxury .tooltip-content {
            --tooltip-bg: rgba(42, 42, 42, 0.95);
            --tooltip-border: rgba(212, 175, 55, 0.3);
            --tooltip-shadow: rgba(0, 0, 0, 0.4);
        }
        
        /* Responsive Anpassungen */
        @media (max-width: 768px) {
            .tooltip-content {
                max-width: calc(100vw - 32px);
                max-height: 80vh;
                overflow-y: auto;
            }
        }
        
        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
            .tooltip-content,
            .tooltip-indicator {
                transition: none !important;
                animation: none !important;
            }
        }
        
        /* High Contrast Mode */
        @media (prefers-contrast: high) {
            .tooltip-content {
                border: 2px solid var(--tooltip-border);
                background: var(--tooltip-bg);
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Performance-Optimierungen
 */
optimizeTooltipPerformance() {
    // Intersection Observer für Performance
    this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const tooltip = this.tooltipSystem.getTooltipByElement(entry.target);
            if (tooltip) {
                if (entry.isIntersecting) {
                    tooltip.isVisible = true;
                } else {
                    tooltip.isVisible = false;
                    this.tooltipSystem.hideTooltip(tooltip);
                }
            }
        });
    }, {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    });
    
    // Tooltip-Elemente überwachen
    document.querySelectorAll('.tooltip-container').forEach(container => {
        this.intersectionObserver.observe(container);
    });
}

/**
 * Error-Handling für Enhancement-Probleme
 */
handleEnhancementError(error) {
    // Fallback-Tooltips ohne JavaScript
    const fallbackStyle = document.createElement('style');
    fallbackStyle.id = 'tooltip-fallback-styles';
    fallbackStyle.textContent = `
        .property-title[title]:hover::after {
            content: attr(title);
            position: absolute;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            max-width: 200px;
            white-space: normal;
        }
    `;
    document.head.appendChild(fallbackStyle);
    
    // Titel-Attribute als Fallback setzen
    document.querySelectorAll('.property-title').forEach(title => {
        const propertyKey = title.closest('[data-property-key]')?.dataset.propertyKey;
        if (propertyKey) {
            const tooltip = this.getPropertyTooltip(propertyKey);
            title.setAttribute('title', tooltip.description);
        }
    });
    
    console.warn('Fallback-Tooltips aktiviert aufgrund von:', error.message);
}

/**
 * Cleanup-Methode für Speicher-Management
 */
cleanupTooltipSystem() {
    // Observer stoppen
    if (this.contentObserver) {
        this.contentObserver.disconnect();
    }
    
    if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
    }
    
    // Tooltip-System bereinigen
    if (this.tooltipSystem) {
        this.tooltipSystem.removeAllTooltips();
    }
    
    // Timeouts bereinigen
    if (this.reinitTimeout) {
        clearTimeout(this.reinitTimeout);
    }
    
    // Live Region entfernen
    const liveRegion = document.getElementById('tooltip-live-region');
    if (liveRegion) {
        liveRegion.remove();
    }
}

triggerPropertyCardAnimations() {
    console.log('=== TRIGGER PROPERTY CARD ANIMATIONS ===');
    
    setTimeout(() => {
        const propertyCards = document.querySelectorAll('.property-card');
        console.log(`Gefundene Property Cards: ${propertyCards.length}`);
        
        propertyCards.forEach((card, index) => {
            const fillBar = card.querySelector('.property-fill');
            if (!fillBar) return;
            
            const ratingValue = parseInt(card.dataset.rating);
            const propertyKey = card.dataset.propertyKey;
            
            if (!ratingValue || !propertyKey) return;
            
            // Korrekte Breitenberechnung
            const targetWidth = (ratingValue / 5) * 100;
            
            // Kontext und Gradient bestimmen
            const context = this.getRatingContext(propertyKey);
            const gradient = this.getDynamicGradient(context, ratingValue);
            
            console.log(`Card ${index}: ${propertyKey} = ${ratingValue}/5 (${targetWidth}%)`);
            
            // KRITISCH: Alle CSS-Eigenschaften mit !important setzen
            fillBar.style.setProperty('width', `${targetWidth}%`, 'important');
            fillBar.style.setProperty('background', gradient, 'important');
            fillBar.style.setProperty('--target-width', `${targetWidth}%`);
            
            // Zusätzlich: data-width Attribut für CSS-Fallback
            fillBar.setAttribute('data-width', `${targetWidth}%`);
            
            // Animation mit Verzögerung
            setTimeout(() => {
                fillBar.style.setProperty('transition', 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)', 'important');
            }, 200 + (index * 100));
        });
        
    }, 500); // Längere Verzögerung für sicheres DOM-Loading
}

/**
 * Bestimmt den Kontext einer Eigenschaft für die korrekte Bewertung
 */
getRatingContext(propertyKey) {
    const contexts = {
        positive_high: [
            'apartmentTauglichkeit',
            'anfängertauglichkeit', 
            'trainierbarkeit', 
            'familienfreundlichkeit',
            'gesundheitsrobustheit', 
            'arbeitsfähigkeit',
            'temperaturresistenz'
        ],
        positive_low: [
            'belltendenz', 
            'fellpflegeaufwand', 
            'beutetrieb'
        ],
        balanced: [
            'energielevel',
            'bewegungsbedarf',
            'wachtrieb',
            'unabhängigkeit'
        ]
    };
    
    for (const [type, properties] of Object.entries(contexts)) {
        if (properties.includes(propertyKey)) {
            return type;
        }
    }
    
    return 'neutral';
}

getContextGradient(context) {
    const gradients = {
        // Eigenschaften wo HOCH = GUT (Grün-Verlauf)
        'positive_high': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        
        // Eigenschaften wo NIEDRIG = GUT (Rot zu Grün invertiert)
        'positive_low': 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
        
        // Ausgewogene Eigenschaften (Orange/Gelb-Verlauf)
        'balanced': 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
        
        // Neutrale Eigenschaften (Grau-Verlauf)
        'neutral': 'linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%)'
    };
    return gradients[context] || gradients['neutral'];
}

handleEigenschaftenElementClick(element, event) {
    // Event-Propagation sofort stoppen
    event.stopPropagation();
    event.preventDefault();
    
    // Property-Card spezifische Behandlung
    if (element.matches('.property-card')) {
        this.handlePropertyCardInteraction(element);
        return;
    }
    
    // Temperament-Tag Behandlung
    if (element.matches('.temperament-tag')) {
        this.handleTemperamentTagClick(element);
        return;
    }
    
    // Rating-Bar Interaktion
    if (element.matches('.property-bar, .bar-mark')) {
        this.handleRatingBarClick(element, event);
        return;
    }
    
    // Kategorie-Header Behandlung
    if (element.matches('.category-header')) {
        this.handleCategoryHeaderClick(element);
        return;
    }
    
    console.log('Allgemeine Eigenschaften-Element Interaktion:', element.className);
}

handlePropertyCardInteraction(card) {
    // Visuelles Feedback
    card.classList.add('property-card--clicked');
    setTimeout(() => {
        card.classList.remove('property-card--clicked');
    }, 200);
    
    // Optional: Zusätzliche Informationen anzeigen
    const propertyTitle = card.querySelector('.property-title')?.textContent;
    console.log('Property Card Interaktion:', propertyTitle);
}

togglePropertyCardDetails(card) {
    const isExpanded = card.classList.contains('property-card--expanded');
    
    if (isExpanded) {
        // Einklappen
        card.classList.remove('property-card--expanded');
        const details = card.querySelector('.property-details');
        if (details) {
            details.style.maxHeight = '0px';
            setTimeout(() => details.remove(), 300);
        }
    } else {
        // Ausklappen
        card.classList.add('property-card--expanded');
        this.addPropertyCardDetails(card);
    }
}

addPropertyCardDetails(card) {
    const propertyKey = card.dataset.propertyKey;
    const ratingData = card.dataset.ratingData ? JSON.parse(card.dataset.ratingData) : null;
    
    const detailsHTML = `
        <div class="property-details">
            <div class="property-details__content">
                ${this.generateDetailedRatingInfo(propertyKey, ratingData)}
                ${this.generatePropertyTips(propertyKey)}
            </div>
        </div>
    `;
    
    card.insertAdjacentHTML('beforeend', detailsHTML);
    
    // Animation
    const details = card.querySelector('.property-details');
    details.style.maxHeight = '0px';
    setTimeout(() => {
        details.style.maxHeight = details.scrollHeight + 'px';
    }, 10);
}

generateDetailedRatingInfo(propertyKey, ratingData) {
    if (!ratingData || typeof ratingData !== 'object') return '';
    
    const subRatings = Object.entries(ratingData)
        .filter(([key]) => key !== 'overall')
        .slice(0, 4);
    
    if (subRatings.length === 0) return '';
    
    return `
        <div class="detailed-rating-info">
            <h6>Detailbewertung:</h6>
            <div class="sub-ratings-detailed">
                ${subRatings.map(([key, value]) => `
                    <div class="sub-rating-detailed">
                        <span class="sub-label">${this.formatRatingLabel(key)}</span>
                        <div class="sub-bar">
                            <div class="sub-fill" style="width: ${(value/5)*100}%"></div>
                        </div>
                        <span class="sub-value">${value}/5</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

generatePropertyTips(propertyKey) {
    const tips = {
        energy: 'Ein hoher Energielevel bedeutet täglich mehrere Stunden Bewegung und geistige Beschäftigung.',
        trainability: 'Gute Trainierbarkeit erleichtert die Erziehung erheblich, besonders für Anfänger.',
        grooming: 'Hoher Pflegeaufwand bedeutet regelmäßiges Bürsten und professionelle Pflege.',
        // Weitere Tips...
    };
    
    return tips[propertyKey] ? `
        <div class="property-tip">
            <span class="tip-icon">💡</span>
            <span class="tip-text">${tips[propertyKey]}</span>
        </div>
    ` : '';
}

handleTemperamentTagClick(tag) {
    // Tag hervorheben
    tag.classList.toggle('temperament-tag--selected');
    console.log('Temperament Tag geklickt:', tag.textContent);
}

handleRatingBarClick(bar, event) {
    // Klick-Position auf der Rating-Bar berechnen
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    console.log('Rating Bar geklickt bei:', Math.round(percentage), '%');
    
    // Visueller Effekt
    const ripple = document.createElement('div');
    ripple.className = 'rating-ripple';
    ripple.style.left = clickX + 'px';
    bar.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

handleCategoryHeaderClick(header) {
    // Kategorie ein-/ausklappen
    const category = header.closest('.properties-category');
    const content = category?.querySelector('.category-content');
    
    if (content) {
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        
        // Icon rotieren
        const icon = header.querySelector('.category-icon');
        if (icon) {
            icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
}

generateAdvancedEigenschaftenContent(species) {
    console.log('=== ERWEITERTE EIGENSCHAFTEN GENERIERUNG ===');
    
    if (!species.ratings) {
        return this.generateSimpleEigenschaftenContent(species);
    }
    
    return `
        <div class="eigenschaften-modal-content">
            <!-- Hero-Bereich mit Gesamtübersicht -->
            <div class="eigenschaften-overview">
                <div class="eigenschaften-hero">
                    <h3>Eigenschaften von ${species.name}</h3>
                    <div class="overall-rating">
                        <span class="overall-score">${this.getAverageRating(species.ratings)}</span>
                        <span class="overall-label">Gesamtbewertung</span>
                    </div>
                </div>
                
                <!-- Key Metrics für schnelle Übersicht -->
                ${this.generateKeyMetrics(species.ratings)}
            </div>

            <!-- Optimierte Kategorien -->
            ${this.generateOptimizedCategories(species.ratings)}
            
            <!-- Handlungsempfehlungen -->
            ${this.generateActionableRecommendations(species.ratings, species.name)}
        </div>
    `;
}

// Erweiterte Hilfsmethode für Modal-Zugehörigkeit
isInsideEigenschaftenModal(element) {
    const eigenschaftenModal = document.getElementById('eigenschaften-modal');
    if (!eigenschaftenModal) return false;
    
    return eigenschaftenModal.contains(element);
}

// Parallax-Effekt für Hero-Section
addParallaxEffect() {
    const hero = document.querySelector('.eigenschaften-hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            hero.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * 5}deg) rotateY(${(x - 0.5) * 5}deg)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            hero.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
}

// Methode zum Prüfen und Bereinigen von "Ghost-Modals"
cleanupAllModals() {
    console.log('=== CLEANUP ALL MODALS ===');
    
    // Eigenschaften-Modal sicher schließen
    if (this.eigenschaftenModal) {
        this.eigenschaftenModal.style.display = 'none';
        this.eigenschaftenModal.classList.remove('show');
        this.eigenschaftenModal.classList.add('hidden');
        
        if (this.eigenschaftenContent) {
            this.eigenschaftenContent.innerHTML = '';
        }
    }
    
    // Haupt-Modal sicher schließen
    if (this.speciesModal) {
        this.speciesModal.classList.remove('show');
        this.speciesModal.classList.add('hidden');
    }
    
    // Body-Zustand vollständig zurücksetzen
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('modal-open');
    
    // Modal-Status zurücksetzen
    this.isModalOpen = false;
    
    console.log('Alle Modals bereinigt');
}

closeEigenschaftenModal() {
    console.log('=== CLOSE EIGENSCHAFTEN MODAL ===');
    
    if (this.eigenschaftenModal) {
        // Modal komplett ausblenden
        this.eigenschaftenModal.style.display = 'none';
        this.eigenschaftenModal.classList.remove('show');
        this.eigenschaftenModal.classList.add('hidden');
        
        // Inhalt leeren für saubere Schließung
        if (this.eigenschaftenContent) {
            this.eigenschaftenContent.innerHTML = '';
        }
        
        // Body-Overflow nur zurücksetzen wenn kein anderes Modal offen ist
        if (!this.speciesModal || !this.speciesModal.classList.contains('show')) {
            document.body.style.overflow = 'auto';
            this.isModalOpen = false;
        }
        
        console.log('Eigenschaften-Modal geschlossen');
    }
}

generateEigenschaftenContent(species) {
    console.log('=== EIGENSCHAFTEN MODAL ERWEITERT ===');
    console.log('Species:', species.name);
    console.log('Ratings verfügbar:', !!species.ratings);
    
    // Fallback für Species ohne Ratings
    if (!species.ratings) {
        return this.generateSimpleEigenschaftenContent(species);
    }
    
    return `
        <div class="eigenschaften-modal-content">
            <!-- Hero-Bereich mit Gesamtübersicht -->
            <div class="eigenschaften-overview">
                <div class="eigenschaften-hero">
                    <h3>Eigenschaften von ${species.name}</h3>
                    <div class="overall-rating">
                        <span class="overall-score">${this.getAverageRating(species.ratings)}</span>
                        <span class="overall-label">Gesamtbewertung</span>
                        <div class="overall-stars">
                            ${this.generateStarRating(this.getAverageRating(species.ratings))}
                        </div>
                    </div>
                </div>
                
                <!-- Key Metrics für schnelle Übersicht -->
                ${this.generateKeyMetrics(species.ratings)}
            </div>

            <!-- Detaillierte Kategorien mit optimierter Darstellung -->
            ${this.generateOptimizedCategories(species.ratings)}
            
            <!-- Handlungsempfehlungen basierend auf Ratings -->
            ${this.generateActionableRecommendations(species.ratings, species.name)}
            
            <!-- Zusätzliche Informationen -->
            <div class="eigenschaften-additional">
                <h4>📋 Zusätzliche Informationen</h4>
                <div class="additional-info-grid">
                    <div class="info-item">
                        <strong>Kategorie:</strong> ${species.subcategoryName || 'Unbekannt'}
                    </div>
                    <div class="info-item">
                        <strong>Lebenserwartung:</strong> ${species.lifeExpectancy || 'Unbekannt'}
                    </div>
                    <div class="info-item">
                        <strong>Schwierigkeitsgrad:</strong> ${species.careLevel || 'Nicht angegeben'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

generateSimpleEigenschaftenContent(species) {
    return `
        <div class="eigenschaften-section">
            <div class="simple-properties">
                <h3>Charakter</h3>
                <p>${species.details?.character || 'Keine Informationen verfügbar'}</p>
                
                <h3>Aktivitätslevel</h3>
                <p>${species.details?.activity || 'Keine Informationen verfügbar'}</p>
                
                <h3>Geeignet für</h3>
                <p>${species.details?.suitability || 'Keine Informationen verfügbar'}</p>
                
                <h3>Pflegeaufwand</h3>
                <p>${species.details?.grooming || 'Keine Informationen verfügbar'}</p>
                
                <h3>Lebenserwartung</h3>
                <p>${species.lifeExpectancy || 'Unbekannt'}</p>
                
                <h3>Schwierigkeitsgrad</h3>
                <p>${species.careLevel || 'Nicht angegeben'}</p>
            </div>
        </div>
    `;
}

setupEigenschaftenButton(species) {
    const eigenschaftenButton = document.querySelector('.eigenschaften-button');
    
    if (eigenschaftenButton) {
        // Alte Event-Listener entfernen
        eigenschaftenButton.removeEventListener('click', this.eigenschaftenButtonHandler);
        
        // Neuen Event-Listener hinzufügen
        this.eigenschaftenButtonHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔍 Eigenschaften-Button geklickt für:', species.name);
            this.showEigenschaftenModal(species);
        };
        
        eigenschaftenButton.addEventListener('click', this.eigenschaftenButtonHandler);
        console.log('✅ Eigenschaften-Button Event-Listener eingerichtet');
    } else {
        console.error('❌ Eigenschaften-Button nicht gefunden');
    }
}

generateTabContent(species, activeTab) {
    const tabs = {
        'uebersicht': () => `
            <div class="species-overview">
                <div class="species-description">
                    <h3>Beschreibung</h3>
                    <p>${species.description}</p>
                </div>
                
                <!-- Button für Eigenschaften-Modal -->
                <div class="eigenschaften-button-container">
                <button class="eigenschaften-button" data-species-id="${species.id}">
                    🔍 Eigenschaften im Detail
                </button>
            </div>
                
                <div class="species-basic-info">
                    <p><strong>Kategorie:</strong> ${species.subcategoryName}</p>
                    <p><strong>ID:</strong> ${species.id}</p>
                </div>
            </div>
        `,
        
        'pflege': () => `
            <div class="care-content">
                <h3>Ernährung</h3>
                <p>${species.details?.nutrition || 'Keine Informationen verfügbar'}</p>
                
                <h3>Gesundheit</h3>
                <p>${species.details?.health || 'Keine Informationen verfügbar'}</p>
            </div>
        `,
        
        'galerie': () => `
            <div class="gallery-content">
                <div class="species-images">
                    ${species.images && species.images.length > 0 ? 
                        species.images.map(img => `
                            <div class="gallery-item">
                                <img src="${img}" alt="${species.name}" 
                                     onerror="this.src='images/placeholder.jpg'">
                            </div>
                        `).join('') 
                        : '<p class="no-images">Keine Bilder verfügbar</p>'
                    }
                </div>
            </div>
        `
    };
    
    return tabs[activeTab] ? tabs[activeTab]() : tabs['uebersicht']();
}

showSpeciesModal(species) {
    if (!this.speciesModal || !species) return;

    this.saveScrollPosition();
    
    // Modal-Titel setzen
    if (this.modalTitle) {
        this.modalTitle.textContent = species.name || 'Tierdetails';
    }

    // Tab-Navigation erstellen (ohne Eigenschaften)
    const tabs = ['uebersicht', 'pflege', 'galerie'];
    const tabLabels = {
        'uebersicht': 'Übersicht',
        'pflege': 'Pflege',
        'galerie': 'Galerie'
    };

    let tabsHTML = '<div class="modal-tabs-nav">';
    tabs.forEach(tab => {
        tabsHTML += `
            <button class="modal-tab ${tab === 'uebersicht' ? 'active' : ''}" 
                    data-tab="${tab}">
                ${tabLabels[tab]}
            </button>
        `;
    });
    tabsHTML += '</div>';

    // Tabs Container setzen
    if (this.modalTabsContainer) {
        this.modalTabsContainer.innerHTML = tabsHTML;
    }

    // Aktiven Tab-Inhalt setzen
    this.showModalTab(species, 'uebersicht');

    // Tab-Event-Listener hinzufügen
    const tabButtons = this.speciesModal.querySelectorAll('.modal-tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Aktive Tab-Klasse setzen
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Tab-Inhalt anzeigen
            this.showModalTab(species, targetTab);
        });
    });

    // Modal anzeigen
    this.speciesModal.style.display = 'block';
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
}

showModalTab(species, tabId) {
    // Tab-Inhalt generieren
    const tabContent = this.generateTabContent(species, tabId);
    
    // Content Container finden oder erstellen
    let contentContainer = this.speciesModal.querySelector('.modal-tab-content');
    if (!contentContainer) {
        const modalBody = this.speciesModal.querySelector('.modal-body');
        contentContainer = document.createElement('div');
        contentContainer.className = 'modal-tab-content';
        modalBody.appendChild(contentContainer);
    }
    
    // Inhalt setzen
    contentContainer.innerHTML = tabContent;
}

saveScrollPosition() {
    this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
}
}

// Am Ende der Datei - Korrekte Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Prüfen ob alle erforderlichen Elemente existieren
    const requiredElements = ['species-modal', 'eigenschaften-modal'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('⚠️ Fehlende DOM-Elemente:', missingElements);
    }
    
    // Instanz nur erstellen wenn nicht bereits vorhanden
    if (!window.haustierWissenInstance) {
        window.haustierWissen = new HaustierWissen();
    }
});

// AnimalOfTheDay-Klasse
class AnimalOfTheDay {
    constructor(app) {
        this.app = app;
        this.app.currentAnimal = null;
        this.app.isExpanded = false;
        this.init();
    }

    async init() {
        await this.loadRandomAnimal();
        this.render();
        this.setupEventListeners();
    }

    async loadRandomAnimal() {
        try {
            // Zufällige Tierart aus den verfügbaren Daten auswählen
            const allSpecies = [];
            for (const category of Object.values(this.app.petsData.species || {})) {
                for (const subcat of Object.values(category.subcategories || {})) {
                    if (subcat.species) {
                        allSpecies.push(...subcat.species);
                    }
                }
            }
            
            if (allSpecies.length > 0) {
                const randomIndex = Math.floor(Math.random() * allSpecies.length);
                this.currentAnimal = allSpecies[randomIndex];
            }
        } catch (error) {
            console.error('Fehler beim Laden des Tier des Tages:', error);
        }
    }

    render() {
        const container = document.querySelector('.animal-of-day-section .container');
        if (!container || !this.currentAnimal) return;

        container.innerHTML = `
            <details class="animal-of-day-spoiler" id="animal-of-day-spoiler">
                <summary class="animal-of-day-spoiler__title">
                    <div class="spoiler-title-content">
                        <div class="spoiler-title-icon">🏆</div>
                        <div class="spoiler-title-text">
                            <h2>Tier des Tages</h2>
                            <p class="spoiler-subtitle">Entdecken Sie heute: ${this.currentAnimal.name}</p>
                        </div>
                    </div>
                    <div class="spoiler-arrow">▼</div>
                </summary>
                
                <div class="animal-of-day-card">
                    ${this.generateHeroSection()}
                    ${this.generateDetailsGrid()}
                    ${this.generateActionButtons()}
                </div>
            </details>
        `;
    }

    generateHeroSection() {
        return `
            <div class="aotd-hero-section">
                <div class="aotd-image-container">
                    <img src="${this.currentAnimal.image || 'images/placeholder.jpg'}" 
                         alt="${this.currentAnimal.name}" 
                         class="aotd-image"
                         onerror="this.onerror=null;this.src='images/placeholder.jpg';">
                    <div class="aotd-image-overlay">Heute</div>
                </div>
                
                <div class="aotd-content">
                    <h3 class="aotd-title">${this.currentAnimal.name}</h3>
                    <p class="aotd-description">
                        ${this.currentAnimal.description || this.currentAnimal.shortDescription || 'Eine faszinierende Tierart mit besonderen Eigenschaften.'}
                    </p>
                    
                    <div class="aotd-quick-facts">
                        ${this.generateQuickFact('🌍', 'Herkunft', this.currentAnimal.origin)}
                        ${this.generateQuickFact('📏', 'Größe', this.currentAnimal.size)}
                        ${this.generateQuickFact('❤️', 'Lebenserwartung', this.currentAnimal.lifeExpectancy)}
                        ${this.generateQuickFact('🧼', 'Pflege', this.currentAnimal.careLevel)}
                    </div>
                </div>
            </div>
        `;
    }

    generateQuickFact(icon, label, value) {
        if (!value) return '';
        return `
            <div class="aotd-fact-item">
                <span class="aotd-fact-label">${icon} ${label}</span>
                <span class="aotd-fact-value">${value}</span>
            </div>
        `;
    }

    generateDetailsGrid() {
        const details = this.currentAnimal.details || {};
        
        return `
            <div class="aotd-details-grid">
                ${this.generateDetailCard('🎭', 'Charakter & Verhalten', details.character)}
                ${this.generateDetailCard('🏠', 'Haltung & Eignung', details.suitability)}
                ${this.generateDetailCard('🏃', 'Aktivität & Bewegung', details.activity)}
                ${this.generateDetailCard('🧼', 'Pflege & Hygiene', details.grooming)}
                ${this.generateDetailCard('🏥', 'Gesundheit', details.health)}
                ${this.generateDetailCard('🍽️', 'Ernährung', details.nutrition)}
            </div>
        `;
    }

    generateDetailCard(icon, title, content) {
        if (!content) return '';
        
        return `
            <div class="aotd-detail-card">
                <div class="aotd-detail-header">
                    <div class="aotd-detail-icon">${icon}</div>
                    <h4 class="aotd-detail-title">${title}</h4>
                </div>
                <div class="aotd-detail-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
    }

    generateActionButtons() {
        return `
            <div class="aotd-actions">
                <button class="aotd-cta-button" onclick="window.haustierWissenInstance.showSpeciesDetail(${this.currentAnimal.id})">
                    Mehr erfahren
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
                    </svg>
                </button>
                
                <button class="aotd-favorite-btn ${this.app.isFavorite(this.currentAnimal.id) ? 'active' : ''}" 
                        data-species-id="${this.currentAnimal.id}">
                    ${this.app.isFavorite(this.currentAnimal.id) ? '❤️' : '🤍'}
                </button>
            </div>
        `;
    }

    setupEventListeners() {
    // ===== MODAL EVENT-LISTENER ÜBER APP-REFERENZ =====
    
    // Haupt-Modal über App-Referenz
    if (this.app.modalCloseBtn) {
        this.app.modalCloseBtn.addEventListener('click', () => {
            this.app.closeSpeciesModal();
        });
    }

    // Eigenschaften-Modal über App-Referenz
    if (this.app.eigenschaftenModalClose) {
        this.app.eigenschaftenModalClose.addEventListener('click', () => {
            this.app.closeEigenschaftenModal();
        });
    }

    // Schließen bei Klick außerhalb der Modals
    window.addEventListener('click', (event) => {
        if (this.app.speciesModal && event.target === this.app.speciesModal) {
            this.app.closeSpeciesModal();
        }
        
        if (this.app.eigenschaftenModal && event.target === this.app.eigenschaftenModal) {
            this.app.closeEigenschaftenModal();
        }
    });

    // ===== ZENTRALER EVENT-LISTENER MIT KORREKTER THIS-BINDUNG =====
    document.addEventListener('click', (e) => {
    // Eigenschaften-Modal-Schutz
    if (this.eigenschaftenModal && 
        this.eigenschaftenModal.style.display === 'block' && 
        this.eigenschaftenModal.contains(e.target)) {
        return; // Event ignorieren
    }

        // 1. EIGENSCHAFTEN-BUTTON
        if (target.matches('.eigenschaften-button')) {
            e.preventDefault();
            e.stopPropagation();
            
            const speciesId = parseInt(target.dataset.speciesId);
            if (speciesId) {
                const species = this.findSpeciesById(speciesId);
                if (species) {
                    this.showEigenschaftenModal(species);
                }
            }
            return;
        }

        // 2. FAVORITEN-SYSTEM
        const favoriteBtn = target.closest('.favorite-btn, .modern-favorite-btn, .aotd-favorite-btn');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            const speciesId = parseInt(favoriteBtn.dataset.speciesId || favoriteBtn.dataset.species, 10);
            if (speciesId) {
                this.app.toggleFavorite(speciesId);
            }
            return;
        }

        // 3. THEME-SYSTEM mit sicherer Methodenprüfung
        if (target.closest('#theme-toggle')) {
            e.stopPropagation();
            if (typeof this.toggleThemeDropdown === 'function') {
                this.toggleThemeDropdown();
            }
            return;
        }

        const themeOption = target.closest('.theme-option');
        if (themeOption) {
            const selectedTheme = themeOption.dataset.theme;
            if (typeof this.applyTheme === 'function') {
                this.applyTheme(selectedTheme);
            }
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
            return;
        }

        // 4. NAVIGATION
        const navTarget = target.closest('[data-category]');
        if (navTarget) {
            e.preventDefault();
            this.app.handleNavigation(navTarget.dataset.category, navTarget);
            return;
        }

        // 5. SPECIES-CARD
        const speciesCard = target.closest('.species-card');
        if (speciesCard) {
            e.preventDefault();
            const speciesId = parseInt(speciesCard.dataset.speciesId, 10);
            if (speciesId) {
                this.app.showSpeciesDetail(speciesId);
            }
            return;
        }

        // 6. SONSTIGE BUTTONS
        if (target.matches('#favorites-link')) {
            e.preventDefault();
            if (typeof this.showFavoritesModal === 'function') {
                this.showFavoritesModal();
            }
            return;
        }

        // 7. DROPDOWN SCHLIEßEN - SICHER MIT NULL-CHECK
        if (!target.closest('.header__theme-dropdown, #theme-toggle')) {
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
        }
    });

    // ===== KEYBOARD EVENT-LISTENER =====
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (this.eigenschaftenModal && this.eigenschaftenModal.style.display === 'block') {
                this.closeEigenschaftenModal();
            } else if (this.speciesModal && this.speciesModal.style.display === 'block') {
                this.closeSpeciesModal();
            }
            
            if (typeof this.closeThemeDropdown === 'function') {
                this.closeThemeDropdown();
            }
        }
    });

    // ===== TAB-NAVIGATION IM MODAL =====
    this.app.modalTabsContainer?.addEventListener('click', (e) => {
        const tabButton = e.target.closest('.modal-tab');
        if (!tabButton) return;

        e.preventDefault();
        const targetTabId = tabButton.dataset.tab;

        // Alle Tabs deaktivieren
        this.app.modalTabsContainer.querySelectorAll('.modal-tab').forEach(btn => btn.classList.remove('active'));
        tabButton.classList.add('active');

        // Alle Tab-Inhalte verstecken
        this.app.speciesModal.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
        const targetContent = this.app.speciesModal.querySelector(`#tab-${targetTabId}`);
        if (targetContent) targetContent.classList.add('active');
    });

    // ===== SCROLL EVENT-LISTENER =====
    const jumpToTopBtn = document.getElementById('jumpToTopBtn');
    if (jumpToTopBtn) {
        window.addEventListener('scroll', () => {
            jumpToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
    }

    // ===== FAVORITEN-MODAL EVENT-LISTENER =====
    if (this.app.favoritesModal) {
        const favCloseBtn = this.app.favoritesModal.querySelector('.modal-close');
        favCloseBtn?.addEventListener('click', () => this.app.closeFavoritesModal());
        
        this.app.favoritesModal.addEventListener('click', (e) => {
            if (e.target === this.app.favoritesModal) this.app.closeFavoritesModal();
        });
    }

    // ===== SEARCH ENHANCEMENT =====
    const searchInput = document.querySelector('.search');
    if (searchInput) {
        // Debounced search für bessere Performance
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.app.updateResultCount();
            }, 150);
        });

        // Enter-Taste Behandlung
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Optional: Fokus auf erstes Ergebnis setzen
                const firstCard = document.querySelector('.species-card');
                if (firstCard) {
                    firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // ===== WINDOW EVENT-LISTENER =====
    // Resize Handler für responsive Anpassungen
    window.addEventListener('resize', this.app.debounce(() => {
        this.app.handleWindowResize();
    }, 250));

    // Page Visibility API für Performance-Optimierung
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Seite ist versteckt - Animationen pausieren
            document.body.classList.add('page-hidden');
        } else {
            // Seite ist wieder sichtbar
            document.body.classList.remove('page-hidden');
        }
    });

    console.log('✅ Alle Event-Listener wurden erfolgreich eingerichtet');
}
}

class EnhancedBlogManager {
    constructor(app) {
        this.app = app;
        this.blogData = [];
        this.filteredBlogs = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.sortBy = 'newest';
        this.displayedCount = 9;
        this.itemsPerLoad = 9;
        this.currentPage = 1;
        this.totalPages = 1;
        this.isLoading = false;
        this.viewMode = 'grid'; // 'grid' oder 'list'
        
        this.init();
    }

    async init() {
        await this.loadBlogData();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.renderBlogGrid();
        this.updateStats();
        this.initializeAnimations();
    }

    async loadBlogData() {
        try {
            this.showLoadingState();
            const response = await fetch('blogData.json');
            if (!response.ok) throw new Error('Failed to load blog data');
            
            this.blogData = await response.json();
            this.filteredBlogs = [...this.blogData];
            this.hideLoadingState();
        } catch (error) {
            console.error('Fehler beim Laden der Blog-Daten:', error);
            this.showErrorState();
        }
    }

    setupEventListeners() {
        // Filter-Buttons
        document.querySelectorAll('.blog-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setFilter(e.currentTarget.dataset.filter);
            });
        });

        // Suche mit Debouncing
        const searchInput = document.getElementById('blog-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.setSearchTerm(e.target.value);
                }, 300);
            });
        }

        // Sortierung
        const sortSelect = document.getElementById('blog-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSortBy(e.target.value);
            });
        }

        // View Mode Toggle
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleViewMode(e.currentTarget.dataset.mode);
            });
        });

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.matches('.pagination-btn')) {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            }
        });

        // Load More Button
        const loadMoreBtn = document.getElementById('blog-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }

        // Modal Events
        this.setupModalEvents();

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBlogModal();
            }
        });
    }

    setupModalEvents() {
        const modal = document.getElementById('blog-modal');
        const closeBtn = document.getElementById('blog-modal-close');
        const backBtn = document.getElementById('blog-back-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeBlogModal());
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => this.closeBlogModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('blog-modal__overlay')) {
                    this.closeBlogModal();
                }
            });
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        
        // Update active filter button
        document.querySelectorAll('.blog-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.applyFilters();
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.applyFilters();
    }

    toggleViewMode(mode) {
        this.viewMode = mode;
        
        // Update active view mode button
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        const blogGrid = document.getElementById('blog-grid');
        blogGrid.className = `blog-grid blog-grid--${mode}`;
        
        this.renderBlogGrid();
    }

    applyFilters() {
        this.showLoadingState();
        
        setTimeout(() => {
            let filtered = [...this.blogData];

            // Category filter
            if (this.currentFilter !== 'all') {
                filtered = filtered.filter(blog => blog.category === this.currentFilter);
            }

            // Search filter
            if (this.searchTerm) {
                filtered = filtered.filter(blog => 
                    blog.title.toLowerCase().includes(this.searchTerm) ||
                    blog.excerpt.toLowerCase().includes(this.searchTerm) ||
                    blog.content.toLowerCase().includes(this.searchTerm) ||
                    (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)))
                );
            }

            // Sort
            this.sortBlogs(filtered);

            this.filteredBlogs = filtered;
            this.calculatePagination();
            this.renderBlogGrid();
            this.updatePagination();
            this.updateStats();
            this.hideLoadingState();
        }, 300);
    }

    sortBlogs(blogs) {
        blogs.sort((a, b) => {
            switch (this.sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'reading-time':
                    return parseInt(a.readingTime) - parseInt(b.readingTime);
                case 'alphabetical':
                    return a.title.localeCompare(b.title);
                case 'popular':
                    return (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });
    }

    calculatePagination() {
        this.totalPages = Math.ceil(this.filteredBlogs.length / this.itemsPerLoad);
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.renderBlogGrid();
        this.updatePagination();
        
        // Scroll to top of blog section
        document.getElementById('blog-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    renderBlogGrid() {
        const grid = document.getElementById('blog-grid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerLoad;
        const endIndex = startIndex + this.itemsPerLoad;
        const blogsToShow = this.filteredBlogs.slice(startIndex, endIndex);
        
        if (blogsToShow.length === 0) {
            this.showEmptyState();
            return;
        }

        grid.innerHTML = blogsToShow.map(blog => this.createBlogCard(blog)).join('');
        
        // Add intersection observer to new cards
        grid.querySelectorAll('.blog-card').forEach(card => {
            this.observer.observe(card);
        });
        
        // Add click listeners to new cards
        this.addCardClickListeners();
    }

    createBlogCard(blog) {
        const categoryIcons = {
            'hunde': '🐕',
            'katzen': '🐱',
            'nagetiere': '🐰',
            'reptilien': '🦎',
            'voegel': '🦜',
            'fische': '🐠',
            'haustiere': '🏠',
            'gesundheit': '🏥',
            'ernaehrung': '🍽️',
            'training': '🎯',
            'pflege': '✨'
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const formatReadingTime = (timeString) => {
            return timeString.replace('min', 'Min.');
        };

        const tags = blog.tags ? blog.tags.slice(0, 3).map(tag => 
            `<span class="blog-card__tag">${tag}</span>`
        ).join('') : '';

        return `
            <article class="blog-card blog-card--${this.viewMode}" data-blog-id="${blog.id}">
                <div class="blog-card__image-container">
                    <img src="${blog.cardImage}" alt="${blog.title}" class="blog-card__image" loading="lazy" 
                         onerror="this.onerror=null;this.src='images/placeholder-blog.jpg';">
                    <div class="blog-card__overlay">
                        <div class="blog-card__category">
                            <span class="blog-card__category-icon">${categoryIcons[blog.category] || '📚'}</span>
                            <span class="blog-card__category-text">${this.getCategoryDisplayName(blog.category)}</span>
                        </div>
                        <div class="blog-card__reading-time">
                            <svg class="blog-card__time-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                            </svg>
                            ${formatReadingTime(blog.readingTime)}
                        </div>
                        <button class="blog-card__bookmark-btn" data-blog-id="${blog.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="blog-card__content">
                    <div class="blog-card__header">
                        <h3 class="blog-card__title">${blog.title}</h3>
                        <p class="blog-card__excerpt">${blog.excerpt}</p>
                    </div>
                    
                    ${tags ? `<div class="blog-card__tags">${tags}</div>` : ''}
                    
                    <div class="blog-card__footer">
                        <div class="blog-card__author">
                            <img src="${blog.author.avatar}" alt="${blog.author.name}" 
                                 class="blog-card__avatar"
                                 onerror="this.onerror=null;this.src='images/avatar-default.jpg';">
                            <div class="blog-card__author-info">
                                <span class="blog-card__author-name">${blog.author.name}</span>
                                <span class="blog-card__date">${formatDate(blog.date)}</span>
                            </div>
                        </div>
                        
                        <div class="blog-card__actions">
                            <button class="blog-card__read-more">
                                <span>Weiterlesen</span>
                                <svg class="blog-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17l10-10M17 7H7v10"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="blog-card__progress-bar"></div>
            </article>
        `;
    }

    addCardClickListeners() {
        document.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const blogId = parseInt(card.dataset.blogId);
                this.showBlogDetail(blogId);
            });
        });

        // Bookmark buttons
        document.querySelectorAll('.blog-card__bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleBookmark(btn.dataset.blogId);
            });
        });
    }

    showBlogDetail(blogId) {
        const blog = this.blogData.find(b => b.id === blogId);
        if (!blog) return;

        const modal = document.getElementById('blog-modal');
        const content = document.getElementById('blog-modal-content');
        
        if (!modal || !content) return;

        content.innerHTML = this.createBlogArticle(blog);
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Add reading progress
        this.initReadingProgress();
        
        // Add sharing functionality
        this.initSharing(blog);
    }

    createBlogArticle(blog) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const tags = blog.tags ? blog.tags.map(tag => 
            `<span class="blog-article__tag">${tag}</span>`
        ).join('') : '';

        return `
            <article class="blog-article">
                <div class="blog-article__progress-bar" id="reading-progress"></div>
                
                <header class="blog-article__header">
                    <div class="blog-article__breadcrumb">
                        <a href="#" class="blog-article__breadcrumb-link">Blog</a>
                        <span class="blog-article__breadcrumb-separator">→</span>
                        <span class="blog-article__breadcrumb-current">${this.getCategoryDisplayName(blog.category)}</span>
                    </div>
                    
                    <div class="blog-article__category-badge">
                        ${this.getCategoryDisplayName(blog.category)}
                    </div>
                    
                    <h1 class="blog-article__title">${blog.title}</h1>
                    
                    <div class="blog-article__meta">
                        <div class="blog-article__author-section">
                            <img src="${blog.author.avatar}" alt="${blog.author.name}" 
                                 class="blog-article__avatar"
                                 onerror="this.onerror=null;this.src='images/avatar-default.jpg';">
                            <div class="blog-article__author-info">
                                <span class="blog-article__author-name">${blog.author.name}</span>
                                <div class="blog-article__meta-details">
                                    <span class="blog-article__date">${formatDate(blog.date)}</span>
                                    <span class="blog-article__separator">•</span>
                                    <span class="blog-article__reading-time">${blog.readingTime} Lesezeit</span>
                                    ${blog.views ? `<span class="blog-article__separator">•</span><span class="blog-article__views">${blog.views} Aufrufe</span>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="blog-article__actions">
                            <button class="blog-article__bookmark-btn" data-blog-id="${blog.id}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                </svg>
                            </button>
                            <button class="blog-article__share-btn" data-blog-id="${blog.id}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                    <polyline points="16,6 12,2 8,6"/>
                                    <line x1="12" y1="2" x2="12" y2="15"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    ${blog.excerpt ? `<p class="blog-article__excerpt">${blog.excerpt}</p>` : ''}
                    
                    ${tags ? `<div class="blog-article__tags">${tags}</div>` : ''}
                </header>
                
                ${blog.heroImage ? `
                    <div class="blog-article__hero-image">
                        <img src="${blog.heroImage}" alt="${blog.title}" 
                             onerror="this.style.display='none';">
                    </div>
                ` : ''}
                
                <div class="blog-article__content" id="blog-content">
                    ${blog.content}
                </div>
                
                <footer class="blog-article__footer">
                    <div class="blog-article__share-section">
                        <h3>Artikel teilen</h3>
                        <div class="blog-article__share-buttons" id="share-buttons">
                            <!-- Share buttons will be populated by JavaScript -->
                        </div>
                    </div>
                    
                    <div class="blog-article__navigation">
                        <button class="blog-article__nav-btn blog-article__nav-btn--prev" id="prev-article">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            <span>Vorheriger Artikel</span>
                        </button>
                        <button class="blog-article__nav-btn blog-article__nav-btn--next" id="next-article">
                            <span>Nächster Artikel</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </footer>
            </article>
        `;
    }

    initReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        const content = document.getElementById('blog-content');
        
        if (!progressBar || !content) return;

        const updateProgress = () => {
            const rect = content.getBoundingClientRect();
            const contentHeight = content.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrolled = Math.max(0, -rect.top);
            const totalScrollable = Math.max(0, contentHeight - windowHeight);
            const progress = Math.min(100, (scrolled / totalScrollable) * 100);
            
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    initSharing(blog) {
        const shareButtons = document.getElementById('share-buttons');
        if (!shareButtons) return;

        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(blog.title);
        const text = encodeURIComponent(blog.excerpt);

        shareButtons.innerHTML = `
            <button class="share-btn share-btn--twitter" data-url="https://twitter.com/intent/tweet?text=${title}&url=${url}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
                Twitter
            </button>
            <button class="share-btn share-btn--facebook" data-url="https://www.facebook.com/sharer/sharer.php?u=${url}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                Facebook
            </button>
            <button class="share-btn share-btn--linkedin" data-url="https://www.linkedin.com/sharing/share-offsite/?url=${url}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
            </button>
            <button class="share-btn share-btn--copy" data-url="${url}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Link kopieren
            </button>
        `;

        shareButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('.share-btn');
            if (!btn) return;

            const url = btn.dataset.url;
            if (btn.classList.contains('share-btn--copy')) {
                navigator.clipboard.writeText(decodeURIComponent(url));
                this.showToast('Link kopiert!');
            } else {
                window.open(url, '_blank', 'width=600,height=400');
            }
        });
    }

    closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    loadMorePosts() {
        if (this.isLoading || this.currentPage >= this.totalPages) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        const loadMoreBtn = document.getElementById('blog-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<span class="loading-spinner"></span> Wird geladen...';
            loadMoreBtn.disabled = true;
        }

        setTimeout(() => {
            this.renderBlogGrid();
            this.updatePagination();
            this.isLoading = false;
            
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = 'Weitere Artikel laden';
                loadMoreBtn.disabled = false;
            }
        }, 1000);
    }

    updatePagination() {
        const paginationContainer = document.getElementById('blog-pagination');
        if (!paginationContainer) return;

        let paginationHTML = '';
        const maxVisiblePages = 5;
        const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn pagination-btn--prev" data-page="${this.currentPage - 1}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    Zurück
                </button>
            `;
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === this.currentPage ? 'pagination-btn--active' : ''}" 
                        data-page="${i}">${i}</button>
            `;
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            paginationHTML += `
                <button class="pagination-btn pagination-btn--next" data-page="${this.currentPage + 1}">
                    Weiter
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHTML;
    }

    updateStats() {
        // Update total blog count
        const totalCountEl = document.getElementById('blog-total-count');
        if (totalCountEl) {
            totalCountEl.textContent = this.blogData.length;
        }

        // Update filtered count
        const filteredCountEl = document.getElementById('blog-filtered-count');
        if (filteredCountEl) {
            filteredCountEl.textContent = this.filteredBlogs.length;
        }

        // Update category counts
        const categories = ['all', 'hunde', 'katzen', 'nagetiere', 'reptilien', 'voegel', 'fische', 'haustiere'];
        
        categories.forEach(category => {
            const countEl = document.getElementById(`blog-count-${category}`);
            if (countEl) {
                const count = category === 'all' 
                    ? this.blogData.length 
                    : this.blogData.filter(blog => blog.category === category).length;
                countEl.textContent = count;
            }
        });
    }

    showLoadingState() {
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.classList.add('loading');
        }
    }

    hideLoadingState() {
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.classList.remove('loading');
        }
    }

    showErrorState() {
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="blog-error-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h3>Fehler beim Laden</h3>
                    <p>Die Blog-Artikel konnten nicht geladen werden.</p>
                    <button class="btn btn--primary" onclick="window.location.reload()">
                        Seite neu laden
                    </button>
                </div>
            `;
        }
    }

    showEmptyState() {
        const grid = document.getElementById('blog-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="blog-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <h3>Keine Artikel gefunden</h3>
                    <p>Versuchen Sie es mit anderen Suchbegriffen oder Filtern.</p>
                    <button class="btn btn--secondary" onclick="document.getElementById('blog-search').value=''; this.closest('.blog-section').querySelector('.blog-filter-btn[data-filter=\"all\"]').click();">
                        Filter zurücksetzen
                    </button>
                </div>
            `;
        }
    }

    toggleBookmark(blogId) {
        // Implementation für Bookmark-Funktionalität
        console.log('Toggle bookmark for blog:', blogId);
        this.showToast('Bookmark-Funktion wird implementiert');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    initializeAnimations() {
        // Stagger animation for initial load
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'hunde': 'Hunde',
            'katzen': 'Katzen',
            'nagetiere': 'Nagetiere',
            'reptilien': 'Reptilien',
            'voegel': 'Vögel',
            'fische': 'Fische',
            'haustiere': 'Allgemein',
            'gesundheit': 'Gesundheit',
            'ernaehrung': 'Ernährung',
            'training': 'Training',
            'pflege': 'Pflege'
        };
        return categoryNames[category] || 'Unbekannt';
    }
}

class AnimalComparison {
    constructor() {
        this.selectedAnimals = {};
        this.currentSlot = null;
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChartLibrary();
    }

    setupEventListeners() {
        // Slot-Auswahl Buttons
        document.querySelectorAll('.slot-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSlot = e.target.dataset.slot;
                this.openAnimalSelectionModal();
            });
        });

        // Modal schließen
        document.getElementById('selection-modal-close').addEventListener('click', () => {
            this.closeAnimalSelectionModal();
        });

        // Vergleich zurücksetzen
        document.getElementById('clear-comparison').addEventListener('click', () => {
            this.clearComparison();
        });

        // Export-Funktionen
        document.getElementById('export-comparison').addEventListener('click', () => {
            this.exportToPDF();
        });

        document.getElementById('export-image').addEventListener('click', () => {
            this.exportToImage();
        });

        // Suchfunktion im Modal
        document.getElementById('animal-search-input').addEventListener('input', (e) => {
            this.filterAnimals(e.target.value);
        });
    }

    loadChartLibrary() {
        // Chart.js laden
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => {
                console.log('Chart.js geladen');
            };
            document.head.appendChild(script);
        }
    }

    openAnimalSelectionModal() {
        const modal = document.getElementById('animal-selection-modal');
        const grid = document.getElementById('animal-selection-grid');
        
        // Alle verfügbaren Tiere laden
        this.populateAnimalGrid(grid);
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    closeAnimalSelectionModal() {
        const modal = document.getElementById('animal-selection-modal');
        modal.classList.add('hidden');
        modal.classList.remove('show');
    }

    populateAnimalGrid(grid) {
        grid.innerHTML = '';
        
        // Aus der bestehenden petsData alle Tiere sammeln
        const allAnimals = [];
        
        if (window.haustierWissen && window.haustierWissen.petsData) {
            Object.values(window.haustierWissen.petsData.species).forEach(category => {
                Object.values(category.subcategories || {}).forEach(subcategory => {
                    if (subcategory.species) {
                        allAnimals.push(...subcategory.species);
                    }
                });
            });
        }

        allAnimals.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'animal-selection-card';
            card.innerHTML = `
                <img src="${animal.image}" alt="${animal.name}" onerror="this.src='images/placeholder.jpg'">
                <h4>${animal.name}</h4>
            `;
            
            card.addEventListener('click', () => {
                this.selectAnimal(animal);
            });
            
            grid.appendChild(card);
        });
    }

    selectAnimal(animal) {
        this.selectedAnimals[this.currentSlot] = animal;
        this.updateSlotDisplay(this.currentSlot, animal);
        this.closeAnimalSelectionModal();
        this.updateComparison();
    }

    updateSlotDisplay(slotNumber, animal) {
        const slot = document.getElementById(`slot-${slotNumber}`);
        slot.classList.add('filled');
        
        slot.innerHTML = `
            <div class="animal-card-mini">
                <img src="${animal.image}" alt="${animal.name}" onerror="this.src='images/placeholder.jpg'">
                <h4>${animal.name}</h4>
                <button class="remove-btn" onclick="animalComparison.removeAnimal('${slotNumber}')">Entfernen</button>
            </div>
        `;
    }

    removeAnimal(slotNumber) {
        delete this.selectedAnimals[slotNumber];
        const slot = document.getElementById(`slot-${slotNumber}`);
        slot.classList.remove('filled');
        
        slot.innerHTML = `
            <div class="slot-placeholder">
                <span class="slot-icon">🐾</span>
                <span class="slot-text">Tier ${slotNumber} auswählen${slotNumber === '3' ? ' (optional)' : ''}</span>
                <button class="slot-select-btn" data-slot="${slotNumber}">Auswählen</button>
            </div>
        `;
        
        // Event-Listener wieder hinzufügen
        slot.querySelector('.slot-select-btn').addEventListener('click', (e) => {
            this.currentSlot = e.target.dataset.slot;
            this.openAnimalSelectionModal();
        });
        
        this.updateComparison();
    }

    updateComparison() {
        const animalCount = Object.keys(this.selectedAnimals).length;
        
        if (animalCount >= 2) {
            this.showRadarChart();
            this.showComparisonTable();
            this.enableExportButtons();
        } else {
            this.hideComparison();
            this.disableExportButtons();
        }
    }

    showRadarChart() {
        const container = document.getElementById('radar-chart-container');
        container.style.display = 'block';
        
        if (window.Chart) {
            this.createRadarChart();
        } else {
            // Chart.js noch nicht geladen, warten
            setTimeout(() => this.showRadarChart(), 100);
        }
    }

    createRadarChart() {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const animals = Object.values(this.selectedAnimals);
        const labels = ['Energie', 'Trainierbarkeit', 'Freundlichkeit', 'Pflege', 'Anfängerfreundlich'];
        
        const datasets = animals.map((animal, index) => {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
            const color = colors[index % colors.length];
            
            return {
                label: animal.name,
                data: [
                    animal.ratings?.energy || 3,
                    animal.ratings?.trainability || 3,
                    animal.ratings?.friendliness || 3,
                    animal.ratings?.grooming || 3,
                    animal.ratings?.beginnerFriendly || 3
                ],
                borderColor: color,
                backgroundColor: color + '33',
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color
            };
        });

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Eigenschafts-Vergleich'
                    }
                }
            }
        });
    }

    showComparisonTable() {
        const container = document.getElementById('comparison-table-container');
        const table = document.getElementById('comparison-table');
        const header = document.getElementById('comparison-header');
        const body = document.getElementById('comparison-body');
        
        container.style.display = 'block';
        
        // Header erstellen
        header.innerHTML = '<th>Eigenschaft</th>';
        Object.values(this.selectedAnimals).forEach(animal => {
            header.innerHTML += `<th>${animal.name}</th>`;
        });
        
        // Body erstellen
        const properties = [
            { key: 'origin', label: 'Herkunft' },
            { key: 'size', label: 'Größe' },
            { key: 'weight', label: 'Gewicht' },
            { key: 'lifeExpectancy', label: 'Lebenserwartung' },
            { key: 'careLevel', label: 'Pflegeaufwand' },
            { key: 'temperament', label: 'Temperament' }
        ];
        
        body.innerHTML = '';
        
        properties.forEach(prop => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><strong>${prop.label}</strong></td>`;
            
            Object.values(this.selectedAnimals).forEach(animal => {
                let value = animal[prop.key] || 'Nicht verfügbar';
                
                if (prop.key === 'temperament' && Array.isArray(value)) {
                    value = value.join(', ');
                }
                
                row.innerHTML += `<td>${value}</td>`;
            });
            
            body.appendChild(row);
        });
    }

    hideComparison() {
        document.getElementById('radar-chart-container').style.display = 'none';
        document.getElementById('comparison-table-container').style.display = 'none';
    }

    enableExportButtons() {
        document.getElementById('export-comparison').disabled = false;
        document.getElementById('export-image').disabled = false;
    }

    disableExportButtons() {
        document.getElementById('export-comparison').disabled = true;
        document.getElementById('export-image').disabled = true;
    }

    clearComparison() {
        this.selectedAnimals = {};
        
        for (let i = 1; i <= 3; i++) {
            this.removeAnimal(i.toString());
        }
        
        this.hideComparison();
        this.disableExportButtons();
    }

    async exportToPDF() {
        // jsPDF laden falls nicht vorhanden
        if (!window.jsPDF) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Titel
        pdf.setFontSize(20);
        pdf.text('Tier-Vergleich', 20, 30);
        
        // Chart als Bild hinzufügen
        const canvas = document.getElementById('radar-chart');
        const chartImage = canvas.toDataURL('image/png');
        pdf.addImage(chartImage, 'PNG', 20, 50, 170, 100);
        
        // Tabelle hinzufügen
        let yPosition = 170;
        pdf.setFontSize(12);
        
        const animals = Object.values(this.selectedAnimals);
        const properties = [
            { key: 'origin', label: 'Herkunft' },
            { key: 'size', label: 'Größe' },
            { key: 'weight', label: 'Gewicht' },
            { key: 'lifeExpectancy', label: 'Lebenserwartung' },
            { key: 'careLevel', label: 'Pflegeaufwand' }
        ];
        
        properties.forEach(prop => {
            pdf.text(prop.label + ':', 20, yPosition);
            let xPosition = 60;
            
            animals.forEach(animal => {
                let value = animal[prop.key] || 'N/A';
                if (prop.key === 'temperament' && Array.isArray(value)) {
                    value = value.join(', ');
                }
                pdf.text(value, xPosition, yPosition);
                xPosition += 60;
            });
            
            yPosition += 10;
        });
        
        pdf.save('tier-vergleich.pdf');
    }

    async exportToImage() {
        // html2canvas laden falls nicht vorhanden
        if (!window.html2canvas) {
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }
        
        const comparisonSection = document.getElementById('comparison-section');
        
        html2canvas(comparisonSection, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'tier-vergleich.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    filterAnimals(searchTerm) {
        const cards = document.querySelectorAll('.animal-selection-card');
        const term = searchTerm.toLowerCase();
        
        cards.forEach(card => {
            const name = card.querySelector('h4').textContent.toLowerCase();
            if (name.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialisierung
let animalComparison;

document.addEventListener('DOMContentLoaded', () => {
    animalComparison = new AnimalComparison();
});

// Animations-Controller für die Species Cards
class SpeciesCardAnimator {
    static initializeCard(cardElement) {
        // Intersection Observer für Scroll-Animationen
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // Rating-Balken animieren
                    const ratingFills = entry.target.querySelectorAll('.modern-rating__fill, .modern-rating__glow');
                    ratingFills.forEach((fill, index) => {
                        setTimeout(() => {
                            fill.style.transform = 'scaleX(1)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(cardElement);
        
        // Hover-Effekte für bessere Interaktivität
        cardElement.addEventListener('mouseenter', () => {
            cardElement.style.zIndex = '10';
        });
        
        cardElement.addEventListener('mouseleave', () => {
            cardElement.style.zIndex = '1';
        });
    }
    
    static initializeAllCards() {
        document.querySelectorAll('.species-card').forEach(card => {
            this.initializeCard(card);
        });
    }
}

/**
 * Finales Tooltip-System mit intelligenter Positionierung
 */
/**
 * Vollständige FinalTooltipSystem-Klasse mit allen fehlenden Methoden
 */
class FinalTooltipSystem {
    constructor() {
        this.tooltips = new Map();
        this.activeTooltip = null;
        this.isMobile = this.detectMobile();
        this.globalConfig = {
            defaultDelay: 200,
            defaultHideDelay: 100,
            maxWidth: 360,
            mobileBreakpoint: 768,
            animationDuration: 300,
            zIndexBase: 50000
        };
        this.callbacks = {};
        this.init();
    }

    /**
     * Globale Konfiguration setzen
     */
    setGlobalConfig(config) {
        this.globalConfig = { ...this.globalConfig, ...config };
        return this;
    }

    /**
     * Globale Konfiguration abrufen
     */
    getGlobalConfig() {
        return this.globalConfig;
    }

    /**
     * Tooltip anhand Element finden
     */
    getTooltipByElement(element) {
        for (const [id, tooltip] of this.tooltips) {
            if (tooltip.element === element || tooltip.element.contains(element)) {
                return tooltip;
            }
        }
        return null;
    }

    /**
     * Callback-System für Events
     */
    onTooltipShow(callback) {
        this.callbacks.show = callback;
    }

    onTooltipHide(callback) {
        this.callbacks.hide = callback;
    }

    /**
     * Tooltip anzeigen (erweitert)
     */
    showTooltip(tooltip) {
        // Anderen Tooltip schließen
        if (this.activeTooltip && this.activeTooltip !== tooltip) {
            this.hideTooltip(this.activeTooltip);
        }

        // Position berechnen
        this.positionTooltip(tooltip);

        // Tooltip anzeigen
        tooltip.contentElement.classList.add('show');
        tooltip.isVisible = true;
        this.activeTooltip = tooltip;

        // Callback ausführen
        if (this.callbacks.show) {
            this.callbacks.show(tooltip);
        }

        // Auto-Hide für mobile Geräte
        if (this.isMobile) {
            setTimeout(() => {
                this.hideTooltip(tooltip);
            }, 5000);
        }
    }

    /**
     * Tooltip verstecken (erweitert)
     */
    hideTooltip(tooltip) {
        if (!tooltip.isVisible) return;

        tooltip.contentElement.classList.remove('show');
        tooltip.isVisible = false;
        
        if (this.activeTooltip === tooltip) {
            this.activeTooltip = null;
        }

        this.clearTimeouts(tooltip);

        // Callback ausführen
        if (this.callbacks.hide) {
            this.callbacks.hide(tooltip);
        }
    }

    /**
     * Alle restlichen Methoden aus der ursprünglichen Klasse...
     */
    init() {
        this.setupGlobalEventListeners();
        this.setupResponsiveHandling();
        this.injectRequiredStyles();
    }

    createTooltip(element, options) {
        const config = {
            title: options.title || '',
            description: options.description || '',
            details: options.details || '',
            tips: options.tips || '',
            importance: options.importance || 'medium',
            placement: options.placement || 'auto',
            delay: options.delay || this.globalConfig.defaultDelay,
            hideDelay: options.hideDelay || this.globalConfig.defaultHideDelay,
            trigger: options.trigger || 'hover',
            ...options
        };

        const tooltip = {
            id: this.generateUniqueId(),
            element: element,
            config: config,
            contentElement: null,
            isVisible: false,
            showTimeout: null,
            hideTimeout: null
        };

        this.tooltips.set(tooltip.id, tooltip);
        this.enhanceElement(element, tooltip);
        
        return tooltip.id;
    }

    // ... weitere Methoden wie in der ursprünglichen Implementierung
    enhanceElement(element, tooltip) {
        // Wrapper-Container erstellen
        const wrapper = document.createElement('div');
        wrapper.className = 'tooltip-container';
        
        // Element wrappen
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);

        // Tooltip-Content erstellen
        tooltip.contentElement = this.createTooltipContent(tooltip);
        wrapper.appendChild(tooltip.contentElement);

        // Indikator hinzufügen
        this.addIndicator(element, tooltip);

        // Event-Listener binden
        this.bindEventListeners(wrapper, tooltip);

        // Für Accessibility
        element.setAttribute('aria-describedby', tooltip.id);
        element.setAttribute('tabindex', '0');
    }

    createTooltipContent(tooltip) {
        const content = document.createElement('div');
        content.className = 'tooltip-content';
        content.id = tooltip.id;
        content.innerHTML = this.generateTooltipHTML(tooltip.config);
        
        return content;
    }

    generateTooltipHTML(config) {
        return `
            <div class="tooltip-header">
                <h4 class="tooltip-title">${config.title}</h4>
                <span class="tooltip-importance tooltip-importance--${config.importance}">
                    ${this.getImportanceLabel(config.importance)}
                </span>
            </div>
            
            <div class="tooltip-body">
                <p class="tooltip-description">${config.description}</p>
                
                ${config.details ? `
                    <div class="tooltip-details">${config.details}</div>
                ` : ''}
                
                ${config.tips ? `
                    <div class="tooltip-tip">
                        <div class="tooltip-tip-icon">💡</div>
                        <div class="tooltip-tip-content">
                            <div class="tooltip-tip-label">Profi-Tipp</div>
                            <p class="tooltip-tip-text">${config.tips}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="tooltip-arrow"></div>
        `;
    }

    addIndicator(element, tooltip) {
        const indicator = document.createElement('span');
        indicator.className = 'tooltip-indicator';
        indicator.setAttribute('aria-label', 'Weitere Informationen');
        
        // Indikator neben dem Element positionieren
        element.parentNode.insertBefore(indicator, element.nextSibling);
        
        // Indikator-Referenz speichern
        tooltip.indicator = indicator;
    }

    bindEventListeners(wrapper, tooltip) {
        const trigger = tooltip.config.trigger;
        
        if (trigger === 'hover' && !this.isMobile) {
            this.setupHoverEvents(wrapper, tooltip);
        } else if (trigger === 'click' || this.isMobile) {
            this.setupClickEvents(wrapper, tooltip);
        } else if (trigger === 'focus') {
            this.setupFocusEvents(wrapper, tooltip);
        }

        // Keyboard-Support
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTooltip(tooltip);
            } else if (e.key === 'Escape') {
                this.hideTooltip(tooltip);
            }
        });
    }

    setupHoverEvents(wrapper, tooltip) {
        const showTooltip = () => {
            this.clearTimeouts(tooltip);
            tooltip.showTimeout = setTimeout(() => {
                this.showTooltip(tooltip);
            }, tooltip.config.delay);
        };

        const hideTooltip = () => {
            this.clearTimeouts(tooltip);
            tooltip.hideTimeout = setTimeout(() => {
                this.hideTooltip(tooltip);
            }, tooltip.config.hideDelay);
        };

        wrapper.addEventListener('mouseenter', showTooltip);
        wrapper.addEventListener('mouseleave', hideTooltip);
        
        // Tooltip-Content sollte auch Hover-Events unterstützen
        tooltip.contentElement.addEventListener('mouseenter', () => {
            this.clearTimeouts(tooltip);
        });
        
        tooltip.contentElement.addEventListener('mouseleave', hideTooltip);
    }

    setupClickEvents(wrapper, tooltip) {
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTooltip(tooltip);
        });
    }

    setupFocusEvents(wrapper, tooltip) {
        wrapper.addEventListener('focusin', () => {
            this.showTooltip(tooltip);
        });
        
        wrapper.addEventListener('focusout', () => {
            this.hideTooltip(tooltip);
        });
    }

    toggleTooltip(tooltip) {
        if (tooltip.isVisible) {
            this.hideTooltip(tooltip);
        } else {
            this.showTooltip(tooltip);
        }
    }

    positionTooltip(tooltip) {
        const element = tooltip.element;
        const content = tooltip.contentElement;
        const placement = tooltip.config.placement;

        if (this.isMobile) {
            // Mobile: Zentrale Positionierung
            content.style.position = 'fixed';
            content.style.top = '50%';
            content.style.left = '50%';
            content.style.transform = 'translate(-50%, -50%)';
            content.setAttribute('data-placement', 'center');
            return;
        }

        // Desktop-Positionierung
        const elementRect = element.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        
        let finalPlacement = placement;
        if (placement === 'auto') {
            finalPlacement = 'top'; // Vereinfachte Auto-Positionierung
        }

        // Position berechnen
        let top, left;
        const spacing = 12;

        switch (finalPlacement) {
            case 'top':
                top = elementRect.top - contentRect.height - spacing;
                left = elementRect.left + (elementRect.width / 2) - (contentRect.width / 2);
                break;
            case 'bottom':
                top = elementRect.bottom + spacing;
                left = elementRect.left + (elementRect.width / 2) - (contentRect.width / 2);
                break;
            case 'left':
                top = elementRect.top + (elementRect.height / 2) - (contentRect.height / 2);
                left = elementRect.left - contentRect.width - spacing;
                break;
            case 'right':
                top = elementRect.top + (elementRect.height / 2) - (contentRect.height / 2);
                left = elementRect.right + spacing;
                break;
        }

        content.style.position = 'absolute';
        content.style.top = top + window.scrollY + 'px';
        content.style.left = left + window.scrollX + 'px';
        content.setAttribute('data-placement', finalPlacement);
    }

    clearTimeouts(tooltip) {
        if (tooltip.showTimeout) {
            clearTimeout(tooltip.showTimeout);
            tooltip.showTimeout = null;
        }
        if (tooltip.hideTimeout) {
            clearTimeout(tooltip.hideTimeout);
            tooltip.hideTimeout = null;
        }
    }

    detectMobile() {
        return window.innerWidth <= 768 || 
               /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    getImportanceLabel(importance) {
        const labels = {
            low: 'Info',
            medium: 'Wichtig',
            high: 'Sehr wichtig',
            critical: 'Kritisch'
        };
        return labels[importance] || 'Info';
    }

    setupGlobalEventListeners() {
        // Tooltip schließen bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (this.activeTooltip && 
                !e.target.closest('.tooltip-container') && 
                !e.target.closest('.tooltip-content')) {
                this.hideTooltip(this.activeTooltip);
            }
        });

        // ESC-Taste
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeTooltip) {
                this.hideTooltip(this.activeTooltip);
            }
        });

        // Scroll-Events
        window.addEventListener('scroll', () => {
            if (this.activeTooltip && !this.isMobile) {
                this.positionTooltip(this.activeTooltip);
            }
        });
    }

    setupResponsiveHandling() {
        window.addEventListener('resize', () => {
            this.isMobile = this.detectMobile();
            
            if (this.activeTooltip) {
                this.positionTooltip(this.activeTooltip);
            }
        });
    }

    injectRequiredStyles() {
        if (document.getElementById('final-tooltip-styles')) return;

        const style = document.createElement('style');
        style.id = 'final-tooltip-styles';
        style.textContent = `
            .tooltip-container {
                position: relative;
                display: inline-block;
            }
            
            .tooltip-trigger:focus {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    generateUniqueId() {
        return 'tooltip-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    addTooltip(element, config) {
        return this.createTooltip(element, config);
    }

    removeTooltip(tooltipId) {
        const tooltip = this.tooltips.get(tooltipId);
        if (tooltip) {
            if (tooltip.isVisible) {
                this.hideTooltip(tooltip);
            }
            
            // DOM-Elemente entfernen
            if (tooltip.contentElement) {
                tooltip.contentElement.remove();
            }
            if (tooltip.indicator) {
                tooltip.indicator.remove();
            }
            
            this.tooltips.delete(tooltipId);
        }
    }

    removeAllTooltips() {
        this.tooltips.forEach(tooltip => {
            this.removeTooltip(tooltip.id);
        });
        this.tooltips.clear();
    }
}

// Nach dem Laden der Karten aufrufen
document.addEventListener('DOMContentLoaded', initializeRatingBars);

// Integration in die Hauptanwendung
document.addEventListener('DOMContentLoaded', () => {
    SpeciesCardAnimator.initializeAllCards();
});

// Grid-Layout automatisch an Bildschirmgröße anpassen
function adjustGridLayout() {
  const grid = document.querySelector('.species__grid');
  const containerWidth = grid.offsetWidth;
  
  if (containerWidth >= 1200) {
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  } else if (containerWidth >= 900) {
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  } else if (containerWidth >= 600) {
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    grid.style.gridTemplateColumns = '1fr';
  }
}

// Bei Fenstergrößenänderung neu berechnen
window.addEventListener('resize', adjustGridLayout);
window.addEventListener('load', adjustGridLayout);
