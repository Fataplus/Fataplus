<template>
  <div>
    <!-- Simple Hero Section -->
    <section class="bg-green-50 py-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-gray-900 mb-6">
          🌱 Fataplus
        </h1>
        <h2 class="text-2xl text-green-600 mb-6">
          Digital Agriculture Platform for Madagascar
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Une plateforme complète qui unit marché, formation et communauté 
          pour transformer l'agriculture à Madagascar.
        </p>
        
        <div class="space-x-4">
          <button class="bg-green-600 text-white px-6 py-3 rounded-lg">
            🛒 Explorer le marché
          </button>
          <button class="border border-green-600 text-green-600 px-6 py-3 rounded-lg">
            🎓 Commencer à apprendre
          </button>
        </div>
      </div>
    </section>

    
    <!-- Simple features section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-12">
          Platform Status: ✅ Running Successfully!
        </h2>
        <p class="text-lg text-gray-600">
          🎉 Congratulations! Your Fataplus development server is now running.<br>
          This is a simplified version to get you started quickly.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Simple page setup
useHead({
  title: 'Accueil',
  meta: [
    { name: 'description', content: 'Fataplus - La plateforme qui transforme l\'agriculture malgache. Marché, formation et communauté pour les agriculteurs de Madagascar.' }
  ]
})
</script> 