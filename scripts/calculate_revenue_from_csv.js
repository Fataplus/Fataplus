const fs = require('fs');
const path = require('path');

const csvPath = 'data/banking/unified_bank_data.csv';

if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`);
    process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

const quarters = {
    'T4_2023': { start: '2023-10-01', end: '2023-12-31', total: 0 },
    'T1_2024': { start: '2024-01-01', end: '2024-03-31', total: 0 },
    'T2_2024': { start: '2024-04-01', end: '2024-06-30', total: 0 },
    'T3_2024': { start: '2024-07-01', end: '2024-09-30', total: 0 },
    'T4_2024': { start: '2024-10-01', end: '2024-12-31', total: 0 },
};

// Helper to parse date DD/MM/YYYY to YYYY-MM-DD
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.trim().split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// Skip header
for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV split (assuming no commas in fields for now, or handle crudely)
    // The previous view_file showed no quotes, so commas separate fields.
    // Description field might clarify if it has commas. 
    // Let's assume standard split for now, but check index.
    // Columns: Date, Value Date, Description, Category, Debit, Credit, Balance, SourceFile
    // Index: 0, 1, 2, 3, 4, 5, 6, 7
    // If Description has commas, it will mess up indices 3-7.
    // Looking at the view_file:
    // "DB vente carte etrangere 277770 FT250025XM76\BNK CONTABO-COM" -> No commas.
    // "Transfer Wallet to Bank Mvola Wallet to Bank FT25020HRSJW\BNK" -> No commas.
    // "Prelevement automatic -DR DD INTERMEDIATARY ..." -> No commas.
    // It seems safe to split by comma for this specific file based on the sample.
    // However, to be safer, we can try to parse from the right side for numeric values.

    // Better strategy: Use regex or simple split and check column count.
    const parts = line.split(',');

    // If parts > 8, it means Description or Category had commas.
    // We know the last columns are: ..., Debit, Credit, Balance, SourceFile
    // So distinct columns from end:
    // SourceFile (last)
    // Balance (last - 1)
    // Credit (last - 2)
    // Debit (last - 3)
    // Category (last - 4)
    // Date is first (0)

    if (parts.length < 8) continue;

    const dateStr = parts[0];
    const creditStr = parts[parts.length - 3]; // Credit is 3rd from end

    const isoDate = parseDate(dateStr);
    if (!isoDate) continue;

    const credit = parseFloat(creditStr);
    if (isNaN(credit) || credit <= 0) continue;

    for (const [q, data] of Object.entries(quarters)) {
        if (isoDate >= data.start && isoDate <= data.end) {
            quarters[q].total += credit;
            break;
        }
    }
}

console.log("Quarterly Revenue Calculation:");
for (const [q, data] of Object.entries(quarters)) {
    console.log(`${q}: ${data.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
}
