/**
 * 🌾 API Recherche Cultures Madagascar
 * Endpoint pour recherche spécialisée dans les cultures
 */

import { defineEventHandler, getQuery } from 'h3'
import { madagascarCrops, madagascarClimate, agricultureCalendar } from '~/shared/data/madagascar-agriculture'

interface CropSearchResult {
  crop: string
  matches: {
    name: string
    varieties: string[]
    regions: string[]
    currentActivity: string
    marketValue: string
    exportPotential: boolean
    tips: string[]
  }[]
  recommendations: string[]
}

export default defineEventHandler(async (event): Promise<CropSearchResult> => {
  const query = getQuery(event)
  const searchTerm = (query.q as string || '').toLowerCase()
  const region = query.region as string
  
  if (!searchTerm) {
    return {
      crop: '',
      matches: [],
      recommendations: [
        "Recherchez par culture: riz, vanille, café, litchi...",
        "Filtrez par région: SAVA, Lac Alaotra, Côte Est...",
        "Demandez le calendrier du mois actuel"
      ]
    }
  }

  const matches: CropSearchResult['matches'] = []
  const recommendations: string[] = []

  // 🔍 Recherche dans les cultures
  Object.entries(madagascarCrops).forEach(([key, crop]) => {
    const isMatch = 
      crop.name.toLowerCase().includes(searchTerm) ||
      key.includes(searchTerm) ||
      crop.varietiesMg.some(v => v.toLowerCase().includes(searchTerm)) ||
      crop.regions.some(r => r.toLowerCase().includes(searchTerm))

    if (isMatch) {
      // 📅 Activité actuelle selon le calendrier
      const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long' })
      const monthData = agricultureCalendar[currentMonth as keyof typeof agricultureCalendar]
      const currentActivity = monthData?.activities.find(activity => 
        activity.toLowerCase().includes(key) || 
        activity.toLowerCase().includes(crop.name.toLowerCase().split(' ')[0])
      ) || "Entretien général"

      // 💡 Conseils spécialisés
      const tips = generateCropTips(key, crop, region)

      matches.push({
        name: crop.name,
        varieties: crop.varietiesMg,
        regions: region ? crop.regions.filter(r => r.toLowerCase().includes(region.toLowerCase())) : crop.regions,
        currentActivity,
        marketValue: crop.marketValue,
        exportPotential: crop.exportPotential,
        tips
      })
    }
  })

  // 🎯 Recommandations contextuelles
  if (matches.length > 0) {
    recommendations.push(
      `Consulter le calendrier complet pour ${matches[0].name}`,
      `Techniques spécialisées ${matches[0].name}`,
      `Marchés d'export pour ${matches[0].name}`
    )
  } else {
    recommendations.push(
      "Essayez: riz rouge, vanille bourbon, café arabica",
      "Recherchez par région: SAVA, Alaotra-Mangoro",
      "Consultez le calendrier agricole actuel"
    )
  }

  return {
    crop: searchTerm,
    matches,
    recommendations
  }
})

/**
 * 💡 Génération de conseils spécialisés par culture
 */
function generateCropTips(cropKey: string, crop: any, region?: string): string[] {
  const tips: string[] = []
  
  switch (cropKey) {
    case 'riz':
      tips.push(
        "🌾 Technique SRI recommandée au Lac Alaotra",
        "💧 Gestion eau critique en saison sèche",
        "🐛 Surveillance criquets octobre-décembre",
        "🌱 Variétés NERICA résistantes aux stress"
      )
      break
      
    case 'vanille':
      tips.push(
        "🌸 Pollinisation manuelle entre 8h-11h",
        "🌡️ Échaudage à 63°C pendant 2-3 minutes",
        "🏠 Séchage sous abri régions SAVA",
        "🔒 Sécurisation des plantations (vol)"
      )
      break
      
    case 'cafe':
      tips.push(
        "☕ Cueillette sélective cerises rouges",
        "💧 Traitement voie humide 24h fermentation",
        "🌬️ Séchage parche altitude >1000m",
        "🌱 Variétés résistantes rouille"
      )
      break
      
    case 'litchi':
      tips.push(
        "🌸 Floraison surveillée août-septembre",
        "✂️ Éclaircissage grappes recommandé",
        "📦 Récolte matinale pour fraîcheur",
        "🚛 Transport rapide <24h pour export"
      )
      break
      
    case 'clous_girofle':
      tips.push(
        "🌸 Récolte boutons roses avant ouverture",
        "☀️ Séchage soleil 4-5 jours",
        "📊 Tri par taille et qualité",
        "🏠 Conservation sacs jute lieu sec"
      )
      break
      
    default:
      tips.push(
        "📚 Consultez techniques traditionnelles",
        "🌍 Adaptez aux conditions locales",
        "👥 Échangez avec agriculteurs expérimentés"
      )
  }

  // 🌍 Conseils spécifiques à la région
  if (region) {
    if (region.toLowerCase().includes('sava')) {
      tips.push("🌀 Protection cyclones novembre-avril SAVA")
    } else if (region.toLowerCase().includes('alaotra')) {
      tips.push("💧 Gestion irrigation Lac Alaotra")
    } else if (region.toLowerCase().includes('côte')) {
      tips.push("🌊 Drainage important côte est")
    }
  }

  return tips
} 