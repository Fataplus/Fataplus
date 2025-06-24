<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <section class="text-center py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg mb-12">
      <h1 class="text-5xl font-bold mb-6">🌱 Bienvenue sur Fataplus</h1>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        La plateforme qui transforme l'agriculture malgache avec des solutions numériques innovantes
      </p>
      <div class="space-x-4">
        <button class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          🛒 Marché
        </button>
        <button class="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">
          📚 Formation
        </button>
        <button class="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 transition">
          👥 Communauté
        </button>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-green-600">🛒 Marché Digital</h3>
        <p class="text-gray-600">Vendez et achetez des produits agricoles directement entre producteurs et consommateurs</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-blue-600">📚 Formation Continue</h3>
        <p class="text-gray-600">Accédez à des formations modernes sur les techniques agricoles durables</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-bold mb-4 text-purple-600">👥 Communauté</h3>
        <p class="text-gray-600">Échangez avec d'autres agriculteurs et experts du secteur</p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white rounded-lg shadow-md p-8 text-center">
      <h2 class="text-3xl font-bold mb-8 text-gray-800">Fataplus en chiffres</h2>
      <div class="grid md:grid-cols-4 gap-6">
        <div>
          <div class="text-3xl font-bold text-green-600">500+</div>
          <div class="text-gray-600">Agriculteurs connectés</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-blue-600">1000+</div>
          <div class="text-gray-600">Produits disponibles</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600">50+</div>
          <div class="text-gray-600">Formations disponibles</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-yellow-600">95%</div>
          <div class="text-gray-600">Satisfaction utilisateur</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Simple homepage - no complex dependencies
console.log('Homepage loaded successfully')
</script> 