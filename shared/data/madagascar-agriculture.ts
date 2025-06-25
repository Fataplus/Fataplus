/**
 * 🇲🇬 Madagascar Agriculture Knowledge Base for AutoRAG
 * Base de connaissances agricoles spécialisée pour Madagascar
 */

export interface CropInfo {
  name: string
  varietiesMg: string[]
  regions: string[]
  seasons: string[]
  techniques: string[]
  challenges: string[]
  marketValue: 'Élevé' | 'Moyen' | 'Faible'
  exportPotential: boolean
}

export interface ClimateInfo {
  region: string
  characteristics: string[]
  seasons: {
    name: string
    months: string
    description: string
  }[]
  risks: string[]
}

export const madagascarCrops: Record<string, CropInfo> = {
  riz: {
    name: "Riz (Vary)",
    varietiesMg: [
      "Riz Rouge de Lac Alaotra",
      "Makalioka", 
      "Rojofotsy",
      "X-Jigna",
      "FOFIFA 154",
      "NERICA"
    ],
    regions: [
      "Lac Alaotra (Alaotra-Mangoro)",
      "Hautes Terres Centrales",
      "Delta du Betsiboka",
      "Plaine de Marovoay"
    ],
    seasons: [
      "Vary aloha (Octobre - Mars)",
      "Vary vakiamindro (Avril - Septembre)"
    ],
    techniques: [
      "SRI (System of Rice Intensification)",
      "Tavy traditionnel",
      "Irrigation gravitaire",
      "Repiquage en ligne"
    ],
    challenges: [
      "Cyclones période novembre-avril",
      "Maladies fongiques",
      "Criquets migrateurs",
      "Accès aux semences améliorées"
    ],
    marketValue: "Élevé",
    exportPotential: true
  },

  vanille: {
    name: "Vanille (Vanilka)",
    varietiesMg: [
      "Vanilla planifolia",
      "Vanille Bourbon",
      "Vanille fine"
    ],
    regions: [
      "SAVA (Sambava, Vohémar, Andapa, Antalaha)",
      "Côte Nord-Est",
      "Maroantsetra"
    ],
    seasons: [
      "Floraison: Septembre-Novembre",
      "Pollinisation: Octobre-Décembre", 
      "Récolte: Juin-Août"
    ],
    techniques: [
      "Pollinisation manuelle",
      "Échaudage (60°C)",
      "Séchage traditionnel",
      "Affinage 6-8 mois"
    ],
    challenges: [
      "Vol de gousses vertes",
      "Cyclones fréquents",
      "Fluctuations prix international",
      "Qualité post-récolte"
    ],
    marketValue: "Élevé",
    exportPotential: true
  },

  clous_girofle: {
    name: "Clous de Girofle (Jirofo)",
    varietiesMg: [
      "Syzygium aromaticum traditionnel"
    ],
    regions: [
      "Île Sainte-Marie",
      "Côte Est",
      "Fénérive-Est",
      "Maroantsetra"
    ],
    seasons: [
      "Récolte principale: Octobre-Décembre",
      "Petite récolte: Avril-Mai"
    ],
    techniques: [
      "Cueillette manuelle des boutons",
      "Séchage au soleil",
      "Tri par qualité",
      "Conservation en sacs jute"
    ],
    challenges: [
      "Arbres vieillissants",
      "Concurrence Indonésie",
      "Séchage en saison pluies",
      "Transport difficile"
    ],
    marketValue: "Moyen",
    exportPotential: true
  },

  cafe: {
    name: "Café (Kafe)",
    varietiesMg: [
      "Arabica des Hautes Terres",
      "Robusta côtier"
    ],
    regions: [
      "Antalaha",
      "Sambava", 
      "Hautes Terres Centrales",
      "Fianarantsoa"
    ],
    seasons: [
      "Floraison: Octobre-Novembre",
      "Récolte: Avril-Septembre"
    ],
    techniques: [
      "Cueillette sélective",
      "Traitement voie humide",
      "Séchage parche",
      "Décorticage"
    ],
    challenges: [
      "Maladies (rouille)",
      "Vieillissement plantations",
      "Accès marchés équitables",
      "Transformation locale"
    ],
    marketValue: "Moyen",
    exportPotential: true
  },

  litchi: {
    name: "Litchi (Letchi)",
    varietiesMg: [
      "Kwaï May Pink",
      "Mauritius",
      "Variétés locales"
    ],
    regions: [
      "Tamatave (Toamasina)",
      "Fénérive-Est",
      "Mananjary",
      "Côte Est"
    ],
    seasons: [
      "Floraison: Août-Septembre",
      "Récolte: Novembre-Janvier"
    ],
    techniques: [
      "Greffage sur porte-greffe local",
      "Taille de formation",
      "Récolte échelonnée",
      "Conditionnement export"
    ],
    challenges: [
      "Courte saison",
      "Transport rapide requis",
      "Concurrence Maurice/Réunion",
      "Normes phytosanitaires export"
    ],
    marketValue: "Élevé",
    exportPotential: true
  }
}

