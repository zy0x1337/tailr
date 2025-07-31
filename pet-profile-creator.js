/**
 * PetProfileCreator - Vollständige Implementierung für mehrstufiges Haustier-Profil Formular
 * Optimiert für die tailr.wiki HTML-Struktur mit Accessibility und vollständiger Funktionalität
 */
class PetProfileCreator {
    constructor(formId, app) {
        this.app = app;
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.error(`Form with ID "${formId}" not found`);
            return;
        }

        // Core Form Elements
        this.steps = Array.from(this.form.querySelectorAll('.form-step'));
        this.nextBtn = this.form.querySelector('#next-btn');
        this.prevBtn = this.form.querySelector('#prev-btn');
        this.submitBtn = this.form.querySelector('#submit-btn');
        this.speciesSelect = this.form.querySelector('#pet-species');

        // Progress Elements
        this.progressFill = document.getElementById('progress-fill');
        this.progressSteps = document.querySelectorAll('.progress-steps .step');
        this.progressBar = document.querySelector('[role="progressbar"]');

        // Image Upload Elements
        this.dropZone = this.form.querySelector('#image-drop-zone');
        this.imageInput = this.form.querySelector('#profile-image');
        this.previewContainer = this.form.querySelector('#image-preview-container');
        this.imagePreview = this.form.querySelector('#image-preview');
        this.removeImageBtn = this.form.querySelector('#image-remove-btn');

        // Dynamic Content Elements
        this.summaryContainer = this.form.querySelector('#profile-summary');
        this.statusContainer = this.form.querySelector('#profile-form-status');

        // State Management
        this.currentStep = 0;
        this.totalSteps = this.steps.length;
        this.editMode = false;
        this.profileId = null;
        this.formData = new Map();

        // Validation State
        this.validationErrors = new Map();
        this.isSubmitting = false;

        // Field Groups for Summary
        this.fieldGroups = {
            'Grunddaten': ['petName', 'species', 'breed', 'gender', 'birthDate', 'microchip'],
            'Aussehen': ['size', 'weight', 'furColor', 'birdPlumage', 'birdBeakType', 'fishScaleColor', 'fishFinType', 'reptileSkinPattern', 'reptileSpeciesType'],
            'Verhalten': ['temperament', 'activityLevel', 'socialBehavior', 'specialTraits'],
            'Gesundheit & Pflege': ['healthStatus', 'allergies', 'careNotes', 'catOutdoor', 'dogTrainingLevel', 'fishTankSize', 'fishWaterType'],
            'Besitzer': ['ownerName', 'ownerEmail']
        };

        // Label Mapping for Display
        this.labelMap = {
            petName: 'Name des Haustiers',
            species: 'Tierart',
            breed: 'Rasse',
            gender: 'Geschlecht',
            birthDate: 'Geburtsdatum',
            microchip: 'Mikrochip-Nummer',
            size: 'Körpergröße',
            weight: 'Gewicht (kg)',
            furColor: 'Fell-/Feder-/Hautfarbe',
            birdPlumage: 'Gefiederart',
            birdBeakType: 'Schnabeltyp',
            fishScaleColor: 'Schuppenfarbe',
            fishFinType: 'Flossentyp',
            reptileSkinPattern: 'Hautmuster/Farbe',
            reptileSpeciesType: 'Art des Reptils',
            temperament: 'Temperament',
            activityLevel: 'Aktivitätslevel',
            socialBehavior: 'Sozialverhalten',
            specialTraits: 'Besondere Eigenschaften',
            healthStatus: 'Gesundheitszustand',
            allergies: 'Allergien/Unverträglichkeiten',
            careNotes: 'Pflegehinweise',
            catOutdoor: 'Freigang (Katze)',
            dogTrainingLevel: 'Trainingslevel (Hund)',
            fishTankSize: 'Aquariumgröße (Liter)',
            fishWaterType: 'Wasserart',
            ownerName: 'Besitzer Name',
            ownerEmail: 'E-Mail-Adresse'
        };

