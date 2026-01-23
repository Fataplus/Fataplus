const XLSX = require('xlsx');
const fs = require('fs');

// NEW FILENAME
const filePath = "data/Zafy Tody KPI/ZAFY TODY-SUIVI INDICATEURS_15 STARTUPS COHORTE 1 -FATAPLUS.xlsx";
const sheetName = "FATAPLUS";

if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
}

try {
    const workbook = XLSX.readFile(filePath);
    if (!workbook.Sheets[sheetName]) {
        console.error(`Sheet ${sheetName} not found.`);
        process.exit(1);
    }
    const sheet = workbook.Sheets[sheetName];

    const setCell = (row, col, value) => {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!sheet[cellRef]) {
            sheet[cellRef] = { t: 'n', v: value };
        } else {
            sheet[cellRef].v = value;
            sheet[cellRef].t = 'n';
        }
    };

    // Actuals from Banking Data
    // T4 2023 (Row 2, Index 2 / Col C)
    console.log("Updating T4 2023 -> 7,995,000");
    setCell(2, 2, 7995000);

    // T1 2024 (Row 12, Index 2 / Col C)
    console.log("Updating T1 2024 -> 10,026,581");
    setCell(12, 2, 10026581);

    // T2 2024 (Row 22, Index 2 / Col C)
    console.log("Updating T2 2024 -> 3,806,000");
    setCell(22, 2, 3806000);

    // T3 2024 (Row 32, Index 2 / Col C)
    console.log("Updating T3 2024 -> 2,620,000");
    setCell(32, 2, 2620000);

    // T4 2024 (Row 42, Index 2 / Col C)
    console.log("Updating T4 2024 -> 15,064,028.59");
    setCell(42, 2, 15064028.59);

    XLSX.writeFile(workbook, filePath);
    console.log("FATAPLUS Sheet updated successfully.");

} catch (error) {
    console.error("Error updating file:", error.message);
    process.exit(1);
}
