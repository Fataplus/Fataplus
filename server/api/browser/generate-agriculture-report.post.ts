/**
 * 🚀 NuxtHub Browser Automation - Génération PDF Rapports Agricoles
 * Génère automatiquement des PDFs de rapports avec Puppeteer sur Cloudflare
 */

export default defineEventHandler(async (event) => {
  const { farmerName, region, crops, period } = await readBody(event)
  
  if (!farmerName || !region) {
    throw createError({
      statusCode: 400,
      statusMessage: 'farmerName and region are required'
    })
  }

  try {
    // 🚀 Utilisation de NuxtHub Browser pour automation
    const browser = hubBrowser()
    
    // Génération du contenu HTML du rapport
    const reportHTML = generateReportHTML({
      farmerName,
      region,
      crops: crops || [],
      period: period || 'Décembre 2024',
      generatedAt: new Date().toLocaleDateString('fr-FR')
    })
    
    // Création du PDF avec le browser automation
    const pdfBuffer = await browser.pdf({
      html: reportHTML,
      options: {
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
            Rapport Agricole Fataplus - ${region}
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
            Page <span class="pageNumber"></span> sur <span class="totalPages"></span>
          </div>
        `
      }
    })
    
    // Stockage du PDF dans R2 Blob Storage
    const fileName = `rapport-agricole-${farmerName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
    const pdfUrl = await hubBlob().put(fileName, pdfBuffer, {
      contentType: 'application/pdf'
    })
    
    return {
      success: true,
      message: "Rapport PDF généré avec succès",
      report: {
        fileName,
        downloadUrl: pdfUrl,
        farmerName,
        region,
        period,
        size: `${Math.round(pdfBuffer.length / 1024)} KB`,
        generatedAt: new Date().toISOString()
      },
      browserAutomation: {
        status: "success",
        engine: "Puppeteer on Cloudflare",
        processingTime: "~2-3 secondes"
      }
    }

  } catch (error) {
    console.error('Browser automation error:', error)
    
    // Fallback: génération simple sans PDF
    return {
      success: false,
      error: "Browser automation temporarily unavailable",
      fallback: {
        message: "Génération PDF temporairement indisponible",
        reportData: {
          farmerName,
          region,
          crops,
          period,
          textFormat: generateSimpleReport({ farmerName, region, crops, period })
        }
      }
    }
  }
})

function generateReportHTML(data: any) {
  const { farmerName, region, crops, period, generatedAt } = data
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport Agricole - ${farmerName}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #00DC82;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #00DC82;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 25px;
          padding: 15px;
          border-left: 4px solid #00DC82;
          background: #f8f9fa;
        }
        .crop-item {
          background: white;
          padding: 10px;
          margin: 8px 0;
          border-radius: 5px;
          border: 1px solid #e0e0e0;
        }
        .recommendations {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 5px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌱 FATAPLUS</div>
        <h1>Rapport Agricole Personnalisé</h1>
        <p><strong>${farmerName}</strong> - ${region}</p>
        <p>Période: ${period}</p>
      </div>

      <div class="section">
        <h2>📊 Informations Générales</h2>
        <p><strong>Agriculteur:</strong> ${farmerName}</p>
        <p><strong>Région:</strong> ${region}</p>
        <p><strong>Période d'analyse:</strong> ${period}</p>
        <p><strong>Date de génération:</strong> ${generatedAt}</p>
      </div>

      <div class="section">
        <h2>🌾 Cultures Analysées</h2>
        ${crops.length > 0 ? 
          crops.map((crop: string) => `
            <div class="crop-item">
              <strong>${crop}</strong>
              <p>Culture adaptée à la région ${region}. Recommandations saisonnières disponibles via l'Assistant IA.</p>
            </div>
          `).join('') :
          '<p>Aucune culture spécifiée. Consultez l\'Assistant IA pour des recommandations personnalisées.</p>'
        }
      </div>

      <div class="section">
        <h2>💡 Recommandations AI</h2>
        <div class="recommendations">
          <h3>Conseils pour ${region}:</h3>
          <ul>
            <li>🌱 Privilégiez les variétés locales adaptées au climat</li>
            <li>📅 Consultez le calendrier agricole pour les bonnes pratiques saisonnières</li>
            <li>💧 Optimisez l'irrigation en fonction des prévisions météo</li>
            <li>🤖 Utilisez l'Assistant IA pour des conseils temps réel</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>📞 Contact & Support</h2>
        <p><strong>Support Technique:</strong> Disponible 24/7 via l'Assistant IA</p>
        <p><strong>Communauté:</strong> Rejoignez la communauté Fataplus pour échanger avec d'autres agriculteurs</p>
        <p><strong>Formation:</strong> Modules d'apprentissage disponibles sur la plateforme</p>
      </div>

      <div class="footer">
        <p>Rapport généré automatiquement par Fataplus AI Platform</p>
        <p>Powered by NuxtHub Browser Automation & Cloudflare</p>
      </div>
    </body>
    </html>
  `
}

function generateSimpleReport(data: any) {
  const { farmerName, region, crops, period } = data
  
  return `
RAPPORT AGRICOLE FATAPLUS
========================

Agriculteur: ${farmerName}
Région: ${region}
Période: ${period}
Généré le: ${new Date().toLocaleDateString('fr-FR')}

CULTURES ANALYSÉES:
${crops.length > 0 ? crops.map((crop: string) => `- ${crop}`).join('\n') : '- Aucune culture spécifiée'}

RECOMMANDATIONS:
- Consultez l'Assistant IA pour des conseils personnalisés
- Vérifiez le calendrier agricole saisonnier
- Rejoignez la communauté pour échanger avec d'autres agriculteurs

Contact: Assistant IA disponible 24/7 sur la plateforme Fataplus
  `
} 