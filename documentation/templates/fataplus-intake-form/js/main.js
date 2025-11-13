// =============================================
// Global Variables
// =============================================
let currentSection = 1;
const totalSections = 8;
const formData = {};
let submissionId = null;
let documentGenerationInProgress = false;

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

// =============================================
// DOM Elements
// =============================================
const form = document.getElementById('projectForm');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const loadingOverlay = document.getElementById('loadingOverlay');

// =============================================
// Initialize
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    updateProgressBar();
    updateNavigationButtons();
});

function initializeForm() {
    // Show first section
    showSection(1);

    // Initialize form data structure
    initializeFormData();

    // Add initial feature inputs
    addInitialFeatureInputs();
}

function setupEventListeners() {
    // Form navigation
    prevBtn.addEventListener('click', () => changeSection(-1));
    nextBtn.addEventListener('click', () => changeSection(1));
    form.addEventListener('submit', handleFormSubmit);

    // Progress steps click
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', function() {
            const targetSection = parseInt(this.dataset.step);
            if (targetSection <= currentSection) {
                showSection(targetSection);
            }
        });
    });

    // Modal close
    document.querySelector('.close').addEventListener('click', () => {
        successModal.style.display = 'none';
    });

    // Window click to close modal
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // Auto-save form data
    setupAutoSave();

    // Form field validation
    setupFieldValidation();
}

// =============================================
// Form Navigation
// =============================================
function showSection(sectionNumber) {
    // Prevent flickering by checking if section is already active
    if (currentSection === sectionNumber) {
        return;
    }

    // Hide all sections first
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show new section
    const newSectionElement = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (newSectionElement) {
        newSectionElement.classList.add('active');
    }

    // Update current section
    currentSection = sectionNumber;

    // Update UI immediately
    updateProgressBar();
    updateNavigationButtons();
    updateProgressSteps();
    debouncedSaveFormData();
}

// Note: Throttling function removed to prevent flickering

function changeSection(direction) {
    const newSection = currentSection + direction;

    if (newSection >= 1 && newSection <= totalSections) {
        // Validate current section before moving forward
        if (direction > 0 && !validateCurrentSection()) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        showSection(newSection);
    }
}

function updateProgressBar() {
    const progress = (currentSection / totalSections) * 100;
    progressBar.style.width = `${progress}%`;
}

function updateNavigationButtons() {
    // Previous button
    prevBtn.style.display = currentSection === 1 ? 'none' : 'flex';

    // Next/Submit buttons
    if (currentSection === totalSections) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

function updateProgressSteps() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber <= currentSection) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// =============================================
// Form Validation
// =============================================
function validateCurrentSection() {
    const currentSectionElement = document.querySelector(`[data-section="${currentSection}"]`);
    const requiredFields = currentSectionElement.querySelectorAll('[required]');

    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }

        // Special validation for checkboxes
        if (field.type === 'checkbox' && field.name === 'consent') {
            if (!field.checked) {
                isValid = false;
                showNotification('Veuillez accepter les conditions pour soumettre le formulaire', 'error');
            }
        }
    });

    // Validate radio groups
    const radioGroups = ['budget', 'timeline', 'visualStyle', 'complexity'];
    radioGroups.forEach(groupName => {
        const radioGroup = currentSectionElement.querySelectorAll(`input[name="${groupName}"]`);
        if (radioGroup.length > 0) {
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                showNotification(`Veuillez sélectionner une option pour ${groupName}`, 'error');
            }
        }
    });

    return isValid;
}

