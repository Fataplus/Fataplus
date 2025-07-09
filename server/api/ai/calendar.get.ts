/*
/**
 * 📅 API Calendrier Agricole Madagascar
 * Endpoint pour informations calendrier par mois/région
 */

import { defineEventHandler, getQuery } from "h3";
import {
  agricultureCalendar,
  madagascarCrops,
  madagascarClimate,
} from "~/shared/data/madagascar-agriculture";

interface CalendarResponse {
  currentMonth: string;
  currentActivities: string[];
  currentRegions: string[];
  monthlyCalendar: typeof agricultureCalendar;
  climateInfo: {
    season: string;
    risks: string[];
    recommendations: string[];
  };
  urgentTasks: string[];
}

export default defineEventHandler(async (event): Promise<CalendarResponse> => {
  const query = getQuery(event);
  const requestedMonth = query.month as string;
  const region = query.region as string;

  // 📅 Mois actuel ou demandé
  const now = new Date();
  const currentMonthName =
    requestedMonth || now.toLocaleDateString("fr-FR", { month: "long" });
  const currentMonth =
    currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  // 📊 Données du mois
  const monthData =
    agricultureCalendar[currentMonth as keyof typeof agricultureCalendar];

  if (!monthData) {
    return {
      currentMonth,
      currentActivities: [],
      currentRegions: [],
      monthlyCalendar: agricultureCalendar,
      climateInfo: {
        season: "Information non disponible",
        risks: [],
        recommendations: [],
      },
      urgentTasks: [],
    };
  }

  // 🌍 Filtrage par région si spécifiée
  let filteredActivities = monthData.activities;
  let filteredRegions = monthData.regions;

  if (region) {
    const regionLower = region.toLowerCase();
    filteredRegions = monthData.regions.filter((r) =>
      r.toLowerCase().includes(regionLower)
    );

    // Activités pertinentes pour la région
    filteredActivities = monthData.activities.filter((activity) => {
      if (
        regionLower.includes("sava") &&
        (activity.includes("vanille") || activity.includes("café"))
      )
        return true;
      if (regionLower.includes("alaotra") && activity.includes("riz"))
        return true;
      if (
        regionLower.includes("côte") &&
        (activity.includes("litchi") || activity.includes("girofle"))
      )
        return true;
      return true; // Activités générales
    });
  }

  // 🌤️ Informations climatiques
  const climateInfo = getClimateInfo(currentMonth, region);

  // ⚠️ Tâches urgentes du mois
  const urgentTasks = getUrgentTasks(currentMonth, now.getDate());

  return {
    currentMonth,
    currentActivities: filteredActivities,
    currentRegions: filteredRegions,
    monthlyCalendar: agricultureCalendar,
    climateInfo,
    urgentTasks,
  };
});

/**
 * 🌤️ Informations climatiques par mois et région
 */
function getClimateInfo(
  month: string,
  region?: string
): CalendarResponse["climateInfo"] {
  const monthNum = new Date(`${month} 1, 2024`).getMonth() + 1;

  // Saisons générales Madagascar
  let season = "Saison sèche";
  let risks: string[] = [];
  let recommendations: string[] = [];

  if (monthNum >= 11 || monthNum <= 4) {
    season = "Saison des pluies / Saison cyclonique";
    risks = [
      "🌀 Cyclones tropicaux",
      "🌧️ Fortes précipitations",
      "⚡ Orages violents",
      "🌊 Inondations possibles",
    ];
    recommendations = [
      "Surveillance météo quotidienne",
      "Protection des cultures sensibles",
      "Drainage des parcelles",
      "Stock de matériel d'urgence",
    ];
  } else {
    season = "Saison sèche";
    risks = [
      "🏜️ Stress hydrique",
      "🌬️ Vents desséchants",
      "🔥 Risque incendies brousse",
      "🌡️ Variations température",
    ];
    recommendations = [
      "Irrigation programmée",
      "Paillage conservation eau",
      "Protection contre vents",
      "Surveillance sanitaire accrue",
    ];
  }

  // Spécificités régionales
  if (region) {
    const regionLower = region.toLowerCase();

    if (regionLower.includes("sava")) {
      if (season.includes("pluies")) {
        risks.push("💨 Vents forts côte est");
        recommendations.push("Protection vanille contre vents");
      }
    } else if (regionLower.includes("alaotra")) {
      if (season.includes("sèche")) {
        recommendations.push("Gestion niveaux eau lac");
      }
    } else if (regionLower.includes("sud")) {
      risks.push("🏜️ Aridité extrême sud");
      recommendations.push("Conservation maximale eau");
    }
  }

  return { season, risks, recommendations };
}

/**
 * ⚠️ Tâches urgentes selon la date
 */
function getUrgentTasks(month: string, day: number): string[] {
  const tasks: string[] = [];

  switch (month.toLowerCase()) {
    case "janvier":
      if (day <= 15) {
        tasks.push(
          "🚨 Surveillance cyclones en cours",
          "🥭 Récolte litchi à terminer",
          "🌾 Préparation urgente rizières"
        );
      }
      break;

    case "février":
      tasks.push(
        "🌱 Plantation riz vary aloha critique",
        "🌀 Protection cyclones maximale",
        "🌿 Entretien vanille urgent"
      );
      break;

    case "juin":
      if (day >= 15) {
        tasks.push(
          "🌸 Début récolte vanille imminent",
          "🌡️ Préparation équipement échaudage",
          "🏠 Vérification infrastructure séchage"
        );
      }
      break;

    case "octobre":
      tasks.push(
        "🌸 Pollinisation vanille urgente",
        "🌾 Semis riz vary aloha à débuter",
        "🌸 Récolte clous girofle"
      );
      break;

    case "novembre":
      tasks.push(
        "🌱 Repiquage riz critical timing",
        "🌀 Préparation saison cyclonique",
        "🌸 Surveillance floraison vanille"
      );
      break;

    default:
      tasks.push("📋 Consultez calendrier détaillé");
  }

  return tasks;
}
