document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    // Search functionality
    const searchInput = document.getElementById('project-search');
    searchInput.addEventListener('input', (e) => {
        filterProjects(e.target.value);
    });
});

let allProjects = [];

async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        const data = await response.json();

        updateHeader(data.generated_at);
        updateFinance(data.finance);
        updateActivity(data.activity);

        allProjects = data.projects;
        renderProjects(allProjects);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('projects-grid').innerHTML = `
            <div class="error-message">
                Error loading dashboard data. Please run <code>python3 scan_system.py</code>
            </div>
        `;
    }
}

function updateHeader(dateStr) {
    const date = new Date(dateStr);
    document.getElementById('last-updated').textContent = `Last synced: ${date.toLocaleString()}`;
}

function formatMoney(amount, currency) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'MGA' }).format(amount);
}

function updateFinance(finance) {
    if (!finance) return;

    document.getElementById('finance-balance').textContent = formatMoney(finance.balance, finance.currency);
    document.getElementById('finance-income').textContent = '+' + formatMoney(finance.total_income, finance.currency);
    document.getElementById('finance-expenses').textContent = '-' + formatMoney(finance.total_expenses, finance.currency);
}

function updateActivity(activities) {
    const list = document.getElementById('activity-list');
    list.innerHTML = '';

    if (!activities || activities.length === 0) {
        list.innerHTML = '<li class="activity-item">No recent activity found</li>';
        return;
    }

    activities.forEach(item => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        // Simple cleanup of log lines if needed
        li.textContent = item;
        list.appendChild(li);
    });
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<div class="no-results">No projects found.</div>';
        return;
    }

    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const lastMod = new Date(p.last_modified * 1000).toLocaleDateString();

        const tagsHtml = p.tech && p.tech.length
            ? `<div class="tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
            : '';

        card.innerHTML = `
            <div>
                <div class="project-name">${p.name}</div>
                <div class="project-desc">${p.description || 'No description available.'}</div>
                ${tagsHtml}
            </div>
            <div class="project-meta">
                <span>${lastMod}</span>
                <span>${p.path}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filterProjects(query) {
    const lowerQ = query.toLowerCase();
    const filtered = allProjects.filter(p =>
        p.name.toLowerCase().includes(lowerQ) ||
        (p.description && p.description.toLowerCase().includes(lowerQ))
    );
    renderProjects(filtered);
}
