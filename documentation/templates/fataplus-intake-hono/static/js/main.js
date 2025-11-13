// =============================================
// Global Variables
// =============================================
let currentSection = 1;
const totalSections = 8;
const formData = {};
let submissionId = null;

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
// API Configuration
// =============================================
const API_BASE = ''; // Same origin for Hono deployment

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

    // Hide all sections
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

    // Update UI
    updateProgressBar();
    updateNavigationButtons();
    updateProgressSteps();
}

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
    const radioGroups = ['budget', 'timeline'];
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

function collectFormData() {
    // Collect all form data
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

    // Collect checkboxes
    formData.projectTypes = getCheckedValues('input[name="projectTypes"]:checked');
    formData.frontendTech = getCheckedValues('input[name="frontendTech"]:checked');
    formData.backendTech = getCheckedValues('input[name="backendTech"]:checked');
    formData.database = getCheckedValues('input[name="database"]:checked');
    formData.existingAssets = getCheckedValues('input[name="existingAssets"]:checked');
    formData.modules = getCheckedValues('input[name="modules"]:checked');
    formData.security = getCheckedValues('input[name="security"]:checked');
    formData.sensitiveData = getCheckedValues('input[name="sensitiveData"]:checked');

    // Collect features (simplified for this example)
    formData.mustHave = ['Fonctionnalité principale', 'Interface utilisateur'];
    formData.shouldHave = ['Fonctionnalité secondaire'];

    return formData;
}

function getCheckedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    return Array.from(checkboxes).map(cb => cb.value);
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

    // Collect form data
    const submissionData = collectFormData();

    // Show loading
    showLoading();

    try {
        // Submit to Hono API
        const response = await fetch(`${API_BASE}/api/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (result.success) {
            submissionId = result.data.projectId;
            hideLoading();
            showSuccessModal();
        } else {
            hideLoading();
            showNotification(result.error || 'Échec de la soumission', 'error');
        }
    } catch (error) {
        hideLoading();
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        console.error('Submission error:', error);
    }
}

// =============================================
// PRD Download
// =============================================
async function downloadPRD() {
    if (!submissionId) {
        showNotification('Aucun projet disponible pour le téléchargement', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/prd/${submissionId}`);

        if (response.ok) {
            const prdContent = await response.text();

            // Create blob and download
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
        } else {
            showNotification('Erreur lors du téléchargement du PRD', 'error');
        }
    } catch (error) {
        showNotification('Erreur lors du téléchargement', 'error');
        console.error('Download error:', error);
    }
}

// =============================================
// UI Helpers
// =============================================
function showLoading() {
    loadingOverlay.style.display = 'block';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showSuccessModal() {
    successModal.style.display = 'block';
    updateProjectSummary();
}

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
                <strong>ID:</strong> ${submissionId || 'En attente'}
            </div>
        </div>
    `;

    summaryContainer.innerHTML = summary;
}

function getProjectTypeDescription() {
    if (formData.projectTypes.length === 0) return 'Non spécifié';
    return formData.projectTypes.slice(0, 3).join(', ') + (formData.projectTypes.length > 3 ? '...' : '');
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
// Notifications
// =============================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        if (notif.textContent.includes(message)) {
            notif.remove();
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
        background: type === 'error' ? 'var(--error-color, #e74c3c)' : type === 'success' ? 'var(--success-color, #27ae60)' : 'var(--primary-color, #2ecc71)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
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