<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Hero Section with fleabite styling -->
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center justify-center p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
        >
          <i class="ri-plant-line mr-2"></i>
          <span class="font-medium">Plateforme #1 Agriculture Madagascar</span>
        </div>

        <h1
          class="mb-4 text-5xl font-extrabold tracking-tight leading-none text-gray-900 md:text-6xl lg:text-7xl dark:text-white"
        >
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"
          >
            🌱 Fataplus
          </span>
        </h1>

        <p class="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          D'un Héritage de Croissance à un Avenir d'Opportunités
        </p>

        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200"
        >
          La plateforme numérique qui révolutionne l'agriculture à Madagascar.
          Connectez-vous avec des producteurs, apprenez de nouvelles techniques
          et développez votre exploitation agricole.
        </p>

        <div
          class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/assistant-ia"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            <span class="mr-2">🤖</span>
            Assistant IA Agriculture
            <i class="ri-ai-generate ml-2"></i>
          </NuxtLink>

          <NuxtLink
            to="/marketplace"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300 transform hover:scale-105"
          >
            <i class="ri-store-2-line mr-2"></i>
            Explorer le Marché
            <i class="ri-arrow-right-line ml-2"></i>
          </NuxtLink>

          <NuxtLink
            to="/learning"
            class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
          >
            <i class="ri-graduation-cap-line mr-2"></i>
            Commencer à Apprendre
          </NuxtLink>
        </div>
      </div>

      <!-- Real Featured Products from Nuxt Content -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2
            class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            Produits Populaires
          </h2>
          <p
            class="font-light text-gray-500 lg:mb-8 sm:text-xl dark:text-gray-400"
          >
            Découvrez les meilleurs produits agricoles de Madagascar
          </p>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          <FlowbiteCard
            v-for="product in featuredProducts"
            :key="product._path"
            :title="product.title"
            :description="product.description"
            :image="
              product.image ||
              'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
            "
            :category="product.category"
            :badge="product.quality"
            :price="`${formatPrice(product.price)}`"
            :rating="5"
            :tags="[
              product.quality,
              product.region,
              product.organic ? 'Bio' : 'Conventionnel',
            ]"
            :location="product.region"
            :seller="product.vendor"
            primary-action-text="Acheter"
            secondary-action-text="Favoris"
            @primary-action="buyProduct(product)"
            @secondary-action="addToFavorites(product)"
          />
        </div>

        <div class="text-center mt-8">
          <NuxtLink
            to="/marketplace"
            class="inline-flex items-center px-6 py-3 text-base font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Voir tous les produits
            <i class="ri-arrow-right-line ml-2"></i>
          </NuxtLink>
        </div>
      </div>

      <!-- Legacy Project Spotlight -->
      <div class="mb-16">
        <div
          class="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-xl p-1"
        >
          <div class="bg-white dark:bg-gray-800 rounded-lg p-8">
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  class="inline-flex items-center mb-4 px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full dark:bg-amber-900 dark:text-amber-200"
                >
                  <i class="ri-history-line mr-1"></i>
                  Notre Histoire
                </div>

                <h2
                  class="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  De FANAJARIANA TANY à Fataplus
                </h2>

                <p class="text-gray-600 dark:text-gray-300 mb-6">
                  Découvrez comment un projet visionnaire de reboisement lancé
                  en 2006 a évolué pour devenir la plateforme technologique
                  leader de l'agriculture malgache, avec un impact prouvé sur le
                  terrain.
                </p>

                <div class="grid grid-cols-2 gap-4 mb-6">
                  <div
                    class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div
                      class="text-2xl font-bold text-green-600 dark:text-green-400"
                    >
                      180
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Hectares reboisés
                    </div>
                  </div>
                  <div
                    class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div
                      class="text-2xl font-bold text-blue-600 dark:text-blue-400"
                    >
                      294,000
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      Plants produits
                    </div>
                  </div>
                </div>

                <NuxtLink
                  to="/projects/legacy-fata"
                  class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300"
                >
                  <i class="ri-arrow-right-line mr-2"></i>
                  Découvrir Notre Héritage
                </NuxtLink>
              </div>

              <div class="flex justify-center">
                <div class="relative">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-2xl opacity-30"
                  ></div>
                  <div
                    class="relative bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full p-12"
                  >
                    <i
                      class="ri-plant-line text-8xl text-green-600 dark:text-green-400"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Courses Section -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2
            class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            Formations Recommandées
          </h2>
          <p
            class="font-light text-gray-500 lg:mb-8 sm:text-xl dark:text-gray-400"
          >
            Développez vos compétences avec nos formations spécialisées
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="course in featuredCourses"
            :key="course._path"
            class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span
                  :class="
                    course.level === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : course.level === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 text-xs rounded-full font-medium"
                >
                  {{
                    course.level === "beginner"
                      ? "Débutant"
                      : course.level === "intermediate"
                        ? "Intermédiaire"
                        : "Avancé"
                  }}
                </span>
                <span
                  :class="course.price ? 'text-orange-600' : 'text-green-600'"
                  class="text-sm font-semibold"
                >
                  {{ course.price ? formatPrice(course.price) : "Gratuit" }}
                </span>
              </div>

              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ course.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {{ course.description }}
              </p>

              <div
                class="flex items-center justify-between text-sm text-gray-500 mb-4"
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

              <NuxtLink
                :to="`/learning${course._path}`"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {{ course.price ? "S'inscrire" : "Commencer" }}
                <i class="ri-arrow-right-line ml-2"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="text-center mt-8">
          <NuxtLink
            to="/learning"
            class="inline-flex items-center px-6 py-3 text-base font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Voir toutes les formations
            <i class="ri-arrow-right-line ml-2"></i>
          </NuxtLink>
        </div>
      </div>

      <!-- Enhanced Features Section with Flowbite cards -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2
            class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
          >
            Pourquoi Choisir Fataplus?
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full dark:bg-green-900"
            >
              <i
                class="ri-store-2-line text-2xl text-green-600 dark:text-green-300"
              ></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Marché Digital
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Vendez et achetez des produits agricoles directement avec les
              producteurs locaux dans un environnement sécurisé.
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900"
            >
              <i
                class="ri-graduation-cap-line text-2xl text-blue-600 dark:text-blue-300"
              ></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Formation Expert
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Apprenez les meilleures techniques agricoles adaptées au climat
              malgache avec nos experts agronomes.
            </p>
          </div>

          <div
            class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full dark:bg-purple-900"
            >
              <i
                class="ri-team-line text-2xl text-purple-600 dark:text-purple-300"
              ></i>
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Communauté Active
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Échangez avec d'autres agriculteurs, partagez vos expériences et
              développez votre réseau professionnel.
            </p>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Section -->
      <div
        class="bg-white border border-gray-200 rounded-lg shadow-lg p-8 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Fataplus en Chiffres
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            L'impact de notre plateforme sur l'agriculture malgache
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full dark:bg-green-900"
            >
              <i
                class="ri-user-line text-2xl text-green-600 dark:text-green-300"
              ></i>
            </div>
            <div class="text-3xl font-bold text-green-600 dark:text-green-400">
              1,000+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Agriculteurs Actifs
            </div>
          </div>

          <div class="text-center">
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full dark:bg-blue-900"
            >
              <i
                class="ri-box-line text-2xl text-blue-600 dark:text-blue-300"
              ></i>
            </div>
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              500+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Produits Disponibles
            </div>
          </div>

          <div class="text-center">
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full dark:bg-purple-900"
            >
              <i
                class="ri-book-line text-2xl text-purple-600 dark:text-purple-300"
              ></i>
            </div>
            <div
              class="text-3xl font-bold text-purple-600 dark:text-purple-400"
            >
              50+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Formations Expert
            </div>
          </div>

          <div class="text-center">
            <div
              class="flex justify-center items-center w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full dark:bg-orange-900"
            >
              <i
                class="ri-map-pin-line text-2xl text-orange-600 dark:text-orange-300"
              ></i>
            </div>
            <div
              class="text-3xl font-bold text-orange-600 dark:text-orange-400"
            >
              20+
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Régions Couvertes
            </div>
          </div>
        </div>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 italic">
            <i class="ri-information-line mr-1"></i>
            Impact de l'agriculture malgache depuis 2006
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
const { getHomepageContent } = useFataplusContent();

// Load homepage content from Nuxt Content
const { data: homepageData } = await useLazyAsyncData("homepage-content", () =>
  getHomepageContent()
);

// Computed properties
const featuredProducts = computed(
  () => homepageData.value?.featuredProducts || []
);
const featuredCourses = computed(
  () => homepageData.value?.featuredCourses || []
);

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    minimumFractionDigits: 0,
  }).format(price);
};

const buyProduct = (product: any) => {
  console.log("Achat de produit:", product.title);
  // TODO: Implement cart functionality
};

const addToFavorites = (product: any) => {
  console.log("Ajout aux favoris:", product.title);
  // TODO: Implement favorites functionality
};

console.log("Homepage loaded successfully with real content");
</script>
