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

    // Dynamic Content Elements (z.B. Zusammenfassung)
    this.summaryContainer = this.form.querySelector('#profile-summary');
    this.statusContainer = this.form.querySelector('#profile-form-status');

    // State Management
    this.currentStep = 0;
    this.totalSteps = this.steps.length;
    this.editMode = false;
    this.profileId = null;
    this.validationErrors = new Map();
    this.isSubmitting = false;

    // Gruppen von Feldern für die Zusammenfassung (optional nach Thema sortiert)
    this.fieldGroups = {
      'Grunddaten': ['petName', 'species', 'breed', 'gender', 'birthDate', 'microchip'],
      'Aussehen': ['size', 'weight', 'furColor', 'birdPlumage', 'birdBeakType', 'fishScaleColor', 'fishFinType', 'reptileSkinPattern', 'reptileSpeciesType'],
      'Verhalten': ['temperament', 'activityLevel', 'socialBehavior', 'specialTraits'],
      'Gesundheit & Pflege': ['healthStatus', 'allergies', 'careNotes', 'catOutdoor', 'dogTrainingLevel', 'fishTankSize', 'fishWaterType'],
      'Besitzer': ['ownerName', 'ownerEmail']
    };

    // Labels für Felder (zur Anzeige z.B. in Zusammenfassung)
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

  /** Initialisiert alle Event Listener, State, UI-Komponenten */
  init() {
    console.log('🚀 Initializing PetProfileCreator...');

    // Navigation Event Listeners
    this.nextBtn?.addEventListener('click', () => this.handleNext());
    this.prevBtn?.addEventListener('click', () => this.handlePrevious());
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Tierart Auswahl reagieren
    this.speciesSelect?.addEventListener('change', () => this.updateSpeciesSpecificFields());

    // Fortschrittsanzeige klickbar machen
    this.progressSteps.forEach((step, index) => {
      step.addEventListener('click', () => this.jumpToStep(index));
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.jumpToStep(index);
        }
      });
    });

    // Bild-Upload System initialisieren
    this.initImageUpload();

    // Formularvalidierung initialisieren
    this.initFormValidation();

    // Auto-Save (optional)
    this.initAutoSave();

    // App-Referenz, falls benötigt
    if (this.app) {
      this.app.petProfileCreator = this;
    }

    // Formular auf Anfangszustand setzen
    this.resetForm();

    console.log('✅ PetProfileCreator initialized successfully');
  }

  /** Bild-Upload mit Drag & Drop, Vorschau, Entfernen, Größe und Typ Validierung */
  initImageUpload() {
    if (!this.dropZone || !this.imageInput) return;

    // Klick auf Drop-Zone öffnet Dateiwahl
    this.dropZone.addEventListener('click', () => {
      this.imageInput.click();
    });

    // Dateien via Input ausgewählt
    this.imageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelect(e.target.files[0]);
      }
    });

    // Drag & Drop Verhalten
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

    // Bild entfernen Button
    this.removeImageBtn?.addEventListener('click', () => {
      this.resetImagePreview();
    });
  }

  /** Verarbeitet ausgewählte Datei für Profilbild mit Validierung und Vorschau */
  handleFileSelect(file) {
    // Nur Bilddateien erlauben
    if (!file.type.startsWith('image/')) {
      this.showError('Bitte wählen Sie eine gültige Bilddatei aus.');
      return;
    }

    // Max. 5MB Größe erlauben
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
      if (this.previewContainer) this.previewContainer.style.display = 'block';
      if (this.dropZone) this.dropZone.style.display = 'none';
    };
    reader.onerror = () => {
      this.showError('Fehler beim Laden des Bildes.');
    };
    reader.readAsDataURL(file);
  }

  /** Setzt die Bildvorschau zurück auf Initialzustand */
  resetImagePreview() {
    if (this.imageInput) this.imageInput.value = '';
    if (this.imagePreview) {
      this.imagePreview.src = '#';
      this.imagePreview.alt = '';
    }
    if (this.previewContainer) this.previewContainer.style.display = 'none';
    if (this.dropZone) this.dropZone.style.display = 'block';
  }

  /** Initialisiert Formular-Validierung für required-Felder, E-Mail, Mikrochip */
  initFormValidation() {
    const requiredFields = this.form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });

    const emailField = this.form.querySelector('#owner-email');
    if (emailField) {
      emailField.addEventListener('blur', () => this.validateEmail(emailField));
    }

    const microchipField = this.form.querySelector('#pet-microchip');
    if (microchipField) {
      microchipField.addEventListener('input', () => this.validateMicrochip(microchipField));
    }
  }

  /** Optional: Auto-Save der Formulardaten im LocalStorage (kann angepasst/entfernt werden) */
  initAutoSave() {
    let autoSaveTimeout;
    this.form.addEventListener('input', () => {
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        this.saveFormDataToStorage();
      }, 2000);
    });
  }

  /** Speichert Formular-Daten in localStorage (kann später genutzt werden für Wiederherstellung) */
  saveFormDataToStorage() {
    try {
      const data = {};
      new FormData(this.form).forEach((value, key) => {
        data[key] = value;
      });
      localStorage.setItem('petProfileFormData', JSON.stringify(data));
      console.log('Auto-save: Formulardaten gespeichert');
    } catch (e) {
      console.warn('Auto-save fehlgeschlagen:', e);
    }
  }

  /** Lädt Formulardaten aus localStorage (optional, nicht automatisch aufgerufen) */
  loadFormDataFromStorage() {
    try {
      const dataStr = localStorage.getItem('petProfileFormData');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      Object.entries(data).forEach(([key, value]) => {
        const input = this.form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = value;
          this.validateField(input);
        }
      });
    } catch (e) {
      console.warn('Fehler beim Laden der gespeicherten Daten:', e);
    }
  }

  /** Navigation zum nächsten Schritt */
  handleNext() {
    if (this.isSubmitting) return;
    if (!this.validateCurrentStep()) {
      this.showError('Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie fortfahren.');
      return;
    }
    this.changeStep(1);
  }

  /** Navigation zum vorherigen Schritt */
  handlePrevious() {
    if (this.isSubmitting) return;
    this.changeStep(-1);
  }

  /** Direkt zu einem bestimmten Schritt springen */
  jumpToStep(targetStep) {
    if (this.isSubmitting) return;
    // Validierung aller Zwischenschritte vor Sprung
    for (let i = this.currentStep; i < targetStep; i++) {
      if (!this.validateStep(i)) {
        this.showError(`Bitte füllen Sie Schritt ${i + 1} vollständig aus.`);
        return;
      }
    }
    this.currentStep = targetStep;
    this.changeStep(0); // UI aktualisieren ohne Schrittwechsel
  }

  /** Ändert aktuellen Schritt und aktualisiert UI */
  changeStep(direction) {
    if (direction !== 0) {
      this.currentStep += direction;
    }
    // Grenzen einhalten
    if (this.currentStep < 0) this.currentStep = 0;
    if (this.currentStep >= this.totalSteps) this.currentStep = this.totalSteps - 1;

    // Zusammenfassung auf letztem Schritt generieren
    if (this.currentStep === this.totalSteps - 1) {
      this.generateSummary();
    }

    this.updateStepVisibility();
    this.updateNavigationButtons();
    this.updateProgressIndicator();
    this.updateAccessibilityStates();
    this.manageFocus();
    this.clearErrors();
  }

  /** Sichtbarkeit der Form-Schritte steuern */
  updateStepVisibility() {
    this.steps.forEach((step, index) => {
      const isActive = index === this.currentStep;
      step.classList.toggle('active', isActive);
      step.setAttribute('aria-hidden', !isActive);
      const elements = step.querySelectorAll('input, select, textarea, button');
      elements.forEach(el => {
        el.tabIndex = isActive ? 0 : -1;
      });
    });
  }

  /** Navigations-Buttons anzeigen/verstecken */
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

  /** Fortschrittsbalken updaten */
  updateProgressIndicator() {
    if (this.progressFill) {
      const percent = (this.currentStep / (this.totalSteps - 1)) * 100;
      this.progressFill.style.width = `${percent}%`;
    }
    if (this.progressBar) {
      this.progressBar.setAttribute('aria-valuenow', Math.round((this.currentStep / (this.totalSteps - 1)) * 100));
      this.progressBar.setAttribute('aria-label', `Fortschritt: Schritt ${this.currentStep + 1} von ${this.totalSteps}`);
    }
    this.progressSteps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      step.setAttribute('aria-selected', 'false');
      step.setAttribute('tabindex', '-1');

      if (index < this.currentStep) step.classList.add('completed');
      else if (index === this.currentStep) {
        step.classList.add('active');
        step.setAttribute('aria-selected', 'true');
        step.setAttribute('tabindex', '0');
      }
    });
  }

  /** Accessibility Updates */
  updateAccessibilityStates() {
    this.steps.forEach((step, index) => {
      const isActive = index === this.currentStep;
      step.setAttribute('aria-hidden', !isActive);
      if (isActive) {
        const firstFocusable = step.querySelector('input, select, textarea, button:not([disabled])');
        if (firstFocusable && document.activeElement === document.body) {
          setTimeout(() => firstFocusable.focus(), 100);
        }
      }
    });
  }

  /** Fokus auf aktuellen Schritt-Start setzen, Titel scrollen */
  manageFocus() {
    const step = this.steps[this.currentStep];
    if (!step) return;
    const stepTitle = step.querySelector('.step-title');
    if (stepTitle) {
      stepTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Passt die sichtbaren Felder und Labels an die Tierart an */
  updateSpeciesSpecificFields() {
    const selectedSpecies = this.speciesSelect?.value;
    const allSpecificFields = this.form.querySelectorAll('.species-specific-fields');

    // Alle verstecken, Validierung deaktivieren
    allSpecificFields.forEach(fieldSet => {
      fieldSet.style.display = 'none';
      const inputs = fieldSet.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.setAttribute('data-was-required', input.hasAttribute('required'));
        input.removeAttribute('required');
      });
    });

    if (!selectedSpecies) return;

    // Sichtbar machen, Validierung reaktivieren
    const fieldsToShow = this.form.querySelectorAll(`[id*="${selectedSpecies}-fields"]`);
    fieldsToShow.forEach(fieldSet => {
      fieldSet.style.display = 'block';
      const inputs = fieldSet.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (input.getAttribute('data-was-required') === 'true') {
          input.setAttribute('required', '');
        }
      });
    });

    // Label für Farbe aktualisieren
    this.updateSpeciesLabels(selectedSpecies);
  }

  /** Setzt Farblabel passend zur Tierart */
  updateSpeciesLabels(species) {
    const colorLabel = this.form.querySelector('#color-label');
    if (colorLabel) {
      const labelMap = {
        bird: 'Gefiederfarbe',
        fish: 'Schuppenfarbe',
        reptile: 'Hautfarbe',
        dog: 'Fellfarbe',
        cat: 'Fellfarbe',
        rodent: 'Fellfarbe'
      };
      colorLabel.textContent = labelMap[species] || 'Fell-/Feder-/Hautfarbe';
    }
  }

  /** Validiert aktuellen Schritt */
  validateCurrentStep() {
    return this.validateStep(this.currentStep);
  }

  /** Validiert einen spezifischen Schritt */
  validateStep(stepIndex) {
    const step = this.steps[stepIndex];
    if (!step) return true;
    const requiredFields = step.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  }

  /** Validiert ein einzelnes Formularfeld */
  validateField(field) {
    const value = field.value?.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && (!value || value === '')) {
      isValid = false;
      errorMessage = 'Dieses Feld ist erforderlich.';
    }

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

    if (isValid && fieldName === 'microchip' && value) {
      isValid = /^\d{15}$/.test(value);
      if (!isValid) errorMessage = 'Mikrochip-Nummer muss genau 15 Ziffern haben.';
    }

    this.updateFieldValidationState(field, isValid, errorMessage);

    return isValid;
  }

  /** Prüft E-Mail-Format mit Regex */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /** Spezielle Validierung E-Mail */
  validateEmail(emailField) {
    const email = emailField.value.trim();
    if (email && !this.isValidEmail(email)) {
      this.updateFieldValidationState(emailField, false, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return false;
    }
    this.clearFieldError(emailField);
    return true;
  }

  /** Spezielle Validierung Mikrochip */
  validateMicrochip(microchipField) {
    const microchip = microchipField.value.trim();
    if (microchip && !/^\d{15}$/.test(microchip)) {
      this.updateFieldValidationState(microchipField, false, 'Mikrochip-Nummer muss genau 15 Ziffern haben.');
      return false;
    }
    this.clearFieldError(microchipField);
    return true;
  }

  /** Updates Validierungsstatus eines Feldes und zeigt Fehler an */
  updateFieldValidationState(field, isValid, errorMessage) {
    const fieldName = field.name || field.id;
    const errorContainer = this.form.querySelector(`#${fieldName}-error`);

    field.classList.toggle('error', !isValid);
    field.setAttribute('aria-invalid', !isValid);

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

    if (!isValid) {
      this.validationErrors.set(fieldName, errorMessage);
    } else {
      this.validationErrors.delete(fieldName);
    }
  }

  /** Löscht Validierungsfehler von einem Feld */
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

  /** Löscht alle Validierungsfehler */
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
      this.statusContainer.textContent = '';
      this.statusContainer.className = '';
    }
  }

  /** Zeigt Fehlermeldung im Statuscontainer oder per alert */
  showError(message) {
    if (this.statusContainer) {
      this.statusContainer.textContent = message;
      this.statusContainer.className = 'form-status error';
      this.statusContainer.style.display = 'block';
    } else {
      alert(message);
    }
  }

  /** Zeigt Statusmeldung an (info, success, error, etc) */
  showStatus(message, type = 'info') {
    if (this.statusContainer) {
      this.statusContainer.textContent = message;
      this.statusContainer.className = `form-status ${type}`;
      this.statusContainer.style.display = 'block';
    }
  }

  /** Generiert Zusammenfassung aller Formulardaten für letzten Schritt */
  generateSummary() {
    if (!this.summaryContainer) return;

    const data = {};
    new FormData(this.form).forEach((value, key) => {
  if (typeof value === 'string') {
    data[key] = value.trim();
  } else {
    data[key] = value;
  }
});

    // Gruppenbasierte Darstellung
    let html = '';
    for (const [groupName, fields] of Object.entries(this.fieldGroups)) {
      html += `<section class="summary-group"><h3>${groupName}</h3><dl>`;
      fields.forEach(field => {
        const label = this.labelMap[field] || field;
        const value = data[field] || '-';
        html += `<dt>${label}</dt><dd>${this.escapeHtml(value)}</dd>`;
      });
      html += '</dl></section>';
    }

    this.summaryContainer.innerHTML = html;
  }

  /** Escaped HTML um XSS-Risiken zu verhindern */
  escapeHtml(string) {
    if (!string) return '';
    return string.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
      })[m];
    });
  }

  /** Holt Wert eines Formularfeldes nach name */
  getFieldValue(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    return field ? field.value.trim() : '';
  }

  /** Sammelt alle Daten und sendet POST mit UserID Query (vermeidet 401) */
  async handleSubmit(event) {
  event.preventDefault();
  if(this.isSubmitting) return;

  this.clearErrors();

  // Validierung aller Schritte vor Absendung
  for(let i = 0; i < this.totalSteps; i++) {
    if(!this.validateStep(i)) {
      this.showError(`Bitte füllen Sie alle erforderlichen Felder in Schritt ${i + 1} aus.`);
      this.changeStep(i);
      return;
    }
  }

  // userId aus app.authManager holen
  const userId = this.app?.authManager?.getCurrentUserId?.();
  if(!userId) {
    this.showError("Bitte zuerst einloggen.");
    this.app?.showAuthModal?.();
    return;
  }

  // Formulardaten sammeln, trim nur für Strings, Files ignorieren oder speziell behandeln
  const formData = new FormData(this.form);
  const data = {};
  formData.forEach((value, key) => {
    if (!(value instanceof File)) { // keine Dateien ins JSON packen
      data[key] = typeof value === 'string' ? value.trim() : value;
    }
  });

  this.isSubmitting = true;
  this.showStatus('Speichern...', 'info');

  try {
    const url = `/api/add-pet-profile?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      this.showError("Nicht authentifiziert oder Session abgelaufen. Bitte erneut anmelden.");
      this.app?.showAuthModal?.();
      this.isSubmitting = false;
      return;
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      this.showError(err.error || "Fehler beim Speichern.");
      this.isSubmitting = false;
      return;
    }

    const result = await response.json();

    this.showStatus('Profil erfolgreich gespeichert!', 'success');
    this.resetForm();

  } catch(error) {
    this.showError("Netzwerkfehler oder Server nicht erreichbar.");
    console.error('Fehler bei handleSubmit:', error);
  } finally {
    this.isSubmitting = false;
  }
}

  /** Setzt Formular zurück auf Anfangszustand */
  resetForm() {
    this.form.reset();
    this.currentStep = 0;

    this.updateStepVisibility();
    this.updateNavigationButtons();
    this.updateProgressIndicator();
    this.clearErrors();

    this.resetImagePreview();
  }
}
