const XLSX = require('xlsx');
const fs = require('fs');

const filePath = process.argv[2];
const sheetName = process.argv[3];

if (!filePath || !sheetName) {
    console.error("Please provide a file path and sheet name.");
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    if (!workbook.Sheets[sheetName]) {
        console.error(`Sheet ${sheetName} not found.`);
        process.exit(1);
    }
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    console.log(`\n--- Sheet: ${sheetName} ---`);
    data.slice(0, 50).forEach((row, index) => {
        console.log(`Row ${index}:`, row);
    });
} catch (error) {
    console.error("Error reading file:", error.message);
}