function setupFieldValidation() {
    // Real-time validation
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        field.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

// =============================================
// Dynamic Features
// =============================================
function addFeature(category) {
    const container = document.getElementById(`${category}Container`);
    const featureCount = container.children.length + 1;

    const featureItem = document.createElement('div');
    featureItem.className = 'feature-item';
    featureItem.innerHTML = `
        <input type="text" class="feature-input" placeholder="${category === 'mustHave' ? 'Fonctionnalité indispensable' : 'Fonctionnalité souhaitée'} ${featureCount}">
        <button type="button" class="remove-feature" onclick="removeFeature(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(featureItem);

    // Add animation
    featureItem.style.opacity = '0';
    featureItem.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        featureItem.style.transition = 'all 0.3s ease';
        featureItem.style.opacity = '1';
        featureItem.style.transform = 'translateY(0)';
    }, 10);
}

function removeFeature(button) {
    const featureItem = button.parentElement;
    featureItem.style.transition = 'all 0.3s ease';
    featureItem.style.opacity = '0';
    featureItem.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        featureItem.remove();
    }, 300);
}

function addInitialFeatureInputs() {
    // Add initial features if containers are empty
    const mustHaveContainer = document.getElementById('mustHaveContainer');
    const shouldHaveContainer = document.getElementById('shouldHaveContainer');

    if (mustHaveContainer.children.length === 0) {
        addFeature('mustHave');
    }

    if (shouldHaveContainer.children.length === 0) {
        addFeature('shouldHave');
    }
}

// =============================================
// Form Data Management
// =============================================
function initializeFormData() {
    // Initialize all form data sections
    const sections = [
        'projectTitle', 'problemStatement', 'solutionVision', 'targetAudience', 'expectedImpact',
        'companyName', 'industry', 'companySize', 'budget', 'timeline',
        'projectTypes', 'complexity', 'frontendTech', 'backendTech', 'database', 'integrations',
        'visualStyle', 'references', 'existingAssets',
        'mustHave', 'shouldHave', 'modules',
        'security', 'sensitiveData',
        'contactName', 'contactEmail', 'contactPhone', 'additionalInfo', 'consent'
    ];

    sections.forEach(section => {
        if (section === 'projectTypes' || section === 'frontendTech' || section === 'backendTech' ||
            section === 'database' || section === 'existingAssets' || section === 'modules' ||
            section === 'security' || section === 'sensitiveData') {
            formData[section] = [];
        } else {
            formData[section] = '';
        }
    });
}

function saveFormData() {
    // Save all form data
    formData.projectTitle = document.getElementById('projectTitle')?.value || '';
    formData.problemStatement = document.getElementById('problemStatement')?.value || '';
    formData.solutionVision = document.getElementById('solutionVision')?.value || '';
    formData.targetAudience = document.getElementById('targetAudience')?.value || '';
    formData.expectedImpact = document.getElementById('expectedImpact')?.value || '';
    formData.companyName = document.getElementById('companyName')?.value || '';
    formData.industry = document.getElementById('industry')?.value || '';
    formData.companySize = document.getElementById('companySize')?.value || '';
    formData.budget = document.querySelector('input[name="budget"]:checked')?.value || '';
    formData.timeline = document.querySelector('input[name="timeline"]:checked')?.value || '';
    formData.complexity = document.getElementById('complexity')?.value || '';
    formData.integrations = document.getElementById('integrations')?.value || '';
    formData.visualStyle = document.querySelector('input[name="visualStyle"]:checked')?.value || '';
    formData.references = document.getElementById('references')?.value || '';
    formData.contactName = document.getElementById('contactName')?.value || '';
    formData.contactEmail = document.getElementById('contactEmail')?.value || '';
    formData.contactPhone = document.getElementById('contactPhone')?.value || '';
    formData.additionalInfo = document.getElementById('additionalInfo')?.value || '';
    formData.consent = document.getElementById('consent')?.checked || false;

    // Save checkboxes
    formData.projectTypes = getCheckedValues('input[name="projectTypes"]:checked');
    formData.frontendTech = getCheckedValues('input[name="frontendTech"]:checked');
    formData.backendTech = getCheckedValues('input[name="backendTech"]:checked');
    formData.database = getCheckedValues('input[name="database"]:checked');
    formData.existingAssets = getCheckedValues('input[name="existingAssets"]:checked');
    formData.modules = getCheckedValues('input[name="modules"]:checked');
    formData.security = getCheckedValues('input[name="security"]:checked');
    formData.sensitiveData = getCheckedValues('input[name="sensitiveData"]:checked');

    // Save features
    formData.mustHave = getFeatureValues('mustHaveContainer');
    formData.shouldHave = getFeatureValues('shouldHaveContainer');

    // Save to localStorage
    localStorage.setItem('fataplus_form_data', JSON.stringify(formData));

    // Update summary
    updateProjectSummary();
}

function getCheckedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    return Array.from(checkboxes).map(cb => cb.value);
}

function getFeatureValues(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('.feature-input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
}

// Debounce function to prevent excessive saves
let saveTimeout;
function debouncedSaveFormData() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveFormData();
    }, 1000); // Save 1 second after user stops interacting
}

function setupAutoSave() {
    // Auto-save every 60 seconds (reduced frequency)
    setInterval(() => {
        saveFormData();
    }, 60000);

    // Load saved data on page load
    loadSavedData();
}

function loadSavedData() {
    const savedData = localStorage.getItem('fataplus_form_data');
    if (savedData) {
        const data = JSON.parse(savedData);

        // Restore form fields
        Object.keys(data).forEach(key => {
            if (key === 'projectTypes' || key === 'frontendTech' || key === 'backendTech' ||
                key === 'database' || key === 'existingAssets' || key === 'modules' ||
                key === 'security' || key === 'sensitiveData') {
                // Restore checkboxes
                data[key].forEach(value => {
                    const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else if (key === 'budget' || key === 'timeline' || key === 'visualStyle') {
                // Restore radio buttons
                const radio = document.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                if (radio) radio.checked = true;
            } else if (key === 'consent') {
                // Restore checkbox
                const checkbox = document.getElementById('consent');
                if (checkbox) checkbox.checked = data[key];
            } else if (key === 'mustHave' || key === 'shouldHave') {
                // Restore features (will be handled separately)
            } else {
                // Restore text inputs
                const field = document.getElementById(key);
                if (field) field.value = data[key];
            }
        });

        // Update form data object
        Object.assign(formData, data);
    }
}

// =============================================
// Project Summary
// =============================================
function updateProjectSummary() {
    const summaryContainer = document.getElementById('projectSummary');

    if (!summaryContainer) return;

    const summary = `
        <div class="summary-content">
            <div class="summary-item">
                <strong>Projet:</strong> ${formData.projectTitle || 'Non spécifié'}
            </div>
            <div class="summary-item">
                <strong>Entreprise:</strong> ${formData.companyName || 'Non spécifiée'}
            </div>
            <div class="summary-item">
                <strong>Type:</strong> ${getProjectTypeDescription()}
            </div>
            <div class="summary-item">
                <strong>Budget:</strong> ${getBudgetDescription()}
            </div>
            <div class="summary-item">
                <strong>Délai:</strong> ${getTimelineDescription()}
            </div>
            <div class="summary-item">
                <strong>Fonctionnalités principales:</strong>
                <ul>
                    ${formData.mustHave.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                    ${formData.mustHave.length > 3 ? '<li>...</li>' : ''}
                </ul>
            </div>
        </div>
    `;

    summaryContainer.innerHTML = summary;
}

function getProjectTypeDescription() {
    if (formData.projectTypes.length === 0) return 'Non spécifié';

    const typeMap = {
        'ui-design': 'Design UI/UX',
        'product-design': 'Design produit',
        'website': 'Site web',
        'ecommerce': 'E-commerce',
        'mobile': 'Application mobile',
        'chatbot': 'Chatbot IA',
        'saas': 'Plateforme SaaS'
    };

    return formData.projectTypes
        .slice(0, 3)
        .map(type => typeMap[type] || type)
        .join(', ') + (formData.projectTypes.length > 3 ? '...' : '');
}

function getBudgetDescription() {
    const budgetMap = {
        'small': '< 500K MGA',
        'medium': '500K - 1M MGA',
        'large': '1M - 5M MGA',
        'enterprise': '> 5M MGA'
    };

    return budgetMap[formData.budget] || 'Non spécifié';
}

function getTimelineDescription() {
    const timelineMap = {
        'urgent': '< 1 mois',
        'short': '1-3 mois',
        'medium': '3-6 mois',
        'long': '6-12 mois',
        'extended': '> 12 mois'
    };

    return timelineMap[formData.timeline] || 'Non spécifié';
}

// =============================================
// Form Submission
// =============================================
async function handleFormSubmit(e) {
    e.preventDefault();

    // Final validation
    if (!validateCurrentSection()) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    // Save final form data
    saveFormData();

    // Show loading with document generation message
    showLoading('Génération de vos documents en cours...');

    try {
        // Submit to backend for AI-powered document generation
        const response = await submitToIntakeAPI();

        if (response.success) {
            submissionId = response.submissionId;

            // Start polling for document generation status
            pollDocumentStatus();

            showNotification('Formulre soumis avec succès! Génération des documents en cours...', 'success');

        } else {
            throw new Error(response.error || 'Échec de la soumission');
        }

    } catch (error) {
        hideLoading();
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        console.error('Submission error:', error);
    }
}

// Submit form data to backend API
async function submitToIntakeAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/intake/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API submission error:', error);
        throw error;
    }
}

// Poll for document generation status
async function pollDocumentStatus() {
    if (!submissionId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/intake/status/${submissionId}`);
        const data = await response.json();

        if (data.success && data.data) {
            const status = data.data;

            // Update loading message
            const progressText = `Génération en cours... ${status.progress || 0}%`;
            updateLoadingMessage(progressText);

            if (status.status === 'completed') {
                hideLoading();
                showSuccessModal();
                loadGeneratedDocuments();
            } else if (status.status === 'failed') {
                hideLoading();
                showNotification('La génération des documents a échoué. Veuillez contacter le support.', 'error');
            } else {
                // Continue polling
                setTimeout(pollDocumentStatus, 5000); // Poll every 5 seconds
            }
        }
    } catch (error) {
        console.error('Status polling error:', error);
        // Continue polling even if there's an error
        setTimeout(pollDocumentStatus, 10000); // Wait longer before retry
    }
}

