const XLSX = require('xlsx');
const fs = require('fs');

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide a file path.");
    process.exit(1);
}

if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    console.log("Sheet Names:", sheetNames);

    sheetNames.forEach(sheetName => {
        console.log(`\n--- Sheet: ${sheetName} ---`);
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

        // Print execution summary
        console.log(`Total Rows: ${data.length}`);

        // Print first 10 rows to understand structure
        data.slice(0, 10).forEach((row, index) => {
            console.log(`Row ${index}:`, row);
        });
    });
} catch (error) {
    console.error("Error reading file:", error.message);
}
