class PetProfileCreator {
    constructor(formId, app) {
        this.app = app;
        this.form = document.getElementById(formId);
        if (!this.form) return;

        // Formular-Elemente
        this.steps = Array.from(this.form.querySelectorAll('.form-step'));
        this.nextBtn = this.form.querySelector('#next-btn');
        this.prevBtn = this.form.querySelector('#prev-btn');
        this.submitBtn = this.form.querySelector('#submit-btn');
        this.speciesSelect = this.form.querySelector('#pet-species');
        this.colorLabel = this.form.querySelector('#color-label');

        // Fortschrittsanzeige
        this.progressFill = document.getElementById('progress-fill');
        this.progressSteps = document.querySelectorAll('.step');

        // Bild-Upload
        this.dropZone = this.form.querySelector('#image-drop-zone');
        this.imageInput = this.form.querySelector('#profile-image');
        this.previewContainer = this.form.querySelector('#image-preview-container');
        this.imagePreview = this.form.querySelector('#image-preview');
        this.removeImageBtn = this.form.querySelector('#image-remove-btn');

        // Zustand
        this.currentStep = 0;
        this.editMode = false;
        this.profileId = null;

        this.init();
    }

    init() {
        this.nextBtn.addEventListener('click', () => this.changeStep(1));
        this.prevBtn.addEventListener('click', () => this.changeStep(-1));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.speciesSelect.addEventListener('change', () => this.updateSpeciesSpecificFields());
        this.initImageUpload();
        
        this.app.petProfileCreator = this;
        this.resetForm();
    }

    // KORRIGIERTE METHODE: Stellt sicher, dass die Fortschrittsanzeige zuverlässig aktualisiert wird
    changeStep(direction) {
        if (direction > 0 && !this.validateStep()) {
            return;
        }

        this.currentStep += direction;

        // Grenzen überprüfen
        if (this.currentStep < 0) this.currentStep = 0;
        if (this.currentStep >= this.steps.length) this.currentStep = this.steps.length - 1;

        // Zusammenfassung für den letzten Schritt generieren
        if (this.currentStep === this.steps.length - 1) {
            this.generateSummary();
        }

        // Sichtbarkeit der Formularschritte aktualisieren
        this.steps.forEach((step, index) => {
            step.classList.toggle('active', index === this.currentStep);
        });

        // WICHTIG: Buttons UND Fortschrittsanzeige bei jedem Schritt-Wechsel aktualisieren
        this.updateButtons();
        this.updateProgress(); // Dieser Aufruf ist entscheidend und behebt den Fehler.
    }