// Load generated documents
async function loadGeneratedDocuments() {
    if (!submissionId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/intake/documents/${submissionId}`);
        const data = await response.json();

        if (data.success && data.data) {
            const documents = data.data.documents;

            // Store document URLs for download
            sessionStorage.setItem('generated_documents', JSON.stringify(documents));

            // Update success modal with download links
            updateSuccessModalDocuments(documents);
        }
    } catch (error) {
        console.error('Document loading error:', error);
    }
}

// Update success modal with document links
function updateSuccessModalDocuments(documents) {
    const modalFooter = document.querySelector('.modal-footer');
    if (!modalFooter) return;

    // Clear existing buttons
    modalFooter.innerHTML = '';

    // Add download buttons for each document
    documents.forEach(doc => {
        const button = document.createElement('button');
        button.className = 'btn-primary document-download-btn';
        button.innerHTML = `
            <i class="fas fa-download"></i>
            Télécharger ${getDocumentDisplayName(doc.type)}
        `;
        button.onclick = () => downloadDocument(doc.url, doc.filename);
        modalFooter.appendChild(button);
    });

    // Add new project button
    const newProjectBtn = document.createElement('button');
    newProjectBtn.className = 'btn-secondary';
    newProjectBtn.innerHTML = '<i class="fas fa-plus"></i> Nouveau Projet';
    newProjectBtn.onclick = () => window.location.reload();
    modalFooter.appendChild(newProjectBtn);
}

// Get display name for document type
function getDocumentDisplayName(type) {
    const names = {
        'prd': 'le PRD',
        'tdr': 'le TDR',
        'technical': 'les Spécifications Techniques'
    };
    return names[type] || 'le document';
}

// Download document
async function downloadDocument(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);

        showNotification(`Document ${filename} téléchargé avec succès`, 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Erreur lors du téléchargement du document', 'error');
    }
}

function generatePRD() {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const projectId = `FP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    return `# Product Requirements Document - ${formData.projectTitle}

**Généré le**: ${currentDate}
**Projet ID**: ${projectId}
**Client**: ${formData.companyName}
**Contact**: ${formData.contactName} (${formData.contactEmail})

---

## 📊 Résumé Exécutif

### Problème
${formData.problemStatement}

### Solution Proposée
${formData.solutionVision}

### Public Cible
${formData.targetAudience}

### Impact Attendu
${formData.expectedImpact}

---

## 🎯 Objectifs et Spécifications

### Type de Projet
${formData.projectTypes.join(', ')}

### Complexité Technique
${formData.complexity}

### Budget Estimé
${getBudgetDescription()}

### Délai Souhaité
${getTimelineDescription()}

---

## 📋 Fonctionnalités

### Essentielles (Must-have)
${formData.mustHave.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Importantes (Should-have)
${formData.shouldHave.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

### Modules Requis
${formData.modules.join(', ')}

---

## 🛠️ Spécifications Techniques

### Frontend
${formData.frontendTech.join(', ') || 'Pas de préférence'}

### Backend
${formData.backendTech.join(', ') || 'Pas de préférence'}

### Base de Données
${formData.database.join(', ') || 'À définir'}

### Intégrations
${formData.integrations || 'Aucune'}

---

## 🎨 Design et UX

### Style Visuel
${formData.visualStyle}

### Références
${formData.references || 'Aucune'}

### Éléments Existant
${formData.existingAssets.join(', ') || 'Aucun'}

---

## 🔒 Sécurité

### Exigences
${formData.security.join(', ') || 'Standard'}

### Données Sensibles
${formData.sensitiveData.join(', ') || 'Aucune'}

---

## 📞 Contact

**Client**: ${formData.companyName}
**Contact**: ${formData.contactName}
**Email**: ${formData.contactEmail}
**Téléphone**: ${formData.contactPhone || 'Non spécifié'}

---

*Généré automatiquement via le formulaire d'intake Fataplus*
*© 2025 Fataplus SARLU`;
}

async function simulateServerSubmission() {
    // Simulate API call delay
    return new Promise(resolve => setTimeout(resolve, 2000));
}

function showLoading(message = 'Génération de votre PRD en cours...') {
    const loadingText = loadingOverlay.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
    loadingOverlay.style.display = 'block';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function updateLoadingMessage(message) {
    const loadingText = loadingOverlay.querySelector('p');
    if (loadingText) {
        loadingText.textContent = message;
    }
}

function showSuccessModal() {
    successModal.style.display = 'block';

    // Clear form data after successful submission
    localStorage.removeItem('fataplus_form_data');
}

// =============================================
// PRD Download
// =============================================
function downloadPRD() {
    const prdContent = sessionStorage.getItem('generated_prd');
    if (!prdContent) {
        showNotification('Aucun PRD disponible pour le téléchargement', 'error');
        return;
    }

    const blob = new Blob([prdContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRD-${formData.projectTitle || 'projet'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('PRD téléchargé avec succès', 'success');
}

// =============================================
// Notifications
// =============================================
function showNotification(message, type = 'info') {
    // Prevent multiple notifications of the same message
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        if (notif.textContent.includes(message)) {
            return; // Skip if same notification exists
        }
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? 'var(--error-color)' : type === 'success' ? 'var(--success-color)' : 'var(--primary-color)',
        color: 'white',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// =============================================
// Animation Styles (CSS-based animations for better performance)
// =============================================
// Note: Animations moved to CSS file for better performance

// =============================================
// Keyboard Navigation
// =============================================
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (currentSection === totalSections) {
            handleFormSubmit(e);
        }
    }

    // Arrow keys for navigation
    if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        changeSection(1);
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        changeSection(-1);
    }
});

// =============================================
// Analytics (Optional)
// =============================================
function trackFormProgress() {
    // Simple analytics tracking
    const progressData = {
        section: currentSection,
        completion: (currentSection / totalSections) * 100,
        timestamp: new Date().toISOString()
    };

    // Send to analytics service or localStorage
    const progressHistory = JSON.parse(localStorage.getItem('form_progress_history') || '[]');
    progressHistory.push(progressData);

    // Keep only last 50 entries
    if (progressHistory.length > 50) {
        progressHistory.shift();
    }

    localStorage.setItem('form_progress_history', JSON.stringify(progressHistory));
}

// Track progress on section change (integrated into main showSection function)
// Note: This has been integrated into the main showSection function to prevent conflicts