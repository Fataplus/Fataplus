const XLSX = require('xlsx');
const fs = require('fs');

// NEW FILENAME
const filePath = "data/Zafy Tody KPI/ZAFY TODY-SUIVI INDICATEURS_15 STARTUPS COHORTE 1 -FATAPLUS.xlsx";
const sheetName = "Details-QIV25";

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

    const row = 16;

    // Apport Personnel
    console.log("Updating Apport Personnel...");
    setCell(row, 11, 1810000); // Feb 27
    setCell(row, 12, 1810000); // Apr 05
    setCell(row, 13, 1810000); // Oct 05
    setCell(row, 14, 3500000); // Jan 05 2026

    // Employment
    console.log("Updating Employment...");
    setCell(row, 15, 0); // Formel
    setCell(row, 16, 0); // Dont femmes (formel)
    setCell(row, 17, 4); // Informel
    setCell(row, 18, 1); // Dont femmes (informel)
    setCell(row, 19, 4); // Total
    setCell(row, 20, 1); // Dont femmes (total)

    // Revenue 2025
    console.log("Updating Revenue 2025...");
    setCell(row, 21, 15064028.59); // T4 2024
    setCell(row, 22, 6468702.19); // T1 2025
    setCell(row, 23, 5540252.32); // T2 2025
    setCell(row, 24, 9173544.33); // T3 2025
    setCell(row, 25, 6122302.36); // T4 2025

    XLSX.writeFile(workbook, filePath);
    console.log("Details-QIV25 Sheet updated successfully.");

} catch (error) {
    console.error("Error updating file:", error.message);
    process.exit(1);
}