export const madagascarClimate: ClimateInfo[] = [
  {
    region: "Hautes Terres Centrales",
    characteristics: [
      "Altitude 1200-1500m",
      "Climat tempéré tropical",
      "Sols ferrallitiques rouges",
      "Température 15-25°C"
    ],
    seasons: [
      {
        name: "Saison sèche",
        months: "Mai - Octobre",
        description: "Période fraîche et sèche, idéale pour la récolte"
      },
      {
        name: "Saison des pluies", 
        months: "Novembre - Avril",
        description: "Période chaude et humide, saison de croissance"
      }
    ],
    risks: [
      "Gel occasionnel juin-août",
      "Grêle en saison chaude",
      "Sécheresse prolongée"
    ]
  },
  {
    region: "Côte Est",
    characteristics: [
      "Climat tropical humide",
      "Pluviométrie 2000-3000mm/an",
      "Sols alluviaux fertiles",
      "Température 20-30°C"
    ],
    seasons: [
      {
        name: "Saison cyclonique",
        months: "Novembre - Avril", 
        description: "Forte pluviométrie, risque cyclons"
      },
      {
        name: "Saison sèche relative",
        months: "Mai - Octobre",
        description: "Moins de pluies mais toujours humide"
      }
    ],
    risks: [
      "Cyclones tropicaux",
      "Inondations",
      "Maladies cryptogamiques"
    ]
  },
  {
    region: "Sud Aride",
    characteristics: [
      "Climat semi-aride",
      "Pluviométrie 300-600mm/an",
      "Sols calcaires", 
      "Température 18-35°C"
    ],
    seasons: [
      {
        name: "Saison sèche",
        months: "Avril - Novembre",
        description: "Période très sèche, irrigation nécessaire"
      },
      {
        name: "Saison des pluies",
        months: "Décembre - Mars",
        description: "Courte période pluvieuse irrégulière"
      }
    ],
    risks: [
      "Sécheresse chronique",
      "Vents desséchants",
      "Invasion acridienne"
    ]
  }
]