        this.init();
    }

    /**
     * Initialisiert alle Event Listener und setzt den Anfangszustand
     */
    init() {
        console.log('🚀 Initializing PetProfileCreator...');
        
        // Navigation Event Listeners
        this.nextBtn?.addEventListener('click', () => this.handleNext());
        this.prevBtn?.addEventListener('click', () => this.handlePrevious());
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Species Change Handler
        this.speciesSelect?.addEventListener('change', () => this.updateSpeciesSpecificFields());

        // Step Navigation (Progress Steps)
        this.progressSteps.forEach((step, index) => {
            step.addEventListener('click', () => this.jumpToStep(index));
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.jumpToStep(index);
                }
            });
        });

        // Image Upload System
        this.initImageUpload();

        // Form Field Validation
        this.initFormValidation();

        // Auto-save (optional)
        this.initAutoSave();

        // Register with app
        if (this.app) {
            this.app.petProfileCreator = this;
        }

        // Initialize form state
        this.resetForm();
        
        console.log('✅ PetProfileCreator initialized successfully');
    }

    /**
     * Initialisiert das Bild-Upload-System mit Drag & Drop
     */
    initImageUpload() {
        if (!this.dropZone || !this.imageInput) return;

        // Click to select file
        this.dropZone.addEventListener('click', () => {
            this.imageInput.click();
        });

        // File input change
        this.imageInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // Drag & Drop Events
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('dragover');
        });

        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // Remove image button
        this.removeImageBtn?.addEventListener('click', () => {
            this.resetImagePreview();
        });
    }

    /**
     * Verarbeitet die Dateiauswahl für Profilbilder
     */
    handleFileSelect(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Bitte wählen Sie eine gültige Bilddatei aus.');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Die Datei ist zu groß. Maximale Größe: 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.imagePreview) {
                this.imagePreview.src = e.target.result;
                this.imagePreview.alt = `Profilbild von ${this.getFieldValue('petName') || 'Haustier'}`;
            }
            
            if (this.previewContainer) {
                this.previewContainer.style.display = 'block';
            }
            
            if (this.dropZone) {
                this.dropZone.style.display = 'none';
            }
        };

        reader.onerror = () => {
            this.showError('Fehler beim Laden des Bildes.');
        };

        reader.readAsDataURL(file);
    }

    /**
     * Setzt die Bildvorschau zurück
     */
    resetImagePreview() {
        if (this.imageInput) {
            this.imageInput.value = '';
        }
        
        if (this.imagePreview) {
            this.imagePreview.src = '#';
            this.imagePreview.alt = '';
        }
        
        if (this.previewContainer) {
            this.previewContainer.style.display = 'none';
        }
        
        if (this.dropZone) {
            this.dropZone.style.display = 'block';
        }
    }

    /**
     * Initialisiert die Formularvalidierung
     */
    initFormValidation() {
        // Real-time validation for required fields
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Email validation
        const emailField = this.form.querySelector('#owner-email');
        if (emailField) {
            emailField.addEventListener('blur', () => this.validateEmail(emailField));
        }

        // Microchip validation
        const microchipField = this.form.querySelector('#pet-microchip');
        if (microchipField) {
            microchipField.addEventListener('input', () => this.validateMicrochip(microchipField));
        }
    }

    /**
     * Initialisiert Auto-Save Funktionalität
     */
    initAutoSave() {
        let autoSaveTimeout;
        
        this.form.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                this.saveFormDataToStorage();
            }, 2000); // Save after 2 seconds of inactivity
        });
    }

    /**
     * Navigation: Nächster Schritt
     */
    handleNext() {
        if (this.isSubmitting) return;
        
        if (!this.validateCurrentStep()) {
            this.showError('Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie fortfahren.');
            return;
        }

        this.changeStep(1);
    }

    /**
     * Navigation: Vorheriger Schritt
     */
    handlePrevious() {
        if (this.isSubmitting) return;
        this.changeStep(-1);
    }

    /**
     * Navigation: Direkt zu einem Schritt springen
     */
    jumpToStep(targetStep) {
        if (this.isSubmitting) return;
        
        // Validate all steps up to target step
        for (let i = this.currentStep; i < targetStep; i++) {
            if (!this.validateStep(i)) {
                this.showError(`Bitte füllen Sie Schritt ${i + 1} vollständig aus.`);
                return;
            }
        }

        const direction = targetStep - this.currentStep;
        this.currentStep = targetStep;
        this.changeStep(0); // Update UI without changing step
    }

    /**
     * Wechselt zu einem anderen Formularschritt
     */
    changeStep(direction) {
        if (direction !== 0) {
            this.currentStep += direction;
        }

        // Boundaries check
        if (this.currentStep < 0) this.currentStep = 0;
        if (this.currentStep >= this.totalSteps) this.currentStep = this.totalSteps - 1;

        // Generate summary for final step
        if (this.currentStep === this.totalSteps - 1) {
            this.generateSummary();
        }

        // Update step visibility
        this.updateStepVisibility();
        
        // Update UI components
        this.updateNavigationButtons();
        this.updateProgressIndicator();
        this.updateAccessibilityStates();

        // Focus management
        this.manageFocus();

        // Clear any existing errors when moving between steps
        this.clearErrors();
    }

    /**
     * Aktualisiert die Sichtbarkeit der Formularschritte
     */
    updateStepVisibility() {
        this.steps.forEach((step, index) => {
            const isActive = index === this.currentStep;
            step.classList.toggle('active', isActive);
            step.setAttribute('aria-hidden', !isActive);
            
            // Update tabindex for form elements
            const formElements = step.querySelectorAll('input, select, textarea, button');
            formElements.forEach(element => {
                element.tabIndex = isActive ? 0 : -1;
            });
        });
    }

    /**
     * Aktualisiert die Navigations-Buttons
     */
    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.display = this.currentStep > 0 ? 'inline-flex' : 'none';
        }

        if (this.nextBtn) {
            this.nextBtn.style.display = this.currentStep < this.totalSteps - 1 ? 'inline-flex' : 'none';
        }

        if (this.submitBtn) {
            this.submitBtn.style.display = this.currentStep === this.totalSteps - 1 ? 'inline-flex' : 'none';
            this.submitBtn.textContent = this.editMode ? 'Änderungen speichern' : 'Profil erstellen';
        }
    }

    /**
     * Aktualisiert die Fortschrittsanzeige
     */
    updateProgressIndicator() {
        // Update progress bar
        if (this.progressFill) {
            const progressPercent = (this.currentStep / (this.totalSteps - 1)) * 100;
            this.progressFill.style.width = `${progressPercent}%`;
        }

        // Update progress bar ARIA attributes
        if (this.progressBar) {
            this.progressBar.setAttribute('aria-valuenow', Math.round((this.currentStep / (this.totalSteps - 1)) * 100));
            this.progressBar.setAttribute('aria-label', `Fortschritt: Schritt ${this.currentStep + 1} von ${this.totalSteps}`);
        }

        // Update step indicators
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            step.setAttribute('aria-selected', 'false');
            step.setAttribute('tabindex', '-1');

            if (index < this.currentStep) {
                step.classList.add('completed');
            } else if (index === this.currentStep) {
                step.classList.add('active');
                step.setAttribute('aria-selected', 'true');
                step.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Aktualisiert Accessibility-Zustände
     */
    updateAccessibilityStates() {
        // Update step panel accessibility
        this.steps.forEach((step, index) => {
            const tabPanel = step;
            const isActive = index === this.currentStep;
            
            tabPanel.setAttribute('aria-hidden', !isActive);
            if (isActive) {
                // Set focus to first focusable element in active step
                const firstFocusable = tabPanel.querySelector('input, select, textarea, button:not([disabled])');
                if (firstFocusable && document.activeElement === document.body) {
                    setTimeout(() => firstFocusable.focus(), 100);
                }
            }
        });
    }

    /**
     * Verwaltet den Fokus für Accessibility
     */
    manageFocus() {
        const currentStepElement = this.steps[this.currentStep];
        if (currentStepElement) {
            const stepTitle = currentStepElement.querySelector('.step-title');
            if (stepTitle) {
                stepTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    /**
     * Aktualisiert tierart-spezifische Felder
     */
    updateSpeciesSpecificFields() {
        const selectedSpecies = this.speciesSelect?.value;
        const allSpecificFields = this.form.querySelectorAll('.species-specific-fields');

        // Hide all species-specific fields first
        allSpecificFields.forEach(fieldSet => {
            fieldSet.style.display = 'none';
            // Disable validation for hidden fields
            const inputs = fieldSet.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.setAttribute('data-was-required', input.hasAttribute('required'));
                input.removeAttribute('required');
            });
        });

        if (!selectedSpecies) return;

        // Show relevant fields for selected species
        const fieldsToShow = this.form.querySelectorAll(`[id*="${selectedSpecies}-fields"]`);
        fieldsToShow.forEach(fieldSet => {
            fieldSet.style.display = 'block';
            // Re-enable validation for visible fields
            const inputs = fieldSet.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.getAttribute('data-was-required') === 'true') {
                    input.setAttribute('required', '');
                }
            });
        });

        // Update form labels based on species
        this.updateSpeciesLabels(selectedSpecies);
    }

    /**
     * Aktualisiert Labels basierend auf der Tierart
     */
    updateSpeciesLabels(species) {
        const colorLabel = this.form.querySelector('#color-label');
        if (colorLabel) {
            const labelMap = {
                'bird': 'Gefiederfarbe',
                'fish': 'Schuppenfarbe',
                'reptile': 'Hautfarbe',
                'dog': 'Fellfarbe',
                'cat': 'Fellfarbe',
                'rodent': 'Fellfarbe'
            };
            colorLabel.textContent = labelMap[species] || 'Fell-/Feder-/Hautfarbe';
        }
    }

    /**
     * Validiert den aktuellen Schritt
     */
    validateCurrentStep() {
        return this.validateStep(this.currentStep);
    }

    /**
     * Validiert einen spezifischen Schritt
     */
    validateStep(stepIndex) {
        const step = this.steps[stepIndex];
        if (!step) return true;

        const requiredFields = step.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validiert ein einzelnes Feld
     */
    validateField(field) {
        const value = field.value?.trim();
        const fieldName = field.name || field.id;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && (!value || value === '')) {
            isValid = false;
            errorMessage = 'Dieses Feld ist erforderlich.';
        }

        // Type-specific validation
        if (isValid && value) {
            switch (field.type) {
                case 'email':
                    isValid = this.isValidEmail(value);
                    if (!isValid) errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                    break;
                case 'number':
                    const num = parseFloat(value);
                    const min = parseFloat(field.min);
                    const max = parseFloat(field.max);
                    if (isNaN(num) || (min !== undefined && num < min) || (max !== undefined && num > max)) {
                        isValid = false;
                        errorMessage = `Bitte geben Sie eine Zahl zwischen ${min || 0} und ${max || 'unbegrenzt'} ein.`;
                    }
                    break;
            }
        }

        // Custom field validation
        if (isValid && fieldName === 'microchip' && value) {
            isValid = /^\d{15}$/.test(value);
            if (!isValid) errorMessage = 'Mikrochip-Nummer muss genau 15 Ziffern haben.';
        }

        // Update field appearance and error display
        this.updateFieldValidationState(field, isValid, errorMessage);

        return isValid;
    }

    /**
     * Validiert E-Mail-Format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Spezialisierte E-Mail-Validierung
     */
    validateEmail(emailField) {
        const email = emailField.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.updateFieldValidationState(emailField, false, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return false;
        }
        this.clearFieldError(emailField);
        return true;
    }

    /**
     * Spezialisierte Mikrochip-Validierung
     */
    validateMicrochip(microchipField) {
        const microchip = microchipField.value.trim();
        if (microchip && !/^\d{15}$/.test(microchip)) {
            this.updateFieldValidationState(microchipField, false, 'Mikrochip-Nummer muss genau 15 Ziffern haben.');
            return false;
        }
        this.clearFieldError(microchipField);
        return true;
    }

    /**
     * Aktualisiert den Validierungsstatus eines Feldes
     */
    updateFieldValidationState(field, isValid, errorMessage) {
        const fieldName = field.name || field.id;
        const errorContainer = this.form.querySelector(`#${fieldName}-error`);

        // Update field appearance
        field.classList.toggle('error', !isValid);
        field.setAttribute('aria-invalid', !isValid);

        // Update error container
        if (errorContainer) {
            if (!isValid && errorMessage) {
                errorContainer.textContent = errorMessage;
                errorContainer.style.display = 'block';
                errorContainer.setAttribute('aria-live', 'polite');
            } else {
                errorContainer.style.display = 'none';
                errorContainer.textContent = '';
            }
        }

        // Store validation state
        if (!isValid) {
            this.validationErrors.set(fieldName, errorMessage);
        } else {
            this.validationErrors.delete(fieldName);
        }
    }

    /**
     * Löscht Validierungsfehler für ein Feld
     */
    clearFieldError(field) {
        const fieldName = field.name || field.id;
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        
        const errorContainer = this.form.querySelector(`#${fieldName}-error`);
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.textContent = '';
        }
        
        this.validationErrors.delete(fieldName);
    }

    /**
     * Löscht alle Fehler
     */
    clearErrors() {
        this.validationErrors.clear();
        const errorContainers = this.form.querySelectorAll('.form-error');
        errorContainers.forEach(container => {
            container.style.display = 'none';
            container.textContent = '';
        });

        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        });

        if (this.statusContainer) {
            this.statusContainer.style.display = 'none';
        }
    }

    /**
     * Zeigt eine Fehlermeldung an
     */
    showError(message) {
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
                <div class="error-content">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">${message}</div>
                </div>
            `;
            this.statusContainer.className = 'form-status error';
            this.statusContainer.style.display = 'block';
            this.statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert(message); // Fallback
        }
    }

    /**
     * Zeigt eine Erfolgsmeldung an
     */
    showSuccess(message) {
        if (this.statusContainer) {
            this.statusContainer.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">✅</div>
                    <div class="success-message">${message}</div>
                </div>
            `;
            this.statusContainer.className = 'form-status success';
            this.statusContainer.style.display = 'block';
            this.statusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Generiert die Zusammenfassung für den letzten Schritt
     */
    generateSummary() {
        if (!this.summaryContainer) return;

        this.summaryContainer.innerHTML = '';
        const formData = new FormData(this.form);
        let hasData = false;

        // Process each field group
        for (const [groupName, fields] of Object.entries(this.fieldGroups)) {
            let groupHTML = '';
            
            for (const fieldName of fields) {
                const value = this.getFormattedFieldValue(fieldName, formData);
                if (value && value.trim() !== '') {
                    hasData = true;
                    const label = this.labelMap[fieldName] || fieldName;
                    groupHTML += `
                        <div class="summary-item">
                            <span class="summary-label">${label}:</span>
                            <span class="summary-value">${value}</span>
                        </div>
                    `;
                }
            }

            if (groupHTML) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'summary-group';
                groupDiv.innerHTML = `
                    <h4 class="summary-group-title">${groupName}</h4>
                    <div class="summary-group-content">${groupHTML}</div>
                `;
                this.summaryContainer.appendChild(groupDiv);
            }
        }

        // Add image preview to summary if exists
        if (this.imagePreview && this.imagePreview.src && this.imagePreview.src !== '#') {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'summary-group summary-image';
            imageDiv.innerHTML = `
                <h4 class="summary-group-title">Profilbild</h4>
                <div class="summary-image-preview">
                    <img src="${this.imagePreview.src}" alt="Profilbild Vorschau" class="summary-image-thumb">
                </div>
            `;
            this.summaryContainer.insertBefore(imageDiv, this.summaryContainer.firstChild);
            hasData = true;
        }

        // Show empty state if no data
        if (!hasData) {
            this.summaryContainer.innerHTML = `
                <div class="summary-empty-state">
                    <div class="summary-empty-icon">📝</div>
                    <h4 class="summary-empty-title">Ihre Zusammenfassung ist noch leer</h4>
                    <p class="summary-empty-description">
                        Die von Ihnen eingegebenen Daten werden hier angezeigt, sobald Sie die vorherigen Schritte ausfüllen. 
                        Gehen Sie einfach einen Schritt zurück, um zu beginnen.
                    </p>
                </div>
            `;
        }
    }

    /**
     * Formatiert Feldwerte für die Anzeige
     */
    getFormattedFieldValue(fieldName, formData) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (!field) return '';

        if (field.type === 'checkbox' && field.name === 'temperament') {
            // Handle multiple checkboxes (temperament)
            const checkboxes = this.form.querySelectorAll(`[name="${fieldName}"]:checked`);
            return Array.from(checkboxes).map(cb => cb.value).join(', ');
        } else if (field.type === 'range') {
            // Format range values
            const value = field.value;
            const labels = ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'];
            return `${labels[value - 1] || value} (${value}/5)`;
        } else if (field.type === 'date' && field.value) {
            // Format dates
            const date = new Date(field.value);
            return date.toLocaleDateString('de-DE');
        } else if (field.tagName === 'SELECT') {
            // Get select option text
            const selectedOption = field.querySelector(`option[value="${field.value}"]`);
            return selectedOption ? selectedOption.textContent : field.value;
        } else {
            return formData.get(fieldName) || '';
        }
    }

    /**
     * Hilfsfunktion: Feldwert abrufen
     */
    getFieldValue(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        return field ? field.value : '';
    }

    /**
     * Formulardaten im Browser-Speicher sichern (Auto-Save)
     */
    saveFormDataToStorage() {
        try {
            const formData = new FormData(this.form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Handle multiple values (like checkboxes)
                    if (Array.isArray(data[key])) {
                        data[key].push(value);
                    } else {
                        data[key] = [data[key], value];
                    }
                } else {
                    data[key] = value;
                }
            }

            localStorage.setItem('petProfileDraft', JSON.stringify({
                data: data,
                currentStep: this.currentStep,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error saving form data to storage:', error);
        }
    }

    /**
     * Formulardaten aus Browser-Speicher laden
     */
    loadFormDataFromStorage() {
        try {
            const saved = localStorage.getItem('petProfileDraft');
            if (!saved) return false;

            const { data, currentStep, timestamp } = JSON.parse(saved);
            
            // Check if data is not too old (24 hours)
            if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('petProfileDraft');
                return false;
            }

            // Restore form data
            Object.keys(data).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                        values.forEach(value => {
                            const checkbox = this.form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    } else {
                        field.value = data[key];
                    }
                }
            });

            // Restore current step
            this.currentStep = currentStep || 0;
            this.changeStep(0);

            return true;
        } catch (error) {
            console.error('Error loading form data from storage:', error);
            return false;
        }
    }

    /**
     * Hauptformular-Submit Handler
     */
    async handleSubmit(event) {
  event.preventDefault();

  if (this.isSubmitting) return;

  // Finale Validierung
  if (!this.validateCurrentStep()) {
    this.showError('Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie das Profil erstellen.');
    return;
  }

  // Datenschutzerklärung prüfen (optional)
  const privacyAccepted = this.form.querySelector('#privacy-accepted');
  if (privacyAccepted && !privacyAccepted.checked) {
    this.showError('Bitte akzeptieren Sie die Datenschutzerklärung, um fortzufahren.');
    return;
  }

  this.isSubmitting = true;
  this.updateSubmitButtonState(true);

  try {
    // Formulardaten als Objekt sammeln
    const formDataObj = this.getFormDataAsObject();

    // POST Request an Netlify Function senden
    const response = await fetch('/.netlify/functions/add-pet-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataObj)
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        this.showSuccess('Haustier-Profil erfolgreich gespeichert!');
        localStorage.removeItem('petProfileDraft');

        setTimeout(() => {
          this.resetForm();
          if (this.app && this.app.showMyPets) {
            this.app.showMyPets();
          }
        }, 1500);

      } else {
        this.showError(result.error || 'Ein unbekannter Fehler ist aufgetreten.');
      }
    } else {
      const errorText = await response.text();
      this.showError(`Fehler beim Speichern: ${errorText}`);
    }

  } catch (error) {
    console.error('Netzwerkfehler:', error);
    this.showError('Ein Netzwerkfehler ist aufgetreten. Bitte versuchen Sie es erneut.');
  } finally {
    this.isSubmitting = false;
    this.updateSubmitButtonState(false);
  }
}

