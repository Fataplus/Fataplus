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
          <i class="ri-folder-2-line mr-2"></i>
          <span class="font-medium">Nos Projets et Initiatives</span>
        </div>

        <h1
          class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          Projets
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"
          >
            Fataplus
          </span>
        </h1>

        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200"
        >
          De notre héritage historique aux innovations modernes, découvrez
          comment nous transformons l'agriculture malgache
        </p>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Legacy Project Card - Featured First -->
        <div class="md:col-span-2 lg:col-span-3">
          <div
            class="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-xl p-1 hover:shadow-2xl transition-all duration-300"
          >
            <div class="bg-white dark:bg-gray-800 rounded-lg p-8">
              <div class="flex flex-col md:flex-row items-center gap-8">
                <div class="flex-shrink-0">
                  <div
                    class="w-32 h-32 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full flex items-center justify-center"
                  >
                    <i
                      class="ri-history-line text-5xl text-green-600 dark:text-green-400"
                    ></i>
                  </div>
                </div>

                <div class="flex-1 text-center md:text-left">
                  <div
                    class="inline-flex items-center mb-3 px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full dark:bg-amber-900 dark:text-amber-200"
                  >
                    <i class="ri-star-fill mr-1"></i>
                    Projet Fondateur
                  </div>

                  <h2
                    class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                  >
                    Notre Héritage: L'Histoire de FANAJARIANA TANY
                  </h2>

                  <p class="text-gray-600 dark:text-gray-300 mb-6">
                    Découvrez comment le projet FANAJARIANA TANY (2006-2012) a
                    posé les bases de Fataplus avec 294,000 plants, 180 hectares
                    reboisés, et un modèle durable qui continue d'inspirer notre
                    mission aujourd'hui.
                  </p>

                  <div
                    class="flex flex-wrap gap-4 justify-center md:justify-start"
                  >
                    <NuxtLink
                      to="/projects/legacy-fata"
                      class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300"
                    >
                      <i class="ri-arrow-right-line mr-2"></i>
                      Découvrir l'Histoire
                    </NuxtLink>

                    <div
                      class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      <span class="flex items-center">
                        <i class="ri-tree-line mr-1"></i>
                        180 ha reboisés
                      </span>
                      <span class="flex items-center">
                        <i class="ri-group-line mr-1"></i>
                        100+ agriculteurs formés
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Projects -->
        <!-- AI Agriculture Assistant -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900"
            >
              <i
                class="ri-ai-generate text-2xl text-purple-600 dark:text-purple-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Assistant IA Agricole
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Intelligence artificielle formée sur les meilleures pratiques
              agricoles malgaches pour accompagner les agriculteurs au
              quotidien.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full dark:bg-purple-900 dark:text-purple-200"
              >
                <i class="ri-sparkles-line mr-1"></i>
                En cours
              </span>

              <NuxtLink
                to="/assistant-ia"
                class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                Essayer
                <i class="ri-arrow-right-line ml-1"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Digital Marketplace -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900"
            >
              <i
                class="ri-store-2-line text-2xl text-green-600 dark:text-green-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Marché Digital
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Plateforme de commerce direct connectant producteurs et acheteurs,
              éliminant les intermédiaires pour des prix équitables.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900 dark:text-green-200"
              >
                <i class="ri-checkbox-circle-line mr-1"></i>
                Actif
              </span>

              <NuxtLink
                to="/marketplace"
                class="text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
              >
                Explorer
                <i class="ri-arrow-right-line ml-1"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Learning Platform -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900"
            >
              <i
                class="ri-graduation-cap-line text-2xl text-blue-600 dark:text-blue-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Plateforme de Formation
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Cours et guides pratiques créés par des experts pour maîtriser les
              techniques agricoles adaptées à Madagascar.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200"
              >
                <i class="ri-book-open-line mr-1"></i>
                50+ cours
              </span>

              <NuxtLink
                to="/learning"
                class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
              >
                Apprendre
                <i class="ri-arrow-right-line ml-1"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Community Network -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900"
            >
              <i
                class="ri-team-line text-2xl text-orange-600 dark:text-orange-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Réseau Communautaire
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Espace d'échange et d'entraide entre agriculteurs pour partager
              expériences, conseils et bonnes pratiques.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full dark:bg-orange-900 dark:text-orange-200"
              >
                <i class="ri-user-follow-line mr-1"></i>
                1000+ membres
              </span>

              <NuxtLink
                to="/community"
                class="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
              >
                Rejoindre
                <i class="ri-arrow-right-line ml-1"></i>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Future Projects -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-indigo-100 rounded-full flex items-center justify-center dark:bg-indigo-900"
            >
              <i
                class="ri-lightbulb-line text-2xl text-indigo-600 dark:text-indigo-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Projets Futurs
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Nouvelles initiatives en préparation: système de crédit agricole,
              assurance récolte, et expansion régionale.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full dark:bg-indigo-900 dark:text-indigo-200"
              >
                <i class="ri-time-line mr-1"></i>
                Bientôt
              </span>

              <button
                disabled
                class="text-gray-400 font-medium text-sm flex items-center cursor-not-allowed"
              >
                En développement
                <i class="ri-lock-line ml-1"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Impact Dashboard -->
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 mb-4 bg-emerald-100 rounded-full flex items-center justify-center dark:bg-emerald-900"
            >
              <i
                class="ri-bar-chart-box-line text-2xl text-emerald-600 dark:text-emerald-300"
              ></i>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau d'Impact
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Visualisez notre impact en temps réel: hectares cultivés,
              agriculteurs formés, et revenus générés.
            </p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full dark:bg-emerald-900 dark:text-emerald-200"
              >
                <i class="ri-line-chart-line mr-1"></i>
                Données live
              </span>

              <NuxtLink
                to="/projects/impact-dashboard"
                class="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center"
              >
                Voir l'impact
                <i class="ri-arrow-right-line ml-1"></i>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-16 text-center">
        <div
          class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-12"
        >
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Participez à la Transformation
          </h2>
          <p
            class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Chaque projet contribue à créer un écosystème agricole plus fort et
            plus durable à Madagascar.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              to="/auth/register"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300"
            >
              <i class="ri-user-add-line mr-2"></i>
              Devenir Membre
            </NuxtLink>

            <NuxtLink
              to="/about"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
            >
              <i class="ri-information-line mr-2"></i>
              En Savoir Plus
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: "Projets - Fataplus",
  description:
    "Découvrez tous les projets et initiatives de Fataplus pour transformer l'agriculture malgache",
});

// SEO
useHead({
  title: "Nos Projets | Fataplus - De l'Héritage à l'Innovation",
  meta: [
    {
      name: "description",
      content:
        "Explorez les projets Fataplus: de notre héritage FANAJARIANA TANY à nos innovations modernes en IA agricole, marché digital et formation.",
    },
    {
      property: "og:title",
      content: "Projets Fataplus - Transformer l'Agriculture Malgache",
    },
    {
      property: "og:description",
      content:
        "Découvrez comment nos projets créent un écosystème agricole durable à Madagascar.",
    },
  ],
});
</script>