export const agricultureCalendar = {
  "Janvier": {
    activities: [
      "Récolte litchi",
      "Préparation rizières pour vary aloha",
      "Surveillance cyclones"
    ],
    regions: ["Côte Est", "Hautes Terres"]
  },
  "Février": {
    activities: [
      "Plantation riz vary aloha",
      "Entretien vanille",
      "Protection contre cyclones"
    ],
    regions: ["Toutes régions"]
  },
  "Mars": {
    activities: [
      "Repiquage riz",
      "Taille caféiers",
      "Fin récolte litchi"
    ],
    regions: ["Lac Alaotra", "Côte Est"]
  },
  "Avril": {
    activities: [
      "Début récolte café",
      "Plantation vary vakiamindro",
      "Pollinisation vanille"
    ],
    regions: ["SAVA", "Hautes Terres"]
  },
  "Mai": {
    activities: [
      "Récolte café",
      "Sarclage riz",
      "Séchage clous de girofle"
    ],
    regions: ["Antalaha", "Alaotra"]
  },
  "Juin": {
    activities: [
      "Début récolte vanille",
      "Préparation terres riz saison sèche",
      "Traitement post-récolte café"
    ],
    regions: ["SAVA", "Toutes régions"]
  },
  "Juillet": {
    activities: [
      "Récolte vanille continue",
      "Échaudage vanille",
      "Plantation cultures vivrières"
    ],
    regions: ["SAVA", "Hautes Terres"]
  },
  "Août": {
    activities: [
      "Fin récolte vanille",
      "Floraison litchi",
      "Séchage vanille"
    ],
    regions: ["SAVA", "Côte Est"]
  },
  "Septembre": {
    activities: [
      "Affinage vanille",
      "Récolte riz vary vakiamindro",
      "Préparation campagne vary aloha"
    ],
    regions: ["SAVA", "Alaotra"]
  },
  "Octobre": {
    activities: [
      "Pollinisation vanille nouvelle saison",
      "Semis riz vary aloha",
      "Récolte clous de girofle"
    ],
    regions: ["SAVA", "Lac Alaotra", "Sainte-Marie"]
  },
  "Novembre": {
    activities: [
      "Repiquage riz vary aloha",
      "Floraison vanille",
      "Début récolte litchi précoce"
    ],
    regions: ["Toutes régions"]
  },
  "Décembre": {
    activities: [
      "Entretien rizières",
      "Pollinisation vanille",
      "Récolte clous de girofle"
    ],
    regions: ["Toutes régions"]
  }
}

export const commonProblems = {
  "Maladies du riz": {
    pyriculariose: {
      symptomes: "Taches brunes sur feuilles et panicules",
      traitement: "Variétés résistantes, rotation cultures",
      prevention: "Éviter excès azote, drainage correct"
    },
    helminthosporiose: {
      symptomes: "Taches ovales brunes bordées jaune",
      traitement: "Fongicides cupriques, variétés tolérantes", 
      prevention: "Rotation, destruction résidus"
    }
  },
  "Ravageurs vanille": {
    punaises: {
      symptomes: "Piqûres sur gousses, dessèchement",
      traitement: "Ramassage manuel, pièges",
      prevention: "Nettoyage tuteurs, désherbage"
    },
    pourriture_noire: {
      symptomes: "Noircissement gousses immatures",
      traitement: "Élimination gousses atteintes",
      prevention: "Drainage, aération, éviter blessures"
    }
  },
  "Problèmes généraux": {
    sécheresse: {
      symptomes: "Flétrissement, jaunissement feuilles",
      traitement: "Irrigation d'appoint, paillage",
      prevention: "Mulching, cultures associées, rétention eau"
    },
    cyclones: {
      symptomes: "Casse, déracinage, inondation",
      traitement: "Élagage, drainage, replantation",
      prevention: "Variétés résistantes, brise-vents"
    }
  }
}

/**
 * Fonction pour rechercher dans la base de connaissances
 */
export function searchKnowledge(query: string): string[] {
  const results: string[] = []
  const searchTerm = query.toLowerCase()

  // Recherche dans les cultures
  Object.entries(madagascarCrops).forEach(([key, crop]) => {
    if (
      crop.name.toLowerCase().includes(searchTerm) ||
      crop.varietiesMg.some(v => v.toLowerCase().includes(searchTerm)) ||
      crop.regions.some(r => r.toLowerCase().includes(searchTerm))
    ) {
      results.push(`Culture: ${crop.name} - Régions: ${crop.regions.join(', ')}`)
    }
  })

  // Recherche dans le calendrier
  Object.entries(agricultureCalendar).forEach(([month, data]) => {
    if (data.activities.some(a => a.toLowerCase().includes(searchTerm))) {
      results.push(`${month}: ${data.activities.join(', ')}`)
    }
  })

  return results
} 