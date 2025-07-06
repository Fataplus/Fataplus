<template>
  <div
    class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
  >
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-br from-green-600/10 to-blue-600/10"
      ></div>
      <div class="relative container mx-auto px-4 py-16">
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center p-2 mb-4 text-sm text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300"
          >
            <i class="ri-history-line mr-2"></i>
            <span class="font-medium">Notre Héritage depuis 2006</span>
          </div>

          <h1
            class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
          >
            Nos Racines: Le Projet
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"
            >
              FANAJARIANA TANY
            </span>
          </h1>

          <p
            class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200"
          >
            L'histoire d'un engagement durable pour l'agriculture et le
            reboisement à Madagascar
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12">
      <!-- The Origin Story -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="bg-white rounded-lg shadow-xl p-8 dark:bg-gray-800">
          <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            <i class="ri-plant-line text-green-600 mr-2"></i>
            L'Histoire de FANAJARIANA TANY
          </h2>

          <div class="prose prose-lg max-w-none dark:prose-invert">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Fondé par <strong>RANAIVOARISON Fanomezanirina</strong> en 2006,
              FANAJARIANA TANY (Fata) était un projet visionnaire axé sur le
              reboisement et l'agriculture durable dans la région du
              <strong>Lac Alaotra</strong>, le grenier à riz de Madagascar.
            </p>

            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Pendant six années intenses (2006-2012), le projet a transformé
              des centaines d'hectares de terres dégradées, formé des centaines
              d'agriculteurs, et établi un modèle durable pour l'agriculture
              malgache.
            </p>

            <div
              class="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 dark:bg-amber-900/20"
            >
              <p class="text-amber-800 dark:text-amber-200">
                <i class="ri-information-line mr-2"></i>
                En 2012, suite au décès du fondateur, le projet a été mis en
                pause. Mais son héritage et son impact continuent d'inspirer
                notre mission aujourd'hui.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Proven Track Record Section -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Un Bilan Prouvé: Les Réalisations de la Campagne 2012
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Des résultats concrets qui témoignent de notre impact sur le terrain
          </p>
        </div>

        <!-- KPI Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <!-- Nurseries Supervised -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900"
            >
              <i
                class="ri-seedling-line text-2xl text-green-600 dark:text-green-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2"
            >
              74
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Pépinières Supervisées
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Réseau de production de plants à travers la région
            </p>
          </div>

          <!-- Eucalyptus Seedlings -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900"
            >
              <i
                class="ri-tree-line text-2xl text-blue-600 dark:text-blue-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2"
            >
              294,000
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Plants d'Eucalyptus
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Production massive pour le reboisement
            </p>
          </div>

          <!-- Hectares Reforested -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center dark:bg-purple-900"
            >
              <i
                class="ri-landscape-line text-2xl text-purple-600 dark:text-purple-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2"
            >
              ~180
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Hectares Reboisés
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Terres restaurées et protégées
            </p>
          </div>

          <!-- Fruit Trees -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900"
            >
              <i
                class="ri-plant-fill text-2xl text-orange-600 dark:text-orange-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2"
            >
              1,685
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Arbres Fruitiers
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Litchis, Café, Mangues, et plus
            </p>
          </div>

          <!-- Success Rate -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center dark:bg-emerald-900"
            >
              <i
                class="ri-bar-chart-line text-2xl text-emerald-600 dark:text-emerald-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2"
            >
              ~90%
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Taux de Réussite
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Survie des plantations
            </p>
          </div>

          <!-- Training Impact -->
          <div
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow dark:bg-gray-800"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center dark:bg-indigo-900"
            >
              <i
                class="ri-graduation-cap-line text-2xl text-indigo-600 dark:text-indigo-300"
              ></i>
            </div>
            <h3
              class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2"
            >
              100+
            </h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">
              Agriculteurs Formés
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Techniques de pépinière, greffage, marcottage
            </p>
          </div>
        </div>

        <!-- Training Details -->
        <div
          class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 dark:from-gray-800 dark:to-gray-700"
        >
          <h3 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            <i class="ri-book-2-line text-green-600 mr-2"></i>
            Programme de Formation Agricole
          </h3>

          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg p-4 dark:bg-gray-600">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">
                <i class="ri-seedling-line text-green-500 mr-1"></i>
                Gestion de Pépinière
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Formation complète sur la création et gestion de pépinières
                productives
              </p>
            </div>

            <div class="bg-white rounded-lg p-4 dark:bg-gray-600">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">
                <i class="ri-scissors-cut-line text-blue-500 mr-1"></i>
                Techniques de Greffage
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Méthodes avancées pour améliorer la qualité et productivité des
                arbres fruitiers
              </p>
            </div>

            <div class="bg-white rounded-lg p-4 dark:bg-gray-600">
              <h4 class="font-bold text-gray-900 dark:text-white mb-2">
                <i class="ri-git-branch-line text-purple-500 mr-1"></i>
                Marcottage
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Techniques de multiplication végétative pour une propagation
                efficace
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Legacy Continues Section -->
      <div class="max-w-4xl mx-auto mb-16">
        <div
          class="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-xl p-8 text-white"
        >
          <h2 class="text-3xl font-bold mb-6">
            <i class="ri-refresh-line mr-2"></i>
            L'Héritage Continue avec Fataplus
          </h2>

          <p class="text-lg mb-4">
            En 2023, nous avons repris le flambeau de FANAJARIANA TANY avec une
            vision renouvelée: combiner l'expertise terrain éprouvée avec la
            puissance de la technologie moderne.
          </p>

          <p class="text-lg mb-6">
            <strong>Fataplus</strong> = <strong>Fata</strong> (notre héritage) +
            <strong>Plus</strong> (la technologie)
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink
              to="/"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-green-600 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-white/30 transition-all duration-300"
            >
              <i class="ri-home-line mr-2"></i>
              Découvrir Fataplus
            </NuxtLink>

            <NuxtLink
              to="/marketplace"
              class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-white border border-white rounded-lg hover:bg-white/10 focus:ring-4 focus:ring-white/30 transition-all duration-300"
            >
              <i class="ri-shopping-bag-line mr-2"></i>
              Explorer le Marché
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center py-12">
        <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Rejoignez Notre Mission
        </h2>
        <p
          class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Ensemble, continuons à transformer l'agriculture malgache, une
          plantation à la fois.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/auth/register"
            class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-900 transition-all duration-300"
          >
            <i class="ri-user-add-line mr-2"></i>
            Rejoindre la Communauté
          </NuxtLink>

          <NuxtLink
            to="/learning"
            class="inline-flex justify-center items-center py-3 px-6 text-base font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-all duration-300"
          >
            <i class="ri-book-open-line mr-2"></i>
            Apprendre Nos Techniques
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
definePageMeta({
  title: "Notre Héritage - Le Projet FANAJARIANA TANY",
  description:
    "Découvrez l'histoire de FANAJARIANA TANY, le projet de reboisement et d'agriculture durable qui a inspiré Fataplus",
});

// SEO
useHead({
  title: "Notre Héritage - FANAJARIANA TANY | Fataplus",
  meta: [
    {
      name: "description",
      content:
        "L'histoire de FANAJARIANA TANY (2006-2012), un projet de reboisement qui a transformé 180 hectares et formé des centaines d'agriculteurs au Lac Alaotra, Madagascar.",
    },
    {
      property: "og:title",
      content: "Notre Héritage - Le Projet FANAJARIANA TANY | Fataplus",
    },
    {
      property: "og:description",
      content:
        "Découvrez comment FANAJARIANA TANY a posé les bases de Fataplus avec 294,000 plants, 74 pépinières et un impact durable.",
    },
  ],
});
</script>
