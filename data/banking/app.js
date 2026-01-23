
// Basic format currency
const formatCurrency = (num) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(num);
};

// State
let transactions = []; // Loaded from data.js (window.bankData)
let filteredTransactions = [];

document.addEventListener('DOMContentLoaded', () => {
    if (window.bankData) {
        transactions = window.bankData;

        // Sort by Date Descending
        transactions.sort((a, b) => {
            // Date format dd/mm/yyyy
            const [d1, m1, y1] = a.Date.split('/');
            const [d2, m2, y2] = b.Date.split('/');
            return new Date(`${y2}-${m2}-${d2}`) - new Date(`${y1}-${m1}-${d1}`);
        }).reverse(); // Actually we want newest first? Yes.
        // Wait, default sort string date is bad.
        // Logic above produces ascending. Reverse for Descending.

        transactions.sort((a, b) => {
            const [d1, m1, y1] = a.Date.split('/');
            const [d2, m2, y2] = b.Date.split('/');
            return new Date(`${y2}-${m2}-${d2}`) - new Date(`${y1}-${m1}-${d1}`);
        }).reverse();

        filteredTransactions = [...transactions];

        initDashboard();
    } else {
        alert("No data found! Make sure data.js is generated.");
    }

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        filteredTransactions = transactions.filter(t =>
            t.Description.toLowerCase().includes(term) ||
            t.Category.toLowerCase().includes(term) ||
            t.Date.includes(term) ||
            (t.Debit && t.Debit.toString().includes(term)) ||
            (t.Credit && t.Credit.toString().includes(term))
        );
        renderTable();
    });
});

// Calendar State
let currentDate = new Date(); // Start with current actual date, or simpler, start with latest transaction date?
// Better to start with latest transaction date in data.
// But we'll init that in initDashboard()

function initDashboard() {
    calculateSummary();
    renderChart();
    renderIncomeChart();
    renderTable();

    // Init Calendar to the latest transaction month
    if (transactions.length > 0) {
        // transactions are sorted desc, so [0] is latest
        const [d, m, y] = transactions[0].Date.split('/');
        currentDate = new Date(`${y}-${m}-01`);
    } else {
        currentDate = new Date();
    }
    renderCalendar();

    // Listeners
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update Header
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendarMonthLabel').textContent = `${monthNames[month]} ${year}`;

    // Aggregate Data for this Month
    const dailyData = {};
    const monthStr = (month + 1).toString().padStart(2, '0');

    transactions.forEach(t => {
        const [d, m, y] = t.Date.split('/');
        if (parseInt(y) === year && parseInt(m) === (month + 1)) {
            const dayKey = parseInt(d);
            if (!dailyData[dayKey]) dailyData[dayKey] = { income: 0, expense: 0 };

            if (t.Credit) dailyData[dayKey].income += parseFloat(t.Credit);
            if (t.Debit) dailyData[dayKey].expense += parseFloat(t.Debit);
        }
    });

    const grid = document.getElementById('calendarGrid');
    // Clear old days (keep headers first 7 children)
    while (grid.children.length > 7) {
        grid.removeChild(grid.lastChild);
    }

    // Logic for days
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty slots before start
    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.className = 'calendar-day empty';
        grid.appendChild(el);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const el = document.createElement('div');
        el.className = 'calendar-day';

        const dayData = dailyData[d];
        let html = `<div class="day-number">${d}</div>`;

        if (dayData) {
            html += `<div class="day-summary">`;
            if (dayData.income > 0) html += `<div class="day-inc">+${formatMoneyShort(dayData.income)}</div>`;
            if (dayData.expense > 0) html += `<div class="day-exp">-${formatMoneyShort(dayData.expense)}</div>`;
            html += `</div>`;
        }

        el.innerHTML = html;
        grid.appendChild(el);
    }
}

function formatMoneyShort(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toFixed(0);
}


function calculateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.Credit) totalIncome += parseFloat(t.Credit);
        if (t.Debit) totalExpense += parseFloat(t.Debit);
    });

    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpense);

    const net = totalIncome - totalExpense;
    const netEl = document.getElementById('net-balance');
    netEl.textContent = formatCurrency(net);
    netEl.className = `value ${net >= 0 ? 'green' : 'red'}`;
}

function renderTable() {
    const tbody = document.getElementById('txTableBody');
    tbody.innerHTML = '';

    // Limit to 100 for perf? Or pagination. Let's do 100 for now or full.
    // Full might be slow if 1200 rows. Let's show first 200.

    filteredTransactions.slice(0, 500).forEach(t => {
        const tr = document.createElement('tr');

        let catStyle = '';
        if (t.Category === 'Riake') catStyle = 'color: #00e5ff;';
        if (t.Category === 'Mvola') catStyle = 'color: #ffeb3b;';
        if (t.Category === 'Refund') catStyle = 'color: #76ff03;';

        tr.innerHTML = `
            <td class="date-col">${t.Date}</td>
            <td style="${catStyle}">${t.Category}</td>
            <td>${t.Description}</td>
            <td class="${t.Debit ? 'amount-debit' : ''}">${t.Debit ? formatCurrency(t.Debit) : '-'}</td>
            <td class="${t.Credit ? 'amount-credit' : ''}">${t.Credit ? formatCurrency(t.Credit) : '-'}</td>
            <td>${formatCurrency(t.Balance)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderIncomeChart() {
    const categories = {};

    transactions.forEach(t => {
        if (t.Credit && t.Category) {
            if (!categories[t.Category]) categories[t.Category] = 0;
            categories[t.Category] += parseFloat(t.Credit);
        }
    });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    const ctx = document.getElementById('incomeChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#00e5ff', // Riake (Cyan)
                    '#ffeb3b', // Mvola (Yellow)
                    '#76ff03', // Refund (Green)
                    '#b388ff', // Transfer (Purple)
                    '#ff80ab', // Other (Pink)
                    '#90a4ae'  // Grey
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#ffffff' }
                },
                title: {
                    display: true,
                    text: 'Income Sources',
                    color: '#ffffff'
                }
            }
        }
    });
}

function renderChart() {
    // Group by Month
    const months = {};

    transactions.forEach(t => {
        const [d, m, y] = t.Date.split('/');
        const key = `${y}-${m}`; // YYYY-MM

        if (!months[key]) months[key] = { income: 0, expense: 0 };

        if (t.Credit) months[key].income += parseFloat(t.Credit);
        if (t.Debit) months[key].expense += parseFloat(t.Debit);
    });

    const sortedKeys = Object.keys(months).sort();

    const labels = sortedKeys;
    const incomeData = sortedKeys.map(k => months[k].income);
    const expenseData = sortedKeys.map(k => months[k].expense);

    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#00c853',
                    borderRadius: 4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: '#d50000',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#333333' },
                    ticks: { color: '#a0a0a0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a0a0' }
                }
            }
        }
    });
}
