<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              <i class="ri-graduation-cap-line mr-3 text-primary-600"></i>
              Formation Agricole
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Développez vos compétences avec nos formations spécialisées
            </p>
          </div>

          <!-- Search and Filter -->
          <div class="flex items-center space-x-4">
            <select
              v-model="selectedLevel"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>

            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher des formations..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <i
                class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Featured Courses -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Formations en Vedette
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="course in featuredCourses"
            :key="course._path"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <!-- Course Image -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg">
              <img
                :src="course.thumbnail || '/images/placeholder-course.jpg'"
                :alt="course.title"
                class="h-48 w-full object-cover"
              />
              <div class="absolute top-2 left-2">
                <span
                  :class="getLevelClass(course.level)"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{ getLevelLabel(course.level) }}
                </span>
              </div>
              <div class="absolute top-2 right-2">
                <span
                  :class="
                    course.price
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                  "
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{
                    course.price ? `${formatPrice(course.price)}` : "Gratuit"
                  }}
                </span>
              </div>
            </div>

            <!-- Course Content -->
            <div class="p-6">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ course.title }}
              </h3>

              <p
                class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2"
              >
                {{ course.description }}
              </p>

              <div
                class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4"
              >
                <div class="flex items-center">
                  <i class="ri-user-line mr-1"></i>
                  {{ course.instructor }}
                </div>
                <div class="flex items-center">
                  <i class="ri-time-line mr-1"></i>
                  {{ course.duration }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-yellow-400 text-sm">
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-line"></i>
                  </span>
                  <span class="ml-2 text-sm text-gray-600">(4.2)</span>
                </div>

                <NuxtLink
                  :to="`/learning${course._path}`"
                  class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {{ course.price ? "Acheter" : "Commencer" }}
                </NuxtLink>
              </div>

              <!-- Course objectives -->
              <div
                v-if="course.objectives"
                class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
              >
                <h4
                  class="text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Objectifs:
                </h4>
                <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li
                    v-for="objective in course.objectives.slice(0, 2)"
                    :key="objective"
                    class="flex items-start"
                  >
                    <i
                      class="ri-check-line text-green-500 mr-2 mt-0.5 text-xs"
                    ></i>
                    {{ objective }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Categories -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Catégories de Formation
        </h2>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            v-for="category in courseCategories"
            :key="category.id"
            @click="filterByCategory(category.value)"
            class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="text-3xl mb-2">{{ category.icon }}</div>
            <h3 class="font-medium text-gray-900 dark:text-white text-sm">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- All Courses -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Toutes les Formations
        </h2>

        <div
          v-if="allCourses"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="course in allCourses"
            :key="course._path"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <!-- Course Image -->
            <div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-t-lg">
              <img
                :src="course.thumbnail || '/images/placeholder-course.jpg'"
                :alt="course.title"
                class="h-48 w-full object-cover"
              />
              <div class="absolute top-2 left-2">
                <span
                  :class="getLevelClass(course.level)"
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{ getLevelLabel(course.level) }}
                </span>
              </div>
            </div>

            <!-- Course Content -->
            <div class="p-6">
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                {{ course.title }}
              </h3>
              <p
                class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2"
              >
                {{ course.description }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-yellow-400 text-sm">
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-fill"></i>
                    <i class="ri-star-line"></i>
                  </span>
                  <span class="ml-2 text-sm text-gray-600">(4.2)</span>
                </div>
                <NuxtLink
                  :to="`/learning${course._path}`"
                  class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {{ course.price ? "Acheter" : "Commencer" }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Chargement des formations...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Meta
definePageMeta({
  title: "Formation Agricole",
  description: "Formations spécialisées en agriculture pour Madagascar",
  middleware: "auth",
});

// Composables
const { getFeaturedCourses, getCourses } = useFataplusContent();

// Reactive data
const searchQuery = ref("");
const selectedLevel = ref("");

// Real data from Nuxt Content
const { data: featuredCourses } = await useLazyAsyncData(
  "featured-courses",
  () => getFeaturedCourses(6)
);

const { data: allCourses } = await useLazyAsyncData("all-courses", () =>
  getCourses()
);

// Course categories
const courseCategories = ref([
  {
    id: "1",
    name: "Gestion des Cultures",
    value: "crop-management",
    icon: "🌱",
  },
  { id: "2", name: "Élevage", value: "livestock", icon: "🐄" },
  { id: "3", name: "Lutte Antiparasitaire", value: "pest-control", icon: "🦗" },
  { id: "4", name: "Santé des Sols", value: "soil-health", icon: "🌍" },
  { id: "5", name: "Marketing", value: "marketing", icon: "📈" },
  { id: "6", name: "Climat", value: "climate", icon: "🌤️" },
]);

// Methods
const getLevelClass = (level: string) => {
  const classes = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };
  return classes[level as keyof typeof classes] || "bg-gray-100 text-gray-800";
};

const getLevelLabel = (level: string) => {
  const labels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
  };
  return labels[level as keyof typeof labels] || level;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    minimumFractionDigits: 0,
  }).format(price);
};

const filterByCategory = (category: string) => {
  // TODO: Implement category filtering
  console.log("Filtering by category:", category);
};
</script>
