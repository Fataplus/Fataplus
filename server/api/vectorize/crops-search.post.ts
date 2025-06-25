/**
 * 🚀 NuxtHub Vectorize - Advanced AutoRAG Search
 * Recherche vectorielle avancée pour l'agriculture Madagascar
 */

export default defineEventHandler(async (event) => {
  const { query, region, season } = await readBody(event)
  
  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Query parameter is required'
    })
  }

  try {
    // 🚀 Utilisation de Vectorize pour recherche vectorielle sémantique
    const vectorSearch = await hubVectorize().search({
      vector: await embedQuery(query),
      topK: 5,
      filter: {
        region: region || undefined,
        season: season || undefined
      }
    })

    // Fallback vers base de connaissances traditionnelle si pas de résultats vectoriels
    if (!vectorSearch.matches || vectorSearch.matches.length === 0) {
      const traditionalResults = await searchTraditionalKnowledge(query, region, season)
      
      return {
        success: true,
        searchType: "traditional",
        query,
        filters: { region, season },
        results: traditionalResults,
        vectorizeStatus: "fallback",
        recommendations: generateRecommendations(traditionalResults, query)
      }
    }

    // Traitement des résultats vectoriels
    const enrichedResults = vectorSearch.matches.map((match: any) => ({
      id: match.id,
      score: match.score,
      content: match.metadata.content,
      crop: match.metadata.crop,
      region: match.metadata.region,
      season: match.metadata.season,
      actionable: match.metadata.actionable || false,
      confidence: Math.round(match.score * 100)
    }))

    return {
      success: true,
      searchType: "vectorized",
      query,
      filters: { region, season },
      results: enrichedResults,
      vectorizeStatus: "active",
      performance: {
        vectorMatches: vectorSearch.matches.length,
        avgConfidence: Math.round(
          enrichedResults.reduce((sum, r) => sum + r.confidence, 0) / enrichedResults.length
        )
      },
      recommendations: generateSmartRecommendations(enrichedResults, query)
    }

  } catch (error) {
    console.error('Vectorize search error:', error)
    
    // Graceful fallback
    const fallbackResults = await searchTraditionalKnowledge(query, region, season)
    
    return {
      success: true,
      searchType: "fallback",
      query,
      error: "Vectorize temporarily unavailable",
      results: fallbackResults,
      vectorizeStatus: "error"
    }
  }
})

// Fonctions helper
async function embedQuery(query: string) {
  // Simulation d'embedding - en production, utiliser un modèle d'embedding réel
  return Array.from({ length: 384 }, () => Math.random() - 0.5)
}

async function searchTraditionalKnowledge(query: string, region?: string, season?: string) {
  // Import de notre base de connaissances traditionnelle
  const { crops, agricultureCalendar } = await import('~/shared/data/madagascar-agriculture')
  
  const results = []
  
  // Recherche dans les cultures
  for (const [cropName, cropData] of Object.entries(crops)) {
    if (cropData.name.toLowerCase().includes(query.toLowerCase()) ||
        cropData.description.toLowerCase().includes(query.toLowerCase())) {
      
      if (!region || cropData.regions.includes(region)) {
        results.push({
          type: 'crop',
          crop: cropName,
          content: cropData.description,
          region: cropData.regions.join(', '),
          confidence: 85
        })
      }
    }
  }
  
  return results.slice(0, 5)
}

function generateRecommendations(results: any[], query: string) {
  return [
    "💡 Conseil: Consultez votre assistant IA pour des conseils personnalisés",
    "📅 Vérifiez le calendrier agricole pour la période optimale",
    "🌱 Considérez les variétés locales adaptées à votre région"
  ]
}

function generateSmartRecommendations(results: any[], query: string) {
  const highConfidenceResults = results.filter(r => r.confidence > 80)
  const crops = [...new Set(results.map(r => r.crop))]
  
  const recommendations = []
  
  if (highConfidenceResults.length > 0) {
    recommendations.push(`🎯 ${highConfidenceResults.length} résultats très pertinents trouvés`)
  }
  
  if (crops.length > 1) {
    recommendations.push(`🌾 Cultures concernées: ${crops.join(', ')}`)
  }
  
  recommendations.push("🚀 Résultats alimentés par l'IA vectorielle NuxtHub")
  
  return recommendations
} 