getFormDataAsObject() {
  const formData = new FormData(this.form);
  const obj = {};

  for (const [key, value] of formData.entries()) {
    // Mehrfachauswahl (z.B. Checkboxes für temperament) berücksichtigen
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  // Optional: "temperament" (wenn Checkboxen) immer als Array, auch bei einem Wert
  if (obj.temperament && !Array.isArray(obj.temperament)) {
    obj.temperament = [obj.temperament];
  }

  return obj;
}

    /**
     * Aktualisiert den Status des Submit-Buttons
     */
    updateSubmitButtonState(loading) {
        if (!this.submitBtn) return;

        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');

        this.submitBtn.disabled = loading;

        if (btnText) {
            btnText.style.display = loading ? 'none' : 'inline';
        }

        if (btnLoading) {
            btnLoading.style.display = loading ? 'inline' : 'none';
        }

        if (loading) {
            this.submitBtn.setAttribute('aria-label', 'Profile wird gespeichert...');
        } else {
            this.submitBtn.setAttribute('aria-label', this.editMode ? 'Änderungen speichern' : 'Profil erstellen');
        }
    }

    /**
     * Lädt ein existierendes Profil zum Bearbeiten
     */
    async loadProfileForEdit(profileId) {
        if (!profileId) return;

        this.resetForm();
        this.editMode = true;
        this.profileId = profileId;

        // Update UI for edit mode
        const titleElement = this.form.closest('section')?.querySelector('.section__title');
        if (titleElement) {
            titleElement.textContent = 'Haustier-Profil bearbeiten';
        }

        try {
            // Show loading state
            this.showStatus('Profil wird geladen...', 'loading');

            const response = await fetch(`/api/pet-profiles/${profileId}`);
            if (!response.ok) {
                throw new Error('Profil konnte nicht geladen werden.');
            }

            const data = await response.json();

            // Populate form fields
            this.populateFormWithData(data);

            // Update species-specific fields
            this.updateSpeciesSpecificFields();

            // Clear status
            this.clearErrors();

            console.log('✅ Profile loaded for editing:', profileId);

        } catch (error) {
            console.error('Error loading profile for edit:', error);
            this.showError('Profil konnte nicht zum Bearbeiten geladen werden.');
            
            // Navigate back to my pets
            if (this.app && this.app.showMyPets) {
                setTimeout(() => this.app.showMyPets(), 2000);
            }
        }
    }

    /**
     * Füllt das Formular mit geladenen Daten
     */
    populateFormWithData(data) {
        Object.keys(data).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (!field) return;

            if (field.type === 'checkbox') {
                if (Array.isArray(data[key])) {
                    // Multiple checkboxes (like temperament)
                    const checkboxes = this.form.querySelectorAll(`[name="${key}"]`);
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = data[key].includes(checkbox.value);
                    });
                } else {
                    field.checked = !!data[key];
                }
            } else if (field.type === 'radio') {
                const radioButton = this.form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                if (radioButton) radioButton.checked = true;
            } else {
                field.value = data[key] || '';
            }
        });

        // Handle profile image
        if (data.profileImage) {
            this.imagePreview.src = data.profileImage;
            this.imagePreview.alt = `Profilbild von ${data.petName || 'Haustier'}`;
            this.previewContainer.style.display = 'block';
            this.dropZone.style.display = 'none';
        }
    }

    /**
     * Zeigt einen Status an (loading, error, success)
     */
    showStatus(message, type) {
        if (!this.statusContainer) return;

        const icons = {
            loading: '⏳',
            error: '⚠️',
            success: '✅'
        };

        this.statusContainer.innerHTML = `
            <div class="${type}-content">
                <div class="${type}-icon">${icons[type]}</div>
                <div class="${type}-message">${message}</div>
            </div>
        `;
        this.statusContainer.className = `form-status ${type}`;
        this.statusContainer.style.display = 'block';
    }

    /**
     * Setzt das Formular zurück
     */
    resetForm() {
        // Reset form data
        this.form.reset();
        
        // Reset state
        this.editMode = false;
        this.profileId = null;
        this.currentStep = 0;
        this.validationErrors.clear();
        this.isSubmitting = false;

        // Reset UI elements
        const titleElement = this.form.closest('section')?.querySelector('.section__title');
        if (titleElement) {
            titleElement.textContent = 'Haustier-Profil erstellen - Digitales Haustier-Portfolio';
        }

        // Reset image upload
        this.resetImagePreview();

        // Reset species-specific fields
        this.updateSpeciesSpecificFields();

        // Reset step navigation
        this.changeStep(0);

        // Clear errors and status
        this.clearErrors();

        // Clear auto-saved data
        localStorage.removeItem('petProfileDraft');

        console.log('✅ Form reset successfully');
    }

    /**
     * Zerstört die Instanz und räumt Event Listener auf
     */
    destroy() {
        // Remove event listeners
        this.nextBtn?.removeEventListener('click', this.handleNext);
        this.prevBtn?.removeEventListener('click', this.handlePrevious);
        this.form?.removeEventListener('submit', this.handleSubmit);
        
        // Clear references
        this.form = null;
        this.app = null;
        
        console.log('✅ PetProfileCreator destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PetProfileCreator;
}
