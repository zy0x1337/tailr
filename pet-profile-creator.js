class PetProfileCreator {
  constructor(formId, app) {
    this.app = app;
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.error(`Form with ID "${formId}" not found`);
      return;
    }

    // Form steps (mehrstufig)
    this.steps = Array.from(this.form.querySelectorAll(".form-step"));
    this.currentStep = 0;
    this.totalSteps = this.steps.length;

    // Buttons and progress
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
    this.imagePreview = this.form.querySelector("#profile-image-preview");
    this.removeImageBtn = this.form.querySelector("#image-remove-btn");

    // Status & Summary
    this.statusContainer = this.form.querySelector("#profile-status");
    this.summaryContainer = this.form.querySelector("#profile-summary");

    // Validation state
    this.validationErrors = new Map();
    this.isSubmitting = false;
    this.editMode = false;
    this.profileId = null;

    // Labels (für Zusammenfassung etc.)
    this.labelMap = {
      petName: "Name des Haustiers",
      species: "Tierart",
      breed: "Rasse",
      gender: "Geschlecht",
      birthDate: "Geburtsdatum",
      microchip: "Mikrochip",
      size: "Größe",
      weight: "Gewicht",
      furColor: "Farbe",
      temperament: "Temperament",
      activityLevel: "Aktivitätslevel",
      socialBehavior: "Soziales Verhalten",
      healthStatus: "Gesundheitsstatus",
      allergies: "Allergien",
      careNotes: "Pflegehinweise",
      specialTraits: "Besondere Eigenschaften",
      ownerName: "Besitzer Name",
      ownerEmail: "E-Mail des Besitzers",
    };

    // Event-Registrierung & Initialisierung
    this.init();
  }

  init() {
    // Navigation Buttons
    this.nextBtn?.addEventListener("click", () => this.handleNext());
    this.prevBtn?.addEventListener("click", () => this.handlePrev());
    this.submitBtn?.addEventListener("click", (e) => this.handleSubmit(e));
    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));

    // Progress bar click navigation
    this.progressSteps.forEach((step, idx) => {
      step.addEventListener("click", () => this.jumpToStep(idx));
      step.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.jumpToStep(idx);
        }
      });
    });

    // Species change updates form fields
    const speciesSelect = this.form.querySelector("#species");
    speciesSelect?.addEventListener("change", () => this.updateSpeciesFields());

    // Image upload handlers
    this.initImageUpload();

    // Validation handlers
    this.initValidation();

    // Reset form for new use
    this.resetForm();

    console.log("PetProfileCreator initialized");
  }

  initImageUpload() {
    if (!this.dropZone || !this.imageInput) return;

    // Open file dialog on dropzone click
    this.dropZone.addEventListener("click", () => this.imageInput.click());

    // Handle files from input change
    this.imageInput.addEventListener("change", (e) => {
      if (e.target.files.length) this.handleFile(e.target.files[0]);
    });

    // Drag and drop effects
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
      if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
    });

    this.removeImageBtn?.addEventListener("click", () => this.resetImagePreview());
  }

  handleFile(file) {
    if (!file.type.startsWith("image/")) {
      this.showError("Bitte wählen Sie eine Bilddatei aus.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showError("Datei zu groß (max. 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.src = e.target.result;
      this.imagePreview.alt = `Bild von ${this.getFieldValue("petName") || "Haustier"}`;
      this.previewContainer.style.display = "block";
      this.dropZone.style.display = "none";
    };
    reader.onerror = () => {
      this.showError("Fehler beim Laden des Bildes.");
    };
    reader.readAsDataURL(file);
  }

  resetImagePreview() {
    if (this.imageInput) this.imageInput.value = "";
    if (this.imagePreview) {
      this.imagePreview.src = "";
      this.imagePreview.alt = "";
    }
    this.previewContainer.style.display = "none";
    this.dropZone.style.display = "block";
  }

  initValidation() {
    const requiredFields = this.form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });

    const emailField = this.form.querySelector("#ownerEmail");
    emailField?.addEventListener("blur", () => this.validateEmail(emailField));

    const microchipField = this.form.querySelector("#microchip");
    microchipField?.addEventListener("input", () => this.validateMicrochip(microchipField));
  }

  validateField(field) {
    const value = field.value?.trim() || "";
    let valid = true;
    let msg = "";

    if (field.hasAttribute("required") && value === "") {
      valid = false;
      msg = "Dieses Feld ist erforderlich.";
    }

    if (valid && field.type === "email") {
      valid = this.isValidEmail(value);
      if (!valid) msg = "Bitte eine gültige E-Mail-Adresse angeben.";
    }

    if (valid && field.name === "microchip" && value !== "") {
      valid = /^[0-9]{15}$/.test(value);
      if (!valid) msg = "Mikrochipnummer muss genau 15 Ziffern enthalten.";
    }

    this.setFieldValidation(field, valid, msg);
    return valid;
  }

  validateEmail(field) {
    const val = field.value.trim();
    if (!this.isValidEmail(val)) {
      this.setFieldValidation(field, false, "Bitte eine gültige E-Mail-Adresse angeben.");
      return false;
    }
    this.clearFieldError(field);
    return true;
  }

  validateMicrochip(field) {
    const val = field.value.trim();
    if (val !== "" && !/^\d{15}$/.test(val)) {
      this.setFieldValidation(field, false, "Mikrochipnummer muss genau 15 Ziffern enthalten.");
      return false;
    }
    this.clearFieldError(field);
    return true;
  }

  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  setFieldValidation(field, valid, msg) {
    if (!valid) {
      field.classList.add("error");
      field.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("error");
      field.setAttribute("aria-invalid", "false");
    }

    // Show error message
    const errEl = this.form.querySelector(`#${field.id}-error`);
    if (errEl) {
      errEl.textContent = valid ? "" : msg;
      errEl.style.display = valid ? "none" : "block";
    }

    if (!valid) this.validationErrors.set(field.name || field.id, msg);
    else this.validationErrors.delete(field.name || field.id);
  }

  clearFieldError(field) {
    field.classList.remove("error");
    field.setAttribute("aria-invalid", "false");
    const errEl = this.form.querySelector(`#${field.id}-error`);
    if (errEl) {
      errEl.textContent = "";
      errEl.style.display = "none";
    }
    this.validationErrors.delete(field.name || field.id);
  }

  validateStep(idx) {
    const step = this.steps[idx];
    if (!step) return true;
    const fields = step.querySelectorAll("[required]");
    let ok = true;
    fields.forEach((f) => {
      if (!this.validateField(f)) ok = false;
    });
    return ok;
  }

  validateCurrentStep() {
    return this.validateStep(this.currentStep);
  }

  handleNext() {
    if (this.isSubmitting) return;
    if (!this.validateCurrentStep()) {
      this.showError("Bitte füllen Sie alle erforderlichen Felder aus.");
      return;
    }
    this.changeStep(1);
  }

  handlePrev() {
    if (this.isSubmitting) return;
    this.changeStep(-1);
  }

  jumpToStep(idx) {
    if (this.isSubmitting) return;
    for (let i = 0; i < idx; i++) {
      if (!this.validateStep(i)) {
        this.showError(`Bitte zuerst Schritt ${i + 1} vervollständigen.`);
        return;
      }
    }
    this.currentStep = idx;
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
    });

    this.updateProgress();
    this.updateButtons();

    if (this.currentStep === this.totalSteps - 1) {
      this.generateSummary();
    }

    this.clearErrors();
    this.manageFocus();
  }

  updateProgress() {
    const percent = (this.currentStep / (this.totalSteps - 1)) * 100;
    if (this.progressFill) this.progressFill.style.width = `${percent}%`;

    if (this.progressBar) {
      this.progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));
      this.progressBar.setAttribute(
        "aria-label",
        `Fortschritt ${this.currentStep + 1} von ${this.totalSteps}`
      );
    }

    this.progressSteps.forEach((step, idx) => {
      step.classList.remove("active", "completed");
      step.setAttribute("aria-selected", "false");
      idx < this.currentStep
        ? step.classList.add("completed")
        : idx === this.currentStep && step.classList.add("active");
      if (idx === this.currentStep) step.setAttribute("aria-selected", "true");
    });
  }

  updateButtons() {
    if (this.prevBtn)
      this.prevBtn.style.display = this.currentStep > 0 ? "inline-flex" : "none";

    if (this.nextBtn)
      this.nextBtn.style.display =
        this.currentStep < this.totalSteps - 1 ? "inline-flex" : "none";

    if (this.submitBtn) {
      this.submitBtn.style.display =
        this.currentStep === this.totalSteps - 1 ? "inline-flex" : "none";
      this.submitBtn.textContent = this.editMode ? "Änderungen speichern" : "Profil erstellen";
    }
  }

  manageFocus() {
    const step = this.steps[this.currentStep];
    if (!step) return;
    step.setAttribute("tabindex", "-1");
    step.focus({ preventScroll: true });
  }

  generateSummary() {
    if (!this.summaryContainer) return;
    const formData = new FormData(this.form);

    this.summaryContainer.innerHTML = ""; // clear all

    for (const [groupName, fields] of Object.entries(this.labelMap)) {
      const value = formData.get(groupName);
      if (value) {
        const div = document.createElement("div");
        div.className = "summary-item";
        div.innerHTML = `<strong>${fields}</strong>: ${value}`;
        this.summaryContainer.appendChild(div);
      }
    }

    // add image preview
    if (this.imagePreview && this.imagePreview.src) {
      const imgDiv = document.createElement("div");
      imgDiv.className = "summary-image";
      imgDiv.innerHTML = `<strong>Profilbild</strong>: <img src="${this.imagePreview.src}" alt="Profilbild" style="max-width: 100px;">`;
      this.summaryContainer.appendChild(imgDiv);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.isSubmitting) return;

    if (!this.validateCurrentStep()) {
      this.showError("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    // Privacy Checked (optional)
    const privacyField = this.form.querySelector("#privacyAccepted");
    if (privacyField && !privacyField.checked) {
      this.showError("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }

    this.isSubmitting = true;
    this.updateButtons();

    try {
      // Collect data from form (including multiple selects etc.)
      let data = this.collectFormData();

      // Add image as Base64 if available
      if (
        this.imageInput?.files &&
        this.imageInput.files.length > 0
      ) {
        data.profileImage = await this.readFileAsDataURL(this.imageInput.files[0]);
      }

      // Submit via AuthManager API Call
      const result = await this.app.authManager.apiCall(
        "https://tailr.netlify.app/.netlify/functions/add-pet-profile",
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.success) {
        this.showSuccess("Profil erfolgreich gespeichert!");
        window.localStorage.removeItem("petProfileDraft");
        setTimeout(() => {
          this.resetForm();
          if (this.app?.showMyPets) this.app.showMyPets();
        }, 1500);
      } else {
        this.showError(result.error || "Fehler beim Speichern.");
      }
    } catch (err) {
      this.showError("Fehler beim Speichern: " + err.message);
      console.error(err);
    } finally {
      this.isSubmitting = false;
      this.updateButtons();
    }
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

    // Convert "temperament" to array always:
    if (data.temperament && !Array.isArray(data.temperament)) {
      data.temperament = [data.temperament];
    }

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
    const errorElements = this.form.querySelectorAll(".error");
    errorElements.forEach((el) => el.classList.remove("error"));

    const errorContainers = this.form.querySelectorAll(".field-error");
    errorContainers.forEach((el) => (el.style.display = "none"));

    if (this.statusContainer) this.statusContainer.style.display = "none";
  }
}
