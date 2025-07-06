<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center justify-center p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
        >
          <i class="ri-bar-chart-box-line mr-2"></i>
          <span class="font-medium">Tableau de Bord d'Impact</span>
        </div>

        <h1
          class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          Notre Impact
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"
          >
            en Temps Réel
          </span>
        </h1>

        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200"
        >
          Suivez l'évolution de notre impact depuis les débuts de FANAJARIANA
          TANY jusqu'à aujourd'hui avec Fataplus
        </p>
      </div>

      <!-- Then & Now Comparison Section -->
      <div class="mb-16">
        <div class="bg-white rounded-lg shadow-xl p-8 dark:bg-gray-800">
          <h2
            class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
          >
            <i class="ri-time-line text-green-600 mr-2"></i>
            Alors & Maintenant: Notre Évolution
          </h2>

          <div class="grid md:grid-cols-2 gap-8">
            <!-- Then Column -->
            <div
              class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6"
            >
              <h3
                class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center"
              >
                <i class="ri-history-line text-amber-600 mr-2"></i>
                ALORS (2012)
              </h3>

              <div class="space-y-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Hectares reboisés</span
                    >
                    <span class="text-2xl font-bold text-amber-600">180</span>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Arbres fruitiers plantés</span
                    >
                    <span class="text-2xl font-bold text-amber-600">1,685</span>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Pépinières supervisées</span
                    >
                    <span class="text-2xl font-bold text-amber-600">74</span>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Agriculteurs formés</span
                    >
                    <span class="text-2xl font-bold text-amber-600">100+</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Now Column -->
            <div
              class="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6"
            >
              <h3
                class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center"
              >
                <i class="ri-rocket-line text-green-600 mr-2"></i>
                MAINTENANT (2024)
              </h3>

              <div class="space-y-4">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Hectares cultivés</span
                    >
                    <span class="text-2xl font-bold text-green-600">{{
                      currentImpact.hectaresCultivated
                    }}</span>
                  </div>
                  <div
                    class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700"
                  >
                    <div
                      class="bg-green-600 h-1.5 rounded-full"
                      :style="`width: ${Math.min((currentImpact.hectaresCultivated / 500) * 100, 100)}%`"
                    ></div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Produits vendus</span
                    >
                    <span class="text-2xl font-bold text-green-600">{{
                      currentImpact.productsSold
                    }}</span>
                  </div>
                  <div
                    class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700"
                  >
                    <div
                      class="bg-green-600 h-1.5 rounded-full"
                      :style="`width: ${Math.min((currentImpact.productsSold / 5000) * 100, 100)}%`"
                    ></div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Marchés actifs</span
                    >
                    <span class="text-2xl font-bold text-green-600">{{
                      currentImpact.activeMarkets
                    }}</span>
                  </div>
                  <div
                    class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700"
                  >
                    <div
                      class="bg-green-600 h-1.5 rounded-full"
                      :style="`width: ${Math.min((currentImpact.activeMarkets / 200) * 100, 100)}%`"
                    ></div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 dark:text-gray-300"
                      >Agriculteurs membres</span
                    >
                    <span class="text-2xl font-bold text-green-600">{{
                      currentImpact.farmerMembers
                    }}</span>
                  </div>
                  <div
                    class="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700"
                  >
                    <div
                      class="bg-green-600 h-1.5 rounded-full"
                      :style="`width: ${Math.min((currentImpact.farmerMembers / 2000) * 100, 100)}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Growth Metrics -->
          <div class="mt-8 grid md:grid-cols-4 gap-4">
            <div
              class="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg p-4 text-center"
            >
              <div
                class="text-3xl font-bold text-green-800 dark:text-green-200"
              >
                {{ growthMetrics.hectaresGrowth }}%
              </div>
              <div class="text-sm text-green-700 dark:text-green-300">
                Croissance des terres
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 text-center"
            >
              <div class="text-3xl font-bold text-blue-800 dark:text-blue-200">
                {{ growthMetrics.farmersGrowth }}x
              </div>
              <div class="text-sm text-blue-700 dark:text-blue-300">
                Plus d'agriculteurs
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4 text-center"
            >
              <div
                class="text-3xl font-bold text-purple-800 dark:text-purple-200"
              >
                {{ growthMetrics.reachGrowth }}x
              </div>
              <div class="text-sm text-purple-700 dark:text-purple-300">
                Portée élargie
              </div>
            </div>

            <div
              class="bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg p-4 text-center"
            >
              <div
                class="text-3xl font-bold text-orange-800 dark:text-orange-200"
              >
                ∞
              </div>
              <div class="text-sm text-orange-700 dark:text-orange-300">
                Impact technologique
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Impact Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <!-- Total Revenue Generated -->
        <div
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900"
            >
              <i
                class="ri-money-dollar-circle-line text-2xl text-green-600 dark:text-green-300"
              ></i>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >+15% ce mois</span
            >
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(currentImpact.totalRevenue) }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Revenus générés
          </p>
        </div>

        <!-- Active Users -->
        <div
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900"
            >
              <i
                class="ri-user-3-line text-2xl text-blue-600 dark:text-blue-300"
              ></i>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >+8% ce mois</span
            >
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ currentImpact.activeUsers }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Utilisateurs actifs
          </p>
        </div>

        <!-- Courses Completed -->
        <div
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900"
            >
              <i
                class="ri-graduation-cap-line text-2xl text-purple-600 dark:text-purple-300"
              ></i>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >+12% ce mois</span
            >
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ currentImpact.coursesCompleted }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Formations complétées
          </p>
        </div>

        <!-- Community Posts -->
        <div
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-4">
            <div
              class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900"
            >
              <i
                class="ri-chat-3-line text-2xl text-orange-600 dark:text-orange-300"
              ></i>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >+20% ce mois</span
            >
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ currentImpact.communityPosts }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Posts communautaires
          </p>
        </div>
      </div>

      <!-- Regional Impact Map -->
      <div class="bg-white rounded-lg shadow-xl p-8 mb-16 dark:bg-gray-800">
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          <i class="ri-map-pin-line text-green-600 mr-2"></i>
          Impact par Région
        </h2>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="region in regionalImpact"
            :key="region.name"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h3 class="font-bold text-gray-900 dark:text-white mb-2">
              {{ region.name }}
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300"
                  >Agriculteurs</span
                >
                <span class="font-medium text-gray-900 dark:text-white">{{
                  region.farmers
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Hectares</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  region.hectares
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Produits</span>
                <span class="font-medium text-gray-900 dark:text-white">{{
                  region.products
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <div
          class="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-xl p-12 text-white"
        >
          <h2 class="text-3xl font-bold mb-4">
            Faites Partie de Notre Croissance
          </h2>
          <p class="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'agriculteurs qui transforment déjà leur
            pratique agricole avec Fataplus.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/auth/register"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-green-600 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-white/30 transition-all duration-300"
            >
              <i class="ri-user-add-line mr-2"></i>
              Rejoindre la Communauté
            </NuxtLink>

            <NuxtLink
              to="/projects/legacy-fata"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-white border border-white rounded-lg hover:bg-white/10 focus:ring-4 focus:ring-white/30 transition-all duration-300"
            >
              <i class="ri-history-line mr-2"></i>
              Découvrir Notre Histoire
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Page metadata
definePageMeta({
  title: "Tableau d'Impact - Fataplus",
  description:
    "Visualisez l'impact de Fataplus sur l'agriculture malgache en temps réel",
});

// SEO
useHead({
  title: "Tableau d'Impact | Fataplus - Mesurer Notre Transformation",
  meta: [
    {
      name: "description",
      content:
        "Suivez l'évolution de notre impact depuis FANAJARIANA TANY (2006) jusqu'à Fataplus aujourd'hui. Données en temps réel sur notre transformation agricole.",
    },
  ],
});

// Simulated current impact data (in real app, this would come from API)
const currentImpact = ref({
  hectaresCultivated: 320,
  productsSold: 2847,
  activeMarkets: 156,
  farmerMembers: 1243,
  totalRevenue: 458000000, // MGA
  activeUsers: 1856,
  coursesCompleted: 892,
  communityPosts: 3421,
});

// Growth metrics calculations
const growthMetrics = computed(() => ({
  hectaresGrowth: Math.round(
    ((currentImpact.value.hectaresCultivated - 180) / 180) * 100
  ),
  farmersGrowth: Math.round(currentImpact.value.farmerMembers / 100),
  reachGrowth: 20, // 20 regions vs 1 originally
}));

// Regional impact data
const regionalImpact = ref([
  { name: "Lac Alaotra", farmers: 245, hectares: 89, products: "Riz, Vanille" },
  { name: "SAVA", farmers: 189, hectares: 67, products: "Vanille, Café" },
  {
    name: "Analamanga",
    farmers: 156,
    hectares: 45,
    products: "Légumes, Fruits",
  },
  {
    name: "Vakinankaratra",
    farmers: 178,
    hectares: 52,
    products: "Pommes de terre, Carottes",
  },
  {
    name: "Atsimo-Andrefana",
    farmers: 134,
    hectares: 38,
    products: "Maïs, Arachides",
  },
  { name: "Boeny", farmers: 98, hectares: 29, products: "Riz, Manioc" },
]);

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    minimumFractionDigits: 0,
  }).format(amount);
};
</script>
