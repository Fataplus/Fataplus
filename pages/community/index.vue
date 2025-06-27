<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              <i class="ri-community-line mr-3 text-primary-600"></i>
              Communauté Agricole
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Connectez-vous avec les agriculteurs de Madagascar
            </p>
          </div>

          <!-- Create Content Button -->
          <div class="flex items-center space-x-4">
            <button
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <i class="ri-add-line mr-2"></i>
              Partager une Histoire
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Stories -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <i class="ri-star-line mr-2 text-yellow-500"></i>
          Histoires de Réussite
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            v-for="story in featuredStories"
            :key="story._path"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                  >
                    {{ story.title }}
                  </h3>
                  <div
                    class="flex items-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <i class="ri-user-line mr-1"></i>
                    <span class="mr-4">{{ story.farmer?.name }}</span>
                    <i class="ri-map-pin-line mr-1"></i>
                    <span>{{ story.farmer?.location }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ getCropLabel(story.farmer?.crop) }}
                  </span>
                </div>
              </div>

              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {{ story.story }}
              </p>

              <!-- Results -->
              <div
                v-if="story.results"
                class="grid grid-cols-2 gap-4 mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <div v-if="story.results.yield_increase" class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {{ story.results.yield_increase }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    Augmentation Rendement
                  </div>
                </div>
                <div v-if="story.results.income_increase" class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {{ story.results.income_increase }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">
                    Augmentation Revenus
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <i class="ri-calendar-line mr-1"></i>
                  {{ formatDate(story.publishedAt) }}
                </div>
                <NuxtLink
                  :to="`/community${story._path}`"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Lire l'histoire complète
                  <i class="ri-arrow-right-line ml-1"></i>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Articles -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <i class="ri-article-line mr-2 text-blue-500"></i>
          Derniers Articles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="article in latestArticles"
            :key="article._path"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <span
                  :class="getCategoryClass(article.category)"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{ getCategoryLabel(article.category) }}
                </span>
                <span class="text-xs text-gray-500"
                  >{{ article.readTime }} min</span
                >
              </div>

              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ article.title }}
              </h3>

              <p
                class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2"
              >
                {{ article.description }}
              </p>

              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <i class="ri-user-line mr-1"></i>
                  <span class="mr-3">{{ article.author }}</span>
                  <i class="ri-calendar-line mr-1"></i>
                  <span>{{ formatDate(article.publishedAt) }}</span>
                </div>
              </div>

              <div class="mt-4">
                <NuxtLink
                  :to="`/community${article._path}`"
                  class="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Lire l'article
                  <i class="ri-arrow-right-line ml-1"></i>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Community Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-primary-600 mb-2">
            {{ communityStats.farmers }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Agriculteurs Actifs
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-green-600 mb-2">
            {{ communityStats.stories }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Histoires Partagées
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-blue-600 mb-2">
            {{ communityStats.articles }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Articles Publiés
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
          <div class="text-3xl font-bold text-purple-600 mb-2">
            {{ communityStats.regions }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Régions Couvertes
          </div>
        </div>
      </div>

      <!-- Regional Community -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          <i class="ri-map-2-line mr-2 text-green-500"></i>
          Communautés Régionales
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="region in madagascarRegions"
            :key="region.id"
            @click="filterByRegion(region.code)"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="text-2xl mb-2">{{ region.icon }}</div>
            <h3 class="font-medium text-gray-900 dark:text-white text-sm">
              {{ region.name }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">{{ region.count }} membres</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Meta
definePageMeta({
  title: "Communauté Agricole",
  description: "Rejoignez la communauté des agriculteurs de Madagascar",
});

// Composables
const { getArticles, getFeaturedStories } = useFataplusContent();

// Real data from Nuxt Content
const { data: featuredStories } = await useLazyAsyncData(
  "featured-stories",
  () => (getFeaturedStories ? getFeaturedStories(4) : [])
);

const { data: latestArticles } = await useLazyAsyncData("latest-articles", () =>
  getArticles({ limit: 6 })
);

// Community stats (could come from API later)
const communityStats = ref({
  farmers: 1247,
  stories: 89,
  articles: 156,
  regions: 22,
});

// Madagascar regions
const madagascarRegions = ref([
  { id: "1", name: "SAVA", code: "SAVA", icon: "🌶️", count: 189 },
  { id: "2", name: "Alaotra-Mangoro", code: "ALAOTRA", icon: "🌾", count: 245 },
  { id: "3", name: "Atsinanana", code: "ATSINANANA", icon: "🥥", count: 156 },
  { id: "4", name: "Analamanga", code: "ANALAMANGA", icon: "🌱", count: 298 },
  {
    id: "5",
    name: "Vakinankaratra",
    code: "VAKINANKARATRA",
    icon: "🥔",
    count: 134,
  },
  { id: "6", name: "Autres", code: "OTHER", icon: "🏞️", count: 225 },
]);

// Methods
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getCropLabel = (crop: string) => {
  const labels = {
    vanilla: "Vanille",
    rice: "Riz",
    clove: "Girofle",
    coffee: "Café",
    cocoa: "Cacao",
  };
  return labels[crop as keyof typeof labels] || crop;
};

const getCategoryClass = (category: string) => {
  const classes = {
    market: "bg-green-100 text-green-800",
    technique: "bg-blue-100 text-blue-800",
    weather: "bg-yellow-100 text-yellow-800",
    policy: "bg-purple-100 text-purple-800",
  };
  return (
    classes[category as keyof typeof classes] || "bg-gray-100 text-gray-800"
  );
};

const getCategoryLabel = (category: string) => {
  const labels = {
    market: "Marché",
    technique: "Technique",
    weather: "Météo",
    policy: "Politique",
  };
  return labels[category as keyof typeof labels] || category;
};

const filterByRegion = (regionCode: string) => {
  console.log("Filtering by region:", regionCode);
  // TODO: Implement region filtering
};
</script>
