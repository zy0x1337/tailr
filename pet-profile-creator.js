class PetProfileCreator {
  constructor(formId, app) {
    this.app = app;
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.error(`Form with ID "${formId}" not found`);
      return;
    }

    // Steps, Buttons, Progress
    this.steps = Array.from(this.form.querySelectorAll(".form-step"));
    this.currentStep = 0;
    this.totalSteps = this.steps.length;
    this.nextBtn = this.form.querySelector("#next-btn");
    this.prevBtn = this.form.querySelector("#prev-btn");
    this.submitBtn = this.form.querySelector("#submit-btn");
    this.progressFill = document.getElementById("progress-fill");
    this.progressSteps = document.querySelectorAll(".progress-steps .step");
    this.progressBar = document.querySelector('[role="progressbar"]');

    // Image Upload
    this.dropZone = this.form.querySelector("#image-drop-zone");
    this.imageInput = this.form.querySelector("#profile-image");
    this.previewContainer = this.form.querySelector("#image-preview-container");
    this.imagePreview = this.form.querySelector("#image-preview");
    this.removeImageBtn = this.form.querySelector("#image-remove-btn");

    // Status & Zusammenfassung
    this.statusContainer = this.form.querySelector("#profile-form-status");
    this.summaryContainer = this.form.querySelector("#profile-summary");

    // Validation, Mode, ID
    this.validationErrors = new Map();
    this.isSubmitting = false;
    this.editMode = false;
    this.profileId = null;

    // Feldgruppen für Zusammenfassung (optional konfigurierbar)
    this.fieldGroups = {
      'Grunddaten': [
        'petName', 'species', 'breed', 'gender', 'birthDate', 'microchip'
      ],
      'Aussehen': [
        'size', 'weight', 'furColor', 'birdPlumage', 'birdBeakType',
        'fishScaleColor', 'fishFinType', 'reptileSkinPattern', 'reptileSpeciesType'
      ],
      'Verhalten': ['temperament', 'activityLevel', 'socialBehavior', 'specialTraits'],
      'Gesundheit & Pflege': [
        'healthStatus', 'allergies', 'careNotes', 'catOutdoor', 'dogTrainingLevel',
        'fishTankSize', 'fishWaterType'
      ],
      'Besitzer': ['ownerName', 'ownerEmail']
    };

    // Label-Map für Felder
    this.labelMap = {
      petName: "Name des Haustiers",
      species: "Tierart",
      breed: "Rasse",
      gender: "Geschlecht",
      birthDate: "Geburtsdatum",
      microchip: "Mikrochip-Nummer",
      size: "Körpergröße",
      weight: "Gewicht (kg)",
      furColor: "Fell-/Feder-/Hautfarbe",
      birdPlumage: "Gefiederart",
      birdBeakType: "Schnabeltyp",
      fishScaleColor: "Schuppenfarbe",
      fishFinType: "Flossentyp",
      reptileSkinPattern: "Hautmuster/Farbe",
      reptileSpeciesType: "Art des Reptils",
      temperament: "Temperament",
      activityLevel: "Aktivitätslevel",
      socialBehavior: "Sozialverhalten",
      specialTraits: "Besondere Eigenschaften",
      healthStatus: "Gesundheitszustand",
      allergies: "Allergien/Unverträglichkeiten",
      careNotes: "Pflegehinweise",
      catOutdoor: "Freigang (Katze)",
      dogTrainingLevel: "Trainingslevel (Hund)",
      fishTankSize: "Aquariumgröße (Liter)",
      fishWaterType: "Wasserart",
      ownerName: "Besitzer Name",
      ownerEmail: "E-Mail-Adresse"
    };

    this.init();
  }

  init() {
    // Navigation & Progress Events
    this.nextBtn?.addEventListener("click", () => this.handleNext());
    this.prevBtn?.addEventListener("click", () => this.handlePrev());
    this.submitBtn?.addEventListener("click", (e) => this.handleSubmit(e));
    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));

    this.progressSteps.forEach((step, idx) => {
      step.addEventListener("click", () => this.jumpToStep(idx));
      step.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.jumpToStep(idx);
        }
      });
    });

    // Feldlogik für Tierart (dynamische Felder)
    const speciesSelect = this.form.querySelector("#pet-species");
    speciesSelect?.addEventListener("change", () => this.updateSpeciesSpecificFields());

    // Bild-Upload
    this.initImageUpload();

    // Validierung
    this.initFormValidation();

    // Reset & Initialzustand
    this.resetForm();
  }

  initImageUpload() {
    if (!this.dropZone || !this.imageInput) return;
    this.dropZone.addEventListener("click", () => this.imageInput.click());
    this.imageInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) this.handleFileSelect(e.target.files[0]);
    });
    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone.classList.add("dragover");
    });
    this.dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      this.dropZone.classList.remove("dragover");
    });
    this.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) this.handleFileSelect(e.dataTransfer.files[0]);
    });
    this.removeImageBtn?.addEventListener("click", () => this.resetImagePreview());
  }

  handleFileSelect(file) {
    if (!file.type.startsWith("image/")) {
      this.showError("Bitte wählen Sie eine gültige Bilddatei aus.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showError("Die Datei ist zu groß. Maximale Größe: 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.src = e.target.result;
      this.imagePreview.alt = `Profilbild von ${this.getFieldValue("petName") || "Haustier"}`;
      this.previewContainer.style.display = "block";
      this.dropZone.style.display = "none";
    };
    reader.onerror = () => this.showError("Fehler beim Laden des Bildes.");
    reader.readAsDataURL(file);
  }

  resetImagePreview() {
    if (this.imageInput) this.imageInput.value = "";
    if (this.imagePreview) {
      this.imagePreview.src = "";
      this.imagePreview.alt = "";
    }
    if (this.previewContainer) this.previewContainer.style.display = "none";
    if (this.dropZone) this.dropZone.style.display = "block";
  }

  // Dynamische Felder für die Tierart
  updateSpeciesSpecificFields() {
    const selectedSpecies = this.form.querySelector("#pet-species")?.value;
    // Blende alle species-specific ab
    const allSpecific = this.form.querySelectorAll(".species-specific-fields");
    allSpecific.forEach(fs => {
      fs.style.display = "none";
      fs.querySelectorAll('input,select,textarea').forEach(i => {
        i.removeAttribute('required'); // Required deaktivieren für ausgeblendete Felder
      });
    });
    if (!selectedSpecies) return;
    // Nur relevante Felder anzeigen/aktivieren
    const fieldsToShow = this.form.querySelectorAll(`[id*="${selectedSpecies}-fields"]`);
    fieldsToShow.forEach(fs => {
      fs.style.display = "block";
      fs.querySelectorAll('input,select,textarea').forEach(i => {
        if(i.getAttribute('data-was-required') === "true") i.setAttribute('required', '');
      });
    });
  }

  // Form-Validierung / Einzelnes Feld
  initFormValidation() {
    const requiredFields = this.form.querySelectorAll("[required]");
    requiredFields.forEach(field => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });
    // E-Mail und Mikrochip
    const emailField = this.form.querySelector("#owner-email");
    emailField?.addEventListener("blur", () => this.validateEmail(emailField));
    const microchipField = this.form.querySelector("#pet-microchip");
    microchipField?.addEventListener("input", () => this.validateMicrochip(microchipField));
  }

  validateField(field) {
    const value = field.value?.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let msg = "";
    if (field.hasAttribute("required") && (!value || value === "")) {
      isValid = false;
      msg = "Dieses Feld ist erforderlich.";
    }
    if (isValid && field.type === "email" && value) {
      isValid = this.isValidEmail(value);
      if (!isValid) msg = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
    if (isValid && fieldName === "microchip" && value) {
      isValid = /^\d{15}$/.test(value);
      if (!isValid) msg = "Mikrochip-Nummer muss genau 15 Ziffern haben.";
    }
    this.updateFieldValidationState(field, isValid, msg);
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validateEmail(field) {
    const val = field.value.trim();
    if (val && !this.isValidEmail(val)) {
      this.updateFieldValidationState(field, false, "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return false;
    }
    this.clearFieldError(field);
    return true;
  }

  validateMicrochip(field) {
    const val = field.value.trim();
    if (val && !/^\d{15}$/.test(val)) {
      this.updateFieldValidationState(field, false, "Mikrochip-Nummer muss genau 15 Ziffern haben.");
      return false;
    }
    this.clearFieldError(field);
    return true;
  }

  updateFieldValidationState(field, valid, msg) {
    const fieldName = field.name || field.id;
    const errorContainer = this.form.querySelector(`#${fieldName}-error`);
    field.classList.toggle("error", !valid);
    field.setAttribute("aria-invalid", !valid);
    if (errorContainer) {
      if (!valid && msg) {
        errorContainer.textContent = msg;
        errorContainer.style.display = "block";
        errorContainer.setAttribute("aria-live", "polite");
      } else {
        errorContainer.style.display = "none";
        errorContainer.textContent = "";
      }
    }
    if (!valid) this.validationErrors.set(fieldName, msg);
    else this.validationErrors.delete(fieldName);
  }

  clearFieldError(field) {
    const fieldName = field.name || field.id;
    field.classList.remove("error");
    field.setAttribute("aria-invalid", "false");
    const errorContainer = this.form.querySelector(`#${fieldName}-error`);
    if (errorContainer) {
      errorContainer.style.display = "none";
      errorContainer.textContent = "";
    }
    this.validationErrors.delete(fieldName);
  }

  validateStep(idx) {
    const step = this.steps[idx];
    if (!step) return true;
    const requiredFields = step.querySelectorAll("[required]");
    let isValid = true;
    requiredFields.forEach(field => {
      if (!this.validateField(field)) isValid = false;
    });
    return isValid;
  }

  validateCurrentStep() {
    return this.validateStep(this.currentStep);
  }

  handleNext() {
    if (this.isSubmitting) return;
    if (!this.validateCurrentStep()) {
      this.showError("Bitte füllen Sie alle erforderlichen Felder aus, bevor Sie fortfahren.");
      return;
    }
    this.changeStep(1);
  }

  handlePrev() {
    if (this.isSubmitting) return;
    this.changeStep(-1);
  }

  jumpToStep(targetStep) {
    if (this.isSubmitting) return;
    for (let i = 0; i < targetStep; i++) {
      if (!this.validateStep(i)) {
        this.showError(`Bitte füllen Sie Schritt ${i + 1} vollständig aus.`);
        return;
      }
    }
    this.currentStep = targetStep;
    this.changeStep(0);
  }

  changeStep(delta) {
    if (delta !== 0) {
      this.currentStep += delta;
      if (this.currentStep < 0) this.currentStep = 0;
      if (this.currentStep >= this.totalSteps) this.currentStep = this.totalSteps - 1;
    }
    this.steps.forEach((step, idx) => {
      const isActive = idx === this.currentStep;
      step.classList.toggle("active", isActive);
      step.setAttribute("aria-hidden", !isActive);
      step.setAttribute("tabindex", isActive ? "0" : "-1");
    });
    this.updateProgressIndicator();
    this.updateNavigationButtons();
    if (this.currentStep === this.totalSteps - 1) this.generateSummary();
    this.clearErrors();
    this.manageFocus();
  }

  updateProgressIndicator() {
    if (this.progressFill) {
      const percent = (this.currentStep / (this.totalSteps - 1)) * 100;
      this.progressFill.style.width = `${percent}%`;
    }
    if (this.progressBar) {
      this.progressBar.setAttribute("aria-valuenow", Math.round((this.currentStep / (this.totalSteps - 1)) * 100));
      this.progressBar.setAttribute("aria-label", `Fortschritt: Schritt ${this.currentStep + 1} von ${this.totalSteps}`);
    }
    this.progressSteps.forEach((step, idx) => {
      step.classList.remove("active", "completed");
      step.setAttribute("aria-selected", "false");
      if (idx < this.currentStep) step.classList.add("completed");
      else if (idx === this.currentStep) {
        step.classList.add("active");
        step.setAttribute("aria-selected", "true");
      }
    });
  }

  updateNavigationButtons() {
    if (this.prevBtn)
      this.prevBtn.style.display = this.currentStep > 0 ? "inline-flex" : "none";
    if (this.nextBtn)
      this.nextBtn.style.display = this.currentStep < this.totalSteps - 1 ? "inline-flex" : "none";
    if (this.submitBtn) {
      this.submitBtn.style.display = this.currentStep === this.totalSteps - 1 ? "inline-flex" : "none";
      this.submitBtn.textContent = this.editMode ? "Änderungen speichern" : "Profil erstellen";
    }
  }

  manageFocus() {
    const currentStepElement = this.steps[this.currentStep];
    if (currentStepElement) {
      const stepTitle = currentStepElement.querySelector(".step-title");
      if (stepTitle) {
        stepTitle.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  generateSummary() {
    if (!this.summaryContainer) return;
    this.summaryContainer.innerHTML = "";
    const formData = new FormData(this.form);

    // Gruppiert nach Feldgruppen
    for (const [groupName, fields] of Object.entries(this.fieldGroups)) {
      let html = "";
      fields.forEach(fieldKey => {
        const value = formData.get(fieldKey);
        if (value) html += `<div><strong>${this.labelMap[fieldKey]}</strong>: ${value}</div>`;
      });
      if (html) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "profile-summary-group";
        groupDiv.innerHTML = `<h4>${groupName}</h4>${html}`;
        this.summaryContainer.appendChild(groupDiv);
      }
    }

    // Bildvorschau falls vorhanden
    if (this.imagePreview && this.imagePreview.src) {
      const imgDiv = document.createElement("div");
      imgDiv.className = "profile-summary-image";
      imgDiv.innerHTML = `<strong>Profilbild</strong>: <img src="${this.imagePreview.src}" alt="Profilbild" style="max-width:100px;">`;
      this.summaryContainer.appendChild(imgDiv);
    }
  }

  async handleSubmit(e) {
  e.preventDefault();
  if (this.isSubmitting) return;

  // Authentifizierung prüfen
  const userId = this.app?.authManager?.getCurrentUserId?.();
  if (!userId) {
    this.showError("Bitte zuerst einloggen.");
    this.app?.showAuthModal?.(); // ggf. Login-Dialog öffnen
    return;
  }

  // Daten zusammenstellen
  const formData = new FormData(this.form);
  const data = Object.fromEntries(formData.entries());

  this.isSubmitting = true;
  this.showStatus('Speichern...', 'info');
  try {
    // Query-String bauen
    const url = `/api/add-pet-profile?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.status === 401) {
      this.showError("Nicht authentifiziert oder Session abgelaufen. Bitte erneut anmelden.");
      this.app?.showAuthModal?.();
      this.isSubmitting = false;
      return;
    }

    if (!response.ok) {
      this.showError(result.error || "Fehler beim Speichern.");
      this.isSubmitting = false;
      return;
    }

    this.showStatus('Profil erfolgreich gespeichert!', 'success');
    // Weiteres Handling (z.B. Weiterleitung oder Reset)

  } catch (err) {
    this.showError("Netzwerkfehler oder Server nicht erreichbar.");
  } finally {
    this.isSubmitting = false;
  }
}

showStatus(message, type = "info") {
  if (!this.statusContainer) return;
  this.statusContainer.textContent = message;
  this.statusContainer.className = `form-status ${type}`;
  this.statusContainer.style.display = 'block';
}

  collectFormData() {
    const formData = new FormData(this.form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    // Immer Array für temperament
    if (data.temperament && !Array.isArray(data.temperament))
      data.temperament = [data.temperament];
    return data;
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Fehler beim Lesen der Datei"));
      reader.readAsDataURL(file);
    });
  }

  showError(msg) {
    if (this.statusContainer) {
      this.statusContainer.className = "status error";
      this.statusContainer.textContent = msg;
      this.statusContainer.style.display = "block";
      this.statusContainer.scrollIntoView({ behavior: "smooth" });
    } else {
      alert(msg);
    }
  }

  showSuccess(msg) {
    if (this.statusContainer) {
      this.statusContainer.className = "status success";
      this.statusContainer.textContent = msg;
      this.statusContainer.style.display = "block";
      this.statusContainer.scrollIntoView({ behavior: "smooth" });
    }
  }

  getFieldValue(name) {
    const f = this.form.querySelector(`[name="${name}"]`);
    return f ? f.value : "";
  }

  resetForm() {
    this.form.reset();
    this.editMode = false;
    this.profileId = null;
    this.currentStep = 0;
    this.validationErrors.clear();
    this.isSubmitting = false;
    this.resetImagePreview();
    this.changeStep(0);
    this.clearErrors();
    if (this.statusContainer) this.statusContainer.style.display = "none";
  }

  clearErrors() {
    this.validationErrors.clear();
    const errorContainers = this.form.querySelectorAll(".form-error");
    errorContainers.forEach(c => { c.textContent = ""; c.style.display = "none"; });
    const errorFields = this.form.querySelectorAll(".error");
    errorFields.forEach(f => { f.classList.remove("error"); f.setAttribute("aria-invalid", "false"); });
    if (this.statusContainer) this.statusContainer.style.display = "none";
  }
}