    // Aktualisiert den visuellen Zustand der Fortschrittsanzeige
    updateProgress() {
        if (!this.progressFill || !this.progressSteps) return;

        // Fortschrittsbalken-Füllung aktualisieren
        const progressPercent = (this.currentStep / (this.steps.length - 1)) * 100;
        this.progressFill.style.width = `${progressPercent}%`;

        // Status der einzelnen Schritte (Kreise) aktualisieren
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');

            if (index < this.currentStep) {
                step.classList.add('completed');
            } else if (index === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    // Alle weiteren Methoden bleiben unverändert
    initImageUpload() {
        if (!this.dropZone) return;
        this.dropZone.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', () => { if (this.imageInput.files.length) this.handleFileSelect(this.imageInput.files[0]); });
        this.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); this.dropZone.classList.add('drag-over'); });
        this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
        this.dropZone.addEventListener('drop', (e) => { e.preventDefault(); this.dropZone.classList.remove('drag-over'); if (e.dataTransfer.files.length) { this.imageInput.files = e.dataTransfer.files; this.handleFileSelect(e.dataTransfer.files[0]); } });
        this.removeImageBtn.addEventListener('click', () => this.resetImagePreview());
    }

    handleFileSelect(file) {
        if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { this.imagePreview.src = e.target.result; this.previewContainer.style.display = 'block'; this.dropZone.style.display = 'none'; }; reader.readAsDataURL(file); }
    }

    resetImagePreview() {
        this.imageInput.value = ''; this.imagePreview.src = '#'; if(this.previewContainer) this.previewContainer.style.display = 'none'; if(this.dropZone) this.dropZone.style.display = 'block';
    }

    resetForm() {
        this.form.reset(); this.editMode = false; this.profileId = null; this.currentStep = 0;
        const titleElement = this.form.closest('section')?.querySelector('.section__title');
        if (titleElement) titleElement.textContent = 'Haustier-Profil erstellen';
        this.submitBtn.textContent = 'Profil erstellen';
        this.resetImagePreview(); this.changeStep(0); this.updateSpeciesSpecificFields();
    }

    async loadProfileForEdit(profileId) {
        // ... (Code zum Laden und Füllen der Felder)
        // Wichtig: Auch die Bild-Vorschau laden
        if (data.profileImage) {
            this.imagePreview.src = data.profileImage;
            this.previewContainer.style.display = 'block';
            this.dropZone.style.display = 'none';
        } else {
            this.resetImagePreview();
        }
    }

    // Diese Methode steuert die Sichtbarkeit der spezifischen Felder
    updateSpeciesSpecificFields() {
        const selectedSpecies = this.speciesSelect.value;
        const allSpecificFields = this.form.querySelectorAll('.species-specific-fields');

        // Zuerst alle spezifischen Blöcke ausblenden
        allSpecificFields.forEach(fieldSet => {
            fieldSet.style.display = 'none';
        });

        if (!selectedSpecies) return;

        // Dann die passenden Blöcke für die gewählte Tierart einblenden
        const fieldsToShow = this.form.querySelectorAll(`[id^="${selectedSpecies}-fields"]`);
        fieldsToShow.forEach(fieldSet => {
            fieldSet.style.display = 'block';
        });
    }

    resetForm() {
        this.form.reset();
        this.editMode = false;
        this.profileId = null;
        this.currentStep = 0;
        
        const titleElement = this.form.closest('section').querySelector('.section__title');
        if (titleElement) {
            titleElement.textContent = 'Haustier-Profil erstellen';
        }
        this.submitBtn.textContent = 'Profil erstellen';
        
        this.changeStep(0);
        this.updateSpeciesSpecificFields(); // Auch beim Zurücksetzen den Zustand aktualisieren
    }

    async loadProfileForEdit(profileId) {
        this.resetForm();
        this.editMode = true;
        this.profileId = profileId;
        
        const titleElement = this.form.closest('section').querySelector('.section__title');
        if (titleElement) titleElement.textContent = 'Haustier-Profil bearbeiten';
        this.submitBtn.textContent = 'Änderungen speichern';

        try {
            const response = await fetch(`/api/pet-profiles/${profileId}`);
            if (!response.ok) throw new Error('Profil-Daten konnten nicht geladen werden.');
            const data = await response.json();

            Object.keys(data).forEach(key => {
                const field = this.form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                         if (Array.isArray(data[key])) {
                            const checkboxes = this.form.querySelectorAll(`[name="${key}"]`);
                            checkboxes.forEach(chk => { chk.checked = data[key].includes(chk.value); });
                         } else {
                            field.checked = !!data[key];
                         }
                    } else if(field.type === 'radio') {
                        const radioToSelect = this.form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                        if(radioToSelect) radioToSelect.checked = true;
                    }
                    else {
                        field.value = data[key];
                    }
                }
            });

            // Nach dem Füllen der Felder die spezifischen Bereiche anzeigen
            this.updateSpeciesSpecificFields();

        } catch (error) {
            console.error('Fehler beim Laden der Profildaten:', error);
            alert('Profil konnte nicht zum Bearbeiten geladen werden.');
            this.app.showMyPets();
        }
    }

    changeStep(direction) {
    if (direction > 0 && !this.validateStep()) {
        return;
    }

    this.currentStep += direction;

    if (this.currentStep < 0) this.currentStep = 0;
    if (this.currentStep >= this.steps.length) this.currentStep = this.steps.length - 1;

    // NEU: Diese if-Bedingung ruft die Zusammenfassung auf
    if (this.currentStep === this.steps.length - 1) {
        this.generateSummary();
    }

    this.steps.forEach((step, index) => {
        step.classList.toggle('active', index === this.currentStep);
    });

    this.updateButtons();
    this.updateProgress();
}

    validateStep() {
        const currentStepFields = this.steps[this.currentStep].querySelectorAll('[required]');
        let isValid = true;
        currentStepFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        return isValid;
    }
    
    updateButtons() {
        this.prevBtn.style.display = this.currentStep > 0 ? 'inline-flex' : 'none';
        this.nextBtn.style.display = this.currentStep < this.steps.length - 1 ? 'inline-flex' : 'none';
        this.submitBtn.style.display = this.currentStep === this.steps.length - 1 ? 'inline-flex' : 'none';
    }

    updateProgress() {
        if (!this.progressFill || !this.progressSteps) return;
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < this.currentStep) {
                step.classList.add('completed');
            } else if (index === this.currentStep) {
                step.classList.add('active');
            }
        });
        const progressPercent = (this.currentStep / (this.steps.length - 1)) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.validateStep()) {
            alert('Bitte füllen Sie alle erforderlichen Felder im letzten Schritt aus.');
            return;
        }
        const formData = new FormData(this.form);
        const url = this.editMode ? `/api/pet-profiles/${this.profileId}` : '/api/pet-profiles';
        const method = this.editMode ? 'PUT' : 'POST';
        try {
            this.submitBtn.disabled = true;
            this.submitBtn.textContent = 'Speichert...';
            const response = await fetch(url, { method: method, body: formData });
            const result = await response.json();
            if (result.success) {
                const message = this.editMode ? 'Profil erfolgreich aktualisiert!' : 'Profil erfolgreich erstellt!';
                alert(message);
                this.resetForm();
                this.app.showMyPets();
            } else {
                alert('Fehler: ' + (result.error || 'Unbekannter Fehler'));
            }
        } catch (error) {
            console.error('Fehler beim Senden des Formulars:', error);
            alert('Ein schwerwiegender Fehler ist aufgetreten.');
        } finally {
            this.submitBtn.disabled = false;
        }
    }

    generateSummary() {
    const summaryContainer = this.form.querySelector('#profile-summary');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = ''; // Leert die vorherige Zusammenfassung
    const formData = new FormData(this.form);
    let hasData = false;
    
    // Definiert, welche Felder in welcher Gruppe angezeigt werden sollen
    const fieldGroups = {
        'Grunddaten': ['petName', 'species', 'breed', 'gender', 'birthDate', 'microchip'],
        'Aussehen': ['size', 'weight', 'furColor', 'birdPlumage', 'fishScaleColor', 'reptileSkinPattern'],
        'Verhalten': ['temperament', 'activityLevel', 'socialBehavior', 'specialTraits'],
        'Pflege': ['healthStatus', 'allergies', 'careNotes', 'catOutdoor', 'dogTrainingLevel', 'fishTankSize', 'fishWaterType'],
        'Besitzer': ['ownerName', 'ownerEmail']
    };

    // Ordnet den internen Feldnamen schönere Labels für die Anzeige zu
    const labelMap = {
        petName: 'Name', species: 'Tierart', breed: 'Rasse', gender: 'Geschlecht', birthDate: 'Geburtsdatum', microchip: 'Mikrochip',
        size: 'Größe', weight: 'Gewicht (kg)', furColor: 'Farbe', birdPlumage: 'Gefieder', fishScaleColor: 'Schuppenfarbe', reptileSkinPattern: 'Hautmuster',
        temperament: 'Temperament', activityLevel: 'Aktivität', socialBehavior: 'Sozialverhalten', specialTraits: 'Besonderheiten',
        healthStatus: 'Gesundheit', allergies: 'Allergien', careNotes: 'Pflegehinweise', catOutdoor: 'Freigang', dogTrainingLevel: 'Training', fishTankSize: 'Aquarium (L)', fishWaterType: 'Wasserart',
        ownerName: 'Besitzer', ownerEmail: 'E-Mail'
    };

    // Geht durch jede Gruppe und erstellt den HTML-Code dafür
    for (const [groupName, fields] of Object.entries(fieldGroups)) {
        let groupHTML = '';
        for (const fieldName of fields) {
            const value = formData.getAll(fieldName).filter(v => v).join(', '); // .getAll() für Checkboxen, .filter(v => v) entfernt leere Werte
            if (value && value.trim() !== '') {
                hasData = true; // Markiert, dass Daten gefunden wurden
                const label = labelMap[fieldName] || fieldName;
                groupHTML += `<p><strong>${label}:</strong> <span>${value}</span></p>`;
            }
        }

        if (groupHTML) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'summary-group';
            groupDiv.innerHTML = `<h5>${groupName}</h5>${groupHTML}`;
            summaryContainer.appendChild(groupDiv);
        }
    }

    // Wenn keine Daten gefunden wurden, zeige eine freundliche Hinweismeldung an
    if (!hasData) {
        summaryContainer.innerHTML = `
            <div class="summary-empty-state">
                <div class="summary-empty-icon">📝</div>
                <h4>Deine Zusammenfassung ist noch leer</h4>
                <p>Die von dir eingegebenen Daten werden hier angezeigt, sobald du die vorherigen Schritte ausfüllst. Gehe einfach einen Schritt zurück, um zu beginnen.</p>
            </div>
        `;
    }
}
}
