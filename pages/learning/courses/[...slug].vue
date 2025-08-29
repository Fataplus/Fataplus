<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <main class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <ContentDoc>
          <template #not-found>
            <div class="p-8 text-center">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                Oups, formation non trouvée
              </h1>
              <p class="mt-4 text-gray-600 dark:text-gray-300">
                Le cours que vous cherchez n'existe pas ou a été déplacé.
              </p>
              <NuxtLink
                to="/learning"
                class="mt-6 inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Retour à la liste des formations
              </NuxtLink>
            </div>
          </template>

          <template #default="{ doc }">
            <!-- Course Header -->
            <div class="relative">
              <img
                :src="doc.thumbnail || '/images/placeholder-course.jpg'"
                :alt="doc.title"
                class="w-full h-64 object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
              ></div>
              <div class="absolute bottom-0 left-0 p-8">
                <h1 class="text-4xl font-bold text-white">
                  {{ doc.title }}
                </h1>
                <p class="text-xl text-gray-200 mt-2">
                  {{ doc.description }}
                </p>
              </div>
            </div>

            <!-- Course Body -->
            <div class="flex flex-col lg:flex-row">
              <!-- Main Content -->
              <div class="flex-grow p-8 prose dark:prose-invert max-w-none">
                <ContentRenderer :value="doc" />
              </div>

              <!-- Sidebar -->
              <aside class="w-full lg:w-80 lg:flex-shrink-0 bg-gray-50 dark:bg-gray-800/50 p-6 border-l border-gray-200 dark:border-gray-700">
                <div class="space-y-6">
                  <div>
                    <h3 class="font-bold text-lg mb-3">
                      À propos du cours
                    </h3>
                    <div class="space-y-2 text-sm">
                      <p class="flex items-center">
                        <i class="ri-user-line mr-2"></i>
                        <strong>Instructeur:</strong> {{ doc.instructor }}
                      </p>
                      <p class="flex items-center">
                        <i class="ri-line-chart-line mr-2"></i>
                        <strong>Niveau:</strong> {{ getLevelLabel(doc.level) }}
                      </p>
                      <p class="flex items-center">
                        <i class="ri-time-line mr-2"></i>
                        <strong>Durée:</strong> {{ doc.duration }}
                      </p>
                      <p class="flex items-center">
                        <i class="ri-global-line mr-2"></i>
                        <strong>Langue:</strong> {{ doc.language }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 class="font-bold text-lg mb-3">
                      Objectifs
                    </h3>
                    <ul class="space-y-2 text-sm">
                      <li
                        v-for="objective in doc.objectives"
                        :key="objective"
                        class="flex items-start"
                      >
                        <i class="ri-check-line text-green-500 mr-2 mt-1"></i>
                        <span>{{ objective }}</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    {{ doc.price ? `S'inscrire - ${formatPrice(doc.price)}` : "Commencer la formation" }}
                  </button>
                </div>
              </aside>
            </div>
          </template>
        </ContentDoc>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useHead({
  title: "Détail de la formation",
});

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
</script>
