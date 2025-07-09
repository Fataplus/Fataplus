/*
/**
 * 🤖 AI Chat API with Madagascar Agriculture AutoRAG
 * Endpoint principal pour l'assistant agricole IA
 */

import { defineEventHandler, readBody } from "h3";
import {
  searchKnowledge,
  madagascarCrops,
  agricultureCalendar,
  commonProblems,
} from "~/shared/data/madagascar-agriculture";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

interface ChatResponse {
  response: string;
  sources: string[];
  confidence: number;
  suggestions: string[];
}

export default defineEventHandler(async (event): Promise<ChatResponse> => {
  try {
    const { message, history = [] }: ChatRequest = await readBody(event);

    // 🔍 AutoRAG: Recherche dans la base de connaissances
    const knowledgeResults = searchKnowledge(message);

    // 🧠 Construction du contexte enrichi
    const context = buildAgricultureContext(message, knowledgeResults);

    // 🤖 Utilisation de NuxtHub AI
    const aiResponse = await hubAI().run("@cf/meta/llama-2-7b-chat-fp16", {
      messages: [
        {
          role: "system",
          content: generateSystemPrompt(context),
        },
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    // 📊 Calcul de confiance basé sur les sources trouvées
    const confidence = calculateConfidence(knowledgeResults, message);

    // 💡 Génération de suggestions contextuelles
    const suggestions = generateSuggestions(message);

    return {
      response:
        aiResponse.response || "Désolé, je n'ai pas pu traiter votre demande.",
      sources: knowledgeResults.slice(0, 3),
      confidence,
      suggestions,
    };
  } catch (error) {
    console.error("AI Chat Error:", error);

    // Fallback avec réponses prédéfinies
    return {
      response:
        "Je rencontre des difficultés techniques. Voici quelques informations générales sur l'agriculture malgache...",
      sources: ["Base de connaissances locale"],
      confidence: 0.5,
      suggestions: [
        "Comment cultiver le riz à Madagascar ?",
        "Calendrier agricole pour la vanille",
        "Problèmes communs en agriculture",
      ],
    };
  }
});

/**
 * 🧠 Construction du contexte AutoRAG
 */
function buildAgricultureContext(
  query: string,
  searchResults: string[]
): string {
  const queryLower = query.toLowerCase();
  let context = "CONTEXTE AGRICOLE MADAGASCAR:\n\n";

  // Informations sur les cultures mentionnées
  Object.entries(madagascarCrops).forEach(([key, crop]) => {
    if (
      queryLower.includes(key) ||
      queryLower.includes(crop.name.toLowerCase())
    ) {
      context += `${crop.name}:\n`;
      context += `- Régions: ${crop.regions.join(", ")}\n`;
      context += `- Saisons: ${crop.seasons.join(", ")}\n`;
      context += `- Techniques: ${crop.techniques.join(", ")}\n`;
      context += `- Défis: ${crop.challenges.join(", ")}\n`;
      context += `- Valeur marché: ${crop.marketValue}\n\n`;
    }
  });

  // Calendrier agricole pertinent
  const currentMonth = new Date().toLocaleDateString("fr-FR", {
    month: "long",
  });
  const monthData =
    agricultureCalendar[currentMonth as keyof typeof agricultureCalendar];
  if (monthData) {
    context += `ACTIVITÉS ${currentMonth.toUpperCase()}:\n`;
    context += `${monthData.activities.join(", ")}\n`;
    context += `Régions concernées: ${monthData.regions.join(", ")}\n\n`;
  }

  // Résultats de recherche
  if (searchResults.length > 0) {
    context += "INFORMATIONS TROUVÉES:\n";
    searchResults.forEach((result) => {
      context += `- ${result}\n`;
    });
  }

  return context;
}

/**
 * 📋 Génération du prompt système
 */
function generateSystemPrompt(context: string): string {
  return `Tu es un expert en agriculture malgache, spécialisé dans les cultures locales comme le riz (vary), la vanille, le café, les clous de girofle et le litchi.

Tu dois répondre en français avec des termes malgaches appropriés quand c'est pertinent.

EXPERTISE:
- Cultures tropicales et techniques traditionnelles malgaches
- Calendrier agricole selon les régions (Hautes Terres, Côte Est, SAVA, etc.)
- Défis climatiques (cyclones, sécheresse, saisons)
- Variétés locales et techniques ancestrales
- Marchés d'export et transformation

STYLE DE RÉPONSE:
- Précis et pratique
- Utilisez des exemples concrets de Madagascar
- Mentionnez les régions spécifiques (Lac Alaotra, SAVA, etc.)
- Incluez les noms malgaches des cultures quand approprié
- Soyez empathique aux défis des agriculteurs malgaches

CONTEXTE ACTUEL:
${context}

Répondez de manière utile, précise et adaptée au contexte agricole malgache.`;
}

/**
 * 📊 Calcul de confiance
 */
function calculateConfidence(results: string[], query: string): number {
  if (results.length === 0) return 0.3;
  if (results.length >= 3) return 0.9;
  if (results.length >= 2) return 0.7;
  return 0.5;
}

/**
 * 💡 Génération de suggestions
 */
function generateSuggestions(query: string): string[] {
  const queryLower = query.toLowerCase();

  if (queryLower.includes("riz") || queryLower.includes("vary")) {
    return [
      "Techniques SRI pour le riz au Lac Alaotra",
      "Variétés de riz résistantes aux cyclones",
      "Calendrier du vary aloha et vary vakiamindro",
    ];
  }

  if (queryLower.includes("vanille") || queryLower.includes("vanilka")) {
    return [
      "Pollinisation manuelle de la vanille",
      "Échaudage et séchage vanille SAVA",
      "Prévention vol gousses vertes",
    ];
  }

  if (queryLower.includes("café") || queryLower.includes("kafe")) {
    return [
      "Traitement café voie humide Madagascar",
      "Variétés arabica Hautes Terres",
      "Accès marchés équitables café",
    ];
  }

  // Suggestions générales
  return [
    "Calendrier agricole par région",
    "Cultures d'exportation Madagascar",
    "Adaptation changement climatique",
  ];
}
