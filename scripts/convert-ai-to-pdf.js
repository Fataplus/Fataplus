#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const puppeteer = require("puppeteer");

// Configuration
const AI_DOCS_DIR = path.join(__dirname, "../AI Instructions");
const OUTPUT_DIR = path.join(__dirname, "../public/ai-pdfs");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// CSS styles for PDF (reuse from legal script)
const CSS_STYLES = `
<style>
  @font-face {
    font-family: 'Fataplus';
    src: url('file://${path.join(__dirname, "../public/fonts/Fataplus-Book.ttf")}') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Fataplus';
    src: url('file://${path.join(__dirname, "../public/fonts/Fataplus-Medium.ttf")}') format('truetype');
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: 'Fataplus';
    src: url('file://${path.join(__dirname, "../public/fonts/Fataplus-SemiBold.ttf")}') format('truetype');
    font-weight: 600;
    font-style: normal;
  }
  @font-face {
    font-family: 'Fataplus';
    src: url('file://${path.join(__dirname, "../public/fonts/Fataplus-Bold.ttf")}') format('truetype');
    font-weight: 700;
    font-style: normal;
  }
  @font-face {
    font-family: 'Fataplus';
    src: url('file://${path.join(__dirname, "../public/fonts/Fataplus-Light.ttf")}') format('truetype');
    font-weight: 300;
    font-style: normal;
  }
  body {
    font-family: 'Fataplus', sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    background: white;
    font-weight: 400;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Fataplus', sans-serif;
    font-weight: 600;
  }
  h1 {
    color: #2E7D32;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 30px;
    text-align: center;
    border-bottom: 3px solid #4CAF50;
    padding-bottom: 15px;
  }
  h2 {
    color: #388E3C;
    font-size: 22px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
    border-left: 4px solid #4CAF50;
    padding-left: 15px;
  }
  h3 {
    color: #43A047;
    font-size: 18px;
    font-weight: 600;
    margin-top: 25px;
    margin-bottom: 10px;
  }
  h4, h5, h6 {
    color: #4CAF50;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  p {
    text-align: justify;
    margin-bottom: 15px;
  }
  ul, ol {
    margin-bottom: 15px;
    padding-left: 30px;
  }
  li {
    margin-bottom: 8px;
  }
  a {
    color: #4CAF50;
    text-decoration: underline;
  }
  .document-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    background: #f8fff8;
  }
  .document-title {
    font-family: 'Fataplus', sans-serif;
    font-size: 32px;
    color: #2E7D32;
    margin-bottom: 10px;
    font-weight: 700;
  }
  .document-subtitle {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
  }
  .update-date {
    font-size: 14px;
    color: #888;
    font-style: italic;
  }
  .footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    text-align: center;
    color: #666;
    font-size: 12px;
  }
  .contact-info {
    background: #f0f8f0;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    border-left: 4px solid #4CAF50;
  }
  .version-info {
    background: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    color: #666;
    font-size: 12px;
    margin-top: 30px;
  }
  @media print {
    body { margin: 0; }
    .page-break { page-break-before: always; }
  }
</style>
`;

// Function to clean and format markdown content
function formatMarkdownContent(content, filename) {
  // Remove markdown frontmatter if present
  content = content.replace(/^---[\s\S]*?---/, "").trim();

  // Use filename (without extension) as title
  const baseName = filename.replace(/\.md$/, "");
  const title = "AI Instruction: " + baseName.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const subtitle = "FATAPLUS - Plateforme Agricole Madagascar";

  // Extract update date if present
  const dateMatch = content.match(
    /(?:Dernière mise à jour|Date de mise à jour|Version).*?(\d{2}\/\d{2}\/\d{4})/i
  );
  const updateDate = dateMatch
    ? dateMatch[1]
    : new Date().toLocaleDateString("fr-FR");

  // Create header
  const header = `<div class="document-header">
    <div class="document-title">${title}</div>
    <div class="document-subtitle">${subtitle}</div>
    <div class="update-date">Dernière mise à jour : ${updateDate}</div>
  </div>`;

  // Add header to content
  content = header + "\n\n" + content;

  // Add footer
  const footer = `
  <div class="footer">
    <p><strong>FATAPLUS</strong> - Plateforme Agricole Numérique Madagascar</p>
    <p>Contact: contact@fata.plus | Web: https://fata.plus</p>
    <div class="version-info">
      Document généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}
    </div>
  </div>`;

  content = content + "\n\n" + footer;

  return content;
}

// Function to convert markdown to HTML
function markdownToHtml(markdownContent) {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
  });
  return marked.parse(markdownContent);
}

// Function to generate PDF from HTML
async function htmlToPdf(html, outputPath, filename) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set the HTML content
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FATAPLUS - ${filename}</title>
      ${CSS_STYLES}
    </head>
    <body>
      ${html}
    </body>
    </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: "A4",
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; color: #666; text-align: center; width: 100%; margin: 0 15mm;">
          <span>FATAPLUS - AI Instructions</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; color: #666; text-align: center; width: 100%; margin: 0 15mm;">
          <span>Page <span class="pageNumber"></span> sur <span class="totalPages"></span></span>
        </div>
      `,
    });

    console.log(`✅ PDF généré: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Erreur lors de la génération du PDF ${filename}:`, error);
  } finally {
    await browser.close();
  }
}

// Main function to process all AI instruction documents
async function convertAIDocsToPdf() {
  console.log("🚀 Conversion des instructions AI FATAPLUS en PDF...\n");

  try {
    // Get all markdown files in the AI instructions directory
    const files = fs
      .readdirSync(AI_DOCS_DIR)
      .filter((file) => file.endsWith(".md"));

    if (files.length === 0) {
      console.log("❌ Aucun fichier markdown trouvé dans", AI_DOCS_DIR);
      return;
    }

    console.log(`📁 Fichiers trouvés: ${files.length}`);
    files.forEach((file) => console.log(`   - ${file}`));
    console.log("");

    // Process each file
    for (const filename of files) {
      const inputPath = path.join(AI_DOCS_DIR, filename);
      const pdfFilename = filename.replace(".md", ".pdf");
      const outputPath = path.join(OUTPUT_DIR, pdfFilename);

      console.log(`📄 Traitement de: ${filename}`);

      try {
        // Read markdown content
        const markdownContent = fs.readFileSync(inputPath, "utf8");

        // Format content
        const formattedContent = formatMarkdownContent(
          markdownContent,
          filename
        );

        // Convert to HTML
        const htmlContent = markdownToHtml(formattedContent);

        // Generate PDF
        await htmlToPdf(htmlContent, outputPath, filename);
      } catch (error) {
        console.error(
          `❌ Erreur lors du traitement de ${filename}:`,
          error.message
        );
      }
    }

    console.log("\n✅ Conversion terminée!");
    console.log(`📂 PDFs disponibles dans: ${OUTPUT_DIR}`);

    // List generated PDFs
    const pdfFiles = fs
      .readdirSync(OUTPUT_DIR)
      .filter((file) => file.endsWith(".pdf"));
    if (pdfFiles.length > 0) {
      console.log("\n📑 PDFs générés:");
      pdfFiles.forEach((file) => {
        const filePath = path.join(OUTPUT_DIR, file);
        const stats = fs.statSync(filePath);
        const fileSize = (stats.size / 1024).toFixed(1);
        console.log(`   - ${file} (${fileSize} KB)`);
      });
    }
  } catch (error) {
    console.error("❌ Erreur générale:", error);
  }
}

// Run the conversion
if (require.main === module) {
  convertAIDocsToPdf().catch(console.error);
}

module.exports = { convertAIDocsToPdf };
