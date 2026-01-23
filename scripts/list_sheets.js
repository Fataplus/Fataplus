const XLSX = require('xlsx');
const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide a file path.");
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    console.log("SHEETS:", workbook.SheetNames.join(', '));
} catch (error) {
    console.error("Error reading file:", error.message);
}
