<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          <i class="ri-robot-line mr-3 text-primary-600"></i>
          Assistant IA Agricole
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Votre assistant intelligent pour l'agriculture à Madagascar
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <p class="text-center text-gray-600 dark:text-gray-300">
            Assistant IA en cours de développement...
          </p>
          <div class="mt-6 text-center">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <i class="ri-home-line mr-2"></i>
              Retour à l'accueil
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: "Assistant IA - Fataplus",
  meta: [
    {
      name: "description",
      content:
        "Assistant intelligence artificielle pour l'agriculture à Madagascar",
    },
  ],
});
</script>
