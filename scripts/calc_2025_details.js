const fs = require('fs');

const csvPath = 'data/banking/unified_bank_data.csv';

if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

const quarters = {
    'T4_2024': { start: '2024-10-01', end: '2024-12-31', total: 0 },
    'T1_2025': { start: '2025-01-01', end: '2025-03-31', total: 0 },
    'T2_2025': { start: '2025-04-01', end: '2025-06-30', total: 0 },
    'T3_2025': { start: '2025-07-01', end: '2025-09-30', total: 0 },
    'T4_2025': { start: '2025-10-01', end: '2025-12-31', total: 0 },
};

let personalContribution = 0;
// Dates for personal contribution cumulative checks (approximate)
// 27 Feb 2025, 05 April 2025, 05 Oct 2025, 05 Jan 2026
const contributionDates = {
    'Feb_2025': { date: '2025-02-27', total: 0 },
    'Apr_2025': { date: '2025-04-05', total: 0 },
    'Oct_2025': { date: '2025-10-05', total: 0 },
    'Jan_2026': { date: '2026-01-05', total: 0 }
};

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.trim().split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 8) continue;

    const dateStr = parts[0];
    const desc = parts.slice(2, parts.length - 5).join(','); // Reconstruct desc if commas exist
    const creditStr = parts[parts.length - 3];
    const category = parts[parts.length - 4]; // Category is 4th from end in unified csv

    const isoDate = parseDate(dateStr);
    if (!isoDate) continue;

    const credit = parseFloat(creditStr);

    // Revenue Calculation
    if (!isNaN(credit) && credit > 0) {
        // Exclude internal transfers or personal deposits from Revenue if possible?
        // Usually Revenue = Sales. Personal deposits = Apport.
        // Categories in CSV might help.
        // Assuming "Card Payment" is expense (Debit).
        // Revenue comes from "Transfer", "Other Income", etc. which are Credit.

        let isRevenue = true;
        // Check if it's personal contribution
        const isPersonal = desc.toLowerCase().includes('lui meme') ||
            desc.toLowerCase().includes('fen') || // Fenohery
            desc.toLowerCase().includes('apport');

        if (isPersonal) {
            isRevenue = false;
            // Add to personal contribution buckets
            if (isoDate <= '2026-01-05') {
                // It's cumulative, so we add to all future buckets?
                // Or just calculate total up to that date.
            }
        }

        if (isRevenue) {
            for (const [q, data] of Object.entries(quarters)) {
                if (isoDate >= data.start && isoDate <= data.end) {
                    quarters[q].total += credit;
                    break;
                }
            }
        }
    }
}

// Re-scan for Personal Contributions specifically to calculate cumulative totals
let runningContribution = 0;
// Need to sort lines by date to get correct cumulative?
// current parsing order is file order. CSV seems not perfectly sorted by date (mixed files).
// Better to collect all contributions first, sort them, then sum.

const contributions = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length < 8) continue;
    const dateStr = parts[0];
    const desc = parts.slice(2, parts.length - 5).join(',');
    const creditStr = parts[parts.length - 3];
    const credit = parseFloat(creditStr);

    if (!isNaN(credit) && credit > 0) {
        if (desc.toLowerCase().includes('lui meme') ||
            desc.toLowerCase().includes('fen') ||
            desc.toLowerCase().includes('apport')) {
            const isoDate = parseDate(dateStr);
            contributions.push({ date: isoDate, amount: credit, desc });
        }
    }
}

contributions.sort((a, b) => a.date.localeCompare(b.date));

// Calculate cumulative
for (const c of contributions) {
    runningContribution += c.amount;
    for (const [key, data] of Object.entries(contributionDates)) {
        if (c.date <= data.date) {
            contributionDates[key].total = runningContribution;
            // This logic is flawed. It overwrites. 
            // We want the total AT that date. 
            // So if current contrib date is <= target, it contributes to that target's total.
        }
    }
}

// Correct cumulative logic:
for (const [key, data] of Object.entries(contributionDates)) {
    let sum = 0;
    for (const c of contributions) {
        if (c.date <= data.date) {
            sum += c.amount;
        }
    }
    contributionDates[key].total = sum;
}

console.log("Revenue 2025:");
for (const [q, data] of Object.entries(quarters)) {
    console.log(`${q}: ${data.total}`);
}

console.log("Personal Contributions:");
for (const [key, data] of Object.entries(contributionDates)) {
    console.log(`${key}: ${data.total}`);
}
